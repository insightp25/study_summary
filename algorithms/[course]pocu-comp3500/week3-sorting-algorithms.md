# 정렬 알고리즘

* 입력 데이터는 일반적으로 배열 같은 데이터 구조에 저장
    - 아무 위치로의 임의 접근 허용
    - 연결 리스트를 사용하면 처음 혹은 끝부터 차례대로 훑어야 함
* 흔히 사용하는 순서: 숫자 순서, 사전 순서
* 정렬 방향: 오름차순, 내림차순
* 다양한 정렬 알고리즘
    - 시간 복잡도 차이
    - 메모리 사용량 차이
    - 안정성(stability) 차이
    - 직렬 vs. 병렬 차이







<br>

# 정렬 알고리즘의 안정성

## 정렬 알고리즘의 안정성
* 안정성(safety)이 아님
* 정렬한 후 똑같은 키(key)를 가진 데이터들의 순서가 바뀌지 않느냐 여부

## 안정성을 잘 모르는 이유
* 같은 키를 가진 데이터의 순서가 바뀌어도 문제가 아닌 경우가 보통
* 그래서 잘 모르고 생각도 안 하는 부분
* 이 때문에 버그가 나도 못 고치는 경우 존재
* 어떤 정렬 알고리즘은 안정성을 보장하기도 하고, 안하기도 함

## 안정성이 문제가 되는 경우
1. 정렬의 기준이 되는 정렬 키(sorted key)와 실제 데이터가 다름
2. 구조체/클래스의 일부 멤버만 정렬 키로 사용








<br>

# 대표적인 정렬 알고리즘

## 대표적인 정렬 알고리즘
* 버블 정렬 - 컴퓨터에 친화적(?). 언제라도 구현 가능해야.
* 선택 정렬 - 사람에게 친화적(?)
* 삽입 정렬 - 사람에게 친화적(?)
* 퀵 정렬 - 언제라도 설명할 수 있어야(어떤 언어라도 거의 디폴트로 사용되는 알고리즘)
* 병합 정렬 - 이해 정도로 충분
* 힙 정렬 - 이해 정도로 충분







<br>

# 정렬 알고리즘 비교

배열을 비교/정렬하려면 모든 요소를 최소 한 번씩은 방문해야 함: O(N)

## 정렬 알고리즘 비교

||평균|최악|메모리|안정성|
|--|--|--|--|--|
|버블|O(N^2)|O(N^2)|O(1)|O|
|선택|O(N^2)|O(N^2)|O(1)|X|
|삽입|O(N^2)|O(N^2)|O(1)|O|
|퀵|O(N*logN)|O(N^2)|O(logN)|X|
|병합|O(N*logN)|O(N*logN)|O(N)|O|
|힙|O(N*logN)|O(N*logN)|O(1)|X|

## 퀵, 병합, 힙 정렬 비교
퀵의 경우 스택 메모리 사용하며, 따라서 메모리 할당/해제가 거의 공짜로 일어난다. 따라서 실무에 가면 그냥 메모리를 적게 드는 것도 있지만 할당/삭제가 굉장히 빠르기 때문에 O(1)에 가까운 정도로 빠르게 돈다고 생각해도 맞다.

병합의 경우 힙에 메모리를 잡아야(새로운 배열 생성) 하여 메모리의 복잡도가 O(N)이다(메모리 할당/해제는 공짜가 아니다).

시간 복잡도 != 실행 시간. O(N*logN)에서 M*logN의 상수 M의 크기도 관건이다. 퀵 정렬은 해당 상수가 굉장히 작은 편이고 힙 정렬은 꽤 큰 편이다. 그래서 평균으로 봤을 땐 퀵이 빠르고, 최악으로 갔을 땐 힙이 빠른 경우가 있다(데이터가 커질 수록). 하지만 퀵 정렬에서 최악이 나오기는 생각보다 쉽지 않고 맞추는 방법도 있다. 그래서 보통 퀵을 사용하는 경우가 많다.





<br>

# 상황에 따른 정렬 알고리즘 선택

## 상황에 따른 정렬 알고리즘 선택

기본: 퀵 정렬. C도 qsort() 함수 기본 제공.

간단히 구현시: 버블 정렬.

어떤 경우에도 느려지면 안 될 때: 병합 또는 힙 정렬. 최악의 경우 여전히 O(N*logN)

특수한 상황에 적합한 정렬 알고리즘도 존재: 기수(radix) 정렬 등.







<br>

# 버블 정렬

## 시간 복잡도
- 목록을 훑는 총 횟수 N - 1번
- 한 번 훑을 때
    - 가장 많이 방문했던 요소 수 N - 1번
    - 가장 적게 방문했던 요소 수 1
    - 평균적으로 방문했던 요소 수 (N - 1 + 1)/2 = N/2번
- 시간 복잡도: O((N-1)N)/2) = O(N^2)

## 공간 복잡도
- 새로 만드는 목록 없음
- 공간 복잡도: O(1)

## 안전성
- 값이 같은 경우 순서를 바꾸지 않음. 따라서 정렬 후에도 순서 유지
- 안정성: 보장 O

## 코드 예

```java
public static void bubbleSort(int[] nums) {
    for (int i = 0; i < nums.length - 1; ++i) {
        for (int j = 0; j < nums.length - i - 1; ++j) {
            if (nums[j] > nums[j + 1]) {
                int temp = nums[j];
                // 원본 배열을 바꿈(in-place 정렬)
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }
}
```








<br>

# 선택 정렬

* 최솟값 찾아 선택한다고 해서 선택 정렬
* 목록 총 N - 1번 훑으면서 다음 과정 반복
    1. 요소 0부터 훑으면서 최솟값을 찾아 요소 0과 교환
    2. 요소 1부터 훑으면서 최솟값을 찾아 요소 1과 교환
    3. 요소 2부터 훑으면서 최솟값을 찾아 요소 2과 교환

    ...N - 1번째까지 반복
* 시간/공간 복잡도: 버블 정렬과 동일
* 안정성: 보장 X



## 코드 예

```java
public static void selectSort(int[] nums) {
    int numsLength = nums.length;

    for (int i = 0; i < numsLength; ++i) {
        int minIndex = findMinIndex(i, numsLength, nums);

        swap(i, minIndex, nums);
        }
    }
}

public static int findMinIndex(int startIndex, int endIndex, int[] nums) {
    for (int j = minIndex + 1; j < endIndex; ++j) {
        if (nums[j] < nums[minIndex]) {
            minIndex = j;
        }
    }
    return minIndex;
}

public static void swap(int indexA, int indexB, int[] nums) {
    int temp = nums[indexA];
    nums[indexA] = nums[indexB];
    nums[indexB] = temp;
}
```








<br>

# 삽입 정렬

각 요소를 이미 정렬된 배열 부분과 비교하여 올바른 위치에 삽입하는 정렬

* 모든 요소를 방문함: O(N)
    * 정해진 횟수이니 for문이 적합

* 내부 반복문의 반복 횟수는 가변적
    * 필요한 만큼까지만 오른쪽으로 미는 방식
        - 시간 복잡도는 여전히 O(N)
    * 정해지지 않은 횟수이니 while문이 더 적합

* 시간/공간 복잡도: 버블 정렬과 동일
* 안정성: 보장 O






<br>

# 퀵 정렬

* 실무에서 가장 많이 사용. 일반적/범용적으로 가장 빠름.
* 진정한 분할 정복 알고리즘
    - 모든 요소 방문(decrease-and-conquer와의 차이)
    - 복잡도에 log
* 어떤 값(pivot)을 기준으로 목록을 하위 목록으로 2개로 나눔
    - 목록을 나누는 기준은 pivot보다 작냐/크냐
    - 이 과정 재귀적으로 반복
    - 재귀 단계가 깊어질 때마다 새로운 pivot 값을 뽑음

## 시간 복잡도
* 각 단계마다 방문하는 요소 수: O(N)
* 총 몇 개의 단계?
    - 매 단계에서 좌우가 균등하게 나뉘면 O(logN)
    - 매 단계 모든 요소가 한쪽으로 몰리면 O(N)
* 평균: O(N log N)
* 최악: O(N^2)

## 최악의 상황 줄이기
* 모든 경우에 작동하는 방법은 [왼쪽, 오른쪽] 범위에서 랜덤 위치
* 그래도 아주 작은 확률(거의 없다고 봐도 무방)이지만 최악의 상황은 나옴
* O(N^2)을 절대 허용할 수 없다면?
    - 다른 정렬 사용
    - 평균 속도 vs. 최악의 상황 사이의 균형

## 분할법은 여러 가지
* 로무토(Lomuto) 분할법: 왼쪽->오른쪽으로만 진행. 가장자리 값을 기준값으로 선택시 잘 작동.
* 호어(Hoare) 분할법: 왼쪽->오른쪽, 오른쪽->왼쪽 번갈아 진행하는 방식. 어떤 값을 기준으로 선택해도 잘 작동.

## 공간 복잡도
* O(logN)
* 재귀적으로 함수 호출
* 실제 원본 배열을 고침: O(1)
* 함수 호출 깊이만큼 스택 메모리 사용: O(logN)
    - 스택 메모리라 할당/해제가 매우 빠름
* quickSortRecursive()에서 재귀 함수 두 번 호출
    - 두 번째 호출은 꼬리 재귀 통해 피할 수 있음

## 안정성
* 안전성: 보장 X
* (Java의 `Arrays.sort()` 오버로드 메서드는 내부적으로 병합 정렬을 사용. 병합 정렬은 안정적 알고리즘. 다른 `Arrays.sort()` 오버로드 메서드들은 퀵 정렬을 사용할 수도 있으므로 Java API 확인 필요.)


## 코드 예

```java
public static void quickSort(int[] nums) {
    quickSortRecursive(nums, 0, nums.length - 1);
}

public static void quickSortRecursive(int[] nums, int left, int right) {
    if (left >= right) {
        return;
    }

    int pivotPos = partition(nums, left, right);

    quickSortRecursive(nums, left, pivotPos - 1);
    quickSortRecursive(nums, pivotPos + 1, right);
}

public static int partition(int[] nums, int left, int right) {
    int pivot = nums[right];

    int i = (left - 1);
    for (int j = left; j < right; ++j) {
        if (nums[j] < pivot) {
            ++i;
            swap(nums, i, j);
        }
    }

    int pivotPos = i + 1;
    swap(nums, pivotPos, right);

    return pivotPos;
}

public static void swap(int[] nums, int indexA, int indexB) {
    int temp = nums[indexA];
    nums[indexA] = nums[indexB];
    nums[indexB] = temp;
}
```






<br>

# 병합정렬

1. 입력 배열을 재귀적으로 반씩 나눠 요소수가 1인 배열들을 만든다.
    - 요소수가 1이니 정렬된 배열(...)
    - 정확히 반씩 나누니 재귀 깊이는 O(logN)
2. 재귀 반대 방향으로 배열을 계속 합침
    - 이때 정렬된 상태를 유지해야 함
    - 각 재귀 단계마다 방문하는 요소수는 O(N)
3. 제일 상위 단계까지 합치면 정렬 끝









<br>

# 힙 정렬
* 힙(heap): 트리(tree) 기반 자료 구조
    - 우선순위 큐의 효율적인 구현 방법 중 하나
* 힙 정렬은 힙을 사용하는 정렬 알고리즘
    - 언제나 부모의 키(key)가 자식의 키와 같거나 큼
    - 이 자료구조에 데이터를 저장하는 순간 정렬이 됨
    - 즉, 정렬 안 된 데이터를 힙에 한 번 넣었다가 빼면 끝
























