## OOP 확장을 지원한 Java 키워드
- Java가 객체 지향을 확장한 것과 관련하여서 다음과 같은 키워드들을 꼽을 수 있다:
  - abstract, enum, final, implements, instanceof, interface, super, this
</br>

### abstract 키워드
- 추상 메서드: 구현부가 없이 선언부만 있는 메서드
- 추상 메서드를 가진 클래스는 반드시 추상 클래스로 선언해야 한다(없어도 선언은 할 수 있다).
- 추상 클래스는 객체를 만들 수 없다.
- 추상 메서드는 하위 클래스에게 메서드 구현을 강제한다.
</br>

### 생성자
- 정확한 표현은 '객체 생성자 메서드'
- 기본 생성자 메서드: 아무 생성자도 만들지 않으면 컴파일 과정에서 자바 컴파일러가 만들어준다.
- 인자가 있는 생성자를 하나라도 만들면 자바는 기본 생성자를 만들어주지 않는다.
</br>

### static 블록 - 클래스 생성 시의 실행 블록
- 클래스가 static 메모리 영역에 배치될 때 실행되는 코드 블록
```java
public class 사람 {
    static {
        System.out.println("사람 클래스 준비 완료");
    }
} 
```
- (당연히)static 블록에서 사용할 수 있는 속성과 메서드는 당연히 static 멤버 뿐이다.
  - 객체 멤버는 클래스가 static 메모리 영역에 자리 잡은 후에 객체 생성자를 통해 힙에 생성된다.
    - 클래스의 static 블록이 실행되고 있을 때는 해당 클래스의 객체는 하나도 존재하지 않기 때문에 static 블록에서는 객체 멤버에 접근할 수 없는 것.
  - 클래스는 특정 패키지 또는 클래스가 처음으로 '사용'될 때 T 메모리의 static 영역에 로딩된다.
  - static 블록은 클래스가 최초 로딩될 때 단 한 번만 실행
- 클래스가 제일 처음 사용될 때:
  1. 클래스의 정적 속성을 사용할 때
  2. 클래스의 정적 메서드를 사용할 때
  3. 클래스의 인스턴스를 만들 때
- 메모리는 최대한 늦게 사용 시작, 최대한 빨리 반환하는 것이 정석
- 자바는 static 영역에 한 번 올라가면 프로그램 종료시까지는 해당 메모리 반환이 불가. 최대한 늦게 로딩함으로써 메모리 사용을 최대한 늦추기 위함.
- 관련 추가 주제: JUnit의 @Before 클래스 어노테이션
- static 블록과 유사하게 인스턴스를 위한 인스턴스 블록도 존재. 아무런 표시 없이 {} 블록을 사용하면 인스턴스 생성시마다 실행.
</br>

### final 키워드
- final 키워드가 나타날 수 있는 곳은 딱 세 군데
- 사실 객체 지향 언어의 구성 요소는 딱 세 가지 뿐이다: 클래스, 변수, 메서드

#### final과 클래스
- 클래스에 final이 붙으면 상속을 허락하지 않겠다는 의미이다
```java
public final class 고양이 {}
```
```java
public final class 길막이 extends 고양이 {} // 에러 발생
```
- 선언 시에, 또는 최초 한 번만 초기화 가능
#### final과 변수
- 마찬가지로 선언 시에, 또는 최초 한 번만 초기화가 가능하다.

#### final과 메서드
- 메서드가 final이면 오버라이딩을 금지하게 된다.
```java
public final class 고양이 {
    final void 울다() {
        System.out.println("야옹");
    }
}
```
```java
public final class 삼색이 extends 고양이 {
    // 에러 발생: Cannot override the final method from 고양이
    void 울다() {
        System.out.println("먀옹");
    }
}
```
</br>

### instanceof 연산자
- 만들어진 객체가 특정 클래스의 인스턴스인지 확인
- 객체 참조변수의 타입이 아닌 <u>**실제 객체의 타입**</u>에 의해 처리한다
```java
class 동물 {}

class 조류 extends 동물 {}

// 객체 참조변수 타입: 동물
// 실제 객체의 타입: 조류
동물 펭귄 = new 조류();

System.out.println("펭귄 instanceof 동물"); // true
System.out.println("펭귄 instanceof 조류"); // true
```
- LSP(리스코프 치환 원칙)을 어기는 코드에서 주로 나타나는 연산자이다.
  - 코드에 instanceof 연산자가 보인다면 냄새 나는 코드가 아닌지, 리팩토링의 대상이 아닌지 점검해봐야 한다
- 클래스들의 상속 관계뿐만 아니라 인터페이스의 구현 관계에서도 동일하게 적용
</br>

### package 키워드
- namespace(이름공간)을 만들어주는 역할을 한다.
- 같은 이름의 클래스가 있을 시 서로 이름 충돌을 피할 수 있도록 해준다.
  - eg. 고객사업부.Customer VS 마케팅사업부.Customer
</br>

### interface 키워드와 implements 키워드
#### interface 키워드
- public 추상 메서드와 public 정적 상수만 가질 수 있다.
- 메서드에 public과 abstract, 속성에 public과 static, final을 작성하지 않아도 자바가 자동으로 붙여준다.
```java
// (public, static, final, abstract 키워드 생략)
interface Speakable {
    double PI = 3.14159;
    final double absoluteZeroPoint = -275.15;
   
    void sayYes();
}
```
```java
// 위의 코드와 동일한 코드이다(생략된 public, static, final, abstract 키워드 표시).
interface Speakable {
    public static final double PI = 3.14159;
    public static final final double absoluteZeroPoint = -275.15;
   
    public abstract void sayYes();
}
```
</br>

#### (번외)람다와 interface
- 2014년 출시한 자바8에서는 빅데이터와 병렬성 지원을 위해 컬렉션을 강화할 수 밖에 없었고, 이를 위해 람다 기능을 언어적으로 추가하였다.
- 람다란 함수를 의미하고, 변수에 할당할 수 있다 -> 함수는 로직이다 -> 람다는 변수에 저장할 수 있는 로직이다(변수는 값을 저장할 수 있고, 메서드의 인자로 쓰일 수 있고, 메서드의 반환값으로 사용할 수 있다).
- 자바에서 람다는 인터페이스를 기초로 하며, 이로 인해 인터페이스에도 큰 변화가 생겼다(정적 상수, 객체 추상 메서드만 지원 -> 객체 구상 메서드와 정적 추상 메서드도 지원)
</br>

### this 키워드
- 객체가 자기 자신을 지칭할 때 쓰는 키워드
- 지역 변수와 속성(객체 변수, 정적 변수)의 이름이 같은 경우 지역 변수가 우선한다.
- 객체 변수와 이름이 같은 지역 변수가 있는 경우 객체 변수를 사용하려면 this를 접두사로 사용
- 정적 변수와 이름이 같은 지역 변수가 있는 경우 정적 변수를 사용하려면 클래스명을 접두사로 사용
</br>

### super 키워드
- 단일 상속만을 지원하는 자바에서 super는 바로 위 상위 클래스의 인스턴스를 지칭한다.


</br>

</br>

</br>

</br>


## reference
- 스프링 입문을 위한 자바 객체 지향의 원리와 이해. 김종민. 2015. 위키북스.