# 경사하강법

~~(순한맛)~~

## 미분이 뭔가요?

- 미분*diffentiation*은 ***변수의 움직임에 따른 함수값의 변화를 측정하기 위한 도구***로 최적화에서 제일 많이 사용하는 기법

`f'(x) = lim_(h->0) f(x + h) - f(x) / h`

미분은 변화율의 극한*limit*으로 정의합니다.

f(x) = x^2 + 2x + 3

`f'(x) = lim_(h->0) f(x + h) - f(x) / h` = `2x + 2 + h`

f'(x) = 2x + 2


```python
import sympy as sym
from sympy.abc import x

sym.diff(sym.poly(x**2 + 2*x + 3), x)
```


<br>

## 미분을 어디에 쓸까?

- 미분은 함수 f의 주어진 점 (x, f(x))에서의 ***접선의 기울기***를 구한다
- 한 점에서 접선의 기울기를 알면 어느 방향으로 점을 움직여야 함수값이 ***증가***하는지/***감소***하는지 알 수 있다.

미분을 계산하려면 함수의 모양이 매끄러워야(연속) 한다.

증가시키고 싶다면 미분값을 더하고, 감소시키고 싶으면 미분값을 뺀다.

미분값이 음수이면 x - f'(x) > x는 오른쪽으로 이동하여 함수값이 감소

미분값이 양수이면 x - f'(x) < x는 왼쪽으로 이동하여 함수값이 감소

- ***미분값을 더하면 경사상승법gradient ascent***이라 하며 함수의 ***극대값***의 위치를 구할 때 사용한다(목적함수를 최대화할 때 사용).
- ***미분값을 빼면 경사하강법gradient descent***이라 하며 함수의 ***극소값***의 위치를 구할 때 사용한다(목적함수를 최소화할 때 사용).
- 경사상승/경사하강 방법은 극값에 도달하면 움직임을 멈춘다

극값에선 미분값이 0이므로 더 이상 업데이트가 안 된다. 그러므로 목적함수 최적화가 자동으로 끝난다.






<br>

## 경사하강법: 알고리즘

```
input: gradient, init, lr, eps
output: var
---
# gradient: 미분을 계산하는 함수
# init: 시작점, lr: 학습율, eps: 알고리즘 종료조건
```

```python

var = init
grad = gradient(var)
while(abs(grad) > eps): # 컴퓨터로 계산할 때 미분이 정확히 0이 되는 것은 불가능하므로 eps보다 작을 때 종료하는 조건이 필요하다.
	var = var - lr * grad # 이 부분이 x - λf(x)을 계산하는 부분. lr은 미분을 통해 업데이트하는 속도 조절.
	grad = gradient(var)
```

주의: 학습율은 굉장히 조심히 다뤄야 한다!






<br>

## 변수가 벡터이면요?

- 미분(differentiation)은 변수의 움직임에 따른 함수값의 변화를 측정하기 위한 도구로 최적화에서 제일 많이 사용하는 기법이다.
- 벡터가 입력인 다변수 함수의 경우 편미분(partial differentiation)을 사용한다.

`∂_x_i f(x) = lim_(h->0) f(x + h * e_i) - f(x) / h`

e_i는 i번째 값만 1이고 나머지는 0인 단위벡터



f(x, y) = x^2 + 2xy + 3 + cos(x + 2y)

∂`_`x f(x, y) = 2x + 2y - sin(x + 2y)

```python
import sympy as sym
from sympy.abc import x

sym.diff(sym.poly(x**2 + 2*x*y + 3) + sym.cos(x + 2*y), x)
```

- 각 변수별로 편미분을 계산한 그레디언트 벡터(gradient vector)를 이용해 경사하강/경사상승법에 사용할 수 있다

`∇f = (∂_x1 f, ∂_x2 f, ..., ∂_x_d f)`

`... <- ∂_x_i f(x) = lim_(h->0) f(x + h * e_i) - f(x) / h`

`∇`: nabla. 다차원 미분의 기본이 되는 연산자이며, 사실 기호는 같지만 연산의 스칼라곱 · 벡터곱 여부, 연산 대상의 스칼라 · 벡터 여부에 따라 계산 방식이 달라지는 수학적 표기법(notation)이므로 주의해야 한다.

앞서 사용한 미분값인 f`(x) 대신 벡터 ∇f를 사용해 변수 x = (x_1, ..., x_d)를 동시에 업데이트할 수 있다.


<br>

f(x, y) = x^2 + 2y^2

-> ∇f = (2x, 4y)

그레디언트 벡터 ∇f(x, y)는 각 점(x, y)에서 ***가장 빨리 증가하는 방향***으로 흐르게 된다.

-∇f는 ∇(-f)랑 같고 이는 각 점에서 ***가장 빨리 감소하게 되는 방향***과 같다.



<br>

## 경사하강법: 알고리즘

```
input: gradient, init, lr, eps
output: var
---
# gradient: 그레디언트 벡터를 계산하는 함수
# init: 시작점, lr: 학습율, eps: 알고리즘 종료조건
```

```python

var = init
grad = gradient(var)
while(norm(grad) > eps): # 경사하강법 알고리즘은 그대로 적용된다. 그러나 벡터는 절대값 대신 노름(norm)을 계산해서 종료조건을 설정한다.
	var = var - lr * grad
	grad = gradient(var)











