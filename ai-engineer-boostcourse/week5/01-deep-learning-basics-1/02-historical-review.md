# Historical Review

## historical review

- "deep learning's most important ideas - a brief historical review", Denny Britz, 2020-07-29

## 2012 - AlexNet

- 이전의 전통적 방식을 깬 새로운 시도
- 이후 전통적 방식이 딥러닝을 이길 수 없게 된다.

<br>

## 2013 - DQN

- (ATARI 핑퐁게임을 스스로 터득하게 함)
- Q-learning이라고 불리는 강화학습의 방법론을 이용해 딥러닝에 접목한 방법

<br>

## 2014 - encoder/decoder

- NMT(neural machine translation, 구글 번역 등에 들어감) 문제를 풀기 위한 방법
- 한 언어로 된 단어의 연속(sequence, 문장)이 주어졌을 때, 이를 어떻게든 표현해서 다른 언어로 된 단어의 연속으로 바꾸는 게 목적
- 이 이후 기계어 번역의 트렌드가 많이 바뀌게 되었다.

<br>

## 2014- Adam Optimizer

- 일반적으로 딥러닝 모델을 만들고 같은 데이터셋을 쓸 때 다양한 hyperparameter search를 한다. 어떤 optimizer를 쓸지, base learning rate은 어떻게 설정할지, scheduling은 어떻게 할지 등...이것들 설정에 따라 성능 좌우가 큰데, 이게 가능하려면 많은 computing resource가 필요하다.
- 예를 들어 구글의 경우 TPU를 1000개를 쓸 수 있다 -> 1000개의 각기 다른 configuration을 한 번에 써볼 수 있다 -> 보통 사람들은 기껏 해야 2~3개, 즉 한 번에 2~3개의 configuration 밖에 못 돌린다 ->
- Adam의 의의 -> '왠만하면 잘 된다'

<br>


## 2015 - generative adversarial network(GAN)

- neural network가 generator와 discriminator라는 걸 두 개를 만들어 학습을 시키는 것.


<br>

## 2015 - residual networks(ResNet)

- 굉장히 큰 의의가 있다. 이 연구 덕분에 딥러닝이 딥러닝이 가능해졌다. ResNet 이전에는 layer가 어느 정도 깊게 쌓이면 학습이 잘 안된다고 알려져 있었으나(학습 데이터의 성능은 좋아질 수 있으나 테스트 데이터 성능이 더 오르지 않는다).
- ResNet 이후에는 그 트렌드가 바뀌었다. 예를 들어 network를 20단을 쌓으면 성능이 잘 안나오던 것을 100단까지 쌓아도 학습 데이터가 아닌 테스트 데이터의 성능이 좋게 나오게 만든 것.
- network를 깊게 쌓을 수 있게 만들어 준 paradigm shift를 이끌어냄.


<br>

## 2017 - transformer

- paper: "attention is all you need"(by Google researchers)
- 기존 RNN들을 모두 대체하고 vision 분야도 넘보는 중

<br>

## 2018 - BERT(bidirectorial encoder representations from transformers, fine-tuned NLP models)

- 딥러닝의 paradigm shift에 있어서는 fine-tuned NLP models란 개념이 굉장히 중요. NLP는 보통 language model로 학습을 한다.
- 그런데 내가 풀고자 하는 문제가 있을 때, 예를 들어 내일 날씨 예측이나 뉴스 기사 작성 등을 한다고 할 때, 뉴스 기사를 위해선 뉴스 기사들이 데이터로 있어야 한다. -> wikipedia 등등 큰 말뭉치들을 활용해 pre-train을 하고 그 다음 내가 정말 풀고자 하는 문제의 소수의 데이터에 그 network를 fine-tuning 하겠다 라는 게 BERT. -> 이 이후 fine-tuned NLP models가 많이 등장하게 되었다.

## 2019 - large language models

- OpenAI GPT-3. BERT의 끝판왕 격. BERT와 다른 특징은 굉장히 많은 parameter로 구성돼있다는 점. 1750억 개 parameters.


<br>

## 2020 - self-supervised learning

- "SimCLR(simple framework for contrastive learning of visual representations, 2020)"이 포문을 열었다.
- 한정된 학습데이터를 주었을 때, 모델을 바꿔가며, 혹은 loss function을 바꿔가며 여러가지 다른 modification을 줘서 좋은 결과를 내는 것이 일반적인 방법이었다면 -> ***학습 데이터 외에*** label을 모르는 unsupervised data를 추가로 활용해 좋은 결과를 얻겠다는 것.
- 결국 이 논문에서 하고 싶었던 것은 visual representation, 즉, 어떻게 하면 이미지를 컴퓨터가 잘 이해할 수 있는 vector로 잘 바꿀지 이고 이것을 단순히 학습 데이터만 가지고 하는 것이 아닌 비지도학습/unsupervised data를 같이 활용해, 결과적으론 좋은 visual representation을 학습함으로써, 진짜 풀고자 하는 분류문제를 잘 풀겠다 라는게 논문의 흐름.

- SimCLR 외에 self-supervised learning 분야에서 또 한가지 다른 트렌드가 있는데: 풀고자 하는 문제에 대해 굉장히 잘 알고있고, 이 문제에 대한 고도화된 domain knowledge가 있을 때 data set을 오히려 만들어내는 것. self-supervised data sampling이라고 부르기도 한다.













