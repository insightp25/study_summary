# feature engineering 1

> feature engineering은 원본 데이터로부터 도메인 지식 등을 바탕으로 문제를 해결하는데 도움이 되는 feature를 생성, 변환하고 이를 머신러닝 모델에 적합한 형식으로 변환하는 작업

딥러닝이 아닌 일반 머신러닝에서는 모델의 성능을 올리는 데에 가장 중요한 핵심적인 단계. 딥러닝은 end-to-end만으로 딥러닝 모델 구조를 통해 data feature를 딥러닝 모델이 알아서 찾아내지만, 일반 머신러닝 알고리즘은 사람이 직접 데이터에 대해 이해해서 feature를 만들어 줘야 한다.

(강사님의 임상경험상)양질의 데이터가 주어진다면 일반 머신러닝 성능의 8~90%는 거의 feature engineering으로 결정. 나머지는 hyper-parameter 튜닝 등 부수적인 요소에 의해 결정. **그만큼 중요한 단계이다!!**



<br>

# 1. Pandas group by aggregation을 이용한 feature engineering

원본 데이터에서 주어진 feature에 고객 id 기반으로 Pandas group by aggregation 함수를 적용해 새로운 feature 생성





<br>

## 1.1. group by aggregation feature generation

EDA를 위한 feature 생성 코드

각 feature마다 aggregation후 해당 feature의 분포가 label이 0이 되는 경우와 1이 되는 경우의 차이를 비교, 해당 feature가 label의 분류에 유효한 영향을 미치는지 확인.

- 실습에선 고객당 연 총 구매율이 300만원 이하일 경우 0, 이상일 경우 1로 labelling

(notebook 참고)





<br>

# 2. cross validation을 이용한 out of fold 예측

모델 training시 cross validation을 적용해 out of fold validation 성능 측정 및 test 데이터 예측을 통해 성능 향상

(notebook 참고)

(02-01-01-cross-validation-out-of-fold-prediction.png)






<br>

# 3. lightGBM early stopping 적용

- early stopping이란?
  - iteration을 통해 반복학습이 가능한 머신러닝 모델에서 validation 성능 측정을 통해 validation 성능이 가장 좋은 하이퍼파라미터에서 학습을 조기 종료(early stopping)하는 regularization 방법
  - 예) boosting 트리 모델 트리 개수, 딥러닝의 epoch 수

- lightGBM early stopping
  - lightGBM에서 몇 개의 트리를 만들지 n_estimators란 하이퍼파라미터로 설정하고 이 개수만큼 트리를 만들지만, 설정한 트리 개수가 최적의 값이라고 볼 수 없음
  - early stopping은 validation 데이터가 있을 시, LightGBM 트리 개수인 n_estimators는 충분히 크게 설정하고, early_stopping_rounds를 적절한 값으로 설정
  - 트리를 추가할때마다 validation 성능을 측정하고 이 성능이 early_stopping_rounds 값 이상 연속으로 성능이 좋아지지 않으면 더 이상 트리를 만들지 않고 가장 validation 성능이 좋은 트리 개수를 최종 트리 개수로 사용





<br>

# 4. baseline code 살펴보기

(notebook 참고)














<br>
<br>

---

# feature engineering 2

# 1. Pandas group by 누적합을 이용한 feature engineering

원본 데이터에서 주어진 feature에 고객 id, 상품 id, 주문 id 기반으로 Pandas group by 누적합(cumsum) 함수를 적용해 새로운 feature 생성





<br>

# 2. 주문, 상품 데이터를 활용한 feature engineering

(notebook 참고)








<br>

# 3. time series 특성을 이용한 feature engineering

(notebook 참고)

