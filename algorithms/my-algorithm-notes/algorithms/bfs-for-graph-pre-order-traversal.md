# 그래프의 BFS(전위 순회)

## 구현

```java
class IterativeBFS {
    public void iterativeBFS(Node node) {
        HashSet<Node> discovered = new HashSet<>();
        Queue<Node> queue = new LinkedList<>();

        queue.add(node);
        discovered.add(node);

        while (!queue.isEmpty()) {
            node = queue.remove;

            System.out.println(node.data);

            for (Node neighbor : node.neighbors) {
                if (!discovered.contains(neighbor)) {
                    queue.add(neighbor);
                    discovered.add(neighbor);
                }
            }
        }
    }
}
```

## notes

- discovered의 타입으로 `HashSet` 사용
  - (`List` 타입의의 `contains()`가 O(N)이 걸리므로, O(1)이 소요되는 `HashSet`이 더 나은 practiced이다)
- Node라는 가상 클래스를 담고있는 node 객체 임의 사용 가정
