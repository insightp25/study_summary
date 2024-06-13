# [예외]ITEM 73 - 추상화 수준에 맞는 예외를 던져라


# 핵심 정리

> 1. 최선은 하위 계층에서 예외가 발생하지 않도록 예방하는 것이다. 그럴 수 없다면 하위 계층에서 예외를 스스로 처리하도록 하는 것이 좋다.  
2. 하위 계층의 예외를 상위 계층에 노출하기 곤란하다면 예외 번역을 사용한다. 예외 연쇄(exception chaining)를 이용하면 상위 계층에는 맥락에 어울리는 고수준 예외를 던지면서 근본 원인도 함께 알려주어 오류를 분석이 용이해진다.

<br>

# 추상화 수준에 맞는 예외를 사용해야 하는 이유

메서드가 저수준 예외를 처리하지 않고 바깥으로 전파해버리게 되면, 이후 일과 관련 없어보이는 예외가 튀어나와 프로그래머는 당황스러울 것이다. 이를 지양해야 하는 이유는 다음과 같다.

1. 하위 계층 내부 구현방식을 드러내어 윗 레벨 API를 오염시킨다.
2. 다음 배포에서 구현 방식을 바꾸면 다른 예외가 튀어나와 기존 클라이언트 프로그램을 깨지게 할 수 있다.
3. 프로그래머에게 혼란을 야기한다.


<br><br>

# 해결

## 예외 번역(exception translation)

- 예외 번역: 상위 계층에서는 저수준 예외를 잡아 자신의 추상화 수준에 맞는 예외로 바꿔 던지는 방법

### 코드 예시

```java
try {
  ... // 저수준 추상화 이용
} catch (LowerLevelException e) {
  // 추상화 수준에 맞게 번역
  throw new HigherLevelException(...);
}
```

<br>

## 예외 연쇄(exception chaining)

예외 번역시, 저수준 예외가 디버깅에 도움이 된다면 예외 연쇄를 사용하는 게 좋다.

- 예외 연쇄: 문제의 근본 원인(cause)인 저수준 예외를 고수준 예외에 실어 보내는 방식
  - 별도의 접근자 메서드(`Throwable`의 `getCause` 메서드)를 통해 필요시 언제든 저수준 예외를 꺼내볼 수 있다.
  - 대부분의 표준 예외는 예외 연쇄용 생성자를 갖추고 있다. 그렇지 않더라도 `Throwable`의 `initCause` 메서드를 사용해 '원인'을 직접 못박을 수 있다.
  - 예외 연쇄는 문제의 원인을 프로그램에서 접근할 수 있게 해주며, 원인과 고수준 예외의 스택 추적 정보를 잘 통합해준다.

### 코드 예시 - 예외 연쇄
```java
// 테스트 코드

// 상위 계층 인스턴스 생성
HigherLevelComponent higher = new HigherLevelComponent();

// 테스트1 - 하위_계층_예외가_발생하면_예외_연쇄로_상위_계층_에외를_던진다
@Test
void 하위_계층_예외가_발생하면_예외_연쇄로_상위_계층_에외를_던진다() {
    Assertions.assertThatThrownBy(() -> {
        // 상위 계층에서 하위 계층 메서드 호출
        higher.callLowerLevelComponent();

    // 하위 계층에서 예외가 발생했지만 상위 계층의 예외로 번역되었음을 검증
    }).isInstanceOf(HigherLevelException.class);
}

// 테스트2 - 예외_연쇄_처리한_하위_계층의_정보를_상위_계층_예외에서_읽어들일_수_있다
@Test
void 예외_연쇄_처리한_하위_계층의_정보를_상위_계층_예외에서_읽어들일_수_있다() {
    Assertions.assertThatThrownBy(() -> {
        // 상위 계층에서 하위 계층 메서드 호출
        higher.callLowerLevelComponent();

    // 상위 계층 예외로 번역된 예외의 원인(cause)이 하위 계층의 예외임을 검증
    }).hasCauseInstanceOf(LowerLevelException.class);
}
```
```java
// 상위 레벨 클래스 정의
public class HigherLevelComponent {

    // 하위 레벨 인스턴스 생성
    LowerLevelComponent lower = new LowerLevelComponent();

    // 하위 레벨 인스턴스의 메서드 호출
    void callLowerLevelComponent() {
        lower.doSomethingAndChainException();
    }
}
```
```java
// 하위 레벨 클래스 정의
public class LowerLevelComponent {

    // 예외를 발생시키는 문제 메서드
    void randomMethod() {
        throw new LowerLevelException();
    }

    // exception chaining 처리
    void doSomethingAndChainException() {
        try {
            // 예외를 발생시키는 문제 메서드 호출
            randomMethod();
        } catch (LowerLevelException e) {
            // 상위 레벨 예외로 exception chaining 처리
            throw new HigherLevelException(e.getMessage(), e);
        }
    }
}
```
```java
// 상위 레벨 예외 정의 - 예외 연쇄 처리
public class HigherLevelException extends RuntimeException {

    // 예외 연쇄 - 저수준 레벨의 cause를 고수준 예외에 전달
    HigherLevelException(String message, Throwable cause) {
        super(message, cause);
    }
}

```
```java
// 하위 레벨 예외 정의
public class LowerLevelException extends RuntimeException{
    LowerLevelException() {
        super("하위 계층에서 발생한 예외입니다");
    }
}
```




<br><br>

# 베스트 프랙티스는?

1. 가능하면 저수준 메서드가 반드시 성공하도록 하여 아래 계층에서는 예외가 발생하지 않도록 하는게 가장 좋은 방법이다.
    - eg. 상위 계층 메서드의 매개변수 값을 미리 검사한 후 아래 계층 메서드로 건넨다.
2. (1이 안될 시)예외 번역/연쇄 처리를 한다.
3. (2가 안될 시)상위 계층에서 그 예외를 조용히 처리하여 문제를 API 호출자에까지 전파하지 않도록 한다(아래 계층에서의 예외를 피할 수 없을 시).
  - 적절한 로깅 기능을 활용해 기록해두면 클라이언트 코드와 사용자에게 문제를 전파하지 않으면서도 프로그래머가 로그를 분석하고 조치를 취할 수 있게 된다.
4. (3이 안될 시)예외를 전파할 수 있다(피하는 게 좋다).


