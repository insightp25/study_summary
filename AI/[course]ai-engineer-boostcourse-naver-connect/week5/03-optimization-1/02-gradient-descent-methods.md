# gradient descent methods

## gradient descent methods

- stochastic gradient descent
  - update with the gradient computed from a single sample
  - 10만 개 데이터가 있으면 한 번에 한 개의 gradient만 구하고 gradient를 업데이트하고, 또 한 개를 구하고 업데이트하고...를 반복하는 것.
- mini-batch gradient descent
  - update with the gradient computed from a subset of data
  - 일반적으로 64~256개를 배치로 묶어 gradient를 구하고 업데이트하고 반복
- batch gradient descent
  - update with the gradient computed from the whole data
  - 한 번에 모든 데이터에 대한 gradient를 구함


<br>

## batch-size matters

- "it has been observed in practice that when using a larger batch there is a degradation in the quality of the model, as measured by its ability to generalize."
- "we ... present numerical evidence that supports the view that large batch methods tend to converge to sharp minimizers of the training and testing functions. in contrast, small-batch methods consistently converge to flat minimizers...this is due to the inherent noise in the gradient estimation."
- batch size를 줄이면 일반적으로 generalization performance가 좋아진다는 것을 실험적으로 보임.
- 논문 추천: on large-batch training for deep learning generalization gap and sharp minima, 2017



<br>

## gradient descent methods

- stochastic gradient descent
- momentum
- nesterov accelerated gradient
- adagrad
- adadelta
- RMSprop
- Adam
















