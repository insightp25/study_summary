# 10. 테스트 코드와 유지 보수

# 테스트 코드와 유지 보수

이 장에서는 처음 TDD를 시도하는 개발자들이 빠지기 쉬운 실수와 주의 사항을 살펴본다.

> 깨진 유리창 이론 - 사소한 무질서를 방치하면 큰 문제로 이어질 가능성이 높아진다



<br><br>

# 변수나 필드를 사용해서 기댓값 표현하지 않기

테스트 코드를 처음 보는 사람은 변수와 필드를 오가며 테스트 코드를 이해해야 한다.

```java
private List<Integer> answers = Arrays.asList(1, 2, 3, 4);
// ...

@Test
void saveAnswerSuccessfully() {
  // given, when
  // ...

  // then
  // ...
  assertAll(
    () -> assertEquals(answers.get(0), savedAnswer.getAnswers().get(0)),
    () -> assertEquals(answers.get(1), savedAnswer.getAnswers().get(1)),
    () -> assertEquals(answers.get(2), savedAnswer.getAnswers().get(2)),
    () -> assertEquals(answers.get(3), savedAnswer.getAnswers().get(3))
  );
}
```

아래를 위와 비교시 가독성이 좋아져서 테스트 코드를 더욱 쉽게 파악할 수 있다. 객체 생성시 사용 값이 무엇인지 알아보기 위해 필드와 변수를 참조하지 않아도 된다. 확인할 때 필드와 변수를 오갈 필요도 없다.

```java
private List<Integer> answers = Arrays.asList(1, 2, 3, 4);
// ...

@Test
void saveAnswerSuccessfully() {
  // given, when
  // ...

  // then
  // ...
  assertAll(
    () -> assertEquals(1, savedAnswer.getAnswers().get(0)),
    () -> assertEquals(2, savedAnswer.getAnswers().get(1)),
    () -> assertEquals(3, savedAnswer.getAnswers().get(2)),
    () -> assertEquals(4, savedAnswer.getAnswers().get(3))
  );
}
```









<br><br>

# 두 개 이상을 검증하지 않기

한 메서드에 많은 단언...

eg. 회원 데이터 저장 검증 + 이메일 발송 요청 검증

한 테스트에서 검증하는 내용이 두 개 이상이면 테스트 결과를 확인할 때 집중도가 떨어진다.

또한 첫 번째 검증이 통과해야만 두 번째 검증이 성공했는지 확인할 수 있다.








<br><br>

# 정확하게 일치하는 값으로 모의 객체 설정하지 않기

```java
@Test
void weakPassword() {
  BDDMockito.given(mockPasswordChecker.checkPasswordWeak("pw")).willReturn(true);

  assertThrows(WeakPasswordException.class, () -> {
    userRegister.register("id", "pw", "email");
  })
}
```

약한 암호인 경우 UserRegister가 원하는대로 동작하는지 확인하기 위한 테스트이지,

"pw"나 "pwa"가 약한 암호인지를 확인하는 테스트가 아니다

모의 객체는 가능한 Mockito.anyString()과 같은 범용적인 값을 사용해서 기술해야 한다. 이렇게 해야 
- 약간의 코드 수정 때문에 테스트가 실패하는 것을 방지할 수 있고,
- 테스트 코드 수정시 모의 객체 관련 코드를 함께 수정해야 하는 빈도도 줄어든다.

```java
@Test
void weakPassword() {
  BDDMockito.given(mockPasswordChecker.checkPasswordWeak(Mickito.anyString())).willReturn(true);

  assertThrows(WeakPasswordException.class, () -> {
    userRegister.register("id", "pw", "email");
  })
}
```






<br><br>

# 과도하게 구현 검증하지 않기

내부 구현 검증이 나쁜 것은 아니지만 한 가지 단점이 있다. 구현을 조금만 변경해도 테스트가 깨질 가능성이 커진다는 것이다.

구현: 비밀번호 검사 -> 실패시 -> 중복 id 검사 하지 않음
1. 비밀번호 강도 확인 메서드 호출 여부 검사
2. 아이디 호출 여부 검사

구현 변경: 중복 id 검사 -> 통과시 -> 비밀번호 강도 검사
1. 중복 id 검사
2. 비밀번호 강도 검사

내부 구현은 언제든지 바뀔 수 있기 때문에 실행 결과를 검증에 집중해야 한다.

비밀번호 강도 검사 메서드 호출 여부를 검증하는 것보다 -> 약한 암호일 때 register()의 결과가 올바른지 검증해야 한다.









<br><br>

# 셋업을 이용해서 중복된 상황을 설정하지 않기

### `@BeforeEach` 등으로 코드 중복 제거시 문제점

1. 테스트 실패한 이유를 알려면 코드를 위아래로 이동하면서 실패한 원인을 분석해야 한다.
2. 테스트가 깨지기 쉬운 구조가 된다. setUp()의 내용을 조금만 바꿔도 실패하는 메서드가 생길 수 있다.

각 테스트 메서드는 별도 프로그램으로서 검증 내용을 스스로 잘 설명할 수 있어야 한다. 그러기 위해서는 상황 구성 코드가 테스트 메서드 안에 위치해야 한다.

```java
// 변경전
@BeforeEach
void setUp() {
  changeService = new ChangeUserService(memoryRepository);
  memoryRepository.save(new User("id", "name", "pw")); // "pw"를 변경하게 된다면?
}

// ...

void pwNotMatch() { // 실패
  assertThrows(IdPwNotMatchException.class, 
    () -> changeService.changePw("id", "pw2", "newpw")
  );
}

// 그 외 광역으로 테스트 메서드에 영향을 주게 되고 테스트가 실패하게 된다.
```

```java
// 변경후
@BeforeEach
void setUp() {
  changeService = new ChangeUserService(memoryRepository); // 이 외 부분 삭제
}

// 각 메서드 별로 직접 구현
```


## 통합 테스트에서 데이터 공유 주의하기

셋업을 이용 상황 설정과 비슷한 것으로 통합 테스트의 DB 데이터 초기화가 있다.

```java
@SpringBootTest
@Sql("classpath:init-data.sql")
public class UserRegisterIntTestUsingSql() {
  // ...
}
```
```sql
turncate table user;
insert into user values ("cbk", "pw", "cbk@cbk.com");
insert into user values ("abc", "pw2"', "abc@abc.com");
```

```java
@Test
void dupId() {
  // 상황
  jdbcTemplate.update(
    "insert into user values (?, ?, ?)" +
    "on duplicate key update passwrod = ?, email = ?",
    "cbk", "pw", "cbk@cbk.com", "pw", "cbk@cbk.com");
    
  // 실행, 결과 확인 ...
}
```

### 문제점

이 방식은 편리하지만 셋업 메서드 활용 설정과 마찬가지로 
1. 초기화를 위한 쿼리 파일을 조금만 변경해도 많은 테스트가 깨질 수 있다.
2. 테스트가 깨질시 쿼리 파일을 같이 봐야 한다.  
-> 테스트 유지 보수를 귀찮고 어렵게 만든다.

통합 테스트시 다음 두 가지로 초기화 데이터를 나눠서 생각해야 한다.

- 모든 테스트가 같은 값을 사용하는 데이터
- 테스트 메서드에서만 필요한 데이터




## 통합 테스트의 상황 설정을 위한 보조 클래스 사용하기

각 테스트 메서드에서 상황을 직접 구성하여 메서드 분석 접근성은 올랐으나, 반대로 여러 코드 중복이 발생한다.

테이블 이름이나 칼럼 이름이 바뀌면 메서드를 모두 일일히 수정해야 하므로 유지보수에 좋지 않다.

이 때, 상황 설정을 위한 보조 클래스를 사용할 수 있다.

```java
// 보조 클래스
public class UserGivenHelper {
  private JdbcTemplate jdbcTemplate;

  public UserGivenHelper(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public void givenUser(String id, String pw, String email) {
    jdbcTemplate.update(
      "insert into user values (?, ?, ?)" +
      "on duplicate key update password = ?, email = ?",
      "cbk", "pw", "cbk@cbk.com", "pw", "cbk@cbk.com");
  }
}
```

```java
// 보조 클래스 활용 테스트
@Autowired
JdbcTemplate jdbcTemplate;
UserGivenHelper given;

@BeforeEach
void setUp() {
  given = new UserGivenHelper(jdbcTemplate);
}

@Test
void dupId() {
  given.givenUser("cbk", "pw", "cbk@cbk.com");

  // 실행, 결과 확인 ...
}
```









<br><br>

# 실행 환경이 다르다고 실패하지 않기

로컬 개발 환경, 빌드 서버 등 환경이 바뀐다고 실패해서는 안된다.

- eg. 파일 경로 - 프로젝트 폴더를 기준으로 상대 경로를 사용해야 한다.

테스트 코드에서 파일 생성시에도 특정 OS나 본인의 개발 환경에서만 올바르게 동작하지 않도록 주의해야 한다.










<br><br>

# 실행 시점이 다르다고 실패하지 않기

- eg. 회원의 만료 여부 일자 - 만료일을 상수로 설정하면 미래에 깨질 수도 있다.
  - 이보다는 테스트 코드에서 시간을 명시적으로 제어할 수 있는 방법을 선택할 수 있다.
  - 또는 별도의 시간 클래서를 작성할 수 있다.



## 랜덤하게 실패하지 않기

- eg. 랜덤 값 사용시 - 랜덤 값에 따라 달라지는 결과 검증할 때, 정답이 랜덤하게 만들어져서 어떤 숫자를 넣어야 하는지 미리 알 수 없고, 값이 매번 바뀌어 검증할 수 없다.
  - 연관 객체의 생성자를 통해 값을 받도록 수정하거나,
  - 랜덤 값 생성을 다른 객체에 위임하게 바꾼다.











<br><br>

# 필요하지 않은 값은 설정하지 않기

- eg. 동일 ID가 존재하는 경우에 가입할 수 없는지를 검증하는 것이 목적인 테스트
  - 상황을 만들 때 ID 외에 이메일, 이름, 가입일과 같은 값은 필요하지 않으므로 지정하지 않는다.
  - 불필요한 값을 안넣게 되면 테스트 코드가 짧아지고 가독성도 좋아진다.


## 단위 테스트를 위한 객체 생성 보조 클래스

테스트 코드 내에 객체 생성코드가 있으면 복잡해지므로, 테스트를 위한 객체 생성(~Factory) 클래스를 따로 만들면 복잡함을 줄일 수 있다.









<br><br>

# 조건부로 검증하지 않기

테스트는 성공하거나 실패해야 한다. 반드시 단언을 실행해야 한다. 단언에 조건을 넣을시 단언을 하지 않게 될 수도 있다.












<br><br>

# 통합 테스트는 필요하지 않은 범위까지 연동하지 않기

DB와 연동을 처리하는 테스트에서 `@SpringBootTest`를 사용하면 서비스, 컨트롤러 등 모든 스프링 빈을 초기화한다.

스프링 부트가 제공하는 `@JdbcTest` 애노테이션은 `DataSource`, `JdbcTemplate` 등 DB 연동과 관련된 설정만 초기화한다. 다른 빈을 생성하지 않으므로 초기화 시간이 짧아진다.








<br><br>

# 더 이상 쓸모 없는 테스트 코드

- 특정 클래스의 사용법을 익히기 위해 작성한 코드는 소프트웨어가 제공할 기능을 검증하는 코드가 아니기 때문에 테스트 코드를 유지해서 얻을 이점이 없다.
- 단지 테스트 커버리지를 높이기 위한 목적으로 작성한 테스트 코드는 유지할 필요가 없다. 예를 들어 특정 클래스의 getter 메서드 등의 매우 단순한 메서드를 검증할 목적으로 테스트 코드를 작성할 필요는 없다.







