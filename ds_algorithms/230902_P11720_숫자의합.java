import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int N = sc.nextInt();
        String sNums = sc.next();
        
        char[] cNums = sNums.toCharArray();
            
        int sum = 0;
        int sNumsLen = cNums.length;

        for (int i = 0; i < sNumsLen; i++) {
            sum += cNums[i] - '0';
        }
        
        System.out.print(sum);
    }
}
