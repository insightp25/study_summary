# 자바의 신 1

# 15장 String

### p.405

- String.format()의 format을 사용하는 방법은 java.util.Formatter 클래스의 API 문서에 자세히 설명되어 있다.

- 아래와 같은 코드는 `System.out.format()`이라는 메소드 하나로 대체 가능하다.

```java
String text = "제 이름은 %s입니다. 지금까지 %d 권을 썼고, " + "하루에 %f %%의 시간을 책을 쓰는 데 할애하고 있습니다.";
String realText = String.format(text, "손오공", 7, 10.5);
System.out.println(realText);
```



<br>

### p.406

- null인 객체에 toString() 메소드 사용시 NullPointerException이 발생하게 되므로, 객체를 출력할 때 valueOf() 메소드를 사용하는게 좋다.
  - valueOf() 메소드는 객체가 null이면 "null"이라는 문자열을, null이 아니면 toString() 메소드를 호출한 결과를 반환한다.
  - (System.out.println() 혹은 System.out.print()에서 null인 객체 출력시 NPE가 발생하지 않는 이유도 이 때문)

### p.413 - 퀴즈 정답

1. 자바의 String클래스는 final로 선언되어 있으며, 더 이상 확장해서는 안된다. 
2. String 클래스는 Serializable, Comparable, CharSequence 인터페이스를 구현(implements) 했다.
3. new String() 생성자는 가장 의미가 없는 String 클래스의 생성자이다. 왜냐하면, 생성된 객체는 해당 변수에 새로운 값이 할당되자마자 GC의 대상이 되어버리기 때문이다. 
4. String클래스의 getBytes() 메소드는 문자열을 바이트의 배열로 전환한다.
5. String 객체의 메소드를 호출하기 전에 반드시 null인지 체크를 하는 습관을 가져야 한다. 그렇지 않으면, 실행시에 생각지도 못한 예외가 발생할 수 있다.
6. length() 메소드를 사용하면 문자열의 길이를 알아낼 수 있다.
7. equals()메소드와 compareTo()메소드의 공통점은 두 개의 문자열을 비교한다는 것이고, 다른 점은 리턴 타입이 다르다는 것이다.
equals() 메소드는 boolean 타입의 리턴을, compareTo() 메소드는 int 타입의 리턴값을 제공한다.
8. startsWith()메소드를 사용하면 해당 문자열이 원하는 문자열로 시작하는지를 확인할 수 있다. 
9. contains()나 matches()메소드를 사용하여 원하는 문자열이 존재하는지 확인할 수 있다. 고전적인 방법으로는 indexOf() 메소드를 사용할 수도 있다.
10. contains()나 matches() 메소드의 리턴타입은 boolean 이다.
11. substring()이나 subSequence()메소드를 사용하면 원하는 위치에 있는 문자열을 자를 수 있다. 
12. replace()나 replaceAll() 메소드를 사용하면 문자열의 특정 부분을 바꿀 수 있다. 여기서 중요한 것은 원본 문자열은 변경되지 않는다는 것이다. 변경된 값을 사용하려면 해당 메소드의 리턴값을 사용해야만 한다.
13. String의 단점을 보완하기 위한 클래스로 StringBuilder와 StringBuffer가 있다. 
14. StringBuilder와 StringBuffer클래스의 append() 메소드를 사용하여 문자열을 더할 수 있다.


