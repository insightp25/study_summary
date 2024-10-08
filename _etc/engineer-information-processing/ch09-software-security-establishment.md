# 9장. 소프트웨어 개발 보안 구축

# GROUP-A

## 256 소프트웨어 개발 보안 요소

소프트웨어 개발 보안 요소는 소프트웨어 개발에 있어 충족시켜야 할 요소 및 요건을 의미하며, 기밀성, 무결성, 가용성을 보안의 3대 요소라 한다.

### 기밀성confidentiality
- 시스템 내의 정보와 자원은 인가된 사용자에게만 접근이 허용된다.
- 정보가 전송 중에 노출되더라도 데이터를 읽을 수 없다.

### 무결성integrity
시스템 내의 정보는 오직 인가된 사용자만 수정할 수 있다.

### 가용성availability
인가받은 사용자는 시스템 내의 정보와 자원을 언제라도 사용할 수 있다.

### 인증authentication
- 시스템 내의 정보와 자원을 사용하려는 사용자가 합법적인 사용자인지를 확인하는 모든 행위이다.
- 대표적 방법: 패스워드, 인증용 카드, 지문 검사 등

### 부인 방지non-repudiation
데이터를 송수신한 자가 송수신 사실을 부인할 수 없도록 송수신 증거를 제공한다.




<br/><br/>

---

## 258 SQL 삽입

- SQL 삽입(injection)은 웹 응용 프로그램에 **SQL을 삽입하여** 내부 데이터베이스DB 서버의 **데이터를 유출 및 변조하고, 관리자 인증을 우회하는 보안 약점**이다.
- 동적 쿼리에 사용되는 입력 데이터에 예약어 및 특수문자가 입력되지 않게 필터링 되도록 설정하여 방지할 수 있다.




<br/><br/>

---

## 267 IDEA

- 스위스의 Lai와 Messey는 1990년에 개발한 PES를 발표하고, 이후 이를 개선한 IPES를 발표하였다.
- PES를 개선한 IPES는 128비트 길이의 key를 사용하여 64비트 블록을 암호화하는 알고리즘이며 현재는 IDEA(International Data Encryption Algorithm)라고 불린다.



<br/><br/>

---

## 268 Skipjack

- Skipjack은 **국가 안전 보장국(NSA)에서 개발한 암호화 알고리즘**이다.
- Clipper Chip이라는 IC 칩(integrated circuit직접 회로 칩)에 내장되어 있다.
- 블록 크기 64비트, 키 길이 80비트
- 주로 음성 통신 장비에 삽입되어 음성 데이터를 암호화




<br/><br/>

---

## 269 DES

- DES(data encryption standard): 1974년 IBM이 개발하고 1975년 미국 NBS에 의해 미국 국가 표준으로 발표한 개인키 암호화 알고리즘
- 블록 크기 64비트, 키 길이 56비트, 16회 라운드 수행
- DES를 3번 적용하여 보안을 더욱 강화한 3DES가 있다.
- 컴퓨터 기술 발달로 해독이 쉬워지면서 미국의 국가 표준이 AES로 대체





<br/><br/>

---

## 270 AES
- AES(advanced encryption standard): 2001년 미국 표준 기술 연구소(NIST)에서 발표한 개인키 암호화 알고리즘
- DES의 한계로 NIST에서 공모 후 발표
- 블록 크기 128비트, 키 길이에 따라 AES-128, AES-192, AES-256으로 분류





<br/><br/>

---

## 272 TKIP

- TKIP(temporal key integrity protocol): 기존의 무선 랜 보안 프로토콜인 **WEP의 취약성을 보완한 데이터 보안 프로토콜**
- 임시 키 무결성 프로토콜이라고도 한다.
- 암호 알고리즘의 입력 키 길이를 128비트로 늘리고 패킷당 키 할당, 키값 재설정 등의 키 관리 방식을 개선




<br/><br/>

---

## 275 MD5

- MD5(message digest algorithm 5): 1991년 R. Rivest가 MD4를 대체하기 위해 고안한 암호화 해시 함수
- 블록 크기 512비트, 키 길이 128비트
- 각각의 512 비트짜리 입력 메시지 블록에 대해 차례로 동작한다. 각 512비트 입력 메시지 블록 처리 후 128비트 스테이트(state)의 값이 변하는 암호화 알고리즘




<br/><br/>

---

## VPN

- VPN(virtual private network, 가상 사설 통신망): 인터넷 등 통신 사업자의 **공중 네트워크와 암호화 기술을 이용하여 사용자가 마치 자신의 전용 회선을 사용하는 것처럼 해주는 보안 솔루션**
- VPN을 사용하면 두 장치 및 네트워크 사이에 암호화된 보안 터미널이 생성되며, 터널에 사용되는 프로토콜에 따라 SSL VPN과 IPSec VPN으로 불린다.
  - SSL VPN: PC에 VPN client 프로그램을 설치하여 VPN 서버에 접속하는 방식으로, 암호화를 위해 SSL 프로토콜 사용
  - IPSec VPN: VPN 서버가 설치된 각각의 네트워크를 서로 연결하는 방식으로, 암호화를 위해 IPSec 프로토콜을 사용함





<br/><br/>

---

## SIEM

- SIEM(security information and event management): 다양한 장비에서 발생하는 **로그 및 보안 이벤트를 통합하여 관리하는** 빅데이터 기반의 **보안 솔루션**
- 방화벽, IDS, IPS, 웹 방화벽, VPN 등에서 발생한 로그 및 보안 이벤트를 통합하여 관리함으로써 비용 및 자원 절약 가능
- 장기간의 로그 및 보안 이벤트를 수집 및 검색할 수 있는 빅데이터 기반의 통합 로그 수집 시스템이다.




<br/><br/>

---

## SSH

- SSH(secure shell): **다른 컴퓨터에 로그인, 원격 명령 실행, 파일 복사 등 작업을 수행할 수 있도록 다양한 기능을 지원하는 프로토콜** 또는 이를 이용한 응용 프로그램
- 데이터 암호화와 강력한 인증 방법으로 보안성이 낮은 네트워크에서도 안전하게 통신할 수 있다.
- 키(key)를 통한 인증 방법을 사용하려면 사전에 클라이언트의 공개키를 서버에 등록해야 한다.
- 기본적으로 22번 포트 사용





<br/><br/>

---

## 정보보호 관리 체계

- 정보보호 관리 체계(ISMS, information security management system): **정보 자산을 안전하게 보호하기 위한 보호 절차와 대책**
- 조직에 맞는 정보보호 정책을 수립하고, 위험에 상시 대응하는 여러 보안 대첵을 통합 관리, 운용한다.
- 우리나라에서는 정보보호 관리 체계를 평가하고 인증하는 사업을 한국인터넷진흥원(KISA)에서 운영하고 있다.




<br/><br/>

---

## LAND attack
- LAND attack(local area network denial attack): **패킷을 전송할 때 송신 IP 주소와 수신 IP 주소를 모두 공격 대상의 IP 주소로 하여** 공격 대상에게 전송하는 것
- 이 패킷을 받은 공격 대상은 송신 IP 주소가 자신이므로 자신에게 응답을 수행하게 되는데, 이러한 패킷이 계속해서 전송될 경우 **자신에 대해 무한히 응답하게 하여 컴퓨터의 실행속도를 느리게 하거나 동작을 마비시켜 서비스 거부 상태에 빠지도록 하는 공격 방법**
- 수신되는 패킷 중 출발지 주소 또는 포트와 목적지 주소 또는 포트를 검사하여 동일한 패킷들을 차단, 공격을 피할 수 있다.




<br/><br/>

---

## 세션 하이재킹

- 세션 하이재킹(session hijacking): **상호 인증 과정을 거친 후 접속해 있는 서버와** 서로 접속되어 **클라이언트 사이의 세션 정보를 가로채는 공격 기법**
- 접속을 위한 인증 정보 없이도 가로챈 세션을 이용해 공격자가 원래의 클라이언트인 것처럼 위장하여 서버의 자원이나 데이터를 무단으로 사용
- TCP 3-way-handshake 과정에 끼어듦으로써 클라이언트와 서버 간의 동기화된 시퀀스 번호를 가로채 서버에 무단으로 접근하는 TCP 세션 하이재킹이 대표적인 예이다.





<br/><br/>

---

## ARP 스푸핑

- ARP 스푸핑(ARP spoofing): ARP의 취약점을 이용한 공격 기법. **자신의 물리적 주소(MAC)을 공격대상의 것으로 변조**하여 공격 대상에게 도달해야 하는 **데이터 패킷을 가로채거나 방해하는 기법**
  - ARP(address resolution protocol): 호스트의 IP 주소를 호스트와 연결된 네트워크 접속 장치의 물리적 주소(MAC address)로 변환해주는 프로토콜




<br/><br/>

---

## 사회 공학social engineering

컴퓨터 보안에 있어서 **인간 상호 작용의 깊은 신뢰를 바탕으로** 사람들을 속여 정상 보안 절차를 깨트리기 위한 비기술적 **시스템 침입 수단**이다.




<br/><br/>

---

## 다크 데이터dark data

특정 목적을 가지고 데이터를 수집하였으나, 이후 **활용되지 않고 저장만 되어있는 대량의 데이터**






<br/><br/>

---

## 타이포스쿼팅typosuqatting

- 네티즌들이 사이트에 접속할 때 **주소를 잘못 입력**하거나 철자를 빠뜨리는 **실수를 이용하기 위해 이와 유사한 유명 도메인을 미리 등록하는 것**
- URL 하이재킹이라고도 한다.





<br/><br/>

---

## 스니핑sniffing

- **네트워크의 중간에서 남의 패킷 정보를 도청**하는 해킹 유형의 하나
- 수동적 공격에 해당





<br/><br/>

---

## 워터링 홀watering hole

- 목표 대상이 자주 방문하는 **웹사이트를 사전에 감염시켜** 대상이 해당 **사이트에 방문했을 때 악성 코드에 감염되게 하는** 웹 기반 **공격**
- 감염된 PC를 기반으로 대상이 속한 조직의 중요 시스템에 접근하거나 불능으로 만드는 등의 영향력을 행사할 수 있다.





<br/><br/>

---

## 







<br/><br/>

---

## 







<br/><br/>

---

## 







<br/><br/>

---

## 








<br/><br/><br/><br/><br/>

---

# GROUP-B

## 189 UI/UX






<br/><br/>

---








<br/><br/>

---







<br/><br/>

---







<br/><br/><br/><br/><br/>

---

# GROUP-C

## 206 화이트박스 테스트

- 모듈의 원시 코드(source code)를 오픈시킨 상태에서 **원시 코드의 논리적인 모든 경로를 테스트하여 테스트 케이스를 설계하는 방법**
- 모듈 안의 작동을 직접 관찰할 수 있다.
- 원시 코드의 모든 문장을 한 번 이상 실행함으로써 수행된다.






<br/><br/>

---








<br/><br/>

---







<br/><br/>

---







<br/><br/>
