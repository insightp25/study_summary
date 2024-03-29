# 트라이, 공간분할 트리

# 단어 확인과 자동완성

입력된 단어가 영어사전에 있으면 true를 아니면 false를 반환

재빨리 판단하려면 사전 데이터를 어디에 저장해야 하죠? -> 메모리

어떤 자료구조에? -> 배열?

그럼 시간 복잡도는? -> O(N)? 훑어야 하기 때문에.

문자열 비교도 해야 하는데? 더 빨라서 적당한 자료구조는? -> 해시 테이블! O(1)

근데 여전히 문자열 비교는 해야 하는데(충돌 때문)? -> 그러면 O(k) 정도(k: 단어내 문자 개수)

최악의 시간 복잡도는? -> O(k * N)

영단어는 해시 충돌이 별로 없지 않나? -> 그럴지도. 하지만 프로그램을 확장할시 제한적이다.

몇 글자만 쳐도 단어 보여주기! -> (자동완성 기능)

근데 해시 테이블에서 이걸 어떻게 찾죠? -> 트라이를 사용하면 된다!



<br>

# 사전식 순서

# 사전을 처음부터 읽으면 보이는 패턴
- 사전식 순서에 따라 기재
- 앞 부분(prefix)이 공통인 단어들이 많음!
  - 재귀적!

재귀에 딱인 자료구조는?





<br>

# 트라이란?

트리로 저장한 사전 단어들

## 이진 트리 vs ???

- 이진 트리
  - 각 노드의 연결이 키에 따라 결정
  - 노드가 그 키를 저장

- ???
  - 연결이 키 전부가 아닌 한 글자로 결정
  - 노드가 키를 저장하지 않음
  - 그 노드 위치 자체가 키를 결정

???의 정체는 '트라이'


## 트라이(trie)

- 탐색 트리 중 하나
- 어원: re***trie***val
  - 원래는 트리라 발음
  - 구분 위해 트라이로 발음
- 다른 이름
  - digital tree
  - prefix tree
- 어떤 집합 안에서 특정한 키를 찾을 때 사용
- 키는 문자열인 경우가 보통
- 노드 사이의 연결이 한 글자로 결정됨
  - 키 전부가 아님
- 노드 위치 자체가 키를 정의
  - 노드가 키 전체를 저장하지 않음


## 트라이의 용도
1. 사전 데이터의 저장(주 용도)
  - 용량을 더 차지할 수는 있음
  - 그러나 탐색 속도 향상
2. 해시 테이블 대신 사용 가능
  - 충돌이 없음
  - 해시 테이블보다 최악의 경우에 더 빠름 0(k)
  - 허나 평균 O(1)이 아님
  - 표현하기 어려운 데이터 형도 있음 (예: float)






<br>

# 공간분할 트리 소개

생각보다 사용처 많다.

## 여태까지 본 트리는 1차원 공간을 표현
- 배열은 선(line)
- 선은 1차원 공간에 존재


## 실세계는 2D 혹은 3D

- 사람의 눈은 2차원
  - 평면
  - x/y축(상하좌우)
  - 2차원 배열에 저장 가능
- 세계는 3차원
  - 2차원 + 깊이
  - x/y/z 축
  - 3차원 배열에 저장 가능

## 공간을 표현하는 프로그래밍 분야

- 영상 처리(2D)
- 게임, 영화(2D/3D)
- 설계 프로그램(2D/3D)
- 가상현실, 증강현실(3D)
- 등

2~4번째 분야에서 겪는 어려움은? -> 물체 수가 많음!(=매우 많은 데이터양)







<br>

# 많은 물체 처리 문제

## 간단한 2D 게임 예

- 배경은 광활한 우주(맵)
- 주인공은 우주 전투기를 운전
- 맵의 일부만 화면에 보임
- 한 화면에 보이는 개체 수는 100개 미만
- 맵에 존재하는 개체 수는 수십 만개
  - 그래픽 카드에 모두 그려달라 하는 건 무리!
  - 정말 화면에 나올 것들만 드려달라 해야함

## 물체 그리기 요청 방법1: 모두 요청

- 모든 물체를 그려달라 함
- 그래픽 카드가 모든 물체를 화면에 투영
  - 화면 밖에 있는 물체는 안 그려짐
  - 안/밖 판단을 하려면 여전히 투영 필요
- 그래픽 프로그래밍에서 종종 병목점(bottleneck)

## 물체 그리기 요청 방법 2: 적당히 추려서 요청

- 화면에 확실히 안 나올 물체들은 추려버림
  - 경계 상자, 경계 구 등 이용
- 안 추려진 물체들만 그래픽 카드에 요청
  - 이것만 그래픽 카드가 화면에 투영
- 여전히 모든 물체에 대해 투영 연산 <-트리로 해결할 수 있는 문제
  - 하지만 CPU에서 연산
  - 간단한 모양(경계 상자, 경계 구 등)을 사용







<br>

# 쿼드 트리

## 아이디어
- 모든 물체를 계산해야 했던 이유
  - 2D 배열을 훑는 것과 마찬가지
- 이걸 트리로 표현하자!
  - 1D 배열을 트리에 저장했듯이
  - 한 깊이 단계씩 깊게 들아갈 수록 공간을 균등히 나눈다

## 쿼드 트리(quadtree)

- 사분 트리라고도 함
- 재귀적으로 2D 공간을 분할
- 각 노드가 4개의 자식을 가짐
  - 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래
  - 현재 노드를 4개의 하위 사각 영역으로 나눔
- 공간분할 트리!

3D에서 마찬가지 일을 하려면?





<br>

# 옥 트리와 기타 공간분할 트리

## 옥 트리(octree)

- 재귀적으로 3D 공간을 분할
- 각 노드가 8개의 자식을 가짐
  - 쿼드 트리의 4자식 * 앞/뒤
  - 현재 노드를 8개의 하위 상자로 나눔
- 3D 프로그램에 종종 사용
  - 마인크래프트 같은 게임
  - 글로벌 일루미네이션(전역 조명) 효과
  - 등

## 기타 공간분할 트리

- BSP(이진 공간 분할 트리, binary space partitioning)
- R 트리
- k-d 트리
- 등




<br>
