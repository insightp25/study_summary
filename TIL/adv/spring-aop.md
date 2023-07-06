
# 10. 스프링 AOP 구현

#### 프로젝트 생성시

의존성 추가(spring data jpa, jpa 등 스프링 제공 의존성 추가하면 함께 포함돼 추가됨. 아닌 경우 직접 추가해야.)

`implementation 'org.springframework.boot:spring-boot-starter-aop'`

`aspectjweaver`가 들어와야.

`@Aspect`를 사용하려면 `@EnableAspectAutoProxy`를 스프링 설정에 추가해야. but, 스프링부트 사용시 자동으로 추가된다.

`AopUtils.isAopProxy(orderService)`

- 스프링 AOP는 AspectJ를 직접 사용하는 것이 아니다. AspectJ의 문법을 차용하고, 프록시 방식의 AOP를 제공하는 것.
- 주로 `@Aspect`를 사용하는데, 이 애노테이션도 AspectJ가 제공하는 애노테이션. 
- 스프링에서는 AspectJ가 제공하는 애노테이션, 관련 인터페이스만 사용하는 것이고, 실제 AspectJ가 제공하는 컴파일, 로드타임 위버 등을 사용하는 것은 아니다.
- `@Aspect`를 포함한 `org.aspectj` 패키지 관련 기능은 `aspectjweaver.jar` 라이브러리가 제공하는 기능. `spring-boot-starter-aop` 포함시 `org.aspectj`도 사용할 수 있게 의존관계에 포함된다.

빈을 등록하는 다른 방법
1. `@Bean` 사용 직접 등록
2. `@Import()` 주로 설정 파일 추가할 때 사용 (`@Configuration`)
3. `@Component` 컴포넌트 스캔 사용 자동 등록




## 포인트컷 분리

포인트컷 분리시 하나의 포인트컷 표현식을 여러 어드바이스에서 함께 사용할 수 있다. (그냥 지정한 절대경로 조인포인트를 중복해서 사용할 수도 있으나 편의상)

`@Pointcut`

이점
1. 중복 제거: 절대경로 조인포인트를 중복해서 사용하지 않아도 된다+실수방지(오타 등으로)
2. 네이밍으로 의미 부여: eg. `@Around("allOrder()")`. 시그니처의 네이밍(allOrder: 모든 주문에 적용)으로 의미를 부여할 수 있다.

`@Around` 어드바이스에서 포인트컷 시그니처 사용 가능. 

포인트컷 시그니처(포인트컷 애노테이션이 붙여진 메서드 시그니처)

반환타입은 `void`여야

코드 내용은 비운다

접근 제어자: 내부에서만 사용시 `private`도 되지만, 다른 애스펙트에서 참고하려면 `public`이어야.




## 스프링 AOP 구현4 - 포인트컷 참조

포인트컷을 공용으로 사용하기 위해 별도의 외부 클래스에 모아두어도 되며, 이 경우 포인트컷 접근제어자를 `public`으로 열어두어야.

`@Around()`에는 포인트컷 클래스 절대경로 + 메서드 이름 넣어야. eg. `@Around("haro.aop.order.aop.Pointcuts.allOrder()")`



## 스프링 AOP 구현5 - 어드바이스 순서

어드바이스는 기본적으로 순서를 보장하지 않는다. 순서 지정을 하려면 `@Aspect` 적용 단위로 `org.springframework.core.annotation.@Order` 애노테이션을 적용해야 -> but, 어드바이스 단위가 아닌 클래스 단위로만 적용 가능 -> 하나의 애스펙트에 여러 어드바이스 있을시 순서 보장 불가 -> **애스펙트를 별도 클래스로 분리해야**





## 스프링 AOP 구현6 - 어드바이스 종류

어드바이스 종류
1. `@Around`: 
    - 메서드 호출 전후에 수행, 가장 강력한 어드바이스, 
    - 조인 포인트 실행여부 선택(`joinPoint.proceed()`), 
    - 반환 값 변환(`joinPoint.proceed(args[])`), 
    - 예외 변환 등 가능
    - 트랜잭션 처럼 `try ~ catch ~ finally` 모두 들어가는 구문 처리 가능
    - 어드바이스의 첫 번째 파라미터는 `ProceedingJoinPoint` 사용해야
    - `proceed()`를 통해 대상을 실행하며, 여러번 실행할 수도 있음(재시도)
    - 어드바이스 종류 전체의 합집합. 아래 나머지(2~5)모두가 가능. 아래 4개는 `@Around`의 부분집합.
2. `@Before`: 조인 포인트 실행 이전에 실행. `@Around`와 다르게 작업흐름을 변경할 수는 없다. `@Around`는 `proceed()`를 호출해야 다음 대상이 호출된다. 호출하지 않거나 예외가 발생하면 다음 코드가 호출되지 않는다. 반면 `@Before`는 메서드 종료시 자동으로 다음 타겟이 호출된다.
3. `@AfterReturning`: 조인 포인트 정상 완료후 실행. 1에서는 return값(반환되는 객체)을 중간에 변경할 수 있었는데, 여기선 불가하다. `returning` 속성에 사용된 이름은 메서드의 매개변수명과 일치해야 하며, `returning` 절에 지정된 타입의 값을 반환하는 메서드만 대상으로 실행한다(타입이 다르면 해당 메서드에 대한 로직을 실행하지 않으며, 부모 타입 지정 시 모든 자식 타입 인정). 반환 객체 변경은 불가하고, 매세드 매개변수 객체에 setter 등이 있다면 조작은 가능.
```java
@AfterReturning(value = "haro.aop.order.aop.Pointcuts.orderAndService()", returning = "result")
public void doReturn(JoinPoint joinPoint, Object result) {
```
4. `@AfterThrowing`: 메서드가 예외를 던지는 경우 실행. `throwing` 속성에 사용된 이름은 메서드의 매개변수명과 일치해야 하며, `throwing` 절에 지정된 타입과 맞는 예외를 실행한다(부모 타입 지정 시 모든 자식 타입 인정)
```java
@AfterThrowing(value = "haro.aop.order.aop.Pointcuts.orderAndService()", throwing = "ex")
public void doThrowing(JoinPoint joinPoint, Exception ex) {
```
5. `@After`: 조인 포인트가 정상 또는 예외에 관계없이 실행(finally). 일반적으로 리소스를 해제하는 데 사용한다.



### 참고 정보 획득

모든 어드바이스는 `org.aspectj.lang.JoinPoint`를 첫번째 파라미터에 사용할 수 있다(생략해도 된다). 단, `@Around`는 `ProceedingJoinPoint`를 사용해야 한다.

`ProceedingJoinPoint`는 `org.aspectj.lang.JoinPoint`의 하위 타입.

### JoinPoint 인터페이스의 주요 기능
- `getArgs()`: 메서드 인수 반환
- `getThis()`: 프록시 객체 반환
- `getTarget()`: 대상 객체 반환
- `getSignature()`: 조언되는 메서드에 대한 설명 반환
- `toString()`: 조언되는 방법에 대한 설명 인쇄

### `ProceedingJoinPoint` 인터페이스의 주요 기능
- `proceed()`: 다음 어드바이스나 타겟 호출(`@Around`에서만 사용)

호출시 전달한 매개변수를 파라미터를 통해서도 전달받을 수도 있다(이후 파트)

### 순서
- 스프링은 5.2.7 버전부터 <u>**동일한 `@Aspect` 안에서**</u> 동일한 조인포인트의 우선순위를 정했다.
- 실행순서: `@Around`-`@Before`-`@After`-`@AfterReturning`-`@AfterThrowing`
- <u>**적용되는 순서 VS 호출 순서 및 리턴 순서는 반대이다**</u>

### `@Around` 외의 다른 어드바이스가 존재하는 이유
`@Around`는 `proceed()`를 반드시 호출해야. 실수 가능성이 있고 실수로 호출 안하면 치명적인 버그 발생. 반면 다른 어드바이스들은
- 실수 가능성이 낮고
- 코드도 단순
- 코드를 작성한 의도가 명확히 드러난다

### 좋은 설계는 제약이 있는 것이다: 

`@Around`만 있으면 되는데 왜 제약을 두는가? 제약은 실수를 방지. 제약 덕분에 역할이 명확해진다. 다른 개발자가 코드를 봤을 때 고민해야하는 범위도 줄고 코드 의도도 파악하기 쉬워진다.

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
