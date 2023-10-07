# SECTION4. 스프링 컨테이너와 스프링 빈

# 스프링 컨테이너 생성

```java
// 스프링 컨테이너 생성
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```
* ApplicationContext: 스프링 컨테이너라 칭한다. 인터페이스이다.
* 스프링 컨테이너는
  1. XML 기반으로 만들거나
  2. 애노테이션 기반 자바 설정 클래스
  
  로 만들 수 있다(스프링 부트 자체가 애노테이션 기반으로 편리하게 작동하도록 되어 있어서, 요즘엔 XML 기반 컨테이너는 잘 사용하지 않는다).
* AnnotationConfigApplicationContext: ApplicationContext의 구현체.

> 참고: 스프링 컨테이너 지칭시 엄격히는 BeanFactory, ApplicationContext로 구분. 하지만, BeanFactory를 직접 사용하는 경우는 거의 없고 일반적으로 ApplicationContext를 스프링 컨테이너라 한다.

## 스프링 컨테이너 생성 과정
1. 스프링 컨테이너 생성
    * 생성시 구성 정보(eg. AppConfig.class)를 지정해주어야 한다.
    * 스프링 컨테이너 내부 저장소 필드
        * 빈 이름
        * 빈 객체
2. 스프링 빈 등록
    * 빈 이름
        * 메서드 이름 사용
        * 이름 직접 부여도 가능.
            * eg. @Bean(name = "memberServiceImpl")
    > 주의: `빈 이름은 항상 다른 이름을 부여`. 같은 이름 부여시 다른 빈이 무시되거나, 기존 빈을 덮어 써버리거나, 설정에 따라 오류 발생(예전엔 덮어 써버렸는데, 최근 스프링부트에선 경고나고 튕기도록 변경됨).
3. 스프링 빈 의존관계 설정 - 준비
4. 스프링 빈 의존관계 설정 - 완료
    * 설정 정보(AppConfig.class) 참고해 의존관계 주입
    * 단순히 자바 코드 호출과 차이가 있다(이후 싱글톤 컨테이너에서 후술)
    
    >참고: 스프링은 `빈 생성 단계`와 `의존 관계 주입 단계`가 `나누어져 있다`. 하지만 `자바 코드로 스프링 빈 등록시 생성자를 호출하면서 의존관계 주입도 한 번에 처리`. 관련 추가 설명은 의존관계 자동 주입에서 후술.

<br>
<br>

---

# 컨테이너에 등록된 모든 빈 조회

```java
// 스프링 컨테이너 생성
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);

// 빈 이름 조회 - 모든, 컨테이너에 등록된
String[] beanDefinitionNames = applicationContext.getBeanDefinitionNames();

// 빈 객체 조회
Object bean = applicationContext.getBean(beanDefinitionName);

// 빈 정의 조회
BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionName);

// 빈 역할 조회
// BeanDefinition.ROLE_APPLICATION - 일반적으로 사용자가 정의한 빈
// BeanDefinition.ROLE_INFRASTRUCTURE - 스프링 내부에서 사용하는 빈
beanDefinition.getRole()
```

<br>
<br>

---

# 스프링 빈 조회 - 기본
가장 기본적인 조회 방법
* applicationContext.getBean(빈 이름, 타입)
* applicationContext.getBean(타입)
    * 타입에 인터페이스, 구현 객체 둘 다 OK. 조회시 구현 객체로 비교한다. 하지만 구현 객체로 조회시 유연성이 떨어지며, 인터페이스로 조회하는 게 더 나은 practice.
* 조회 대상 스프링 빈 없을시 예외 발생
    * NoSuchBeanDefinitionException: No bean named 'xxxxx' available

```java
// JUnit 테스트코드 예
@Test
@DisplayName("빈 이름으로 조회")
void findBeanByName() {
    RedisConnectionFactory redisFanOutConnectionFactory = ac.getBean(
        "redisFanOutConnectionFactory", RedisConnectionFactory.class);
    assertThat(redisFanOutConnectionFactory)
        .isInstanceOf(LettuceConnectionFactory.class);
}

@Test
@DisplayName("이름 없이 타입(인터페이스)으로만 조회")
void findBeanByInterfaceType() {
    RedisConnectionFactory redisFanOutConnectionFactory = ac.getBean(RedisConnectionFactory.class);
    assertThat(redisFanOutConnectionFactory)
        .isInstanceOf(LettuceConnectionFactory.class);
}

@Test
@DisplayName("이름 없이 타입(구현체)으로만 조회")
void findBeanByImplementationType() {
    RedisConnectionFactory redisFanOutConnectionFactory = ac.getBean(LettuceConnectionFactory.class);
    assertThat(redisFanOutConnectionFactory)
        .isInstanceOf(LettuceConnectionFactory.class);
}

@Test
@DisplayName("빈 이름으로 조회 실패")
void findBeanByNameX() {
    assertThrows(NoSuchBeanDefinitionException.class,
        () -> ac.getBean("xxxxx", RedisConnectionFactory.class));
}
```

<br>
<br>

---

# 스프링 빈 조회 - 동일 타입 둘 이상
* 타입으로 조회시 같은 타입 스프링 빈이 둘 이상일시 오류 발생. 해당 경우 빈 이름 지정.
* ac.getBeanOfType() 으로 해당 타입 모든 빈 조회 가능
```java
// 특정 타입의 빈 모두 조회
Map<String, RedisConnectionFactory> beansOfType = applicationContext.getBeansOfType(RedisConnectionFactory.class);
```

```java
// JUnit 테스트코드 예
// RedisConnectionFactory 인터페이스를 구현하고, 타입이 같은 두 개의 인스턴스 빈(eg. redisSessionConnectionFactory, redisFanOutConnectionFactory)이 있다고 가정
@Test
@DisplayName("타입으로 조회시 같은 타입 둘 이상 있으면 중복 오류 발생")
void findBeanByTypeDuplicate() {
    assertThrows(NoUniqueBeanDefinitionException.class,
        () -> ac.getBean(RedisConnectionFactory.class));
}

@Test
@DisplayName("타입으로 조회시 같은 타입 둘 이상 있으면 중복 오류 발생 -> 빈 이름 지정 조회, 테스트 통과")
void findBeanByNameAndDuplicateType() {
    RedisConnectionFactory redisConnectionFactory = ac.getBean("redisSessionConnectionFactory",
        RedisConnectionFactory.class);

    assertThat(redisConnectionFactory).isInstanceOf(RedisConnectionFactory.class);
}

@Test
@DisplayName("특정 타입 빈 모두 조회")
void findAllBeanByType() {
    Map<String, RedisConnectionFactory> beansOfType = ac.getBeansOfType(RedisConnectionFactory.class);
    for (String key : beansOfType.keySet()) {
        System.out.println("key = " + key + ", value = " + beansOfType.get(key));
    }
    System.out.println("beansOfType = " + beansOfType);
    assertThat(beansOfType.size()).isEqualTo(2);
}
```

<br>
<br>

---
# 스프링 빈 조회 - 상속 관계
* 부모 타입으로 조회시, 자식 타입도 함께 조회
    * getBean()으로 부모 타입 조회시, 자식이 둘 이상 있으면 중복 오류 `NoUniqueBeanDefinitionException` 발생 -> getBeansOfType()으로 모두를 조회하거나, 빈 이름 특정해 지정하면 OK
* eg. 모든 자바 객체의 최고 부모인 Object 타입으로 조회시 모든 스프링 빈 조회

> 빈 조회는 이 정도까지 알면 충분하며, ApplicationContext.getBean() 등 빈 조회를 직접 쓸 일은 거의 없다. 가끔, 순수 자바 애플리케이션에서 스프링 컨테이너를 생성해 쓸 일이 있긴 한데, 그럴 때 사용하면 된다. 추가로 빈 조회 + 상속 관계의 내용을 알아야 자동 의존관계 주입 등에서 문제 없이 잘 해결할 수 있다. (이 외 다른 기능들도 있지만 주로 스프링 컨테이너 자동 의존관계 주입을 사용하기 때문에 또한 거의 사용하지 않는다.)

<br>
<br>

---
# BeanFactory와 ApplicationContext
(I)BeanFactory <- (I)ApplicationContext <- (C)AnnotationConfigApplicationContext
### BeanFactory
* 스프링 컨테이너 최상위 인터페이스
* 스프링 빈 관리, 조회 역할 담당
* getBean() 제공
* 지금까지 사용한 기능 대부분 BeanFactory가 제공

### ApplicationContext
* BeanFactory 기능 모두 상속
* BeanFactory와의 차이는? -> 그 외 애플리케이션 개발에 필요한 수 많은 부가기능 제공
    * 메시지소스 활용 국제화 기능
    * 환경변수
        * 로컬, 개발, 스테이징, 운영 등 구분해 처리
    * 애플리케이션 이벤트
        * 이벤트 발행, 구독 모델 편리하게 지원
    * 리소스 조회 편의기능:
        * 파일, 클래스패스, 외부 등에서 리소스 편리하게 조회
    * (eg. ApplicationContext가 상속하는 인터페이스들: EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver)

### 정리
* BeanFactory를 직접 사용할 일은 거의 없으며, 부가기능이 포함된 ApplicationContext를 사용한다.
* BeanFactory나 ApplicationContext를 스프링 컨테이너라 한다.

<br>
<br>

---
# 다양한 설정 형식 지원 - 자바 코드, XML
* 스프링 컨테이너는 다양한 형식의 설정 정보를 받아들일 수 있도록 유연하게 설계돼 있다.
    * 자바 코드, XML, Groovy 등등

### 애노테이션 기반 자바 코드 설정
* AnnotationConfigApplicationContext 클래스 사용, 자바 코드로 된 설정 정보를 넘긴다.
* eg. new AnnotationConfigApplicationContext(AppConfig.class)

### XML 설정 사용
* 최근엔 스프링부트를 많이 적용하게 되면서, 잘 사용하지 않는다.
* 컴파일 없이 빈 설정 정보를 변경할 수 있는 장점이 있다(설정 파일만 교체).
* GenericXmlApplicationContext 클래스 사용, xml 설정 파일을 넘긴다.

    ```java
    ApplicationContext ac = new GenericXmlApplicationContext("appConfig.xml");
    ```

<br>
<br>

---
# 스프링 빈 설정 메타 정보 - BeanDefinition

* 다양한 설정 형식 지원 중심에 BeanDefinition이라는 추상화가 있다(역할, 구현 개념적 분리).
* BeanDefinitionReader라는 구현체가 각 설정 파일을 읽으며 @Bean, <bean> 당 각각 하나씩 메타 정보 생성
* `BeanDefinition`을 `빈 설정 메타정보`라고 한다.
* 스프링 컨테이너는 이 메타 정보를 기반으로 스프링 빈을 생성한다.
* BeanDefinition 관련 메서드 중 일부는 ApplicationContext 인터페이스가 아닌 다른 인터페이스가 구현하므로, 참조 변수 타입이 ApplicationContext일 시 일부 BeanDefinition 관련 메서드를 사용할 수 없다. 참조 변수 타입이 AnnotationConfigApplicationContext, GenericXmlApplicationContext 등과 같이 구현 객체 타입일 시, 구현 객체는 모든 인터페이스를 상속하므로 BeanDefinition 관련 모든 메서드 또한 사용 가능하다.
    ```java
    // 참조 변수 타입: ApplicationContext(인터페이스)
    ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);

    // getBeanDefinitionNames() 사용 가능
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();

    // getBeanDefinition() 사용 불가
    BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionNames[0]); 
    ```
    
    ```java
    // 참조 변수 타입: AnnotationConfigApplicationContext(구현 객체)
    AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);

    // getBeanDefinitionNames() 사용 가능
    String[] beanDefinitionNames = ac.getBeanDefinitionNames(); 
     // getBeanDefinition() 사용 불가
    BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionNames[0]);
    ```

```java
@Test
@DisplayName("빈 설정 메타정보 확인")
void findApplicationBeanDefinition() {
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();
    for (String beanDefinitionName : beanDefinitionNames) {
        BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionName);

        if (beanDefinition.getRole() == BeanDefinition.ROLE_APPLICATION) {
            System.out.println("beanDefinitionName = " + beanDefinitionName
                + ", beanDefinition = " + beanDefinition);
        }
    }
}
//// 출력 결과 예:
// beanDefinitionName = redisConfig, beanDefinition = Generic bean: class [clone.twitter.config.RedisConfig$$SpringCGLIB$$0]; scope=singleton; abstract=false; lazyInit=null; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodNames=null; destroyMethodNames=null
// beanDefinitionName = redisSessionConnectionFactory, beanDefinition = Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=redisConfig; factoryMethodName=redisSessionConnectionFactory; initMethodNames=null; destroyMethodNames=[(inferred)]; defined in clone.twitter.config.RedisConfig
// beanDefinitionName = redisFanOutConnectionFactory, beanDefinition = Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=redisConfig; factoryMethodName=redisFanOutConnectionFactory; initMethodNames=null; destroyMethodNames=[(inferred)]; defined in clone.twitter.config.RedisConfig
// beanDefinitionName = objectFanOutRedisTemplate, beanDefinition = Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=redisConfig; factoryMethodName=objectFanOutRedisTemplate; initMethodNames=null; destroyMethodNames=[(inferred)]; defined in clone.twitter.config.RedisConfig
// beanDefinitionName = stringFanOutRedisTemplate, beanDefinition = Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=redisConfig; factoryMethodName=stringFanOutRedisTemplate; initMethodNames=null; destroyMethodNames=[(inferred)]; defined in clone.twitter.config.RedisConfig
```

### BeanDefinition 정보
* BeanClassName, factoryBeanName, factoryMethodName, Scope, lazyInt, InitMethodName, DestoryMethodName, Constructor arguments, Properties...

### 정리
* 가끔 스프링 코드나 스프링 관련 오픈 소스를 볼 때, BeanDefinition이 보이면 이런 메커니즘을 떠올리면 된다.
* BeanDefinition을 직접 생성해 스프링 컨테이너에 등록할 수도 있으나, 실무에서 그럴 경우는 거의 없다.
* 추가 정보
    * 스프링 빈 등록시 크게 애노테이션 기반 자바 코드 설정, XML 기반 설정은 크게 2가지 방법:
        1. 직접 스프링 빈을 등록하는 방법 - XML 기반 방식
            ```
            Generic bean: class [org.springframework.data.redis.core.StringRedisTemplate]; ... factoryBeanName=null; factoryMethodName=null;
            ```
        2. 팩토리 메서드를 쓰는 방법(약간 우회하는 방법이라 볼 수 있다) - 애노테이션 기반 자바 코드
            ```
            Root bean: class [null]; ... factoryBeanName=redisConfig; factoryMethodName=stringFanOutRedisTemplate;
            ```
    
        이 있다고 볼 수 있는데, BeanDefinition 조회시 위와 같이 결과 정보가 약간 다른 이유는 위의 방법 차이에 기인한다.
