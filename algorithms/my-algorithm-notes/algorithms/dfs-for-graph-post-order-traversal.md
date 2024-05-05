# 그래프의 DFS(후위 순회)

## 올바른 노드 기억법

옵션1. 스택에 이미 들어간 노드는 다시 안 넣음  
옵션2. 스택에서 pop()을 한 후에 이미 방문했던 노드인지 확인

---

## 구현

(옵션2. 스택에서 pop()을 한 후에 이미 방문했던 노드인지 확인)

- 무한 루프 방지
- discovered로 `HashSet` 사용
  - (`List` 등은 `graph.contains()`가 O(N)이 걸리므로, O(1)이 소요되는 `HashSet`이 더 나은 practiced이다)
- stack으로 `ArrayDeque` 사용
- int 값들을 요소로 담고있는 graph라는 가상 객체 임의 사용

```java
class PostOrderRecursiveDFS {
    public Set<Integer> postOrderRecursiveDFS(int v) {
        Set<Integer> discovered = new HashSet<>();

        dfs(v, discovered);

        return discovered;
    }

    public void dfs(int v, Set<Integer> discovered) {
        if (discovered.contains(v)) {
            return;
        }

        for (int w : graph.get(v)) {
            dfs(w, discovered);
        }

        discovered.add(v);

        // 특정 로직 수행(예)
        System.out.println(v);
    }
}
```

