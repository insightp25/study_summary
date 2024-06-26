# 섹션2. 어쨌든 테스트 코드

# 테스트 추가하기: h2를 이용한 repository 테스트

개별 메서드 테스트는 통과하지만 여러 메서드를 한 번에 테스트하면 실패하는 경우 -> 비결정적 테스트

테스트 메서드가 병렬로 처리되는데 동시성 제어가 안 된다. -> `@Sql("/sql/user-repository-test-data.sql")`로 해결

`@Sql`은 해당 테스트 클래스의 각 테스트 메서드별로 실행되며 각 테스트 메서드마다 독립적인 DB 환경을 제공한다.

- test -> resources -> sql ->user-repository-test-data.sql 생성
- ```sql
insert into `users` (`id`, `email`, `nickname`, `address`, `certification_code`, `status`, `last_login_at`)
values ('1', 'jos@gmail.com', 'jos', 'Seoul', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa', 'ACTIVE', 0);
```





<br><br>

# 테스트 추가하기: h2를 이용한 service 테스트

- 흔히 사용되는 컨벤션은 아니지만 `get...`과 `find...`를 구분하는 컨벤션이 있다.
  - `get...`은 애초에 데이터가 없으면 에러를 던진다는 의미가 내포되어 있다 -> 코드의 `...orElseThrow() -> {...} 제거`
  - `find...`는 `Optional`을 반환한다는 의미

- `createUser()`네이밍에서 `User` 제거 -> 이미 `UserService` 자체가 user에 대한 책임을 지고 있기 때문에. `PostService`의 `getPostById()` `createPost()`, `updatePost` 등도 마찬가지. -> `getById()`, `creat()`, `update()`


- `@SqlGroup()` - Sql 파일을 여러 개 지정해서 실행시킬 수 있는데, 테스트 메서드 실행 전에 데이터를 넣는 코드와 테스트 메서드가 종료될 때 데이터를 정리하는 코드를 분리해서 실행 가능
```java
@SqlGroup({
    @Sql(value = "/sql/user-repository-test-data.sql", executionPhase = ExecutionPhase.BEFORE_TEST_METHOD),
    @Sql(value = "/sql/delete-all-data.sql", executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
})
@SpringBootTest
public class UserServiceTest {
  // ...
}
```




- 테스트 클래스 바로 위에 붙는 `@DataJpaTest`와 `SpringBootTest`는 각각 다른 트랜잭션 설정을 갖고 있을 수 있다. `@DataJpaTest`는 각 테스트 메서드마다 롤백을 하지만, `@SpringBootTest`는 그렇지 않다. 




- ```java
        BDDMockito.doNothing().when(mailSender).send(any(SimpleMailMessage.class));
```
  - 해석: `SimpleMailMessage`를 사용하는 send()가 호출돼도 아무 것도 하지 말라는 명령
- `@MockBean private JavaMailSender mailSender;`




- `// FIXME` - IntelliJ IDEA 코드에 작성시 하이라이트 표시



- error 노트:
  - 파일 /sql/post-service-test-data.sql 내용에서 post의 id를 1로 설정시 발생. 99 등 다른 값으로 하면 OK.
  ``` 
  org.springframework.dao.DataIntegrityViolationException: could not execute statement; SQL [n/a]; constraint ["PRIMARY KEY ON PUBLIC.POSTS(ID) ( /* key:1 */ CAST(1 AS BIGINT), 'written content1', CAST(0 AS BIGINT), CAST(0 AS BIGINT), CAST(1 AS BIGINT))"; SQL statement:
  insert into posts (id, content, created_at, modified_at, user_id) values (default, ?, ?, ?, ?) [23505-214]]
  ```






<br><br>

## 테스트 추가하기: h2를 이용한 controller 테스트

모든 레이어 테스트 전체 완료후 남아있는 미해결 문제들
- user 생성 인증시 인증 코드의 UUID 검증
- private 메서드인데 중요할 것 같은 메서드들
  - eg. 인증 url 생성 메서드(사용자에게 가는 메시지가 제대로 만들어지는지)
- 로그인 시간 갱신시 시간 검증

이제까지 테스트 작성시 경험한 문제들
- 전체적으로 느린 테스트 과정
- h2 이용시 동시성 문제








<br><br>

# 








<br><br>

# 








<br><br>

# 








<br><br>

# 








<br><br>

# 








<br><br>

# 



