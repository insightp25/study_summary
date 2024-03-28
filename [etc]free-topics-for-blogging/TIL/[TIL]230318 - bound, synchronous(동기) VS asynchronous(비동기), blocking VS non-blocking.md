> 💡 동기? 비동기? block/non-block IO? 혼동할 수 있는 개념들에 대해 정리해보았다.

</br>

## bound
동기 비동기에 대해 논하기에 앞서 bound가 무엇인지 알아야 한다. bound는 한 마디로 작업 수행이 잠시 중단되는 것을 말한다. bound에는 CPU bound와 I/O bound가 있다.
* CPU bound: 복잡한 연산(매우매우 큰 수의 계산, 수 많은 횟수의 계산 등)으로 연산 수행 중 다른 작업을 못하고 연산이 완료될 때 까지 다른 코드 실행이 멈추는 것을 말한다.
* I/O bound: input과 output을 받기까지 대기상태로 다른 코드 실행을 할 수 없는 경우를 말한다.
  * input bound의 흔한 예로 컴퓨터 부팅시 로그인 화면을 들 수 있는데, 비밀번호 등을 입력할 때까지 다른 작업을 수행할 수 없게 된다.
  * output bound의 흔한 예로 http 네트워크에서의 request/response 과정에서 response를 받기까지 시간이 걸리는 경우를 들 수 있다. 데이터 통신상의 latency나 서버에서의 로직 처리등에 시간이 걸리게 되면 response도 결국 늦어지고, response를 받기 전까지는 작업을 더 진행할 수 없는 것이다. 
  * 흔히 I/O bound는 network I/O bound를 지칭하기도 한다.
</br>

## synchronous VS asynchronous
동기(synchronous)와 비동기(asynchronous)의 차이는 호출하는 함수와 호출된 함수 사이에서 '작업완료 여부를 어떤 쪽에서 신경쓰는지' 여부에 있다.
* synchronous: 함수를 호출한 후 리턴을 기다리거나, 리턴을 받지 않았더라도 함수를 호출한 쪽에서 호출한 함수 쪽의 작업 완료 여부를 계속 확인한다.
* asynchronous: 함수 호출 시 콜백을 함께 전달하고 이후 작업완료 여부를 신경쓰지 않는다. 호출된 함수가 작업을 완료하면 전달받았던 콜백을 실행해 작업 완료 여부를 알게된다.
</br>

## blocking VS non-blocking
blocking과 non-blocking의 핵심은 '제어권'에 있다.
* blocking: 함수 호출 시 제어권이 호출된 함수 쪽으로 넘어가며, 함수를 호출한 쪽에서 작업이 완료되고 다시 제어권을 돌려받을 때까지 다른 작업을 수행하지 못한다. 예를 들어 I/O가 발생 시 기본적으로 시스템콜을 하게되고 제어권이 커널로 넘어가 사용자는 다른 작업을 할 수 없게 된다.
* non-blocking: 함수 호출 후 제어권을 바로 돌려받아 다른 작업을 수행할 수 있게 된다.

</br>
</br>

## reference
- 윤상석. *파이썬 동시성 프로그래밍*. inflearn. https://www.inflearn.com/course/파이썬-동시성-프로그래밍/dashboard
- HomoEfficio. *Blocking-NonBlocking-Synchronous-Asynchronous*. https://homoefficio.github.io/2017/02/19/Blocking-NonBlocking-Synchronous-Asynchronous/