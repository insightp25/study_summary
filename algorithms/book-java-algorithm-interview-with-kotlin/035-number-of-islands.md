# 035. 섬의 개수

https://leetcode.com/problems/number-of-islands/


### java

```java
public void dfs(int i, int j, char[][] grid) {
    if (i < 0 || i >= grid.length || j < 0 || grid[0].length || grid[i][j] == '0') return;
    grid[i][j] = '0';
    dfs(i, j + 1, grid);
    dfs(i, j - 1, grid);
    dfs(i + 1, j, grid);
    dfs(i - 1, j, grid);
}

public int numIslands(char[][] grid) {
    int count = 0;

    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == '1') {
                dfs(i, j, grid);
                count++;
            }
        }
    }
    return count;
}
```




<br><br><br>

---

### kotlin

```kotlin
fun numIslands(grid: Array<CharArray>): Int {
    fun dfs(i: Int, j: Int) {
        when {
            (i < 0) ||
            (i >= grid.size) ||
            (j < 0) ||
            (j >= grid.size) ||
            (grid[i][j] == '0') -> return
        }
        grid[i][j] = '0'
        dfs(i, j + 1, grid);
        dfs(i, j - 1, grid);
        dfs(i + 1, j, grid);
        dfs(i - 1, j, grid);
    }

    var count = 0

    for (i in grid.indices) {
        for (j in grid[i].indices) {
            if (grid[i][j] == '1') {
                dfs(i, j)
                count++
            }
        }
    }
    return count
}
```