# 머신러닝 기본 개념 소개

# 1. underfitting & overfitting

## 1.1. what is underfitting & overfitting

fit이라는 표현은 데이터를 "잘" 설명할 수 있는 능력

- underfitting: 데이터를 설명하지 못함
- overfitting: 데이터를 과하게 설명함

일반적으로 많이 사용하는 방법으로는 우리의 데이터셋에서 전체의 데이터셋을 잘 설명할 수 있는 데이터셋을 추출하여 머신러닝 모델이 얼마나 잘 작동하는지 확인하는 방법이 있다.

<br>

## 1.2. how to monitor underfitting & overfitting

train 데이터셋과 validation 데이터셋의 depth vs. error 그래프에서 일정 구간부터 train에 사용되지 않은 데이터셋의 error가 높아지는데, 그 곳을 기준으로 현재 모델이 overfit인지 underfit인지를 설명할 수 있다.

데이터셋을 구성하는 방법에 따라 머신러닝 모델의 성능과 일반화, 새로운 데이터셋에서도 잘 작동하는 모델을 만들 수 있다.

<br>

## 1.3. regularization

underfitting을 방지하는 방법에는 더 많은 데이터로 더 오래 훈련시키거나, feature를 더 많이 반영하거나, variance가 높은 머신러닝 모델을 사용하는 방법등이 있다.

overfitting을 제어하기 위한 방법들에는 아래와 같은 아래의 regularization 방법론들이 있다. 모델이 노이즈 데이터에 민감하게 반응하지 않게 규제하는 것.

- early stopping: DL 모델에 사용하는 방법과 유사. validation error가 지속 증가하는 지점에서 멈추는 것. 이걸 '트레이드오프 관계'에 있다고 표현하기도 하는데, 최적의 결과를 찾는 과정이라고 생각하면 된다.
- parameter norm penalty: 이 또한 정형데이터 분석에서 DL 모델의 그것과 유사하게 이용할 수 있다.
- data augmentation: 원본 이미지를 회전, 뒤집기, 확대, 축소해 데이터 갯수를 늘린다. 데이터를 의도적으로 증강시켜 머신러닝 모델에게 다양한 경험을 할 수 있도록 하는 것.
    - SMOTE: 정형데이터 분석에서 SMOTE라는 방법을 사용한다. 주로 imbalanced한 데이터를 처리할 때 많이 사용하는 기법. 모든 데이터에 대해 증강하는 것이 아닌 imbalance한 데이터를 대상으로 수행하는데 먼저 imbalance한 데이터를 찾아 기준으로 설정하고, 기준으로 되어있는 데이터 근처의 데이터를 찾는다. 기준 데이터와 근처 데이터 사이에 데이터 생성하는 방식으로 데이터 증강.
- noise robustness
- label smoothing
- dropout: DL 에서 무작위로 노드간 연결을 끊는다. 모든 feature를 사용하는 것이 아닌 일부만 사용해 모델 생성.
    - pruning가지치기: 정형데이터 모델에서의 표현. 비유로 볼 때 트리 모델에서 자라나지 못하거나 썩은 나무가지를 가지치기해서 잘 자라게 하는 기법. 하나의 모델 생성시 모든 컬럼을 생성하는 것이 아닌 랜덤하게 컬럼을 샘플링해서 구현.
- batch normalization

<br>

# 2. validation strategy

## 2.1. what is validation strategy

### test 데이터셋

가장 중요. 최대한 전체 데이터셋을 대표할 수 있으면 좋다. test 데이터셋 변경은 분석 프로젝트를 지우게 되는 것만큼 위험한 행동이며 지속적으로 바꾸는 것은 부적절하다. 그렇기 때문에 비교적 합리적으로 변경이 가능한 validation 데이터셋을 제어하는 것이 이상적.

### validation 데이터셋

주요 목적: 만들고 있는 머신러닝 모델을 테스트 데이터셋에 적용하기 전에 모델의 성능을 파악하기 위함. 이를 이용해 regularization 기법들을 사용할 수 있다.

test 데이터셋과 최대한 유사하게 구성하는 것이 좋다.

test 데이터셋을 얻을 수 없는 경우에는?(eg. 미래 주가)

좋은 validation 데이터셋을 만들기 위해선 프로젝트/해결하려는 문제의 배경을 파악하고 이를 바탕으로 전체 데이터셋과 유사한 데이터셋을 만드는 것.

eg. 전체의 데이터가 모바일과 웹으로부터 얻어진 것이 있는 상황이며, 프로젝트의 목적이 모바일에서 제공되는 것이 목적인 서비스라고 하면, 모바일로부터 얻은 데이터가 더 가치가 있게 된다. 이를 바탕으로 모바일 데이터 비율을 크게해 validation 데이터셋을 구성하는 방법이 있다.


### train 데이터셋

머신러닝 모델이 보고 학습하는 데이터셋. train 데이터는 validation 데이터셋의 나머지 모든 데이터셋으로 자연스럽게 정해진다. 하지만 확보 데이터의 품질에 따라 노이즈 데이터를 train 데이터셋에 포함할지 여부를 고민해볼 수 있다(앞서 이상치 데이터 소개내용과 유사).

<br>

## 2.2. hold-out validation

하나의 validation 데이터셋을 고정한다는 의미로, 하나의 train과 하나의 validation을 사용하는 방법이다. 만약에 나눌때 클래스의 비율을 고려하지 않으면 imbalance한 데이터가 몰릴 수 있으니 주의해야 한다.

1. random sampling
2. stratified split: 가장 일반적. 특정 값, 데이터, 혹은 레이블의 카테고리 각 feature의 비율을 유지하며 데이터셋 split한다. 보통 8:2 비율이 일반적이나 데이터가 많을시 9:1 혹은 test를 더 많이 하면 7:3으로도 split 할 수 있다. scikit-learn에서 `stratified` 옵션을 사용해 구현할 수 있다.

<br>

## 2.3. cross validation

train, validation 셋을 여러개로 구성. k-fold 방식.

cross validation에서도 hold-out validation의 두 가지 모든 방식이 존재(eg. stratified k-fold). 

stratified k-fold: 분류문제에서는 클래스별로 비율을 유지시켜야 보통 모델의 성능이 좋기 때문에 stratified k-fold가 적합. 마찬가지로 8:2 비율 많이 사용.

group k-fold: 그룹들을 하나의 덩어리로 생각해 train과 validation을 나눌 때 뭉쳐있게 구성. 같은 그룹이 동일한 폴더에 들어가지 않도록 split을 하는 방식. group 수가 fold 수보다 커야 가능.

time series split: serial 데이터의 경우 데이터의 순차 시간을 고려해 validation set을 선정. 미래데이터로 과거 데이터를 예측하지 않도록 하기 위함. 앞쪽 fold일수록 데이터셋 크기가 작을 수 있다는 점 감안해야.

<br>

# 3. reproducibility모델 재현성

## 3.1. fix seed

cross validation 기법들 또한 실행시마다 다르게 샘플링되므로 모델 성능이 매번 다르게 나오는데, 하지만 반복해 실행시 똑같은 조건에서 반복해 샘플링돼야 모델 성능을 정확히 측정할 수 있는데, 그러기에 재현성이 필요하다.

또한 머신러닝 모델 또한 랜덤하게 작동하므로 이전 작업 보관이 어렵다. 머신러닝의 랜덤성 때문에 풀고자 했던 문제의 데이터가 매번 바뀌게 되면 모델의 성능을 측정했을 때 feature나 전처리 방법들이 효과적인지 확인하기 어렵게 된다. 그래서 랜덤성을 제거하는 절차가 필요한데, 이를 위해 seed 고정이 필요하다.

numpy, tensorflow 등에서 seed를 고정하는 방법이 있다. seed를 고정함으로써 머신러닝에게 했던 feature engineering이나 model parameter handling 등의 작업이 유의미한 행동이었는지 여부를 validation 데이터의 성능으로 판단해서, 만들고 있는 머신러닝 모델을 더 가치있게 만들 수 있다.




# 4. machine learning workflow

1. raw data에서 data 추출

2-1. 데이터 준비: data processing, feature engineering, feature scaling, feature selection
2-2. machine learning algorithm 선택

3. modeling
4. evaluation
5. iteration(back to 2-1)

데이터 준비 과정이 가장 중요한 단계이다. 신뢰도 높으며 정확한 데이터를 기반으로 훈련된 모델이 없다면 프로젝트 실패 가능성이 높기 때문. 엔지니어가 불리한 또는 오류 데이터를 모델에 입력해 훈련시킨다면 의미있는 결과를 도출해낼 수 없고, 모델의 비정상적인 작동에 많은 시간이 소요될 수 있기에 준비과정이 가장 중요하다.