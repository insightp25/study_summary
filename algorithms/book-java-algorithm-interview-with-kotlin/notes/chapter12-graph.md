# 12장 그래프

# DFS

```java
Map<Integer, List<Integer>> graph = new HashMap<>();

graph.put(1, Arrays.asList(2, 3, 4));
graph.put(2, Arrays.asList(5));
graph.put(3, Arrays.asList(5));
graph.put(4, Arrays.asList());
graph.put(5, Arrays.asList(6, 7));
graph.put(6, Arrays.asList());
graph.put(7, Arrays.asList(3));
```

### 재귀 구조로 구현

```java
public List<Integer> recursiveDFS(int v, List<Integer> discovered) {
    discovered.add(v);

    for (Integer w : graph.get(v)) {
        if (!discovered.contains(w)) {
            discovered = recursiveDFS(w, discovered);
        }
    }

    return discovered; // [1, 2, 5, 6, 7, 3, 4]
}
```

### 스택을 이용한 반복 구조로 표현

```java
public List<Integer> iterativeDFS(int v) {
    List<Integer> discovered = new ArrayList<>();

    Deque<Integer> stack = new ArrayDeque<>();

    stack.push(v);

    while (!stack.isEmpty()) {
        v = stack.pop();

        if (!discovered.contains(v)) {
            discovered.add(v);

            for (int w : graph.get(v)) {
                stack.push(w);
            }
        }
    }

    return discovered; // [1, 4, 3, 5, 7, 6, 2]
}
```









<br><br><br>

---

# BFS

### 큐를 이용한 반복 구조로 구현

```java
public List<Integer> iterativeBFS(int start_v) {
    List<Integer> discovered = new ArrayList<>();

    discovered.add(start_v);

    Queue<Integer> queue = new LinkedList<>();

    queue.add(start_v);

    while (!queue.isEmpty()) {
        int v = queue.poll();

        for (int w : graph.get(v)) {
            if (!discovered.contains(w)) {
                discovered.add(w); // 이것 스택과 구현 순서에서 때문에 차이 발생. 큐는 더한 순서로 순서가 정해지기 때문에 이렇게 미리 더할 수 있는데, 스택은 그걸 보장하지 못한다.
                queue.add(w);
            }
        }
    }

    return discovered;
}
```









<br><br><br>

---





