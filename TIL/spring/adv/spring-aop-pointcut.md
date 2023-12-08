# 스프링 AOP - 포인트컷

## 포인트컷 지시자

### 포인트컷 지시자
eg. `@Pointcut("execution(* haro.app.order..*(..))")`

포인트컷 표현식(AspectJ pointcut expression)은 `execution`같은 포인트컷 지시자~~Pointcut Designator(a.k.a. PCD)~~로 시작한다.

종류
- `execution`: 메서드 실행 조인포인트를 매칭. 가장 많이 사용, 기능도 복잡. (아래 나머지는 자주사용하진 않는다)
- `within`: 특정 타입 내의 조인포인트 매칭
- `args`: 인자가 주어진 타입의 인스턴스인 조인포인트
- `this`: 스프링 빈 객체(스프링 AOP 프록시)를 대상으로 하는 조인포인트
- `target`: target 객체를 대상으로 하는 조인포인트
- `@target`: 실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인포인트
- `@within`: 주어진 애노테이션이 있는 타입 내 조인포인트
- `@annotation`: 메서드가 주어진 애노테이션을 갖고 있는 조인포인트 매칭
- `@args`: 전달된 실제 인수의 런타임 타입이 주어진 타입의 애노테이션을 갖는 조인포인트
- `bean`: 스프링 전용 포인트컷 지시자. 빈의 이름으로 포인트컷 지정.


## 예제 생성

```java
@Target(ElementType.TYPE)
public @interface ClassAop {
```
`TYPE`: 클래스에 붙이는 element type. `METHOD`, `PACKAGE` 등 다양한 옵션이 있다.

`@Retention(RetentionPolicy.RUNTIME)`: `RUNTIME` - 애플리케이션이 실행될 때 까지 애노테이션이 살아서 인식할 수 있는 것(`SOURCE`도 있는데, 컴파일되면 애노테이션이 사라진다). 런타임으로 해야 실행 시점에 동적으로 읽을 수 있다.



## execution - 1

### execution 문법
```java
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)

execution(접근제어자? 반환타입 선언타입?메서드이름(인수) 예외?)
```

- 메서드 실행 조인포인트를 매칭
- `?`는 생략 가능
- `*` 같은 패턴 지정 가능

- 선언타입?: eg. `haro.aop.member.MemberServiceImpl`(패키지+클래스. 클래스가 곧 타입) + `haro(..)`(메서드, 인수)
- `String` 같은 원시타입은 앞에 패키지명 생략 가능

- `*`: 아무 값이나 들어와도 허용
- `..`: 인수 타입과 파라미터 수 상관 없다는 뜻(`0..*`)


## execution - 2

타입 매칭 - 부모 타입 허용: `execution`에서는 `MemberService`(인터페이스. 구현체 MemberServiceImpl 있음)처럼 부모 타입을 선언해도 그 자식 타입은 매칭된다. 다형성 적용.

타입 매칭 - 부모 타입에 있는 메서드만 허용: 







<u>****</u>































<br></br><br></br><br></br><br></br><br></br><br></br><br></br>

## 핵심 기능 VS 부가 기능?

핵심 기능
- 비즈니스 로직

부가기능: 보조 역할

Examples of cross-cutting concerns include:

1. **Logging**: This is a very common example of a cross-cutting concern, as you might want to log entry, exit, and exception information across many different methods and classes.

2. **Transaction Management**: For example, you might want to start a database transaction at the start of a method and commit it at the end, across many different methods.

3. **Security**: This includes authentication and authorization. For instance, you might want to check if a user is authenticated and authorized before allowing them to call certain methods.

4. **Error Handling**: You might want a standard way to catch and handle certain types of exceptions across your application.

5. **Performance Monitoring**: You might want to track how long method calls take to execute across different parts of your application.

6. **Caching**: You may want to cache the results of methods to improve performance.

7. **Data Validation**: Checking for the correctness of data before processing.

8. **Notification**: You might want a standard way of notifying certain systems or people when certain events occur in your system.

9. **Resource Pooling**: Managing resources which are expensive to create, like database connections.

10. **Concurrency Control**: Ensuring that multiple threads can safely access shared resources.

11. **Rate Limiting**: Controlling the frequency of operations, such as limiting the number of requests to an API per hour.

12. **Retries and Failover**: Automatically retrying an operation in the event of a failure, or diverting to a backup system if one fails.

13. **Auditing**: Keeping a record of user activities in the system for the sake of transparency and accountability.

14. **Instrumentation/Profiling**: Understanding the behavior of the system by gathering data about how your methods and functions are being used.

15. **Internationalization (i18n) and Localization (L10n)**: Adapting your application to different languages, regional differences and technical requirements of a target locale.

16. **Compression**: Automatically compressing responses to make them smaller, which can save bandwidth.

17. **Encryption**: Automatically encrypting data for security purposes, like sensitive information in a database.

18. **Decompression/Decryption**: Just like compression and encryption, you might need to decompress or decrypt data automatically.

19. **Context Passing**: In distributed systems, you might need to pass context (like tracing information) from one service to another.

20. **Dependency Injection**: Providing objects that an object needs (its dependencies) instead of having it construct them itself. This is also a form of decoupling code.
