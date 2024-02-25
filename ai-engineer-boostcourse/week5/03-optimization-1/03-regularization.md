# regularization

일종의 규제를 건다는 말인데, 학습에 반대되도록 무언가 규제를 건다. 엄밀히 말하면 학습을 방해하는 게 목적인데 그냥 학습을 방해하면 사실 의미가 없다. 학습을 방해함으로써 얻는 이점은 학습데이터에서만 잘 동작하는 것이 아니라 테스트 데이터에도 잘 동작할 수 있게 만드는 것.

## regularization

- early stopping
- parameter norm penalty
- data augmentation
- noise robustness
- label smoothing
- dropout
- batch normalization



<br>

## early stopping

- additional validation data can be used to do early stopping.
- trainig에 활용하지 않은 데이터셋에 지금까지 학습된 모델 성능을 평가해보고 loss를 보고 그 loss가 어느 시점부터 커지기 시작할 가능성이 큰데, 그 때 멈추는 것. 이를 위해선 당연히 새로운 validation data가 필요하게 되는 것.



<br>

## parameter norm penalty

(aka. weight decay)

- adds smoothness to the function space
- network parameter가 너무 커지지 않게 하는 것.
- 가정: 부드러운 함수일수록 generalization performance가 높을 것이다 하는 가정을 갖는 것.



<br>

## data augmentation

- more data are always welcomed
- 데이터가 무한히 많으면 왠만하면 성능이 다 잘 나온다.
- 데이터가 적을 때는 딥러닝보다 gradient boost, random forest, svm 이런 방법들이 더 잘될 때가 많았다. 실제로 지금 아무리 딥러닝을 잘 해도 데이터셋이 100개 밖에 없다고 하면 딥러닝이 안 될 가능성이 굉장히 높다.
- 그런데 데이터셋이 어느 정도 이상 커지게 되면 기존의 ML에서 사용하던 방법론들이 많은 수의 데이터를 표현하기에 부족해진다. -> DL로 자료를 표현하되 부족한 데이터를 증강한다.



<br>

## noise robustness

- add random noises inputs or weights



<br>

## label smoothing

- mix-up constructs augmented training examples by mixing both input and output of two randomly selected training data.
- 증강과 비슷. 단, 두 가지 혹은 이상의 데이터를 서로 섞는다. eg. 강아지 고양이 60:40 비율로 cut mix, cut out, mix up(들이는 노력 대비 성능을 많이 올릴 수 있다) 등 수행.
- CutMix constructs augmented training examples by mixing inputs with cut and paste and outputs with soft labels of two randomly selected training data.




<br>

## dropout

- in each forward pass, randomly set some neurons to zero.




<br>

## batch normalization

- batch normalization compute the empirical mean and variance independently for each dimension(layers) and normalize
- there are different variances of normalizations
- 왜 이게 잘되는지 해석보다 간단한 분류 문제를 푸는 데에 있어서는 batch normalization을 활용하는게 많은 경우 성능을 올릴 수 있다.



<br>

















