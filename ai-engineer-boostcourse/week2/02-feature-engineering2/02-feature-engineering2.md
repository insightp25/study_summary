# 피처 중요도, 피처 선택

# 1. 피처 중요도*feature importance*란?

- 피처 중요도
  - 타겟 변수를 예측하는 데 얼마나 유용한지에 따라 피처에 점수를 할당해서 중요도를 측정하는 방법
- model-specific vs. model-agnostic
  - 머신러닝 모델 자체에서 피처 중요도 계산이 가능하다면 model-specific
  - 모델에서 제공하는 기능에 의존하지 않고 모델을 학습한 후에 적용되는 피처 중요도 계산 방법은 model-agnostic




<br>

# 2. boosting tree 피처 중요도

### model-specific method

## 2.1. LightGBM 피처 중요도

- LightGBM 피처 중요도 함수
  - training된 LightGBM 모델 클래스에 feature_importance(importance_type) 함수로 피처 중요도 계산 기능 제공
  - 인자의 importance_type 값에 'split' 또는 'gain' 사용 가능, 디폴트는 'split'
    - split: numbers of times the feature is used in a model. 트리를 만드는 데에 특정 피처가 얼마나 자주 사용되었냐를 나타낸다.
    - gain: total gains of splits which use the feature. 그 feature를 사용해서 split하는 데에 gain을 얻는 데에 얼마나 gain값이 나오는지를 계산하는 방식이다.




<br>

## 2.2. XGBoost 피처 중요도

- XGBoost 피처 중요도 함수
  - training된 XGBoost 모델 클래스에 get_score(importance_type) 함수로 피처 중요도 계산 기능 제공
  - 인자의 importance_type, 디폴트는 'weight'
    - 'weight': the number of. imes a feature is used to split the data accross all trees
    - 'gain': the average gain across all splits the feature is used in
    - 'cover': the average coverage accross all splits the feature is used in
    - 'total_gain': the total gain accross all splits the feature is used in
    - 'total_cover': the total coverage across all splits the feature is used in

모델 특성에 따라 feature 계산 방식이 다르기 때문에 같은 데이터셋의 피처 중요도 결과도 다르게 나올 수 있다.




<br>

## 2.3. CatBoost 피처 중요도

- CatBoost 피처 중요도 함수
  - training된 CatBoost 모델 클래스에 get_feature_importance(type) 함수로 피처 중요도 계산 기능 제공
  - 인자의 type, 디폴트는 FeatureImportance
    - FeatureImportance: equal to PredictionValuesChange for non-ranking metrics and LossFunctionChange for ranking metrics
    - ShapValues: a vector with contributions of each feature to the prediction for every input object and the expected value of the model prediction for the object
    - Interaction: the value of the feature interaction strength for each pair of features
    - PredictionDiff: a vector with contributions of each feature to the RawFormulaVal difference for each pair of objects







# 3. permutation 피처 중요도

### model-agnostic method

## 3.1. permutation 피처 중요도란?

- measure the importance of a feature by calculating the increase in the model's prediction error after permuting the feature
- a feature is "important" if shuffling its values increases the model error, because in this case the model relied on the feature for the prediction
- a feature is "unimportant" if shuffling its values leaves the model error unchanged, because in this case the model ignored the feature for the prediction

input: trained model f, feature matrix X, target vector y, error measure L(y, f).

1. estimate the original model error e^orig = L(y, f(X)) (eg. mean squared error)
2. for each feature j = 1, ..., p do:
  - generate feature matrix X^perm by permuting feature j in the data X. this breaks the association between feature j and true outcome y.
  - estimate error e^perm = L(Y, (X^perm)) based on the predictions of the permuted data.
  - calculate permutation feature importance FI^j = e^perm/e^orig. alternatively, the difference can be used: FI^j = e^perm - e^orig
3. sort features by descending FI.


<br>

## 3.2. permutation 피처 중요도 적용

https://scikit-learn.org/stable/modules/generated/sklearn.inspection.permutation_importance.html



<br>

# 4. 피처 선택이란?

## 4.1. 피처 선택*feature selection*이란?

- 피처 선택
  - 머신러닝 모델에서 사용할 피처를 선택하는 과정
  - 머신러닝 모델이 타겟 변수를 예측하는데 유용한 피처와 유용하지 않은 피처를 구분해서 유용한 피처를 선택하는 과정
  - 피처 선택을 통해 ***모델의 복잡도를 낮춤으로써 오버피팅 방지 및 모델의 속도 향상*** 가능
  - 피처 선택 방법
    - filter method
    - wrapper method
    - embedded method

## 4.2. 피처 선택의 방식

### filter method
- filter type methods select variables regardless of the model. they are based only on general features like the correlation with the variable to predict. filter methods suppress the least interesting variables. the other variables will be part of a classification or a regression model used to classify or to predict data. these methods are particularly effective in computation time and robust to overfitting.
- 통계적인 측정 방법을 사용해서 feature들의 상관관계를 알아내는 방식. 하지만 feature간의 상관계수가 반드시 모델에 적합한 feature라고는 할 수 없어서, 이 방식이 가장 좋은 방법이라고는 할 수 없지만 가장 간단하게 사용할 수 있는 방식 중 하나.
- 대신 계산 속도가 빠르고 feature간 상관관계를 알아내는 데에 적합하기 때문에 wrapper method를 사용하기 전에 전처리 하는 데에 보통 사용할 수 있다.

filter method의 대표적인 방법을 두 가지 정도로 보자면:

1. feature간 correlation을 계산해서, correlation이 굉장히 높은 feature들은 사실 같은 feature이라고도 볼 수 있기 때문에 둘 중에 feature 하나를 제거 방식

이 있고, 또 하나의 방식은

2. variance threshold란 방식으로 feature에 있는 data의 분산*variance*를 계산해서(variance가 작다면 feature 안의 값들이 비슷하다는 의미도 있기 때문에 사실 모델에서 label을 예측하는 데에 중요한 feature가 될 가능성이 낮다), 특정 값 이상인 feature들은 사용하고 variance가 낮은 값들은 사용하지 않는 방식

이 있다. 

set of all features -> selecting the best subset -> learning algorithm -> performance

https://en.wikipedia.org/wiki/Feature_selection#Filter_method

https://subinium.github.io/feature-selection/









<br>

## wrapper method

- wrapper methods evaluate subsets of variables which allows, unlike filter approaches, to detect the possible interactions amongst variables. the two main disadvantages of these methods are:
  - the increasing overfitting risk when the number of observations is insufficient
  - the significant computation time when the number of variables is large
- 예측 모델을 사용해서 feature의 subset을 계속 테스트하는 방식. 이 경우 기존 데이터에서 성능을 측정할 수 있는 hold-out 데이터셋을 따로 주어서 validation 성능을 측정할 수 있는 방법이 필요하다. subset을 계속 확인해서 어떤 feature가 중요한지 알아내는 방식.

https://en.wikipedia.org/wiki/Feature_selection#Wrapper_method

https://subinium.github.io/feature-selection/






<br>

## embedded method

- embedded methods have been recently proposed that try to combine the advantages of both previous methods. a learning algorithm takes advantage of its own variable selection process and performs feature selection and classification simultaneously.
- filter method와 wrapper method의 장점을 결합한 방식. 학습 알고리즘 자체에서 feature selection 기능이 들어가있는 방식

https://en.wikipedia.org/wiki/Feature_selection#Embedded_method

https://subinium.github.io/feature-selection/










<br>

# 5. 피처 중요도 코드 실습

(notebook 참고)





