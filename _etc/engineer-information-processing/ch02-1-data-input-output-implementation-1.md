# 2-1장. 데이터 입출력 구현1

# GROUP-A

# 063 스키마schema

**데이터베이스의 구조와 제약조건에 관한 전반적인 명세 기술**

종류|내용
--|--
외부 스키마|사용자나 응용 프로그래머가 각 개인의 입장에서 필요로하는 데이터베이스의 논리적 구조를 정의한 것
개념 스키마|데이터베이스의 전체적인 논리적 구조. 모든 응용프로그램이나 사용자들이 필요로 하는 데이터를 종합한 조직 전체의 데이터베이스로, 하나만 존재함
내부 스키마|물리적 저장장치의 입장에서 본 데이터베이스 구조. 실제로 저장될 레코드의 형식, 저장 데이터 항목의 표현 방법, 내부 레코드의 물리적 순서 등을 나타냄



<br/><br/>

---

#  064 데이터베이스 설계 순서

1. 요구 조건 분석 - 요구 조건 명세서 작성
2. 개념적 설계 - 개념 스키마, 트랜잭션 모델링, E-R 모델
3. 논리적 설계 - 목표 DBMS에 맞는 논리 스키마 설계, 트랜잭션 인터페이스 설계
4. 물리적 설계 - 목표 DBMS에 맞는 물리적 구조의 데이터로 변환
5. 구현 - 목표 DBMS의 DDL(데이터 정의어)로 데이터 베이스 생성, 트랜잭션 작성



<br/><br/>

---

# 065 개념적 설계
- 개념적 설계(정보 모델링, 개념화): 정보의 구조를 얻기 위하여 현실 세계의 무한성과 계속성을 이해하고, 다른 사람과 통신하기 위하여 **현실 세계에 대한 인식을 추상적 개념으로 표현하는 과정**
- 개념적 설계에서는 개념 스키마 모델링과 트랜잭션 모델링을 병행 수행한다.
- 개념적 설계에서는 요구 분석에서 나온 결과인 요구 조건 명세를 DBMS에 독립적인 E-R 다이어그램으로 작성한다.



<br/><br/>

---

# 066 논리적 설계
- 논리적 설계(데이터 모델링): **현실 세계에서 발생하는 자료를** 컴퓨터가 이해하고 처리할 수 있는 물리적 저장 장치에 저장할 수 있도록 변환하기 위해 **특정 DBMS가 지원하는 논리적 자료 구조로 변환(mapping)시키는 과정**
- 개념 세계의 데이터를 필드로 기술된 데이터 타입과 이 데이터 타입들 간의 관계로 표현되는 논리적 구조의 데이터로 모델화
- 개념적 설계가 개념 스키마를 설계하는 단계라면, 논리적 설계에서는 개념 스키마를 평가 및 정제하고 DBMS에 따라 서로 다른 논리적 스키마를 설계하는 단계이다.



<br/><br/>

---

# 067 물리적 설계
- 물리적 설계(데이터 구조화): **논리적 설계에서 논리적 구조로 표현된 데이터**를 디스크 등의 물리적 저장장치에 저장할 수 있는 **물리적 구조의 데이터로 변환하는 과정**
- 물리적 설계에서는 다양한 데이터베이스 응용에 대해 처리 성능을 얻기 위해 데이터베이스 파일의 저장 구조 및 액세스 경로를 결정한다.
- 저장 레코드의 형식, 순서, 접근 경로, 조회 집중 레코드 등의 정보를 사용하여 데이터가 컴퓨터에 저장되는 방법을 묘사한다.



<br/><br/>

---

# 068 데이터 모델

- **현실 세계의 정보들을** 컴퓨터에 표현하기 위해서 단순화, 추상화하여 **체계적으로 표현한 개념적 모형**
- 데이터 모델에 표시할 요소

요소|내용
--|--
구조structure|논리적으로 표현된 개체 타입들 간의 관계로서 데이터 구조 및 정적 성질 표현
연산operation|데이터베이스에 저장된 실제 데이터를 처리하는 작업에 대한 명세로서 데이터베이스를 조작하는 기본 도구
제약 조건constraint|데이터베이스에 저장될 수 있는 실제 데이터의 논리적인 제약 조건



<br/><br/>

---

# 관계형 데이터베이스의 릴레이션 구조
릴리에션relation은 데이터들을 표table의 형태로 표현한 것으로, 구조를 나타내는 릴레이션 스키마와 실제 값들인 릴레이션 인스턴스로 구성된다.
- 릴레이션 인스턴스: 데이터 개체를 구성하고 있는 속성들에 데이터 타입이 정의되어 구체적인 데이터 값을 가진 것을 의미한다.



<br/><br/>

---

# 튜플tuple
- 튜플: **릴레이션을 구성하는 각각의 행**
- 튜플은 속성의 모임으로 구성
- 파일 구조에서 레코드와 같은 의미
- 튜플의 수를 카디널리티cardinality 또는 기수, 대응 수라고 한다.



<br/><br/>

---

# 속성attribute
- 속성: **데이터베이스를 구성하는 가장 작은 논리적 단위**
- 파일 구조상의 데이터 항목 또는 데이터 필드에 해당 된다.
- 속성은 개체의 특성을 기술한다.
- 속성의 수를 디그리degree 또는 차수라고 한다.



<br/><br/>

---

# 후보키candidate key
- 릴레이션을 구성하는 **속성들 중에서 튜플을 유일하게 식별하기 위해 사용되는 속성들의 부분집합**
- 기본키로 사용할 수 있는 속성들을 말한다.
- 후보키는 유일성unique과 최소성minimality을 모두 만족시켜야 한다.

구분|내용
---|---
유일성unique|하나의 키 값으로 하나의 튜플만을 유일하게 식별할 수 있어야 함
최소성minimality|키를 구성하는 속성 하나를 제거하면 유일하게 식별할 수 없도록 꼭 필요한 최소의 속성으로 구성되어야 함



<br/><br/>

---

# 슈퍼키super key
- 한 릴레이션 내에 있는 **속성들의 집합으로 구성된 키**
- 릴레이션을 구성하는 모든 튜플 중 슈퍼키로 구성된 속성의 집합과 동일한 값은 나타나지 않는다.
- 슈퍼키는 릴레이션을 구성하는 모든 튜플에 대해 유일성은 만족하지만, 최소성은 만족하지 못한다.



<br/><br/>

---

# 순수 관계 연산자

### select
- 릴레이션에 존재하는 튜플 중에서 선택 조건을 만족하는 튜플의 부분집합을 구하여 새로운 릴레이션을 만드는 연산이다.
- 릴레이션의 행에 해당하는 튜플을 구하는 것이므로 수평 연산이라고도 한다
- 기호: σ(시그마)

### project
- 주어진 릴레이션에서 속성 리스트attribute list에 제시된 속성 값만을 추출하여 새로운 릴레이션을 만드는 연산
- 릴레이션의 열에 해당하는 속성을 추출하는 것이므로 수직 연산자라고도 한다.
- 기호: ㅠ(파이)

### join
- 공통 속성을 중심으로 두 개의 릴레이션을 하나로 합쳐서 새로운 릴레이션을 만드는 연산
- join의 결과는 cartesian product(교차곱)를 수행한 다음 select를 수행한 것과 같다.
- 기호: ▷◁


### division
- X ⊃ Y인 두 개의 릴레이션 R(X)와 S(Y)가 있을 때, R의 속성이 S의 속성값을 모두 가진 튜플에서 S가 가진 속성을 제외한 속성만을 구하는 연산
- 기호: ÷





<br/><br/>

---

# 일반 집합 연산자

### 합집합union
- `...skipped for later`
- 기호: ∪

### 교집합intersection
- `...skipped for later`
- 기호: ∩

### 차집합difference
- `...skipped for later`
- 기호: -

### 교차곱cartesian product
- `...skipped for later`
- 기호: ×




<br/><br/>

---

# 관계해석relational calculus
- **관계 데이터의 연산을 표현하는 방법**
- 관계 데이터 모델의 제안자인 코드(E. F. Codd)가 수학의 predicate calculus(술어 해석)에 기반을 두고 관계 데이터베이스를 위해 제안
- 관계해석은 원하는 정보가 무엇이라는 것만 정의하는 비절차적 특성을 지닌다.
- 원하는 정보를 정의할 때는 계산 수식을 사용한다.




<br/><br/>

---

# 이상anomaly
- 데이터베이스 내에 **데이터들이 불필요하게 중복되어 릴레이션 조작 시 예기치 않게 발생하는 곤란한 현상**
- 삽입 이상insertion anomaly: `...skipped for later`
- 삭제 이상deletion anomaly: `...skipped for later`
- 갱신 이상update anomaly: `...skipped for later`




<br/><br/>

---

# 함수적 종속functional dependency

`...skipped for later`

### 완전 함수적 종속full functional dependency
`...skipped for later`

### 부분 함수적 종속partial functional dependency
`...skipped for later`

### 이행적 함수적 종속transitive functional dependency
`...skipped for later`



<br/><br/>

---

# 정규화 과정

`...skipped for later`




<br/><br/>

---

# 반정규화denormalization
- 시스템의 성능을 향상하고 개발 및 운영의 편의성 등을 높이기 위해 **정규화된 데이터 모델을 의도적으로 통합, 중복, 분리하여 정규화 원칙을 위배하는 행위**
- 반정규화를 수행하면 시스템의 성능이 향상되고 관리 효율성은 증가하지만 데이터의 일관성 및 정합성이 저하될 수 있다.
- 과도한 반정규화는 오히려 성능을 저하시킬 수 있다.




<br/><br/>

---

# 트랜잭션의 특성

특성|의미
--|--
atomicity원자성|트랜잭션의 연산은 데이터베이스에 모두 반영되도록 완료commit되든지 아니면 전혀 반영되지 않도록 복구rollback되어야 함
consistency일관성|트랜잭션이 그 실행을 성공적으로 완료하면 언제나 일관성 있는 데이터베이스 상태로 변환함
isolation독립성, 격리성, 순차성|둘 이상의 트랜잭션이 동시에 병행 실행되는 경우 어느 하나의 트랜잭션 실행중에 다른 트랜잭션의 연산이 끼어들 수 없음
durability영속성, 지속성|성공적으로 완료된 트랜잭션의 결과는 시스템이 고장나더라도 영구적으로 반영되어야 함








<br/><br/>

---

## 













<br/><br/><br/><br/><br/>

---

# GROUP-B

## 999 소제목









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 








<br/><br/>

---

## 








<br/><br/><br/><br/><br/>

---

# GROUP-C

## 999 소제목









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---

## 









<br/><br/>

---
## 









<br/><br/>

---

## 








<br/><br/>

---

## 








<br/><br/>