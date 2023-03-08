> 💡 TCP와 UDP는 네트워크에서 데이터의 전송, 수신에 관한 규약(protocol)이다. TCP는 데이터 통신에 있어 다양한 제어기능과 절차를 규정하여 통신의 정확성과 신뢰성을 보증한다. UDP는 TCP의 규약과 절차 중 일부를 생략하여 데이터의 정확성을 희생하는 대신, (일반적으로)보다 빠른 데이터 송신을 보증한다.

<br></br>
## TCP(transmission control protocol)
![](https://velog.velcdn.com/images/rmndr/post/6227f50c-2612-4fef-b6c2-bffa64f8431a/image.png)

- 데이터 신뢰성 보장
- 느린 전송 속도
- 데이터를 패킷이라는 단위로 쪼개 TCP Header 추가, 전송
- connection-oriented, 3 way-handshake를 통한 연결, 양방향 통신
- 흐름 제어(flow control-순차 전송), 혼잡 제어(contgestion control), 오류 감지(error detection)

<br></br>
## UDP(user datagram protocol)
![](https://velog.velcdn.com/images/rmndr/post/d3976903-b3b2-4d86-b547-0445e78caa19/image.png "UDP Header")

- 데이터 신뢰성을 보장하지 않음
- 빠른 전송 속도
- 데이터를 쪼개지 않고 UDP Header만 추가, 통째로 전송
- connectionless
<br></br>
<br></br>
<br></br>
## reference
- Peter L Dordal, "An Introduction to Computer Networks", 2011, https://intronetworks.cs.luc.edu/1/html/udp.html