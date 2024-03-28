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

		long[] sumArr = new long[N];

		// can cause IOException
		stringTokenizer = new StringTokenizer(bufferedReader.readLine());
		
		sumArr[0] = Integer.parseInt(stringTokenizer.nextToken());

		for (int i = 1; i < N; i++) {
			sumArr[i] = 
				sumArr[i - 1] + Integer.parseInt(stringTokenizer.nextToken());
		}

		for (int q = 0; q < M; q++) {
			// can cause IOException
			stringTokenizer = 
				new StringTokenizer(bufferedReader.readLine());

			int i = Integer.parseInt(stringTokenizer.nextToken()) - 1;
			int j = Integer.parseInt(stringTokenizer.nextToken()) - 1;

			if (i == 0 && j == 0) {
				System.out.println(sumArr[0]);
			} else if (i == 0) {
				System.out.println(sumArr[j]);
			} else {
				System.out.println(sumArr[j] - sumArr[i - 1]);
			}
		}
	}
}
