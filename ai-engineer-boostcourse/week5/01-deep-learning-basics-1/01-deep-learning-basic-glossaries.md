# 딥러닝 기본 용어 설명

## introduction

- disclaimer
- what makes you a good deep learner?
  1. implementation skills - PyTorch, TensorFlow...아이디어를 실제로 돌려보고 결과를 뽑아낼 수 있는 스킬
  2. math skills(linear algebra, probability)
  3. knowing a lot of recent papers

artificial intelligence > machine learning > deep learning

- key components of deep learning
  1. the ***data*** that the model can learn from
  2. the ***model*** how to transorm the data
  3. the ***loss*** function that quantifies the badness of the model
  4. the ***algorithm***(optimization algorithm) to adjust the parameters to minimize the loss

<br>

## data
- data depend on the type of the problem to solve
  - eg. classification, semantic segmentation, detection, pose estimation, visual QnA

<br>

## model

- 같은 task가 주어졌어도 모델의 성질에 따라서 좋은 결과가 나올 수도, 안 나올 수도 있다.
- eg. AlexNet, GoogLeNet, ResNet, DenseNet, LSTM, Deep AutoEncoders, GAN...


<br>

## loss

- the loss function is a proxy of what we want to achieve
- 모델이 정해져 있고 데이터가 정해져 있을 때, 이 모델을 어떻게 학습할지이다.
- eg. 
  - regression task: MSE(mean squared erro)
  - classification task: CE(cross entropy)
  - probabilistic task: MLE(maximum likelihood estimation)

<br>

## optimization algorithm

- eg. dropout, early stopping, k-fold validation, weight decay, batch normalization, mixup, ensemble, bayesian optimization

<br>
<br>


