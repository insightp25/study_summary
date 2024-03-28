# 

# 

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

```java
public static void searchBreadthFirst(Node node) {
	Queue<Node> queue = new LinkedList<>();

	queue.add(node);

	while (!queue.empty()) {
		Node next = queue.remove();

		System.out.println(next.data);

		for (Node child : next.children) {
			queue.add(child);
		}
	}
}
```






<br>








<br>








<br>








<br>








<br>








<br>








<br>








<br>








<br>








<br>








<br>









