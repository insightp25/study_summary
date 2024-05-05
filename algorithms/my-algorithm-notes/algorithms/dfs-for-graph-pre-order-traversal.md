# 그래프의 DFS(전위 순회)

## 올바른 노드 기억법

옵션1. 스택에 이미 들어간 노드는 다시 안 넣음  
옵션2. 스택에서 pop()을 한 후에 이미 방문했던 노드인지 확인

---

## 구현 타입 1-A

(옵션1. 스택에 이미 들어간 노드는 다시 안 넣음)

- 무한 루프 방지
- discovered의 타입으로 `HashSet` 사용
  - (`List` 타입의의 `contains()`가 O(N)이 걸리므로, O(1)이 소요되는 `HashSet`이 더 나은 practiced이다)
- stack의 타입으로 `Stack` 사용(deprecated)
- Node라는 가상 클래스를 담고있는 node 객체 임의 사용

```java
class IterativeDFS2 {
    public void iterativeDFS2(Node node) {
        HashSet<Node> discovered = new HashSet<>();
        Stack<Node> stack = new Stack<>();

        stack.push(node);
        discovered.add(node);

        while (!stack.isEmpty()) {
            node = stack.pop();

            // 특정 로직 수행(예)
            System.out.println(node.data);

            for (Node neighbor : node.neighbors) {
                if (!discovered.contains(neighbor)) {
                    stack.push(neighbor);
                    discovered.add(neighbor);
                }
            }
        }
    }
}
```


## 구현 타입 1-B(재귀)

```java
class RecursiveDFS2 {
    public void recursiveDFS2(Node node) {
        HashSet<Node> discovered = new HashSet<>();
        
        dfs(node, discovered);
    }

    public void dfs(Node node, HashSet<Node> discovered) {
        if (discovered.contains(node)) {
            return;
        }

        discovered.add(node);

        // 특정 로직 수행(예)
        System.out.println(node.data);        

        for (Node neighbor : node.neighbors) {
            if (!discovered.contains(neighbor)) {
                dfs(neighbor, discovered);
            }
        }
    }
}
```




---

## 구현 타입 2-A

(옵션2. 스택에서 pop()을 한 후에 이미 방문했던 노드인지 확인)

- 무한 루프 방지
- discovered로 `LinkedList` 사용
  - (`List` 타입의 `contains()`가 O(N)이 걸리므로, O(1)이 소요되는 `HashSet`이 더 나은 practiced이다)
- stack으로 `ArrayDeque` 사용
- int 값들을 요소로 담고있는 graph라는 가상 객체 임의 사용

```java
class IterativeDFS1 {
    public List<Integer> iterativeDFS1(int v) {
        List<Integer> discovered = new LinkedList<>();
        Deque<Integer> stack = new ArrayDeque<>();

        stack.push(v);

        while (!stack.isEmpty()) {
            v = stack.pop();

            if (!discovered.contains(v)) {
                discovered.add(v);

                // 특정 로직 수행(예)
                System.out.println(v);

                for (int w : graph.get(v)) {
                    stack.push(w);
                }
            }
        }

        return discovered;
    }
}
```

## 구현 타입 2-B(재귀)

```java
class RecursiveDFS1 {
    public List<Integer> recursiveDFS1(int v) {
        List<Integer> discovered = new LinkedList<>();

        dfs(v, discovered);

        return discovered;
    }

    public void dfs(int v, List<Integer> discovered) {
        if (discovered.contains(v)) {
            return;
        }

        discovered.add(v);

        // 특정 로직 수행(예)
        System.out.println(v);

        for (int w : graph.get(v)) {
            dfs(w, discovered);
        }
    }
}
```


