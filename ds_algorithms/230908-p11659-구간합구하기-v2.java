import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.StringTokenizer;

public class Main {

	public static void main(String[] args) throws IOException {
		BufferedReader bufferedReader = 
			new BufferedReader(new InputStreamReader(System.in));

		// can cause IOException
		StringTokenizer stringTokenizer =
			new StringTokenizer(bufferedReader.readLine());

		int N = Integer.parseInt(stringTokenizer.nextToken());
		int M = Integer.parseInt(stringTokenizer.nextToken());

		long[] sumArr = new long[N + 1];

		// can cause IOException
		stringTokenizer = new StringTokenizer(bufferedReader.readLine());

		for (int i = 1; i <= N; i++) {
			sumArr[i] = 
				sumArr[i - 1] + Integer.parseInt(stringTokenizer.nextToken());
		}

		for (int q = 0; q < M; q++) {
			// can cause IOException
			stringTokenizer = 
				new StringTokenizer(bufferedReader.readLine());

			int i = Integer.parseInt(stringTokenizer.nextToken());
			int j = Integer.parseInt(stringTokenizer.nextToken());

			System.out.println(sumArr[j] - sumArr[i - 1]);
		}
	}
}

