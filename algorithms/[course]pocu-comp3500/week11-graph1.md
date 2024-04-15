# 그래프1

# 그래프의 정의

## 그래프란?

"데이터(노드)들을 잘 정리하는 방법 중 하나"

- 노드: 정점vertex, 꼭지점point
- 잘 정리: 노드 간의 관계를
- 변, 간선(edge, line, link)






<br>

# 그래프의 예

예: 

- 서울 지하철 노선표
- POCU의 선수과목
- 전/현 직장동료
- 세탁기 사이클
- 게임의 스킬 트리

트리는? 방향 비순환 그래프 중 하나(DAG, directed acyclic graph)







<br>

# 그래프의 종류

## 그래프의 정의와 용도

- 데이터들과 그 관계를 보여주는 방법 중 하나
- 서로 연관있는 노드의 집합

> G = (N,E)

- 네트워크 형태의 관계를 보여주기에 적합
- 복잡한 실세계의 문제를 모델링하기에 적절
  - 네트워크 형태가 명백하게 안보이는 경우도 있음
  - 그래프 이론을 적절히 적용하면 시간복잡도를 확연히 줄일 수도 있음

## 그래프 관련 용어

- 노드(정점, 꼭짓점)
- 변(간선, 선)
- 차수(degree)
- 루프(loop)

## 그래프의 종류

- 방향/무방향(directed/undirected) 그래프
- 순환/비순환(cyclic/acycic) 그래프
- 가중/비가중(weighted/unweighited) 그래프

## 방향 vs 무방향 그래프

- 방향 그래프
  - 변이 한 방향만 가리킴
  - 꼬리 -> 머리로 이동은 가능
  - 머리 -> 꼬리로 이동은 불가능

- 무방향 그래프
  - 변에 특별한 방향이 없음
  - 따라서 양방향을 가리키는 것과 같음
  - 꼬리 -> 머리, 머리 -> 꼬리 모두 가능

## 무방향 그래프의 최대 변 개수

- 모든 노드가 연결되어 있는 경우
  - 단, 평행 변이나 루프는 없음
- 첫 번째 노드의 변: N - 1개
- 두 번째 노드의 변: N - 2개(중복된 것을 다시 세지 않음)
- 세 번째 노드의 변: N - 3개

## 순환 vs 비순환 그래프

- 비순환 그래프
  - 일단 떠나면 그 노드로 돌아오는 경로가 없음
  - 그래프 안의 모든 노드에 대해
- 순환 그래프
  - 떠난 뒤에도 그 노드로 돌아오는 경로가 있음
  - 그런 노드가 하나만 있어도 순환 그래프

## 가중 vs 비가중 그래프

- 비가중 그래프
  - 모든 변이 동일한 의미를 가짐
  - 각 변의 값이 같음
  - 별도의 표기 불필요
- 가중 그래프
  - 각 변의 관계 정도가 다름 (예: 거리, 시간)
  - 각 변의 값이 다름







<br>

# 그래프의 다양한 표현 방법

## 그래프를 사용해 풀 수 있는 문제들

* 여러 스케줄링 관련
* 두 위치 사이의 여행 경로 관련
* 분자를 구성하는 원자들의 결합 관련
* 인터넷에서 데이터 패킷이 전달되는 경로 관련
* 대규모 프로젝트에서 일감 사이의 의존성 관련
* 도시의 전기 공급 그리드 관련
* SNS에서 친구 관계 관련

그 외 다양한 문제 존재!

트리는 비교적 간단한 형태의 그래프였고 restriction이 많아 구현이 편했지만, 그래프는 그 표현에 테크닉적인 부분이 필요하다.


## 그래프의 다양한 표현 방법

1. 원과 선
2. 인접 행렬(adjacency matrix)
3. 인접 리스트(adjacency list)


## 1. 원과 선

- 사람이 가장 이해하기 쉬운 표현법
  - 한눈에 그래프를 파악 가능
  - 단, 노드와 변의 수가 적당해야 함
- 굳이 코드로 표현하면 트리와 비슷한 구조

```java
public class Node {
	public int data;
	public ArrayList<Node> neighbors = new ArrayList<>();
}
```
* 하지만 대규모 데이터 처리에 적합한 표현법은 아님









<br>



# 인접 행렬

## 2. 인접 행렬

* NxN 행렬
  * G[N][N]
  * N:그래프 G 안에 있는 노드 수
* 서로 인접한 노드를 표현
  * 인접: 두 노드 사이를 연결하는 변이 있음
  * 1에서 J로 향하는 변이 있다면 G[1][j] = 1
  * 없으면 G[i][j] = 0
* G가 가중 그래프이면 0/1 대신 실제 가중치를 저

자기 자신과 연결됐는지 여부는 따로 loop가 있지 않는 한 0으로 처리. 

eg. G[2][2] = 0







<br>

# 방향 그래프의 인접 행렬

## 인접 행렬 만들기 - 방향 그래프

특정 노드가 다른 노드를 가리키면 1, 가리키고 있지 않으면 0으로 처리.

예시:

```
0 0 1 0 // 가로(행)로 보면 해당 행의 노드가 어떤 노드를 가리키는지 알 수 있다.
1 0 0 1
0 1 0 0
0 0 0 0
// 세로(열)로 보면 해당 열의 노드를 어떤 노드가 가리키는지 알 수 있다.
```

## 인접 행렬의 장단점

|장점|단점|
|---|---|
|(일단 알면)쉽게 구현 가능|공간을 더 차지함 O(N2)|
|변 제거의 시간 복잡도가 0(1)|언제나 같은 공간을 차지. 연결된 노드가 많아도, 적어도.|
|다음과 같은 관계를 효율적으로 찾음: 노드 a에서 b로 가는 변이 존재하는가? -> 0(1)|인접 행렬을 만드는 시간은 0(N2)|
| |인접 노드를 찾는 시간은 0(N)|

연결돼있는 게 많지 않을 경우 인접 행렬은 낭비가 심해 그렇게 뛰어나지 않을 수 있다.







<br>

# 인접 리스트

## 3. 인접 리스트

* 각 노드마다 이웃의 리스트를 만듦
  * 리스트 N 개
  * 보통 연결 리스트 N 개를 배열에 저장
  * 연결 리스트 대신 다른 자료구조도 사용 가능
* 원과 선을 굳이 코드로 구현한 것과 큰 차이 없음(...)


## 인접 리스트의 장단점

|장점|단점|
|---|---|
|* 공간을 적게 사용|* 다음과 같은 관계를 찾는 게 느림|
|  * O(N + E)|  * 노드 a에서 b로 가는 변이 존재하는가?|
|  * 최악(모든 노드끼리 연결돼 있을 시): O(N^2) = O(N + (N+ ((N - 1)/2))|  * O(1)보다 느림|
|* 삽입/삭제가 빠름| |
|  * 연결 리스트를 사용했을 경우| |


## (supplementary)기타 표현 방법

* 결합 행렬(incidence matrix)
* 결합 리스트(incidence list)
* 연산에 따라 이 표현법을 사용하는 게 더 쉽기도 함










<br>

# 그래프의 깊이 우선 탐색

 ## 그래프의 DFS와 무한루프

```java
public static void searchDepthFirst(Node node) {
	Stack<Node> stack = new Stack<>();

	stack.push(node);

	while (!stack.empty()) {
		Node next = stack.pop();

		System.out.println(next.data);

		for (Node child : next.children) {
			stack.push(child);
		}
	}
}
```

## 무한루프의 해결법

* 이미 처리했던 노드를 다시 처리하면 안 됨
* 방문했던 노드를 기억할 방법이 필요
  1. 전역적으로 방문했던 노드를 기억(예: HashSet<Node>)
  2. 각 노드마다 방문했는지 여부를 기억(예: boolean)
* 두 번째 방문 시 처리 안 하고 곧바로 다음 노드로 넘어감


## 방문 노드 기억하기

```java
// 중복 방문 여전히 발생!
public static void searchDepthFirst(Node node) {
	HashSet<Node> visited = new HashSet<>(); // 추가
	Stack<Node> stack = new Stack<>();

	stack.push(node);

	while (!stack.empty()) {
		Node next = stack.pop();

		System.out.println(next.data);

		visited.add(next);

		for (Node neighbor : next.neighbors) {
			if (!visited.contains(neighbor)) { // 조건 추가
				stack.push(neighbor);
			}
		}
	}
}
```





<br>

# 올바른 노드 기억법

## 올바른 노드 기억법

옵션1. 스택에 이미 들어간 노드는 다시 안 넣음
옵션2. 스택에서 pop()을 한 후에 이미 방문했던 노드인지 확인

## 발견한 노드 기억하기

```java
// 어떤 노드든 stack에 넣기 전에 무조건 discovered에 추가	
public static void searchDepthFirst(Node node) {
	HashSet<Node> discovered = new HashSet<>(); // 변경
	Stack<Node> stack = new Stack<>();

	stack.push(node);
	discovered.add(node); // 추가

	while (!stack.empty()) {
		Node next = stack.pop();

		System.out.println(next.data);

		// visited.add(next); // 삭제

		for (Node neighbor : next.neighbors) {
			if (!discovered.contains(neighbor)) {
				stack.push(neighbor);
				discovered.add(neighbor); // 추가
			}
		}
	}
}
```







<br>








<br>








<br>









