# SECTION1. JPA 소개

# SQL 중심적인 개발의 문제점

- 지금 시대는 ***객체***를 ***관계형 DB***에 관리
  - 객체를 DB에서 관리하기 위해 수 많은 SQL을 작성해야 하는 문제점
    - eg. 객체에 필드 하나 추가하면 쿼리문 다 고쳐야...
  - SQL에 의존적 개발
- 패러다임의 불일치(객체지향 vs. SQL)
- 객체와 관계형 DB의 차이
  1. 상속
    - 각각 테이블에 따른 join SQL 작성..각각 객체 생성 등등 복잡. 하여 DB에 저장할 객체에는 상속 관계를 쓰지 않는다.
  2. 연관관계
    - 객체는 참조 사용. 테이블은 외래 키를 사용
  3. 데이터타입
  4. 데이터 식별 방법

- 객체를 테이블에 맞춰 모델링하게 된다.
- 엔티티 신뢰 문제 - 한 객체와 관련된 모든 객체를 미리 로딩할 수 없다. 진정한 의미의 계층 분할이 어렵다.
- 비교: DAO에서 가져온 동일 데이터를 객체에 담아 비교할 때(서로 다른 객체) vs 컬렉션에서 가져와 비교할 때(같은 객체)
- 객체답게 모델링 할수록 매핑 작업만 늘어나...
- 객체를 자바 컬렉션에 저장 하듯이 DB에 저장할 수는 없을까?하는 고민

