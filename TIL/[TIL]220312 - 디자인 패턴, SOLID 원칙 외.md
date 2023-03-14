## 디자인 패턴

* 소프트웨어 설계 시 특정 상황에서 자주 반복되는 문제를 해결하기 위한 재사용 가능한 솔루션
* 주로 객체지향 설계 및 원칙을 활용해 문제 해결
* 대부분 클래스 상속, 오브젝트(객체) 합성의 두 가지 구조로 확장성 추구
* 패턴별 기억해야 할 포인트:
  * 적용할 상황
  * 해결해야할 문제
  * 솔루션의 구조 및 각 요소의 역할, 핵심 의도 등
<br></br>
## 객체지향 설계 원칙(SOLID)
### 단일 책임 원칙(SRP, single responsibility principle)
* '한 클래스는 하나의 책임만 가진다(a class should have one, and only one, reason to change)'

### 개방 폐쇄 원칙(OCP, open closed principle)
* '소프트웨어 요소는 확장에는 열려있고 변경에는 닫혀 있어야 한다(one should be able to extend a classes behavior, without modifying it)'
### 의존관계 역전 원칙(DIP, dependency inversion principle)
* '구체화가 아닌 추상화에 의존한다(depend on abstractions, not on concretions)'

*그 외 리스코프 치환 원칙(LSP, Liskov substitution principle), 인터페이스 분리 원칙(ISP, interface segregation principle)가 있다*
<br></br>

## 템플릿 메소드 패턴
* 상속 통해 기능 확장
* 변하지 않는 기능은 슈퍼클래스에, 자주 변경되고 확장할 기능은 서브클래스에 작성
* 서브클래스에서 선택적으로 메소드 오버라이드/추상 메소드 구현
<br></br>
## 팩토리 메소드 패턴
* 팩토리 메소드
  * 서브클래스에서 오브젝트 생성 방법과 클래스를 결정할 수 있도록 슈퍼클래스에서 미리 메소드를 정의
  * 주로 인터페이스 타입으로 리턴
* 팩토리 메소드 패턴
  * 팩토리 메소드 방식으로 오브젝트(객체) 생성 방법을 나머지 로직(슈퍼클래스의 기본 코드)에서 독립시키는 방법

<br></br>
<br></br>
## reference
* Robert Martin. *Principles of Ood*. http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod
* 이일민. *토비의 스프링*. 에이콘. 2012.