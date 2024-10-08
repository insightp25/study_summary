# 7장. 애플리케이션 테스트 관리

# GROUP-A

## 202 애플리케이션 테스트의 기본 원리

- 파레토 법칙(Pareto principle): 애플리케이션의 20%에 해당하는 코드에서 전체 결함의 80%가 발견된다는 법칙
- 살충제 패러독스(pesticide paradox): 동일한 테스트 케이스로 동일한 테스트를 반복하면 더 이상 결함이 발견되지 않는 현상
- 오류-부재의 궤변(absence of errors fallacy): 소프트웨어의 결함을 모두 제거해도 사용자의 요구사항을 만족시키지 못하면 해당 소프트웨어는 품질이 높다고 말할 수 없는 것






<br/><br/>

---

## 203 프로그램 실행 여부에 따른 테스트

### 정적 테스트
- 프로그램을 실행하지 않고 명세서나 소스 코드를 대상으로 분석하는 테스트
- 소스 코드에 대한 코딩 표준, 코딩 스타일, 코드 복잡도, 남은 결함 등을 발견하기 위해 사용
- 종류: walkthrough, inspection, 코드 검사 등

### 동적 테스트
- 프로그램을 실행하여 오류를 찾는 테스트
- 소프트웨어 개발의 모든 단계에서 테스트를 수행
- 종류: 블랙박스 테스트, 화이트박스 테스트






<br/><br/>

---

## 208 화이트박스 테스트의 검증 기준

### 문장 검증 기준(statement coverage)

소스 코드의 모든 구문이 한 번 이상 수행되도록 테스트 케이스를 설계한다.

### 분기 검증 기준(branch coverage)

- 소스 코드의 모든 조건문에 대해 조건식의 결과가 `true`인 경우와 `false`인 경우가 한 번 이상 수행되도록 테스트 케이스를 설계한다.
- 결정 검증 기준(decision coverage)이라고도 한다.

### 조건 검증 기준(condition coverage)

소스 코드의 조건문에 포함된 **개별 조건식**의 결과가 `true`인 경우와 `false`인 경우가 한 번 이상 수행되도록 테스트 케이스를 설계한다.
- eg. `if (A || B)...`
  - `A`와 `B` 각각을 개별 조건식으로 보고
  - `A`의 true/false인 경우, `B`의 true/false인 경우 비교 모두 비교

### 분기/조건 기준(branch/condition coverage)

분기 검증 기준과 조건 검증 기준을 모두 만족하는 설계로, 조건문이 `true`인 경우와 `false`인 경우에 따라 조건 검증 기준의 입력 데이터를 구분하는 테스트 케이스를 설계한다.





<br/><br/>

---

## 209 블랙박스 테스트

- 블랙박스 테스트(blackbox test): 소프트웨어가 수행할 특정 기능을 알기 위해서 각 기능이 완전히 작동되는 것을 입증하는 테스트.
- 동치 클래스 분해 및 경계값 분석 등을 이용
- 기능 테스트라고도 한다.
- 사용자의 요구사항 명세를 보면서 테스트 한다.
- 주로 구현된 기능을 테스트한다.
- 소프트웨어 인터페이스를 통해 실시된다.







<br/><br/>

---

## 210 블랙박스 테스트의 종류

## 동치 분할 검사(equivalence partitioning testing)
- (프로그램의)입력 조건에 타당한 입력 자료와 타당하지 않은 입력 자료의 개수를 균등하게 하여 테스트 케이스 결정, 해당 입력 자료에 맞는 결과가 출력되는지 확인하는 기법
- 동등 분할 기법 또는 동치 클래스 분해라고도 한다.

## 경계값 분석(boundary value analysis)
- 입력 조건의 중간값보다 경계값에서 오류 발생 확률이 높다는 점 이용
- 입력 조건의 경계값을 테스트 케이스로 선정하여 검사

## 원인-효과 그래프 검사(cause-effect graphing testing)
**입력 데이터** 간의 관계와 출력에 영향을 미치는 상황을 체계적으로 분석, 효용성이 높은 테스트 케이스를 선정, 검사

## 오류 예측 검사(error guessing)
과거 경험이나 확인자의 감각으로 테스트

## 비교 검사(comparison testing)
여러 버전의 프로그램에 동일한 테스트 자료 제공, 동일한 결과가 출력되는지 테스트




<br/><br/>

---

## 216 하향식 통합 테스트






<br/><br/>

---

## 217 상향식 통합 테스트







<br/><br/>

---

## 218 회귀 테스트







<br/><br/>

---

## 224 애플리케이션 성능 측정 지표






<br/><br/>

---

## 229 소스 코드 품질 분석 도구






<br/><br/>

---







<br/><br/>

---





<br/><br/>

---

## skipped-for-later list

211 개발 단계에 따른 애플리케이션 테스트
212 단위 테스트
213 통합 테스트
215 인수 테스트
216 하향식 통합 테스트
217 상향식 통합 테스트
218 회귀 테스트
220 테스트 오라클의 종류
224 애플리케이션 성능 측정 지표
229 소스 코드 품질 분석 도구


<br/><br/><br/><br/><br/>

---

# GROUP-B

## 189 UI/UX






<br/><br/>

---








<br/><br/>

---







<br/><br/>

---







<br/><br/><br/><br/><br/>

---

# GROUP-C

## 206 화이트박스 테스트

- 모듈의 원시 코드(source code)를 오픈시킨 상태에서 **원시 코드의 논리적인 모든 경로를 테스트하여 테스트 케이스를 설계하는 방법**
- 모듈 안의 작동을 직접 관찰할 수 있다.
- 원시 코드의 모든 문장을 한 번 이상 실행함으로써 수행된다.






<br/><br/>

---








<br/><br/>

---







<br/><br/>

---







<br/><br/>
