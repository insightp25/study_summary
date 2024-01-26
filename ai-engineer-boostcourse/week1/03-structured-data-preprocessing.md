# 데이터 전처리

### 데이터 전처리(preprocessing)

머신러닝 모델에 데이터를 입력하기 위해 데이터를 처리하는 과정

- EDA에 따라 달라지는 데이터 전처리
- 모델, 목적에 따라 달라지는 데이터 전처리

선형 모델? 트리? 딥러닝? -> 달라지는 데이터 전처리 방식

- 연속형, 범주형 처리
- 결측치 처리
- 이상치 처리



# 1. 연속형, 범주형 처리

## 1.1. 연속형continuous type

### scaling

데이터의 단위 혹은 분포를 변경

- 선형기반의 모델(선형회귀, 딥러닝 등)인 경우 변수들 간의 스케일을 맞추는 것이 필수적
- (아래 방법들을 통해 모델의 성능을 올릴 수 있는 더 좋은 feature가 될 수 있다)

1. scale
2. scale + distribution

+ binning



### scale

1. min max scaling
2. standard scaling
3. robust scaling

값의 스케일링 -> 분포의 변화


### scale + distribution

1. log transformation
2. quantile transformation


### binning

- 넓고 얇은 다봉분포
- overfitting 방지

<br>

## 1.2. 범주형categorical type

### encoding

1. one hot encoding
2. label encoding
    - 단점: 모델이 숫자들의 순서를 특징으로 인식할 수 있다는 점. 특히 선형 모델에서 label encoding은 범주형 변수형 범주의 값이 순서를 갖고 있고 이를 순서에 맞게 label encoding 했다면 사용할 수 있지만 그렇지 않을 경우 사용할 수 없으니 주의해야 한다.
3. frequency encoding: 해당 변수의 값이 몇 번 나오는지 빈도수를 변수의 값으로 사용
4. target encoding: 각각의 종이 갖는 타겟 변수의 평균으로 encoding.
    - frequency encoding, target encoding의 장점은 의미있는 값을 모델에 줄 수 있다는 점이다. 해당 두 경우 각각의 값을 수치로 바꿈으로써 하나의 컬럼에 모든 값을 표현할 수 있는 장점도 보존하면서, 순서의 영향을 받지 않는다는 장점도 있다. 하지만 target encoding의 경우 target 변수와 직접 연관되기 때문에 overfitting 문제가 생길 수 있다.
    - 서로 다른 종을 갖지만 encoding한 값이 같게 되어 종이 겹치는 문제 발생 가능.
    - 미래의 새로 등장하는 종에 대해서는 encoding할 수 없다.
5. embedding
    - aka. entity embedding
    - Word2Vec


# 2. 결측치 처리

## 2.1. pattern

### missing data patterns

random한 결측, rule이 있는 결측인지 확인.

특정 패턴이 존재하는 경우 반복적으로 발생하는 변수값과 동일한 값으로 결측치를 채운다. 하지만 패턴을 특정하기 어렵거나 랜덤으로 발생한 경우에 대해서는 Data point 를 제거 하는 방법, 해당 결측치가 발생한 변수의 평균값이나 중앙값을 삽입하는 방법, 특정 값으로 채우는 방법 등이 있다.

<br>

## 2.2. univariate단변량

1. 제거
2. 평균값 삽입
3. 중위값 삽입
4. 상수값 삽입

-> 문제점?

<br>

## 2.3. multivariate다변량

### model

1. 회귀분석
    - X1을 X2...Xn으로 예측, X2로 X1...Xn 예측 -> 반복
2. KNN nearest: mssing values are imputed with observed values randomly chosen from "similar" responding units. 결측치가 존재하는 샘플과 가장 유사한 샘플을 찾아서 해당 값을 이용해 결측치를 채우는 방식.

결측치가 많다면 시행하기 어렵고 데이터 크기에 따라 시간이 많이 소요되므로 적절한 판단 필요.


### 합리적 접근법

결측치의 값을 변수간의 의미를 보고 합리적으로 판단해 임의로 채우는 방법. eg. 강수량 데이터 -> 결측치 '0'으로 대체.

<br>

# 3. 이상치 처리

이상치는 잘못하면 모델의 성능에 큰 영향을 끼칠 수 있으므로 주의해 처리해야 한다.

## 3.1. 이상치란

다수의 분포와 동떨어진 outliers

<br>

## 3.2. 정성적인 측면

### 이상치 탐색

1. Z-score
2. IQR

<br>

## 3.3. 이상치 처리 관점

1. 정성적인 측면
    - 이상치 발생 원인 파악
    - 이상치의 의미 해석 -> 특정 원인을 별도 feature로 만들어 해결할 수도 있다(eg. 아파트 시공연도 vs. 실거래가 그래프에서 특정 연도에 재개발을 이유로 일부 아파트 가격이 비정상적으로 높게 나옴 -> 재개발 여부를 별도 feature로 만들어 해결)
2. 성능적인 측면
    - train test distribution
    - eg. 데이터를 차원축소해 2차원 scatter chart로 그린 후 train 데이터 test 데이터, z-score 데이터 비교 -> train 데이터와 z-score 방식으로 탐색한 이상치 데이터 간의 분포는 조금 겹치지만 test 데이터와는 잘 겹치지 않으므로 이상치를 제거함으로써 모델 성능 향상













