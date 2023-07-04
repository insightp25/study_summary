## 필드 동기화 - 동시성 문제

동시성 문제
- 여러 스레드가 같은 인스턴스의 필드에 접근
  - 트래픽 적은 상황에서는 잘 발생하지 않고, 트래픽이 많을 수록 자주 발생
  - 특히 스프링 빈 처럼 싱글톤 객체 필드 변경 사용시 동시성 문제 조심해야
- 싱글톤 객체 같이 사용(트랜잭션 없이)
- 실무에서 굉장히 중요한 문제
- 지역변수에서는 발생하지 않음
- 다른 스레드마다 각각 다른 메모리 영역 할당
- 같은 인스턴스 필드 또는 공용 static 필드에 접근할 때 발생
- 값을 읽기만 할 시 발생하지 않는다

-> 레디스는 싱글 스레드인데 상관 있나? async로 처리하고 필드가 공용이면 있지 않을까?(아니다. 트랜잭션은 db와 관련이 있고 애플리케이션의 실행과는 완전히 별개이므로...)
  - 해결책은 2가지가 있겠는데
    1. 트랜잭션 적용 -> 보틀넥이 생긴다. async는 포기해야. 이 경우 멀티스레드이던 싱글스레드이던 문제는 같다. 
        - 중간에 트랜잭션 로직이 있다고 해도, 순서가 꼬이게 된다. DB에서만 문제가 멈춰지지, 필드 활용등에 있어서는 여전히 문제가 생긴다.
    2. 스레드 로컬 사용.

싱글 스레드여도 비동기방식(async)일 시 여전히 문제가 생길 수 있다.


트랜잭션과는 결이 다른 건가?
- 트랜잭션은 DB에 접근했을 때의 제어이고, 
- 본 동시성 문제는 애플리케이션 내에서 발생하는 문제이다.
  - 애플리케이션 로직에 트랜잭션이 포함된다면 문제에 해당이 된다.

자바 기본서 - Runnable, Thread 객체


## ThreadLocal - 소개
역할: 스레드를 구분해서 처리해준다
자바에서만 사용하는 게 아닌, 범용적인 멀티스레드 디자인 패턴 같은 것. 자바에서는 이런 것을 많이 사용하기 때문에 자바언어 차원에서 java.lang.ThreadLocal 클래스를 제공한다.

멀티스레드 환경에서 해당 스레드만 접근할 수 있는 특별한 저장소. 쉽게 얘기해 물건 보관 창구. 여러 사용자(스레드)가 있을 시 창구 직원이 있어 직원이 사용자에 따라 보관한 물건을 구분해 준다.

스레드 로컬은 객체
스레드 로컬 사용시 각 스레드마다 별도 내부 저장소 제공 -> 같은 인스턴스 스레드 로컬 필드에 접근해도 문제 없다

싱글톤 클래스내에 필드를 아예 ThreadLocal 자료형으로 지정
eg.
private ThreadLocal<String> nameStore = new ThreadLocal<>(); //이런 식으로
nameStore.set(); // 저장할 때는 이런 식으로
nameStore.get(); // 꺼낼 때는 이런 식으로
nameStore.remove(); // 사용 후 제거release. 사용 후에는 제거해줘야. 일반적으로 괜찮을 때도 있지만 특정 상황에서 메모리 누수가 날 수 있어.

동시성 문제 해결.


## 스레드 로컬 - 주의 사항

- WAS(톰캣)처럼 스레드 풀을 사용하는 경우 심각한 문제 발생 가능(다른 사용자의 민감한 정보가 타인에게 노출될 수 있다)
    1. WAS에서 스레드를 생성하는 비용은 비싸다.
    2. 스레드 풀 꺼내는 데에는 순서가 없다. 뭐가 나올지 모른다.

- 스레드를 제거하지 않고, 스레드 풀을 통해 스레드를 재사용
- 따라서 스레드 로컬을 제거 안하면, 이후에 풀에 재호출 된 스레드가 스레드 로컬의 이전 저장소에 접근해 안에있는 이전 데이터를 읽는 문제가 발생할 수도 있다.

- 해결 방법:
    - 한 스레드의 실행이 끝날 때 반드시 필드 데이터를 제거해야.
    - 보통 요청 처리가 다 끝나고 WAS에서 나갈 때 필터나 인터셉터 같은 곳에서 클리어 해서 깔끔하게 제거하는 기본 작업을 해줘야. 혹은 별도로 remove() 사용.


---
## 템플릿 메서드 패턴

핵심 기능이 수백개이면 부가기능(변하지 않는 부분)을
- 일일이 수 백 개 다 고쳐야 하는 문제 -> 유지보수성 떨어지고 실수 가능성도 높아져
- 코드가 너무 너저분해져

변하지 않는 부분(템플릿) -> 부모 클래스에 두고
변하는 부분 -> 자식 클래스에서 상속(abstract), 오버라이딩

단점
- 변하는 부분 분기 시 클래스를 계속 만들어야 함
- 보완: 익명 내부 클래스 사용
- 그럼에도 단점: 템플릿 부분만 따로 호출할 수 없다
- 상속에서 오는 단점들 그대로 안고 간다
    - 자식 클래스가 부모 클래스와 컴파일 시점에 강하게 결합되는 문제->자식 클래스 입장에서 부모 클래스 기능 전혀 사용하지 않아도 부모 클래스를 상속받아야(자식 클래스는 변하는 로직만 들고있고, 해당 로직만 사용할 수도 있다). 그리고 부모 클래스 잘못 수정하면 자식에게도 그대로 전이된다.

### 좋은 설계란?

'변경'이 일어날 때 자연스럽게 드러난다.
단일 책임 원칙 등...평소엔 안드러나지만 변경이 있을 때 드러난다.

GOF 템플릿 메서드 디자인 패턴의 목적: "작업에서 알고리즘의 골격을 정의하고 일부 단계를 하위 클래스로 연기합니다. 템플릿 메서드를 사용하면 하위 클래스가 알고리즘의 구조를 변경하지 않고도 알고리즘의 특정 단계를 재정의할 수 있습니다."
- 골격 -> 템플릿




## 전략 패턴(콜백 패턴)

변하지 않는 부분 -> context에. 
변하는 부분 -> strategy에. 

context: strategy를 parameter 등 어떤 방식으로든 받아 사용하게 함.
strategy: 인터페이스. 변하는 부분을 구현체에서 구현하도록 함.
상속이 아닌 '위임'으로 문제 해결

GOF에서 정의한 전략 패턴의 의도
"알고리즘 제품군을 정의하고 각각을 캡슐화하여 <u>**상호 교환**</u> 가능하게 만들자. 전략을 사용하면 알고리즘을 사용하는 클라이언트와 <u>**독립적으로**</u> 알고리즘을 변경할 수 있다."

### 디자인 패턴은 그림이 아닌 의도로 구분을 한다. 전략 패턴의 경우 strategy를 context 안에 갖고 있을 수도, strategy를 인수로 전달 받을 수도 있어 미묘히 그림은 달라질 수 있다. -> 그림보다 의도가 중요.

핵심: context는 strategy 인터페이스에만 의존

스프링에서 의존관계 주입하는 방식이 전략 패턴
strategy가 어떻게 변하든 context는 전혀 영향을 받지 않음.
당연히 strategy도 client에서 익명 내부 클래스로 구현하여 바로 사용 가능

방식1: 선 조립 후 실행
단점: 
- context와 strategy를 조립한 이후에는 strategy를 변경하기 번거롭다
- context에 setter를 제공해 strategy를 넘겨받아 변경하면 되지만, context가 싱글톤일 경우 동시성 이슈 등 고려할 점이 많아
    - 전략을 실시간으로 변경해야 하면 차라리 context를 하나 더 생성해 그곳에 다른 strategy를 주입하는 것이 나을 수 있다

방식2: strategy를 실행할 때마다 전략을 인수로 받아 사용
- 장점: 유연함
- 단점: 실행할 때마다 strategy 계속 지정해야





## 템플릿 콜백 패턴

전략 패턴 2번 방식처럼
다른 코드의 인수로서 넘겨주는 실행 가능한 코드를 콜백(callback)이라 한다.
전략 패턴에서 strategy가 콜백이었음

### 콜백 정의
callback/call-after function: 다른 코드의 인수로서 넘겨주는 실행 가능한 코드
콜백을 넘겨받는 코드는 이 코드를 즉시 실행할 수도, 나중에 실행할 수도 있다

쉽게 callback은 코드가 호출*call*은 되는데 코드를 넘겨준 곳의 뒤*back*에서 실행된다는 뜻

### 자바 언어에서 콜백
- 실행 가능한 코드를 인수로 넘기려면 객체가 필요(람다 사용 가능)
- 자바8 이전 -> 하나의 메서드 가진 인터페이스 구현 후 주로 익명 내부 클래스 사용
- 최근 -> 람다 사용

### 템플릿 콜백 패턴
- 스프링에서는 방식2(strategy를 인수로/콜백으로 전달)의 전략 패턴을 템플릿 콜백 패턴이라고 부른다.
- 템플릿 콜백 패턴은 GOF 패턴은 아니다.
- 스프링 내부에서 이런 방식 자주 사용하기 때문에, 스프링 안에서만 이렇게 부른다.
- 전략 패턴에서 템플릿과 콜백 부분이 강조된 패턴
- `JdbcTemplate`, `RestTemplate`, `TransactionTemplate`, `RedisTemplate` 처럼 다양한 템플릿 콜백 패턴이 사용된다. 

예제
- context -> template
- strategy -> callback



## 중간 정리
템플릿 메서드 패턴, 전략 패턴, 템플릿 콜백 패턴 모두 한계가 있는데,
- 결국 부가 기능을 적용하기 위해 원본 코드(클라이언트 코드)를 모두 수정해야함은 마찬가지.
---

요구사항 추가
- 원본 코드 수정 없이 부가 기능 추가적용할 것
- 선택적으로 부가 기능 적용할 수 있도록 할 것
- 어떤 종류의 클래스에도(인터페이스를 구현한/구현하지 않은 클래스, 스프링 빈으로 등록한 클래스 등) 적용하도록 할 것

## 프록시, 데코레이터 패턴 - 소개

클라이언트: 요청자, 웹브라우저, 요청하는 객체
서버: 처리자, 웹 서버, 요청을 처리하는 객체

대리자*proxy*를 통해 간접 요청 가능

재미있는 점은 간접 호출 시 대리자가 중간에서 여러가지 일 가능

- 캐싱, 접근 제어: 엄마(대리자)한테 라면 사달라고 했는데, 집에 있다고 함.
- 부가 기능 추가: 아빠(대리자)한테 차 주유를 부탁했는데 세차까지 해주심.
- 대리자가 또 다른 대리자 부를 수도
- 핵심: 클라이언트는 대리자를 통해 요청했기 때문에 그 이후 과정은 모름. 동생(대리자)에게 라면을 사달라고 했는데 동생이 또 다른 대리자에게 라면을 사달라고 할 수도 있음. 근데 나는 어쨌든 동생한테서 라면만 받으면 되는 것.

캐싱 확인이 결국 AOP, 프록시

### 대체 가능
- 서버와 프록시는 <u>**같은 인터페이스**</u> 사용 -> 클라이언트는 서버에 요청을 한 것인지, 프록시에게 한 것인지 몰라야 -> 그래야 객체가 프록시가 될 수 있음
- 서버를 프록시 객체로 변경해도 클라이언트 코드를 변경하지 않고 동작할 수 있어야

런타임 객체 의존 관계
- 클라이언트 객체에 DI를 사용해 client -> server에서 client -> proxy로 객체 의존관계를 변경해도 **클라이언트 코드를 전혀 변경하지 않아도 된다**

DI를 사용하면 클라이언트 코드 변경 없이 유연하게 프록시 주입 가능

프록시 주요 기능
- 접근 제어
    - 권한에 따른 접근 차단
    - 캐싱
    - 지연 로딩
- 부가 기능 추가
    - 원래 서버 제공 기능에 더해 부가 기능 수행
        - eg1. 요청 값, 응답 값 중간에 변형
        - eg2. 실행 시간 측정, 로그 추가


GOF 디자인 패턴
- '의도*intent*'에 따라 구분(모양은 둘이 그냥 동일)
    - 프록시 패턴: 접근 제어가 목적
    - 데코레이터 패턴: 새로운 기능 추가가 목적

프록시라는 개념은 프록시 객체 안에서의 개념도 있고, 웹 서버에서의 프록시도 있다. 객체 안에서 객체로 구현돼있는가, 웹 서버로 구현돼 있는가 처럼 규모 차이만 있을 뿐 근본적 역할은 같다.

## 프록시 패턴

프록시 객체에서 실제 구현 객체(호출하는 대상)를 'target'이라고 지칭한다
프록시는 최종적으로 실제 객체를 호출해야. 따라서 내부에 실제 객체의 참조를 갖고 있어야.


## 데코레이터 패턴

GOF에서는 데코레이터 패턴에서 구현의 대상이 되는 인터페이스를 'component'라고 부른다

데코레이터가 중간에 여러개가 생기면 호출할 때 순서 설정이 중요하게 된다

꾸며주는 `Decorator`들은 스스로 존재할 수 없다. 항상 꾸며줄 대상이 있어야 한다. 따라서 내부에 호출 대상인 `component`를 항상 갖고 있어야 하고, 동일 호출 대상을 꾸미는 데코레이터가 많을 수록 `component`를 호출하는 중복이 생긴다. 이런 중복 제거를 위해 `component`를 속성으로 갖고있는 `Decorator`라는 <u>**추상클래스**</u>를 만드는 방법도 고민할 수 있다.
- 이렇게 하면 실제 컴포넌트와 데코레이터의 구분이 명확해져 도움이 된다.


## 인터페이스 기반 프록시 - 적용

- 프록시 객체를 스프링 빈에 등록시
- 프록시 객체는 스프링 컨테이너가 관리하고 자바 힙 메모리에도 올라간다. 반면 실제 객체는 프록시 객체를 통해 참조만 되며 자바 힙 메모리에 올라가지만 스프링 컨테이너가 관리하지 않는다.

- 여기까지에서의 한계: 너무 많은 프록시 클래스를 만들어야 하는 단점


## 클래스 기반 프록시 - 적용

클래스 기반 프록시 단점
- 자바 기본 문법에 의해 자식 클래스를 생성할 때 항상 super()로 부모 클래스의 생성자를 호출해야. 생략시 기본 생성자가 호출(하지만 예시에서 부모클래스에 기본 생성자가 없었고 인수 1개를 받는 생성자만 있어서, 자식 클래스 생성자에서 super(...)를 호출해야 했음).
- 프록시는 부모 객체 기능 사용하지 않기 때문에 super(null) 입력
- 인터페이스 기반 프록시는 이런 요소들 해당사항 없음

## 인터페이스 기반 VS 클래스 기반 프록시

- 클래스 기반 프록시는 해당 클래스에만 적용할 수 있다(-> ?). 인터페이스 기반 프록시는 인터페이스만 같으면 모든 곳에 적용할 수 있다.
- 상속에 따른 제약
    - 부모 생성자 호출해야
    - 클래스에 final 키워드 붙으면 상속 불가
    - 메서드에 final 키워드 붙으면 오버라이딩 불가
- 인터페이스 기반 프록시 단점은 인터페이스가 필요하다는 그 자체.

- 인터페이스가 항상 필요하지는 않다: 하지만 실무에서는 구현을 변경할 일이 거의 없는 클래스도 많다. 인터페이스 도입은 구현을 변경할 가능성이 적을 때 효과적, 실용적.

---
### 지금까지의 단점, 이전의 문제 follow-up

템플릿 메서드 패턴: abstract 부모 클래스
단점
- 변하는 부분 분기 시 클래스를 계속 만들어야 함
- 보완: 익명 내부 클래스 사용
- 그럼에도 단점: 템플릿 부분만 따로 호출할 수 없다
- 상속에서 오는 단점들 그대로 안고 간다
    - 자식 클래스가 부모 클래스와 컴파일 시점에 강하게 결합되는 문제->자식 클래스 입장에서 부모 클래스 기능 전혀 사용하지 않아도 부모 클래스를 상속받아야(자식 클래스는 변하는 로직만 들고있고, 해당 로직만 사용할 수도 있다). 그리고 부모 클래스 잘못 수정하면 자식에게도 그대로 전이된다.

전략 패턴
방식1: 선 조립 후 실행
단점: 
- context와 strategy를 조립한 이후에는 strategy를 변경하기 번거롭다
- context에 setter를 제공해 strategy를 넘겨받아 변경하면 되지만, context가 싱글톤일 경우 동시성 이슈 등 고려할 점이 많아
    - 전략을 실시간으로 변경해야 하면 차라리 context를 하나 더 생성해 그곳에 다른 strategy를 주입하는 것이 나을 수 있다

방식2: strategy를 실행할 때마다 전략을 인수로 받아 사용
- 장점: 유연함
- 단점: 실행할 때마다 strategy 계속 지정해야
---
결국 템플릿 메서드 패턴, 전략 패턴, 템플릿 콜백 패턴 모두 한계가 있는데,
- 결국 부가 기능을 적용하기 위해 <u>**원본 코드(클라이언트 코드)를 모두 수정해야함**</u>은 마찬가지.
---
프록시 패턴에서의 문제
- 너무 많은 프록시 클래스를 생성해야.
- 프록시 클래스 하는 일이 모두 동일하여도(로깅 등) 적용해야하는 대상 클래스가 100개 있다면 프록시 100개를 만들어야
- (흐름제어나 부가기능 로직 자체는 모두 동일함에도 불구하고)

---
### 여기까지의 전체 흐름 정리
프록시 패턴에서는 <u>**원본 코드(클라이언트 코드)**</u>에 손을 대지 않아도 되지만(빈 설정 등에서 제어 흐름의 구조를 정함). -> 대신 곁가지로 프록시 클래스를 계속 따로 만들어야. -> 적용해야하는 대상(target/component) 클래스가 100개라면?
- 프록시 클래스를 하나만 만들어 모든 곳에 적용하는 방법은 없을까? -> 동적 프록시 기술
---
## 동적 프록시 기술

## 리플렉션

핵심: **'메타 데이터'**

동적으로 만들어 낸다는 건 결국 수동으로 프록시 클래스를 계속 안만들어도 된다는 것
- Java 기본 제공 JDK 동적 프록시 기술
- 오픈소스 기반 프록시 기술 - CGLIB 등

자바 리플렉션 기술 이해 -> JDK 동적 프록시 이해

- 리플렉션: 클래스, 메서드의 메타정보 동적 획득, 코드 동적 호출.
    - 클래스나 메서드 메타정보를 사용해 </u>**동적으로 호출하는 메서드를 변경할 수 있다**</u>(변하는 로직과 변하지 않는 로직 중 변하는 로직만 별도로 뽑아내 그때 그때 다르게 호출할 수 있다).

하지만 리플렉션 기술은 런타임에 동작, 컴파일 시점에 오류 잡을 수 없어

리플렉션은 type-safe 등으로 컴파일 오류 잡아주는 방식에 역행하는 방식

일반적으로 사용하면 안되고, 프레임워크 개발 혹은 매우 일반적인 공통 처리가 필요할 때 부분적으로 주의해서 사용


## JDK 동적 프록시

JDK 동적 프록시는 인터페이스 활용해서만 가능. 상속 활용 못함.

동적 프록시: 프록시의 로직은 같은데, 적용 대상만 차이가 있는 문제 해결

- 프록시 객체를 동적으로 런타임에 대신 만들어 준다
- 동적 프록시에 원하는 실행 로직을 지정할 수 있다

JDK 동적 프록시가 제공하는 InvocationHandler
- Object proxy 프록시 자신
- Method method 호출한 메서드
- Object[] args 메서드 호출시 전달한 인수


동적 프록시를 사용하면 결국 handler 하나 만들고, config에서 설정 해주는 것으로 모든 작업이 끝난다.

### 적용1
proxy를 부르면 지정한 클래스의 모든 메서드에 대해 invoke가 된다. eg. 로그를 출력하지 말아야 하는 메서드도 똑같이 invoke 되는 문제가 남음. -> 특정 조건에서만 로그 남기는 기능 별도 개발

### 적용2
PatternMatchUtils.simpleMatch(...)


## CGLIB(Code Generator Library)

인터페이스 없어도 구현체 클래스만으로 동적 프록시 만들어낼 수 있다
외부 라이브러리 -> 스프링 프레임워크 편입

MethodInterceptor 사용

하지만 CGLIB 사용하는 경우 거의 없다. `ProxyFactory`가 있어서.

상속에 따른 제약
- 부모 클래스 생성자 체크
- 클래스에 final 키워드 붙을 시 상속 불가
- 메서드에 final 키워드 붙을 시 오버라이딩 불가


### 남은 문제

- 인터페이스 경우 -> JDK 동적 프록시 with `InvocationHandler`
- 그 외 경우 -> CGLIB with `MethodInterceptor`
- 둘을 중복으로 각각 만들어 관리해야 할까?
- 특정 조건(no log 등)에 맞는 기술을 적용하도록 공통으로 제공할 수 있는 방법이 없을까?



## Proxy Factory

이전에는 상황에 따라 JDK 동적 프록시, CGLIB 사용 여부를 직접 선택 -> 프록시 팩토리 하나로 편리하게 동적 프록시 생성


프록시 팩토리가 `InvocationHandler`와 `MethodInterceptor` 둘 중 적절하게 선택하여 프록시를 생성하고, 해당 프록시의 `InvocationHandler`/`MethodInterceptor`는 내부에서 `Advice`를 호출.

- `Advice`: `InvocationHandler`/`MethodInterceptor`를 개념적으로 추상화. 프록시가 제공하는 부가기능 이란 뜻이라 해석할 수 있음.

- 프록시 팩토리 사용시 둘 대신 `Advice` 사용하면 된다
---
```Java
public interface MethodInterceptor extends Interceptor {
    Object invoke(MethodInvocation invocation) throws Throwable;
}
```

- `MethodInvocation`: 다음 모두 포함
    - 다음 메서드 호출 방법
    - 현재 프록시 객체 인스턴스
    - `args`
    - 메서드 정보

(기존 `InvocationHandler`/`MethodInterceptor`의 인수들이 모두 이 안으로 들어갔다고 생각하면 된다)

`MethodInterceptor`는 CGLIB의 그것과 이름이 동일하니 패키지 이름에 주의.

MethodInterceptor -> Interceptor -> Advice

org.aopalliance.intercept 패키지는 AOP 모듈(spring-top)안에 있다.

`invocation.proceed()`(부가기능 구현할 때): `target` 클래스 호출하고 그 결과를 받음

`target` 정보는 이미 `MethodInvocation` 안에 모두 들어가 있음

`new ProxyFactory(targe)` 프록시 팩토리 생성할 때 이미 정보를 넣음 -> 

`AopUtils.isAopProxy()` 프록시 팩토리 사용해 생성된 객체에 true 표시

`proxyFactory.setProxyTargetClass(true);` ProxyTargetClass 옵션을 사용하면 인터페이스가 있어도 강제로 CGLIB을 사용하고, 클래스 기반 프록시 사용. 중요. 실무에서도 사용함.

### 정리
- 프록시 팩토리 서비스 추상화 덕분에 구체적 CGLIB, JDK 동적 프록시 기술에 의존 없이 편리하게 동적 프록시 생성 가능
- 프록시의 부가 기능 로직도 특정 기술에 종속적이지 않게 `Advice` 하나로 편리하게 사용할 수 있다.

JDK 동적 프록시 경우  `InvocationHandler`가 `Advice` 호출, CGLIB의 경우 `MethodInterceptor`가 `Advice` 호출.

스프링 부트는 AOP 적용시 기본적으로 `ProxyTargetClass=true`로 설정해서 사용. 인터페이스 있어도 항상 CGLIB 사용해 구체 클래스 기반 프록시 생성.


---
## 포인트컷, 어드바이스, 어드바이저 - 소개

- 포인트컷~~Pointcut~~(어디에?): 메서드, 클래스에. 어디에 부가기능 적용할지 안할지 판단하는 필터링 로직. 주로 클래스, 메서드 이름으로 필터링(어떤 포인트에 기능을 적용할지 하지 않을지 잘라서~~cut~~ 구분하는 것)
- 어드바이스~~Advice~~(어떤 로직?): 프록시가 호출하는 부가 기능. 단순히 프록시 로직이라 생각하면 된다.
- 어드바이저~~Advisor~~: 하나의 포인트컷과 하나의 어드바이스.

부가 기능 로직을 적용해야 하는데, 포인트컷으로 어디에?적용할지 선택하고, 어드바이스로 어떤 로직을 적용할지 선택하는 것.

어디에? 어떤 로직?을 모두 알고 있는 것이 **어드바이저**.

조언자~~Advisor~~는 어디~~Pointcut~~에 조언~~Advice~~을 해야할지 알고 있다.

역할과 책임 명확한 분리 위해 이렇게 구분한 것.
포인트컷은 대상 여부를 확인하는 필터 역할만 담당.
어드바이스는 부가 기능 로직만 담당.
스프링에서 1+1로 쓴다.


## 직접 만드는 포인트컷

`Pointcut`이라는 인터페이스가 있다.
`MethodMatcher`와 `ClassFilter` 두 가지 모두 만족(true)해야 어드바이스를 사용 가능

(일반적으론 스프링이 이미 만든 구현체를 사용)


## 스프링이 제공하는 포인트컷

- `NameMatchMethodPointCut`: 메서드 이름 기반 매칭. 내부에서는 `PatternMatchUtils` 사용. eg. `*blahblah*` 허용
- `JdkRegexpMethodPointcut`: JDK 정규 표현식 기반으로 포인트컷 매칭
- `TruePointcut`: 항상 참 반환
- `AnnotationMatchingPointcut`: 애노테이션으로 매칭
- `AspectJExpressionPointcut`: aspectJ 표현식으로 매칭

가장 중요한 것은 aspectJ표현식. 편하고 기능도 가장 많다. 

aspectJ 표현식과 사용법은 중요(이후 cover).


## 여러 어드바이저 함께 적용

`advisor`는 등록하는 순서대로 호출된다.

여러 프록시를 사용할 때와 비교해 결과는 같고 성능은 더 좋다.

중요: 하나의 `target`에 여러 AOP가 동시에 적용돼도, 스프링의 AOP는 `target`마다 하나의 프록시만 생성한다.
- 실무에서 AOP 적용 수 만큼 프록시가 생성된다고 착각하는 경우가 있다. 스프링은 AOP를 적용할 때 최적화를 진행해서 프록시는 하나만 만들고, 하나의 프록시에 여러 어드바이저를 적용한다.


## 정리

어드바이저, 어드바이스, 포인트컷 개념 덕분에 **어떤 부가 기능**을 **어디에 적용**할 지 명확히 이해 가능하게 됨

### 남은 문제

#### 문제1 - 너무 많은 설정
`ProxyFactoryConfigV1`, `ProxyFactoryConfigV2`와 같은 설정 파일이 지나치게 많아짐.

스프링 빈이 100개가 있다면 100개의 동적 프록시 생성해야.

#### 문제2 - 컴포넌트 스캔

컴포넌트 스캔 사용시 프록시 적용 불가 -> 실제 객체를 컴포넌트 스캔으로 스프링 컨테이너에 스프링 빈으로 등록을 다 해버린 상태이기 때문.

실제 객체를 스프링 컨테이너에 빈으로 등록하는 것이 아니라, 부가기능이 있는 프록시를 실제 객체 대신 스프링 컨테이너에 빈으로 등록해야.

---
## 빈 후처리기~~bean post-processor~~

빈 후처리기는 막강하다

`BeanPostProcessor` 인터페이스를 구현하고, 스프링 빈으로 등록하면 된다

spring bean 등록시 post processor 가 다른 빈들보다 우선권을 갖는다

빈 후처리기: 빈 조작, 다른 객체로 교체 등

조작: 해당 객체의 특정 메서드를 호출하는 것

일반적으로 스프링 컨테이너가 등록하는, 특히 컴포넌트 스캔의 대상이 되는 빈들은 중간에 조작할 방법이 없는데, 빈 후처리기를 사용하면 개발자가 등록하는 모든 빈을 중간에 조작할 수 있다. -> **빈 객체를 프록시로 교체**하는 것도 가능하다는 뜻.

#### 번외: `@PostConstruct`의 비밀
`@PostConstruct`는 스프링 빈 생성 이후 빈을 <u>**초기화**</u> 하는 역할을 한다.

생각해보면 빈의 초기화는 단순히 `@PostConstruct` 애노테이션이 붙은 초기화 메서드를 한 번 호출만 하면 된다. -> 생성된 빈을 한 번 조작하는 것. -> 빈 조작하는 적절한 빈 후처리기가 있으면 된다

스프링은 `CommonAnnotationBeanPostProcessor`라는 빈 후처리기를 자동으로 등록하는데, 여기서 `@PostConstruct` 애노테이션이 붙은 메서드를 호출한다. 따라서 스프링 스스로도 스프링 내부 기능 확장(<u>**초기화**</u>)을 위해 빈 후처리기를 사용한다.


## 빈 후처리기 - 적용

프록시를 스프링 빈으로 등록 -> 수동 등록 빈 + 컴포넌트 스캔 사용 빈 모두 프록시 적용 가능, 설정 파일의 프록시 생성 코드 모두 한 번에 제거 가능

앱 실행시 처음에 빈에 등록되는 객체들 너무 많다(+final로 돼있어서 proxy로 등록 못하는 빈들도 있다, 오류 발생) -> package를 지정하는 방법 등을 사용해서 꼭 필요한 객체들에만 proxy 적용하도록 한다 -> 더 좋은 방법은 포인트컷을 활용하는 방법.


## 빈 후처리기 - 정리

스프링은 프록시 생성을 위한 빈 후처리기를 이미 만들어 제공(`AnnotationAwareAspectJAutoProxyCreator`)

어드바이저는 포인트컷을 갖고 있다 -> 어드바이저 통해 포인트컷 확인 가능(프록시 적용 대상 여부 더 정밀히 설정 가능)

**결과적으로 포인트컷은 다음 두 곳에 사용된다**
1. 프록시 적용 대상 여부 체크, 꼭 필요한 곳에만 프록시 적용(빈 후처리기 - 자동 프록시 생성)
2. 프록시의 특정 메서드가 호출됐을 때 어드바이스를 적용할지 판단(프록시 내부)


---
## 스프링 제공 빈 후처리기1

의존성 spring-boot-starter-aop 추가 -> **자동 프록시 생성기~~AutoProxyCreator~~**

**자동 프록시 생성기~~AutoProxyCreator~~**
`AnnotationAwareAspectJAutoProxyCreator`라는 빈 후처리기가 스프링 빈에 자동 등록
- 스프링 빈으로 등록된 `Advisor`들을 자동으로 찾아 프록시가 필요한 곳에 자동으로 프록시를 적용해준다.
- `Advisor` 안에는 `Pointcut`과 `Advice`가 이미 모두 포함 -> `Advisor`만 알고 있으면 그 안에 있는 `Pointcut`으로 어떤 스프링 빈에 프록시를 적용해야 할지 알 수 있다. 그리고 `Advice`로 부가 기능 적용.

`AnnotationAwareAspectJAutoProxyCreator`가 스프링 AOP의 핵심인 셈.

두 개를 구분해서 이해해야
1. 프록시를 만드는 단계에서 사용하는 포인트컷
    - 클래스 + 메서드 조건 하나하나 모두 비교. 조건에 맞는 포인트컷 하나라도 있을 시 프록시 생성.
2. 실제 실행 단계에서 사용하는 포인트컷
    - 프록시 호출시 어드바이스 적용 여부를 포인트컷 보고 판단

프록시 모든 곳에 생성하는 것은 비용 낭비. 꼭 필요한 곳에 최소한의 프록시를 적용해야



## 스프링이 제공하는 빈 후처리기2

기존 포인트컷의 `"request*", "order*", "save*"`등이 매칭만 되면 프록시가 적용되기 때문에 앱 실행시 기대하지 않은 로그들이 올라오는 경우 있어. 보다 정밀한 포인트컷 필요.

`AspectJExpressionPointcut`: 실무에서는 이 것만 사용.


```java
AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
pointcut.setExpression("execution(* hello.proxy.app..*(..)) && !execution(* hello.proxy.app..noLog(..))")
```
표현식 예























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
