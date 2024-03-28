# tree model

# 1. what is tree model

## 1.1. 트리 모델의 기초 의사결정나무


- 칼럼(feature) 값들을 어떠한 기준으로 group을 나누어 목적에 맞는 의사결정을 만드는 방법. 컬럼 값들을 어떠한 조건으로 그룹을 나누어 세분화하여 목적에 맞는 의사결정을 내리는 모델.

- 하나의 질문으로 yes or no로 decision을 내려서 분류


<br>

## 1.2. 트리 모델의 발전

Decision Tree -> Random Forest -> AdaBoost -> GBM -> LightGBM, XGBoost, CatBoost



<br>

## 1.3. Bagging & Boosting

여러 개의 decision tree를 이용하여 모델 생성.

- Random Forest는 bagging 방법의 대표적 기법.
- LightGBM, XGBoost, CatBoost는 boosting 기법들.

(bagging & boosting은 이후에 앙상블 섹션에서 다룬다)

- bagging과 boosting 모두 decision tree를 여러 개를 이용해 모델을 만드는 것
- bagging과 boosting의 차이점은 train 데이터를 어떻게 활용하느냐에 가장 큰 차이가 있다.


### decision tree

일련의 분류기준 설명후 데이터를 분류, 예측하여 일련의 규칙을 찾는 알고리즘.

특정 기준에 따라 데이터를 구분하는 모델을 데이터 결정 트리 모델이라 한다.

결정 트리에서 질문이나 정답은 노드로 표현.

### Bagging

- 데이터 셋을 샘플링(전체중 일부만 추출)하여 모델을 만들어 나가는 것이 특징
- 샘플링한 데이터 셋을 하나로 하나의 decision tree가 생성
- 생성한(여러 개의) decision tree들의 decision들을 취합(aggregation)하여 하나의 decision 생성

bagging = bootstrap + aggregation

bootstrap: data를 여러 번 sampling

aggregation: 종합(Ensemble)


### boosting

초기에 데이터셋을 랜덤하게 샘플링해 하나의 tree 생성 -> 잘 맞추지 못한 데이터들에 weight 부여 -> 다음 tree를 만들 때 영향을 주어 다음 번에는 잘 맞출 수 있게 한다.

### 종합

| |bagging|boosting|
|---|---|---|
|tree 생성 방법|병렬 모델(각 모델이 서로 연관이 없음)|순차적 모델(이전 tree의 오류반으로)|
|특징|다양한 tree 생성|정밀한 tree 생성|




<br>

## 1.4. LightGBM, XGBoost, CatBoost

XGBoost, CatBoost: 균형적 구조

LightGBM: 비균형적 구조





<br>

# 2. tree model with hyper-parameter

## 2.1. hyper-parameter 살펴보기

learning rate: 너무 작으면 수렴속도가 너무 느려지고, 너무 크면 수렴이 아닌 발산을 하게 된다. 적당한 값을 찾아야 모델이 제대로 학습할 수 있다.

트리 성장시키는 방법: 모델의 깊이depth와 잎leaves를 제한하는 방법이 있다. tree를 너무 깊게 만들거나, 잎을 제한없이 두면 overfitting이 될 수 있다.

column sampling ratio: 사용하는 feature들을 랜덤하게 선택되도록 해서 특정 feature에 overfitting되는 것을 방지. 각 차수마다 랜덤한 feature들로 트리를 여러개 생성한다

row sampling ratio: row를 기준으로 랜덤하게 선택해 tree를 여러개 생성. 특정 데이터에 overfitting되는 것 억제.

(05-01-boosting-hyper-parameters.png)


<br>

## 2.2. hyper-parameter 실습

### category 변수 다루기

- LightGBM과 CatBoost는 Pandas의 category 데이터 타입 가능
- XGBoost는 오직 numeric 데이터 타입만 가능하기 때문에, XGBosst에서 category 데이터는 따로 전처리 필요

plot metric으로 train log 확인 가능
plot tree로 tree 구조 확인 가능


<br>

## 2.3. baseline code(tree model train) 살펴보기

(notebook 참고)



<br>

# 3. baseline code(tree model train) 살펴보기

(notebook 참고)






