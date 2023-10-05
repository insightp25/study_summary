import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.StringTokenizer;

public class Main {

	public static void main(String[] args) throws IOException {
		BufferedReader br = 
			new BufferedReader(new InputStreamReader(System.in));

		StringTokenizer st =
			new StringTokenizer(br.readLine());

		int N = Integer.parseInt(st.nextToken());
		int M = Integer.parseInt(st.nextToken());

		long[][] sumArr = new long[N + 1][N + 1];

		for (int i = 1; i <= N; i++) {
			st = new StringTokenizer(br.readLine());

			for (int j = 1; j <= N; j++) {
				sumArr[i][j] = Integer.parseInt(st.nextToken()) +
					sumArr[i - 1][j] + 
					sumArr[i][j - 1] - 
					sumArr[i - 1][j - 1];
			}
		}

		for (int i = 0; i < M; i++) {
			st = new StringTokenizer(br.readLine());

			int x1 = Integer.parseInt(st.nextToken());
			int y1 = Integer.parseInt(st.nextToken());
			int x2 = Integer.parseInt(st.nextToken());
			int y2 = Integer.parseInt(st.nextToken());

			System.out.println(sumArr[x2][y2] - sumArr[x1 - 1][y2] - 
				sumArr[x2][y1 - 1] + sumArr[x1 - 1][y1 - 1]);
		}
	}
}
