# BFS로 최단 경로 찾기

## 구현

```java
public static int findShortestDistance(Node s, Node d) {
    HashMap<Node, Integer> distances = new HashMap<>();
    Queue<Node> queue = new LinkedList<>();

    queue.add(s);
    discovered.put(s, 0);

    while (!queue.isEmpty()) {
        s = queue.remove();
        int distance = distances.get(s);

        if (s.equals(d)) {
            return distance;
        }

        for (Node neighbor : s.neighbors) {
            if (!distances.containsKey(s)) {
                queue.add(neighbor);
                distances.put(neighbor, distance + 1);
            }
        }
    }

    return -1;
}
```

## notes

- 
