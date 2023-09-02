import java.util.Scanner;

public class Main {
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int[] scores = new int[N];
        for (int i = 0; i < N; i++) {
            scores[i] = sc.nextInt();
        }
        
        long sum = 0;
        long max = 0;
        for (int i = 0; i < N; i++) {
            if (scores[i] > max) max = scores[i];
            sum += scores[i];
        }

        System.out.println(sum * 100.0 / max / N);        
    }
}
