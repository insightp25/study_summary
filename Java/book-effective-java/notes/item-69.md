# [예외]ITEM 69 - 예외는 진짜 예외 상황에만 사용하라

## 요약

> 예외는 예외 상황에서 쓸 의도로 설계되었다. 정상적인 제어 흐름에서 사용해서는 안되며, 이를 프로그래머에게 강요하는 API를 만들어서도 안 된다.

<br>

## 예외 사용의 나쁜 예 - 잘못된 최적화

* 잘못된 추론 - "JVM은 배열에 접근할 때마다 경계를 넘지 않는지 검사하는데, 일반적인 반복문도 배열 경계에 도달하면 종료한다. 따라서 이 검사를 반복문에도 명시하면 같은 일이 중복되므로 하나를 생략하면 더 빠른 성능을 낼 수 있다."

추론이 사실일지 추론 내용을 기반으로 테스트를 해보았다.

### 테스트 1, 2
```java
// 테스트 전역 변수 설정
final static int SIZE = 100; // 배열 사이즈 설정
final int REPEAT_COUNT = 1_000_000;  // 반복문 * 1000000회 반복
```

```java
// 테스트1 - 예외 활용
// 결과 - Execution time: 180 milliseconds
boolean[] array = new boolean[SIZE];

long startTime = System.currentTimeMillis();
try {
    for (int j = 0; j < REPEAT_COUNT; j++) {
        int i = 0;
        while (true)
            array[i++] = true;
    }
} catch (ArrayIndexOutOfBoundsException e) {
}

long endTime = System.currentTimeMillis();
System.out.println("Execution time: " + (endTime - startTime) + " milliseconds");
```

```java
// 테스트2 - 표준 반복문
// 결과 - Execution time: 19 milliseconds
boolean[] array = new boolean[SIZE];

long startTime = System.currentTimeMillis();
for (int j = 0; j < REPEAT_COUNT; j++) {
    for (int i = 0; i < SIZE; i++) {
        array[i] = true;
    }
}

long endTime = System.currentTimeMillis();
System.out.println("Execution time: " + (endTime - startTime) + " milliseconds");
```

- 표준 반복문을 사용한 경우(테스트2)가 예외를 활용한 경우(테스트1)보다 약 10배 빨랐다.

### 추론이 잘못된 이유

1. 예외는 예외 상황에 쓸 용도로 설계되었으므로 JVM 구현자 입장에서는 명확한 검사만큼 빠르게 만들어야 할 동기가 약하다(최적화에 별로 신경쓰지 않았을 가능성이 크다)
2. 코드를 try-catch 블록 안에 넣으면 JVM이 적용할 수 있는 최적화가 제한된다.
3. 배열을 순회하는 표준 관용구는 중복검사를 수행하지 않으며, JVM이 알아서 최적화해 없애준다.

### 그 외 잘 못된 최적화의 부작용

- 반복문의 안에 버그가 숨어 있다면 흐름 제어에 쓰인 예외가 이 버그를 숨겨 디버깅을 훨씬 어렵게 할 수 있다.
  - eg. 반복문 본문에서 호출한 메서드가 내부에서 관련 없는 배열을 사용하다가 `ArrayIndexOutOfBoundsException`을 일으킨다면, 엉뚱한 예외를 정상적인 반복문 종료 상황으로 오해하고 넘어가게 된다.




<br>

## 교훈
- 표준적이고 쉽게 이해되는 관용구를 사용하고, 성능 개선을 목적으로 과하게 머리를 쓴 기법은 자제해야 한다.
  - 실제로 성능이 좋아지더라도 자바 플랫폼이 꾸준히 개선되고 있으니 최적화로 얻은 상대적인 성능 우위가 오래가지 않을 수 있다.
  - 과하게 영리한 기법에 숨겨진 미묘한 버그의 폐해와 어려워진 유지보수 문제는 계속 이어진다.
- 예외는 오직 예외 상황에서만 써야 한다. 절대로 일상적인 제어 흐름용으로 쓰여선 안 된다.

이 원칙은 API 설계에서도 적용된다.
- 잘 설계된 API라면 클라이언트가 정상적인 제어 흐름에서 예외를 사용할 일이 없게 해야 한다.


<br>

## 상태 의존적 메서드와 상태 검사 메서드
특정 상태에서만 호출할 수 있는 '상태 의존적' 메서드를 제공하는 클래스는 '상태 검사' 메서드도 함께 제공해야 한다(불필요한 예외를 발생시키지 않기 위해서).
- eg. `Iterator`
  - `next()` - 상태 의존적 메서드
  - `hasNext()` - 상태 검사 메서드

상태 검사 메서드 없이 예외를 사용하는 사례와 표준 구현을 비교하는 테스트를 해보았다.

### 테스트 3, 4
```java
// 테스트 전역 변수 설정
final static int SIZE = 100; // 배열 사이즈 설정
final int REPEAT_COUNT = 1_000_000;  // 반복문 * 1000000회 반복
```
```java
// 테스트3 - 예외 사용
// 결과 - Execution time: 9114 milliseconds
Collection<Boolean> collection = new ArrayList<>();
for (int i = 0; i < SIZE; i++) {
    collection.add(false);
}

long startTime = System.currentTimeMillis();
for (int j = 0; j < REPEAT_COUNT; j++) {
	try {
		Iterator<Boolean> i = collection.iterator();
		while (true) {
        	Boolean bool = i.next();
        }
    } catch (NoSuchElementException e) {
    }
}

long endTime = System.currentTimeMillis();
System.out.println("Execution time: " + (endTime - startTime) + " milliseconds");
```
```java
// 테스트 4 - 표준 반복문
// 결과 - Execution time: 319 milliseconds
Collection<Boolean> collection = new ArrayList<>();
for (int i = 0; i < SIZE; i++) {
    collection.add(false);
}

long startTime = System.currentTimeMillis();
for (int j = 0; j < REPEAT_COUNT; j++) {
    for (Iterator<Boolean> i = collection.iterator(); i.hasNext(); ) {
        boolean bool = i.next();
    }
}

long endTime = System.currentTimeMillis();
System.out.println("Execution time: " + (endTime - startTime) + " milliseconds");
```
- 상태 검사를 포함하는 표준 구현(테스트4)가 상태 검사 메서드 없이 예외를 사용한 경우(테스트3)보다 약 30배 빨랐다.

이처럼 반복문에 예외를 사용하면 장황하고 헷갈리며 속도도 느리고, 엉뚱한 곳에서 발생한 버그를 숨기기도 한다.

### 상태 검사 메서드 대신 사용할 수 있는 선택지

올바르지 않은 상태일 때 빈 `Optional` 혹은 `null` 같은 특수한 값을 반환하는 방법이다.

1. 외부 동기화없이 여러 스레드가 동시에 접근할 수 있거나 외부 요인으로 상태가 변할 수 있다면 `Optional`이나 특정 값을 사용한다. 상태 검사 메서드와 상태 의존적 메서드 호출 사이에 객체의 상태가 변할 수 있기 때문이다.

2. 성능이 중요한 상황에서 상태 검사 메서드가 상태 의존적 메서드의 작업 일부를 중복 수행한다면 옵셔널이나 특정 값을 선택한다.

3. 다른 모든 경우엔 상태 검사 메서드 방식이 조금 더 낫다고 할 수 있다. 가독성이 살짝 더 좋고, 잘못 사용했을 때 발견하기가 쉽다.