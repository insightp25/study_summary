# AWS 자격증 챌린지 2주차

# 2-1. 2주차 미리보기

### 2주차 목차
- 고가용성/확장성
- load balancer
  - ELB란?
  - CLB
  - ALB
  - NLB
- 데이터 저장 서비스
  - RDS
  - ElastiCache
- AWS의 DNS 알아보기
  - Route 53

---

<br><br><br>

# 2-2. 고가용성과 확장성 알아보기
- 확장성
  - 애플리케이션 또는 시스템이 부하에 맞추어 적절하게 조절될 수 있다.
- 수평적 확장
  - 더 많은 수의 인스턴스를 띄우는 방식의 탄력적인 방식
- 수직적 확장
  - 하드웨어 또는 인스턴스의 티어를 올리고 더 많은 리소스를 사용하는 경우 사용
  - 주로 한 개 애플리케이션이 처리하는 분량이 늘어나는 경우 진행
- 가용성
  - 확장성과 밀접하게 연관되어 있는 개념
  - 서비스를 오래 유지해서 운영하는 것 의미
  - 서비스 가용시간이라는 개념과 밀접한 관계를 갖고 있다.

## 고가용성
- 일반적으로 수평적 확장과 밀접한 연관
- 애플리케이션이 2개 이상의 데이터 센터 또는 가용영역에서 운영되는 것을 의미
- RDS multi-az 등은 자체적으로 지원하고 있다.
  - RDS와 같은 완전 관리형(fully-managed) 서비스는 multi-az를 자체 지원

## EC2에서 적용하기
- 수직적 확장(vertical scaling)
  - t2.micro - t2.large
  - 1vCPU/1.0GiB RAM -> 2vCPU/8.0GiB RAM
  - 인스턴스 타입 변경을 통해 확장을 지원
- 수평적 확장
  - auto scaling group을 multi-az로 적용
    - auto scaling group이 새로운 인스턴스를 생성할 때 기존에 있는 AZ에서 다른 AZ 하나를 생성하게 된다. 그래서 AZ A와 AZ B에 모두 생성이 되었다가 추가로 생성이 될 때 AZ A 그 다음에 B, 그 다음에는 A, 그 다음에는 B 이런 식으로 반복적으로 돌아가면서 하게 된다.
  - 로드밸런서를 multi-az로 적용

## 로드밸런서를 사용하는 이유
- 여러대의 서버에 트래픽을 분산하는 역할
- 여러 application/서버에 대한 외부에 공개된 접근 포인트를 노출시켜주는 역할
  - eg. DNS
- 뒷단의 인스턴스의 장애 또는 부하 핸들링을 용이하게 한다.
- 인스턴스에 대한 헬스 체크를 진행
- 가용영역간의 가용성 지원
- 퍼블릭 트래픽과 프라이빗 트래픽을 분할
  - 인터넷에서 들어오는 요청들을 내부 네트워크 망에서 요청을 분할해주는 역할. '한 번 세탁을 해준다.' 예를 들어 외부에서 공개되어 있는 프론트엔드 서버 혹은 API 서버 등에서는 이런 퍼블릭 트래픽과 프라이빗 트래픽을 분할해주는 LB를 중간에 두고 그걸 기반으로 서비스가 안정적으로 유지되는 가용성을 확보하게 된다.

## 헬스 체크
- 로드 밸런서에서 가장 중요한 역할
- 뒷단의 인스턴스가 들어오는 요청을 받을 수 있는 상태인지 확인하는 역할
- 포트 번호 + 루트로 구성(example.com:443/health-check)
- HTTP 상태 코드를 기준으로 판단
  - 일반적으로 200을 사용
    - eg1. 301, 404 등을 보내준다면 서비스가 실패한 것으로 파악
    - eg2. 201 created -> 정확한 status code를 지정하지 않을 시 실패로 간주할 수도.


---

<br><br><br>

# 2-3. ELB

'AWS에 있는 관리형 load balancer들을 모두 뭉뚱그려서 elastic load balancer라고 부른다.'

## ELB(elastic load balancer)란?
- AWS에서 제공하는 관리형 로드 밸런서
  - '관리형': AWS가 인프라 부문의 매니징을 모두 다 지원해준다. eg. 세부적인 네트워크 설정, 인스턴스 설정, 부하에 따르는 스케일링 같은 것들을 모두 AWS에 위임.
- 관리형이란?
  - AWS가 작동을 보증
  - AWS에서 업그레이드/유지보수/고가용성 관리
  - 적은 수의 설정 변경권한 제공
    - AWS가 모든 내용을 관리해주기 때문에 내부적인 세부 파라미터나 동작 방식들을 변경하는 데 있어서 제한적이라는 의미
- 직접 생성에 비해 비용이 적다.
  - 가격적인 면, 관리 효율 면에서 더 나은 선택
- 다른 AWS service들과 연동 지원(->직접적으로 IP를 등록해주거나 스크립트를 작성하는 등의 일들이 불필요)
  - `cloud watch`를 통해 모니터링하고
  - `AWS certificate manager`를 통해 인증 관리
  - `EC2 auto scaling group`과 연계해 자동으로 부하를 분산하는 등
  - 다양한 서비스 연동 지원

## AWS의 로드 밸런서 살펴보기
- `CLB`(classic load balancer) - 2009년 출시
  - 지원 프로토콜: HTTP, HTTPS, TCP, SSL
  - 더 이상 잘 쓰이지 않는다.
- `ALB`(application load balancer) - 2016
  - 지원 프로토콜: HTTP, HTTPS, web socket
- `NLB`(network load balancer) - 2017
  - 지원 프로토콜: TCP, TLS(보안형 TCP), UDP
- `GWLB`(gateway load balancer)
  - 지원 프로토콜: OSI 3계층 - IP 프로토콜
- 일반적으로 가장 최근 세대의 로드 밸런서를 사용하는 것이 권장된다.

## load balancer와 security groups
- security group을 기반으로 요청에 대한 허용 여부를 핸들링
  - whitelist 기반 - 허용하는 대상만 허용하고 나머지는 모두 다 요청 거부reject
- type | protocol | port 범위 | 요청 소스 를 기반으로 구성
  - "네트워크 보안을 유지한다는 것 - 어디에서 요청하는지를 지정하고 그 요청을 기반으로만 들어올 수 있도록 한다"
- 요청 소스는 요청하는 client를 식별한다.
  - IP 0.0.0.0
  - IP CIDR 10.10.1.0/24
  - 다른 security group의 id
    - '관리의 편의성이라는 부분이 굉장히 중요 -> 다양한 서비스와 요소들을 다루게 되는데, 애플리케이션이 여러 개, 여러 그룹이 될 수록 점점 더 설정을 하나씩 그 때마다 매번 IP를 저장하고 진행을 한다면 어려워진다.'

## CLB(classic load balancer) 훑어보기
- 지원 프로토콜
  - TCP(layer 4)
  - HTTP, HTTPS(layer 7)
- HTTP/TCP 기준으로 헬스 체크를 진행
- 고정된 호스트 네임



---

<br><br><br>

# 2-4. ALB(application load balancer)

## 기본

- HTTP(layer 7/애플리케이션 계층)의 로드 밸런서
- 다양한 target group을 설정해 두고 이 target group에 따라서 요청을 흘러 들어가게 한다.
- 여러개 머신/여러개의 HTTP 어플리케이션의 부하를 분산하는데 사용
  - target group
- 한개 머신의 여러 인스턴스에 부하를 분산하는데 사용
  - container 환경 등(eg. k8s의 ingress 같은 곳에서 ALB를 ingress 타입으로 지정할 수 있다)
- http/2와 웹소켓 지원
- http to https 리다이렉트 등 리다이렉트 지원
- 관리형 서비스이다.

## 라우팅 알아보기
- target group은 routing table 별로 구성
- routing 기준 알아보기
  - url 기반
    - example.com/something | example.com/products
  - host명 기반
    - test.example.com | devops.example.com
  - query string 또는 헤더 기반
    - example.com/product?id=1234

## target group
- ec2 인스턴스 - http 기반 타겟 그룹
- ec2 태스크(ecs 기능) - http
  - ecs에서 kubernetes job이나 cron처럼 일시적으로 인스턴스를 띄우는 기능. 이 때 발생하는 것들을 http로 묶어 target group에 엮어줄 수 있다.
- lambda 함수 - json event로 변환되는 http
- ip 주소 - private ip로 적용
- 한개 ALB는 여러개 타겟 그룹과 엮일 수 있다.
- health check는 각 인스턴스가 아닌 타겟 그룹 단위로 이루어진다.

## ALB는 언제 사용하나?
- container 기반 어플리케이션(eg. k8s, ecs 등)
- 마이크로 서비스
- ecs를 사용하는 경우 다이나믹 포트에 대응하기 위해 포트 매핑 지원
  - 다이나믹 포트: 한 개의 인스턴스/서버에서 여러 개의 내부 컨테이너들이 있을 수 있는데, 이 때 포트가 겹치는 사태를 방지하기 위해 사용 -> 애플리케이션이 실제 어떤 포트가 할당되는지 알 수 없을 때가 있는데, 이런 것에 대해 application load balancer가 자동으로 해당 포트와 포트 매핑을 지원 -> 애플리케이션 별로 clb를 붙일 필요가 없는 이점
- 다양한 종류의 요청을 한 곳에서 핸들링이 가능

## 기억해야 할 특징
- 고정된 호스트 명을 사용한다(xxxxx.region.elb.amazonaws.com).
- 타겟그룹에 연결된 ip는 외부에 공개되지 않는다.
- **ip 의존 대신 호스트를 기준으로 핸들링하기 때문에 유연해진다.**
- 클라이언트의 정보는 http 헤더에 담겨져 들어간다.
  - (클라이언트 ip를 기준으로 무언가를 판단하는 로직 등이 들어가 있을 수도 있고, 그 ip를 기준으로 어떤 판단을 하거나 헤더에 있는 정보를 가져와 이해한다든지 아니면 포트 번호를 갖고 와서 무언가를 해야하는 경우들이 있을 수 있다)
  - x-forwarded-for -> 클라이언트의 ip
    - 127.0.0.1이 클라이언트라면 전달된 ip는 로드밸런서의 ip이고 x-forwarded-for 헤더에 127.0.0.1이 담기게 된다.
  - x-forwarded-port/x-forwarded-proto도 있다.
  - target group의 인스턴스들 입장에서 ip는 ALB의/CIDR에 속해있는 ip이기 때문에, 클라이언트의 정보는 http 헤더에 담겨있으니 헤더에 있는 정보를 사용해야 한다.



---

<br><br><br>

# 2-5. NLB(network load balancer)와 GWLB(gateway load balancer) 알아보기

CLB, ALB와 달리 layer4, layer3에서 동작

## NLB - 훑어보기 1
- layer 4(transport layer)에서 동작
- TCP/UDP 요청을 전달
- (TCP/UDP 요청을 전달한 만큼)초당 백만 단위의 요청 처리 가능
- ALB에 비해 더 빠른 지연시간을 갖고 있다(ALB 400ms | NLB 최대 100ms) - 동작하고 있는 레이어에 따라 발생하게 되는 문제
- 고성능 워크로드를 설계할 때 사용
- free-tier에서는 사용할 수 없다.

## NLB - 훑어보기 2
- 타겟그룹과 TCP 또는 HTTP로 통신할 수 있다.
- 클라이언트와 NLB는 TCP 기반으로 통신한다.
- ALB와 동일하게 여러 개의 대상그룹(target group)을 가질 수 있다.
- 타겟그룹의 속성
  - EC2 인스턴스
  - private ip 주소
  - ALB
- (고성능이 필요한 경우, TCP 단위로만 통신해도 되는 상태일 때 사용하는 것 적극 추천. eg. TCP 소켓 기반의 어떠한 액션을 취한다고 했을 때 낮은 레이턴시를 유지해야 하는 경우에 사용)
  - ALB와는 사용하는 목적이 다르다. 무엇이 더 우월한지 여부의 문제라기보다, 어떤 게 더 적절한가에 대해 충분히 고민하고 워크로드에 따라 판단하고 사용하는 것이 좋다.

## GWLB 훑어보기
- 가상 어플라이언스appliance를 위한 로드밸런서.
  - 가상 어플라이언스: 일반적으로 모든 게 특정한 소프트웨어에 최적화되어 있는 것들 지칭하는데, 여기서 말하는 가상 어플라이언스는 그런 것들 중에 가상화되어 있는 어플라이언스를 말한다.
- 배포, 확장, 관리 용이성을 위해 설계
- layer3(네트워크 레이어)에서 동작 - IP 기반으로 통신
- 단일 인입/반환 지점이 있다.
- 가상 어플라이언스에 대한 요청을 분할해 전송하는 목적을 갖고 있다. 이런 여러 어플라이언스들과 통신할 때에 있어 발생할 수 있는 다양한 문제점들을 해결하기 위해 나온 서비스이다. 이런 목적을 위해 GENEVE라는 별도의 프로토콜을 사용(port는 6081 고정 사용).
- EC2 인스턴스 또는 private ip 주소를 대상 그룹으로 설정할 수 있다.



---

<br><br><br>

# 2-6. AWS 로드 밸런서 추가 기능 알아보기

## sticky session
- 동일한 클라이언트가 요청을 동일한 인스턴스에서 이어서 처리하도록 유도
- CLB/NLB/ALB에서 지원
  - sticky session 유지 기간을 설정할 수 있다.
- 트레이드오프: 사용할 때 인스턴스간 트래픽이 균등하지 않은 현상이 생길 수 있다!

### sticky session - cookie
애플리케이션별 쿠키
- 애플리케이션에서 커스텀 쿠키를 세팅할 수 있다.
- 쿠키명으로 `AWASLB`, `AWSALBAPP`, `AWSALBTG`는 사용을 피해야 한다.
  - ALB에서 디폴트로 주고 있는 쿠키값들이기 때문
- target group 당 독립적인 이름을 가져야 한다.
- AWSALBAPP은 로드밸런서에서 자동으로 생성해주는 쿠키명이다.

기간 단위 쿠키
- 로드밸런서가 직접 생성
- ALB는 `AWSALB`
- CLB는 `AWSELB`


<br/>

## cross-zone load balancing
가용 영역 간 로드밸런싱을 할 수 있는지 여부  

### ALB
- 디폴트로 사용 설정이 켜져 있다 -> zone 간에 로드 밸런싱이 되며, zone 간으로 얼만큼의 요청을 분할해서 보내줄지 같은 것들이 세팅되어 있고, 그룹 단위로 켰다 끌 수 있다.
- AZ간 데이터 전달에 추가 비용이 발생하지 않는다.
  - (가용 영역간 데이터 전송시 상당히 많은 비용 발생(eg. EBS를 옮기는 등))

### NLB/GWLB
- 기본으로 사용이 꺼져 있다
- AZ간 데이터 전달에 비용이 발생

### CLB
- 기본으로 사용이 꺼져 있다
- AZ간 데이터 전달에 추가 비용이 발생하지 않는다.


<br/>

## SSL과 TLS

- 흔히 http와 https를 구분하게 하는 가장 기본적인 인증
  - (ALB를 사용하기 때문에 로드 밸런서가 중간에 인증 처리를 해줘야 하는 영역들이 분명 있다)

### SSL(security socket layer)
- SSL 인증은 클라이언트와 로드밸런서 간의 통신을 암호화 해주는 역할
- SSL은 연결을 암호화 하기위한 용도입니다.
- SSL 통신은 CA(Certified Agent)를 통해 발급
- 사용자가 지정한 만료일자가 있고 주기적으로 업데이트 해주어야 한다.
- (약간 오래된 방식이므로 TLS를 사용하는 편을 적극 권장. 둘의 다른 점은 다만 버전 차이 정도로 이해해도 무방.)

### TLS(Transport Layer Security)
- SSL 이후 출시된 구간 암호화 방식


<br/>

## Load Balancer에서 SSL 인증 동작 방식
- 로드 밸런서는 X.509 인증을 사용한다.
- AWS Certified Manager 를 통해 인증을 관리할 수 있다.
- 이미 가지고 있는 인증을 생성하거나 업로드 할 수 있다.
- HTTPS 리스너
  - 기본 인증서를 설정해야 한다.
  - 여러개의 도메인을 지원하기 위해 추가적인 인증서를 등록 할 수 있다.
  - 클라이언트는 SNI(server name indication)를 통해 도착지의 호스트명을 식별할 수 있다.

### SNI(server name indication)란
- SNI는 여러개의 ssl 인증서가 한개 웹서버에서 동작할 때 적절한 인증서를 로딩하기 위해 사용
- 클라이언트가 접근하고자 하는 목적지에 도달할 수 있도록 지원하는 프로토콜(SSL 핸드쉐이크 초기화 과정에서 진행)
- ALB\NLB\Cloudfront에서 사용 가능
- CLB 에서는 동작하지 않는다.


<br/>

## ELB 서비스별 SSL 인증
### CLB
- SSL 인증만 지원합니다.
- 여러개 호스트네임을 사용하려면 여러개 CLB 를 사용해야 한다(인증서도 여러개 필요).

### ALB & NLB
- SNI를 통해 여러개의 리스너와 인증서 사용 가능


<br/>

## connection draining
- 인스턴스가 정지되거나 Unhealthy한 상태일 때 연결된 요청을 종료하는 방식 의미
  - (인스턴스가 정지되는 period(주기)로 흘러 넘어가는 과정, 스케일이 축소되는 과정에서 발생 가능)
  - (eg. 서버가 다운되어 해당 서버를 내릴 때 마지막에 연결돼있는 요청/지금 원래 이미 전송되고 있는 상태의 요청(flight/inflight)을 어떻게 처리할 것인가에 대한 내용)
- 중지되거나 unhealthy한 인스턴스에 대해 요청을 중단(de-register) -> 클라이언트는 fail alert를 받게 된다.
- 1초에서 3600 초까지 **요청이 완료되길 대기**: 기본은 30초!
- 0초로 설정하면 사용하지 않는 상태이다.
- 요청이 주로 몇 초 이내에 끝나는지 확인후 적절한 값 세팅 필요






---

<br><br><br>

# 2-7. ALB 사용 실습

ssh -i sparta-lecture.pem ec2-user@{퍼블릭IP}
```
sudo su
yum install httpd
cd /var/www/html
echo "<h1>alb 테스트 1번</h1>" > index.html
systemctl start httpd
```

- aws 콘솔 -> EC2 -> 로드밸런싱 대상 그룹 생성  -> 로드 밸런서 생성
- 기존에 이미 사용중이라 불가피한 상황이 아니라면 CLB는 절대 사용하지 않길 추천



---

<br><br><br>

# 2-8. Auto Scaling Group 사용 실습

- auto scaling group 생성 -> 시작 템플릿 생성
- (시작 템플릿)사용자 데이터 입력
```
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
TOKEN=`curl-X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds:21600"` && INSTANCE_ID=`curl -H "X-aws-ec2-metadata-token:$TOKEN" -v http://169.254.169.254/latest/meta-data/instance-id`
echo "<h1>인스턴스ID:${INSTANCE_ID} 에 접속했어요 </h1>">
/var/www/html/index.html
```
- 시작 템플릿 생성후 auto scaling 그룹 생성





---

<br><br><br>

# 2-9. AWS RDS 알아보기







---

<br><br><br>

# 2-10. AWS Aurora 알아보기










