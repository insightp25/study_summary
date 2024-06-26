# [예외]ITEM 72- 표준 예외를 사용하라

숙련된 프로그래머는 많은 코드를 재사용한다. 예외도 마찬가지이며, 자바 라이브러리는 대부분 API에서 쓰기에 충분한 수의 예외를 제공한다.

## 표준 예외를 재사용하면 얻는 것들

표준 예외 재사용시 이점은 다음과 같다.

1. API를 다른 사람이 익히고 사용하기 쉬워진다 - 많은 프로그래머에게 이미 익숙해진 규약을 그대로 따르기 때문
2. 우리의 API를 사용한 프로그램도 낯선 예외를 사용하지 않게 되어 읽기 쉽게 된다.
3. 예외 클래스 수가 적을수록 메모리 사용량도 줄고 클래스를 적재하는 시간도 적게 걸린다.

### 가장 많이 재사용되는 예외들

|예외|주요 쓰임|
|---|---|
|IllegalArgumentException|허용하지 않는 값이 인수로 건네졌을 때(null은 NullPointerException으로 처리)|
|IllegalStateException|객체가 메서드를 수행하기에 적절하지 않은 상태일 때|
|NullPointerException|null을 허용하지 않는 메서드에 null을 건넸을 때|
|IndexOutOfBoundsException|인덱스가 범위를 넘어섰을 때|
|ConcorrentModificationException|허용하지 않는 동시 수정이 발견됐을 때|
|UnsupportedOperationException|호출한 메서드를 지원하지 않을 때|


더 많은 정보를 제공하길 원한다면 표준 예외를 확장해도 좋다.  단, 예외는 직렬화할 수 있다는 사실을 기억해야 한다. (직렬화에는 많은 부담이 따르니)이 사실만으로도 나만의 예외를 새로 만들지 않아야 할 근거로 충분하다.


## 선택이 어려울 때엔

위 표의 '주요 쓰임'이 상호 배타적이지 않은 탓에, 종종 선택이 어려울 때도 있다.

- eg. 카드 덱을 표현하는 객체가 있고, 인수로 건넨 수만큼의 카드를 뽑아 나눠주는 메서드 - 덱에 남아있는 카드 수보다 큰 값을 건네면?
  - 인수 값이 너무 크면 `IllegalArgumentException`을,
  - 덱에 남은 카드 수가 너무 적다고 본다면 `IllegalStateException`을 선택할 수도 있다.
  
이런 상황에서의 일반적인 규칙은 다음과 같다.
- 인수값이 무엇이었든 어차피 실패했을 거라면 `IllegalStateException`을,
- 그렇지 않으면 `IllegalArgumentException`을 사용한다.


