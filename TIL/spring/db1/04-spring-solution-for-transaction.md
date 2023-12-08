
# 4. 스프링과 문제 해결 - 트랜잭션

## 문제점들
(순수 JDBC 사용시 문제점들)

### 기존 트랜잭션 방식의 문제
1. 서비스 계층은 순수해야 한다 -> 변화에 대응. 기술을 변경해도 서비스 계층 코드는 최대한 유지할 수 있어야.
2. 트랜잭션 동기화 문제 - 같은 트랜잭션 유지 위해 커넥션 파라미터로 전달해야
3. 반복 코드 - `try, catch, finally` 등

### 예외 누수
- 체크 예외 `SQLException`의 서비스 계층으로의 전파
- JDBC 전용 기술. JPA 등으로 변경 시 그에 맞는 예외로 변경 필요.

### JDBC 반복
- 반복 코드
    - `try, catch, finally` 등
    - 커넥션 열고, `PreparedStatement` 사용, 결과 매핑, 실행, 커넥션 및 리소스 정리 등...


<br></br>

---

## 트랜잭션 추상화

인터페이스
- `interface PlatformTransactionManager`
    - `getTransaction(..)`: 트랜잭션 시작. 이름이 get인 이유는 기진행중 트랜잭션 있는 경우 참여 가능하기 때문(트랜잭션 참여, 전파).
    - `commit(..)`
    - `rollback(..)`

구현체

`DataSourceTransactionManager`, `JpaTransactionManager`, `HibernateTransactionManager`, `EtcTransactionManager`...



<br></br>

---

## 트랜잭션 동기화

- 트랜잭션 동기화 매니저:
    - 스레드로컬 사용, 커넥션 동기화. 트랜잭션 매니저가 내부에서 사용.
    - 멀티스레드 상황에 안전하게 커넥션 동기화 가능 -> 커넥션 필요시 트랜잭션 동기화 매니저로 커넥션 획득 -> 인수로 커넥션 전달하지 않아도 되게 함

(트랜잭션 동기화 매니저 객체 안에서 커넥션을 스레드로컬 자료형인 커넥션 전용 필드에 넣어 관리한다 라고 이해하면 되나?)

- 동작 방식
    1. 트랜잭션 시 커넥션 필요. 트랜잭션 매니저가 데이터소스 통해 커넥션 만들고 트랜잭션 시작.
    2. 트랜잭션 매니저가 트랜잭션이 시작된 커넥션을 트랜잭션 동기화 매니저에 보관
    3. 리포지토리는 트랜잭션 동기화 매니저에 보관된 커넥션을 꺼내 사용(인수로 커넥션 전달 불필요)
    4. 트랜잭션 종료시 트랜잭션 매니저가 트랜잭션 동기화 매니저에 보관중인 커넥션 통해 트랜잭션 종료, 커넥션 닫음


<br></br>

---

## 트랜잭션 문제 해결 - 트랜잭션 매니저1

- 트랜잭션 동기화 사용하려면 `DataSourceUtils` 사용해야
    - `DataSourceUtils.getConnection(con, dataSource)`
        - 트랜잭션 동기화 매니저 관리중 커넥션 있을시 해당 커넥션 반환, 없을시 새로운 커넥션 생성 반환
    - `DataSourceUtils.releaseConnection(dataSource)`
        - 트랜잭션 사용 위해 동기화된 커넥션은 커넥션을 닫지 않고 그대로 유지
        - 트랜잭션 동기화 매니저가 관리하는 커넥션 없을시 해당 커넥션 닫음
        - 커넥션을 `con.close()`로 직접 닫아버리면 커넥션 유지되지 않는 문제 발생. 사용중 커넥션은 이후 로직 실행, 트랜잭션 종료(커밋/롤백)시 까지 유지돼야.

service layer에서

1. `PlatformTransactionManager transactionManager` 주입 - JDBC용
    - eg. JPA로 DB 접근 기술 변경시 `JpaTransactionManager` 등으로 대체 가능
2. `dataSource.getConnection()` 대신 `transactionManager.getTransaction(new DefaultTransactionDefinition)`. 
    - `DefaultTransactionDefinition`: timeout, 읽기전용 transaction 등 트랜잭션 속성 정할 수 있어.

트랜잭션이 커밋되거나 롤백되면 다 끝난 것. 트랜잭션 매니저가 다 정리해 준다.


<br></br>

---

## 트랜잭션 문제 해결 - 트랜잭션 템플릿

- 템플릿 콜백 패턴 사용
- `TransactionTemplate`: 사용시 `TransactionManager` 객체 필요. 생성자에서 인수로 받아 많이 사용.
    - `execute()`
    - `executeWithoutResult()`
    - `TransactionTemplate`는 구현체 클래스라 유연성이 떨어지므로 주로 생성자에서 직접 생성해 사용(`this.transactionTemplate = new TransactionTemplate(transactionManager`)를 인수로 받아 사용. 

`TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition);`

- 트랜잭션 템플릿 기본 동작
    - 서비스 로직 정상 수행 -> 커밋
    - 스프링의 기본 룰
        - 언체크 예외 -> 롤백
        - 체크 예외 -> 커밋

(예제: 람다에서 체크 예외 밖으로 던질 수 없어 `catch` 시 언체크 예외로 바꾸어 던지도록 예외 전환함)


### 문제점 중간 점검

트랜잭션 추상화가 해결한 문제들

- 기존 트랜잭션 방식의 문제
    1. 서비스 계층은 순수해야 한다 -> 변화에 대응. 기술을 변경해도 서비스 계층 코드는 최대한 유지할 수 있어야.
    2. 트랜잭션 동기화 문제 - 같은 트랜잭션 유지 위해 커넥션 파라미터로 전달해야
    3. 반복 코드 - `try, catch, finally` 등

- 예외 누수
    - 체크 예외 `SQLException`의 서비스 계층으로의 전파
    - JDBC 전용 기술. JPA 등으로 변경 시 그에 맞는 예외로 변경 필요.

- JDBC 반복
    - 반복 코드
        - `try, catch, finally` 등
        - 커넥션 열고, `PreparedStatement` 사용, 결과 매핑, 실행, 커넥션 및 리소스 정리 등...

트랜잭션 템플릿이 해결한 문제
- 반복적 트랜잭션 로직 제거

여전히 존재하는 문제
- 서비스 계층에 아직 트랜잭션 관련 로직이 남아있다 -> AOP를 통한 프록시 도입으로 해결


<br></br>

---

## 트랜잭션 문제 해결 - 트랜잭션 AOP 적용

스프링 (트랜잭션)AOP 적용은 스프링이 제공하는 빈 등이 적용되는 것에 한해 가능(Service 등이 빈으로 등록돼있어야).

원칙적으로는 `@Transactional` 사용시에도 `DataSource`와 `DataSourceTransactionManager`가 빈으로 등록되어야 하나, 스프링부트 사용시 `application.properties`를 통해 자동으로 등록 및 설정을 해준다.








<br></br>

---


<u>****</u>