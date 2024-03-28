# 최적화의 주요 용어 이해하기

최적화는 사실 여기에서 모두 다루기엔 너무 큰 주제. 최적화에는 제일 기본적인 convex optimization, non-convex optimization, gradient free optimization 등 다양한 종류가 있고 각 분야에 대해 학습할 내용도 각각이 한 학기 분량일 정도로 많다. 여기서는 간단하게만 다룬다.

## introduction

- "language is the source of misunderstandings" - Antoine de Saint-Exupery
  - 최적화의 용어들에 대해 정확하게 짚고 넘어가지 않으면 뒤에 가서 많은 오해가 생길 수 있다. 협업시에도 큰 문제 발생가능.
- gradient descent
  - first-order iterative optimization algorithm for finding a local minimum of a differentiable function
  - local minimum: 이 loss function을 최소화시킬 수 있는 파라미터가 여러 곳에 있을 수 있다. 여러 파라미터들이 존재할 수 있는데 그 중에서 국소적으로 봤을 때 local minimum만 찾을 수 있다, local minimum을 찾는게 목적이다.


<br>

## important concepts in optimization

- generalization
- under-fitting vs. over-fitting
- cross validation
- bias-variance tradeoff
- bootstrapping
- bagging and boosting


<br>

## 일반화generalization

- how well the learned model will behave on unseen data


<br>

# cross-valication

- cross-validation is a model validation technique for assessing how the model will generalize to an independent (test) data set.


<br>

# bias and variance tradeoff

- variance: 어떤 비슷한 입력들을 넣었을 때 출력이 얼마나 일관되게 나오는지. variance가 큰 모델은 비슷한 입력이 들어와도 출력이 많이 달라진다. -> overfitting 가능성 증가
- bias: target으로 부터 얼마나 벗어나있는가
- we can derive that what we are minimizing (cost) can be decomposed into three different parts: bias, variance, and noise. 학습데이터에 노이즈가 껴있다고 가정을 했을 때 이 노이즈가 껴있는 타겟데이터를 최소화하는 데엔 세 가지 파트로 나뉠 수 있다. 최소화하려는 값이 사실은 하나가 아닌 세 가지 component로 이루어져 있어 이 세 개 중 하나를 최소화하면 다른 게 커질 수 밖에 없다.
- 그래서 cost를 최소화한다는 건 사실은 bias, variance, noise를 최소화한다는 것과 같다(다만 한 요소가 다른 요소에 영향을 미침).


<br>

## bootstrapping

- any test or metric that uses random sampling with replacement
  - eg. 학습 데이터가 100개가 있으면 전부가 아닌 일부 subset을 만들어 활용하는 것. 예로 80개를 랜덤으로 뽑아서 데이터셋 하나 만들고 다시 80개를 뽑아서 또 하나를 만들고 하는 식. 그렇게 여러 개의 모델을 만들 수 있다. 
- 그렇게 만든 모델이 있을 때 하나의 입력에 대해 각각의 모델이 모두 같은 값을 예측할 수도 있지만, 다른 값을 예측할 수도 있다. 이 모델들이 예측하는 값들의 consensus, 즉 얼마나 일치를 이루는지 보고 전체적인 모델의 uncertainty를 예측하고자 할 때 bootstrapping 활용.


<br>

## bagging vs. boosting

- bagging(bootstrapping aggregating)
  - multiple models are being trained with bootstrapping
  - eg. base classifiers are fitted on random subset where individual predictions are aggregated(voting or averaging).
  - 캐글 등에서 앙상블을 기본적으로 많이 사용하는데 앙상블 사용시 bagging을 같이 사용하는 경우가 많다.

- boosting
  - it focuses on those specific training samples that are hard to classify
    - eg. 100개의 데이터가 있으면 80개와 20개의 subset을 만들고 80개와 20개에 학습 및 테스트를 해본다. 20개에 대해 만약 예측이 정확하지 않으면 모델을 하나 더 만들어 20개의 데이터에 대해서만 잘 동작하는 모델을 만든다. 이렇게 여러 개의 모델을 만들어 이 모델을 합친다. 합칠 때 여러 개의 독립적인 모델을 보고 n개의 결과를 뽑는 게 아니라, 하나하나의 모델들(weak learners라고 부른다)을 sequential하게 합쳐서 하나의 strong learner를 만드는 것.
  - a strong model is built by combining weak learners in sequence where each learner learns from the mistakes of the previous weak learner

- bagging: parallel vs. boosting: sequential



















