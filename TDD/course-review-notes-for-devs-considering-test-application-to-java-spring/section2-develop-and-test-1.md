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








<br><br>

# 



