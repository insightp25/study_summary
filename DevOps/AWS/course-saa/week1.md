# AWS SAA 챌린지 1주차

~/Desktop/study_summary/DevOps/AWS/course-saa/week1.md

#  AWS IAM 사용자 그룹 정책

## IAM 사용자와 그룹

### IAM이란?

- identity and access management - 인증과 권한을 관리하는 솔루션
- 특정 region에 종속되지 않는 글로벌 서비스
- `root account`는 가입 시점에 자동 생성
- `사용자`는 계정을 공유하고 사용하기 위해 나뉘는 사용자 단위
- `그룹`은 사용자만을 포함(다른 그룹 포함 불가)
- 사용자는 0 ~ n개의 그룹에 포함될 수 있다.

## IAM 권한 관리하기

- 사용자/그룹은 정책(policy)을 설정할 수 있다.
    - eg. ~ 서비스에 대해 ~ 액션을 할 수 있다
- 정책은 json 형태로 관리된다.  
    ```json
	// policy example
	{
		"Version" : "2020-10-17",
		"Statement" : [{
			"Sid" : "1",
    		...
    	}]
	}
	```  
- 정책 설정시
    - `최소 권한 부여 원칙`을 지켜야 한다(필요 이상의 권한을 주지 않는다).
    	- eg. 삭제용 사용자, 생성/수정용 사용자 별도 설정 
    	- human error로 인한 장애 요소 최소화

## IAM

- 최상위
	- Version: policy json의 버전. 버전 "2012-10-17"이 항상 들어간다.
	- Id: 정책의 id(optional). 식별 가능하도록 string으로 임의 설정.
	- Statement: 1 ~ n 개의 statement로 구성
- statement의 속성
	- Sid: statement의 id(optional)
	- Effect: allow/deny 두 가지 액션을 가진다.
	- Principal: 계정/사용자/롤 등으로 정책 적용 대상 지칭
	- Action: 해당 정책이 허용하거나 차단하는 액션 지정
	- Condition: 어떤 경우에 정책이 적용되는지 설정(optional)

## 정책 상속

- eg. 개발자 그룹, DevOps 그룹, 운영 그룹
    - 사용자/그룹별 권한 교차 상속 가능





---

<br><br><br>

# IAM 보안 관리하기

## IAM 비밀번호 정책 알아보기
- 최소 비밀번호 길이 정하기
- 특정 문자열 형식 포함하기
- IAM 사용자가 자신의 비밀번호를 바꿀 수 있도록 허용하기
- 특정 주기마다 비밀번호 변경하도록 권장하기
- 비밀번호 재사용 금지


## IAM MFA(multi factor authentication)
- 사용자는 AWS 계정에 접속해서 설정을 변경하거나 리소스를 삭제할 수 있다.
- 그렇기 때문에 IAM 사용자 또는 루트 계정에 대한 보안을 강화할 필요가 있다.
- MFA를 적용하면 더 강력한 보안을 유지할 수 있다.

### 주로 사용하는 MFA
- 가상 MFA device
  - MS authenticator
  - google authenticator
  - suthy 등
- U2F 키
- 하드웨어 기반 MFA 기기


## IAM 서비스 롤
- aws service 내부에서 aws 리소스를 접근해야 할 수 있습니다.
  - eg. EC2 -> RDS, EC2 -> S3...
- 이런 경우 aws service에 iam 롤을 적용할 수 있습니다.
- 예시
  - 'aws 내부에서 다른 리소스에 접근을 한다, 그리고 이 상황에서 그것이 제한되어야 한다'에 가장 포커스가 맞춰져 있다.
  - EC2 인스턴스 롤
  - 람다 함수 롤
  - ...대부분의 서비스에는 롤을 적용할 수 있습니다.
  - 최소 권한의 원칙을 지키는 것을 추천

## AWS 접근 방법 알아보기
- AWS management console
  - 비번 + MFA로 보안 유지
- AWS CLI
  - access key를 기반으로 보안 유지
- AWS SDK
  - access key 또는 IAM assign(내부 리소스간)
- access key는 console에서 생성 가능하다.
  - 비번과 같이 외부로 공유되어지면 안된다.
- 사용자는 각자 access key를 관리할 수 있다.
- access key는 access key id와 secret access key로 구성되어 있다.


## IAM 보안 툴
- IAM 보안 보고서(confidential report)
  - account(계정) 범위
  - 모든 계정 내부의 사용자의 상태와 민감 정보의 상태를 보여준다.
- IAM access advisor
  - 사용자 단위
  - 사용자에게 주어진 서비스 권한 및 접속 기록을 보여준다.
  - 정책이 적절한지 체크하는 용도로 사용한다.
  - 현재 사용자에게 주어진 권한 내에서 불필요한 것들이 있는지 없는지 솎아내는 용도로 체크하게 된다.

  ## IAM 정리
  - 사용자: 실제 사용자와 매핑되며 AWS console에 비밀번호로 접속할 수 있다.
  - 그룹: 사용자를 묶는 용도로 사용
  - 정책: json 스타일로 작성. 사용자 또는 그룹에게 적용 가능. 리소스별 접근과 할 수 있는 역할 규정.
  - 롤: 리소스가 다른 리소스에 접근할 수 있도록 지정
  - 보안방식: MFA + 비밀번호 정책
  - access key: 어플리케이션 또는 CLI에서 aws를 접근할 수 있도록 제공
  - 이력관리: credential report와 access advisor 활용 



---

<br><br><br>

# IAM 콘솔 사용자 생성

(실습)




---

<br><br><br>

# IAM CLI 접근
```
aws configure  
aws iam list-users

cd $HOME/.aws  
vi credentials  
vi config  
```


---

<br><br><br>

# IAM 정책 생성

(실습)



 ---

<br><br><br>

# EC2와 인스턴스 타입

## EC2 소개
- ec2는 AWS에서 제공하는 가장 기본적인 인프라 서비스
- elastic compute cloud의 약어
- ec2를 생성할 때 기본적으로 4가지 요소들이 함께하게 된다.
  - EC2 가상 머신
  - EBS(elastic block store)/EFS(elastic file system) - 가상 머신 내에 데이터를 저장하는 스토리지
  - ELB(elastic load balancer) - 머신간 부하 분산
  - AutoSailing 그룹 - 서비스의 스케일링 조정

## EC2의 장점
- 손쉽게 대량의 인스턴스 실행 가능
- 인스턴스 내부의 모든 요소에 대해 root 권한을 갖는다.
- 인스턴스 유형을 선택하거나, os를 선택하는 등 유연한 구성 제공
- 빠르고 쉽게 교체 가능하고 고가용성을 지원
- VPC/security group 등을 통해 보안 확보 가능
- 필요한 상황에 맞게 저렴한 비용으로 사용 가능
  - (적절하게 설정하지 않는다면, 오히려 많은 비용 발생 가능)

## EC2 User Data 알아보기
- EC2 인스턴스가 최초로 실행될때 User Data를 통해 스크립트를 실행할 수 있습니다(Bootstrapping).
- User data 에 입력된 스크립트는 인스턴스가 최초로 시작될때만 수행됩니다.
- User data 는 해당 인스턴스에 root 권한을 가지고 수행합니다.
  - root 권한 -> 모든 동작이 수행 가능하므로 주의하여 사용!

## EC2 Instance Type 알아보기
- EC2는 다양한 목적과 필요한 용량에 맞춰서 제공할 수 있는 패밀리와 타입을 제공합니다.
- 인스턴스 타입의 구분은 C7g.medium 와 같이 패밀리(C for computing) + 세대(7) + proccesor/특징/없음(g) + 크기(medium) 로 구분되어집니다.
  - 범용, 컴퓨팅 최적화, 메모리 최적화, 가속화 컴퓨팅, 스토리지 최적화, HPC 최적화 등...
- https://aws.amazon.com/ko/ec2/instance-types/ 페이지에서 인스턴스 타입별 상세 내용을 확인 할 수 있습니다.

### EC2 Instance Type - 범용(general purpose)
- 다양한 종류의 워크로드를 지원하는데 특화
- 네트워크/메모리/연산이 고르게 분배
- t2.micro의 경우 aws free tier에서 사용 가능
  - (앞으로 진행하게 되는 모든 ec2 실습은 해당 인스턴스 타입을 이용해 진행)
  
### EC2 Instance Type - 컴퓨팅 최적화(compute optimized)
- 고성능 프로세서가 필요한 연산력 특화된 작업을 수행하는데 용이
  - 배치 작업
  - 미디어 파일의 인코딩
  - 고성능이 필요한 웹서버
  - 게이밍 서버

### EC2 Instance Type - 메모리 최적화(memory optimized)
메모리 상에서 많은 량의 데이터를 처리하는데 유리합니다.
- 데이터 베이스를 올리거나
- 캐시 스토어로 사용하거나
- BI 등에 필요한 인메모리 DB를 사용하거나
- 비정형화된 데이터를 처리하는데 유리합니다.

### EC2 Instance Type - 스토리지 최적화(storage optimized)
스토리지 처리 능력이 높은 경우 필요합니다. 대용량 파일에 접근해서 순차적으로 읽어내고 쓰는 능력에 최적화 되어 있습니다.
- 자주 OLTP 가 발생하거나
- Database 용도로 사용하거나
- In memory db 를 사용하거나
- 데이터를 처리하고 저장하거나
- 분산 파일 저장에 특화되어 있습니다.

### EC2 Instance Type - 가속 컴퓨팅(accelerated computing)
하드웨어 가속 또는 co-processor 를 사용해 연산력이 매우 고도로 필요한 작업들을 처리하는데 최적화되어있습니다.
- 딥러닝
- 그래픽 처리
- 부동소수점 계산등의 연산
- 데이터 패턴 분석

### EC2 Instance Type 지원가능한 내용 확인하기
- 타입별 사이즈와 메모리/스토리지 타입 등 필요한 내용을 확인
- https://aws.amazon.com/ko/ec2/instance-types/?ncl=h_ls
  - 해당 페이지에서 각 타입별 상세 내용을 확인할 수 있습니다.




---

<br><br><br>

# EC2 인스턴스 보안 그룹과 구매 옵션

## EC2 security group 알아보기
- security group은 aws 네트워크 보안의 개념이다.
- secuirty 그룹을 기반으로 ec2 인스턴스의 트래픽을 막거나/허용합니다.
- security group은 allow 정책만 가지고 있다(기본적으론 모든 요청을 block한다).
- security group은 ip 또는 다른 security group을 참조해서 구성할 수 있다.
  - (참조한다 -> 다른 security group에 세팅되어 있는 내용을 승계/상속해서 가져온다 라고 이해해도 무방하다)

## EC2 security group - in/out bound
- in-bound: 허용된 특정 ip의 22번 포트에서 접근하는 것만 가능. ip와 포트 번호로 접근/차단 제어.
- out-bound: 언제나 모든 곳에 대해 허용
- (참고: security group은 포트 번호와 함께 세팅. 일반적으로 22번 ssh용 포트, http:80 포트, https:443 포트 등 다양한 포트들을 기반으로 핸들링.)

## EC2 security group - 알아둘 내용
- 여러 인스턴스에서 하나의 security group을 공유해서 사용할 수
있습니다.
  - security group과 ec2 인스턴스의 관계는 M:N의 관계. 하나의 인스턴스에서도 여러 개의 security group을 참조 가능.
- Security group은 리젼/VPC 에 의존합니다.
  - vpc(virtual private cloud): 네트워크를 격리하는 최소 단위
- Security Group 은 요청은 인스턴스 앞단에서 차단합니다.
- 하나의 그룹을 다른 그룹의 룰로 추가 할 수 있습니다.
- Inbound 는 allow list 로 관리됩니다.

## EC2 인스턴스에 접속하기
os|접속 방법
--|--
mac|ssh, putty, ec2 instance connect
linux|ssh, ec2 instance connect
windows<10|putty,  ec2 instance connect
windows>=10|ssh, putty, ec2 instance connect

## ec2 구매 옵션 알아보기 - 1
- 온디맨드 인스턴스 - 시작하는 인스턴스에 대한 비용을 초 단위로 지불
- 절감형 플랜(Savings Plans) - 1년 또는 3년 기간 동안 시간당 USD로 일관된 사용량을 약정하여 Amazon EC2 비용 절감 가능
- 예약 인스턴스 - 1년 또는 3년 기간 동안 인스턴스 유형 및 리전을 포함하여 일관된 인스턴스 구성을 약정하여 Amazon EC2 비용 절감 가능

## ec2 구매 옵션 알아보기 - 2
- 스팟 인스턴스 - 미사용 EC2 인스턴스를 요청하여 Amazon EC2 비용을 대폭 줄일 수 있습니다.
- 전용 호스트 - 인스턴스 실행을 전담하는 실제 호스트 비용을 지불하며, 기존의 소켓, 코어 또는 VM 소프트웨어별 라이선스를 가져와 비용을 절감합니다.
- 전용 인스턴스 - 단일 테넌트 하드웨어에서 실행되는 인스턴스 비용을 시간
단위로 지불합니다.


---

<br><br><br>

# EC2 깊게 알아보기

## private / public IP
- IP는 IPv4 와 IPv6 두 종류가 있다.
- IPV4
  - [0-255].[0-255].[0-255].[0-255] 로 구성
  - 가장 일반적으로 사용하는 IP
- IPV6
  - loT등에서 필요로 하는 주소 형식
  - 약 37억개의 주소 지원

### public IP란?
- 인터넷(world-wide web)에 공개되고 식별될 수 있는 주소
- 모든 인터넷에서 유일해야 한다.
- 위치한 지역을 구분하기 쉽다.

### Private IP란?
- private IP 는 내부망에서 기기를 식별하기 위해 사용
- 내부망 안에서 각 IP는 Unique 해야 한다.
- 별도의 내부망에서는 같은 IP 를 사용해도 무관하다(망이 분리되어 있기 때문!).
- NAT + internet gateway 를 통해 인터넷과 통신한다.
  - 외부에서 들어오는 요청이 public IP를 통해서 private IP로 분배되고, 나갈 때는 NAT gateway를 통해서 지정된 한 곳에서만 요청이 나가게 된다.
- 지정된 범위 내의 IP만 private IP 로 사용가능
  - 이 때 IP CIDR라는 방식을 사용하게 된다.

## 탄력적(elastic) IP
- EC2 인스턴스를 stop - start 순으로 재기동 했을때 public IP 는 변경될 수 있다.
- 인스턴스가 고정IP 를 사용해야 하는 경우 Elastic IP 를 사용한다.
- Elastic IP 는 한번 지정되면 Public IPv4 IP 를 삭제되기 전 까지 점유한다.
- 한번에 한개의 인스턴스에만 적용 가능하다.
- Elastic IP를 사용하지 않는 경우에는 IP 지정 이슈로 서비스 연결이 되지 않거나 IP 가 변경되어 문제가 될 수 있다.
- 한개 계정(Account)에는 5개의 Elastic IP 만 사용할 수 있다.
- 더 필요한 경우 AWS 측에 증가를 요구할 수 있다.

## ENI(elastic network interface/탄력적 네트워크 인터페이스)
- VPC 내부에서 가상 네트워크 카드를 나타내는 논리적인 요소
- ENI 속성 알아보기
  - 하나의 메인 IPv4 주소와 1개 이상의 서브 IPv4주소를 가질 수 있다.
  - 한개의 퍼블릭 IPv4 주소를 가질 수 있다.
  - 한개의 프라이빗 IPv4 주소당 하나의 Elastic IPv4 IP를 가질 수 있다.
  - 하나 이상의 security group. ENI와 security group은 같이 묶인다.
  - MAC Address
- 특정 가용영역(AZ) 에 사용범위가 한정되어 있다.
- ENI 를 독립적으로 생성하고 연결 할 수 있다.

## 배치그룹(placement group)
- 요구사항에 따라 인스턴스의 배치를 고민해야 하는 경우 사용
- 배치그룹 생성은 무료이다.
- 클러스터
  - 인스턴스를 동일 가용영역(AZ) 내부에서 서로 근접하게 패킹
  - 고성능 컴퓨팅 애플리케이션
  - 낮은 네트워크 지연이 필요한 서비스등에서 사용 가능
- 파티션
  - 인스턴스를 논리적 파티션으로 분산
  - 분할된 인스턴스는 서로 다른 하드웨어 사용
  - 예시
    - kafka
    - hadoop
    - cassanra
    - 주로 분산 및 복제된 워크로드에서 사용
- 분산
  - 인스턴스를 서로 다른 하드웨어에 분산해 발생할 수 있는 오류를 줄인다.


## EC2 Hibernate
- 인스턴스를 정지 - 실행 할 때 발생하는 다운타임을 줄인다.
- 메모리 상태를 유지한채 인스턴스를 일시 정지 하는데 사용한다.
- OS는 정지하지 않는다. (재사용시 부팅이 불필요합니다)
- 메모리 내의 정보를 ebs 볼륨에 저장하고 이후 다시 사용한다.
- 메모리 정보를 저장할때 암호화 해서 저장한다.
- 주로 RAM 상태를 유지한채 서비스를 일시 정지하거나 
- 부팅 프로세스가 긴 워크로드를 정지 - 재시작 하는 경우 사용한다.
- 저장하는 RAM 용량은 150GB 보다 작아야 한다.
- 볼륨은 EBS 만 사용할 수 있다.
- 60일 이내만 hibernate 될 수 있다.


## EBS volume
- EBS 볼륨은 인스턴스 런타임에 적용되는 네트워크 드라이브 인스턴스가 종료된 이후에도 데이터를 영속(persist) 시키도록 한다.
- 한개의 볼륨은 한대의 인스턴스에만 연결된다.
- 특정 가용영역에 종속된다.
- 프리티어에서는 월간 30GB General Purpose SSD 또는 HDD 를 사용할 수
있다.
- IOPS 또는 GB의 용량에 따라 간다.
- 기본적으로 인스턴스종료시에 삭제되지만 console/ cli 를 통해 유지되드록
할 수 있다.
- snapshot 지원
- 특정 시점을 기준으로 지정 가능
- 스냅샷은 인스턴스에 지정되어 있는 상태에서도 진행 가능하지만 권장되지는 않는다.
- 가용영역 또는 리전간 스냅샷을 복사할 수 있다.
- 비용절감을 위해서는 EBS snapshot archive를 사용한다.
  - 복구시 24-72시간이 걸리지만 75%가량 저렴하다.
- 삭제시 recycle bin을 등록해서 다시 사용할 수 있도록 지정할 수 있다.
  - 1일 - 1년간 보관할 수 있다.
- fast snapshot restore(FSR)
  - 스냅샷을 재사용할 때 바로 사용할 수 있도록 지원하지만 비싼편이다.

### EBS volume type
- EBS volume은 총 6가지 타입으로 나뉜다.
- SSD 기반
  - gp2/gp3: 범용 목적의 ssd 볼륨. 적당한 가격과 성능을 갖고 있다.
    - (대부분 이 시리즈로 해결이 되므로 일반적으로 가장 많이 사용)
  - io1/io2: 고성능 IO와 낮은 지연시간이 필요한 경우 사용
- HDD 기반
  - st1: 낮은 가격과 잦은 접근에 강점을 갖고 있다.
  - sc2: 가장 가격이 낮지만 성능이 낮다. 접근이 많지 않은 경우 권장.

### EBS Volume - 1 볼륨, n개 인스턴스
- iol/io2 만 지원
- 한개의 EBS 볼륨을 같은 가용영역 내의 여러개 인스턴스에 추가
  - 인스턴스를 띄울 때 multi-AZ(다중 가용 영역)로 띄우는 경우들도 상당히 많아, multi-AZ로 띄웠을 때 동일한 EBS를 공유해서 사용할 수 없다.
- 고가용성 애플리케이션에 적합하지만 쓰기 작업시 발생하는 경쟁상태(race condition)에 대한 핸들링을 애플리케이션이 진행해주어야 한다.
- 인스턴스 16개까지 연결 가능
- 클러스터링이 가능한 file system을 사용해야 한다.

### EBS Volume - 암호화
- 인스턴스와 볼륨간 데이터 이동시 암호화를 지원한다.
- 스냅샷 암호화를 지원한다.
- 암호화 및 복호화는 시스템상에서 자동으로 진행된다.
- 암호화는 지연시간에 최소한의 영향만을 미친다.
- 암호화 되지 않은 스냅샷을 복사시 암호화 할 수 있다.
  - EBS 스냅샷 생성- 스냅샷 암호화 - 스냅샷을 기반으로 신규 EBS 생성 순서를 거쳐 ebs 암호화가 가능하다.


## EFS(elastic file system)
- 다수의 ec2에 부착할 수 있다.
- 여러 az에 부착 가능하다.
- 사용량 만큼 비용을 지불하고 비싸지만 고가용성 / 확장성을 가지고 있다.
- 다량의 데이터를 관리하거나 / 웹 페이지 서버 / 데이터 공유등을 하는 용도로 사용한다.
- NFSV4.1 프로토콜을 사용한다.
- EFS 접근 제어는 security group 을 기반으로 진행한다.
- 암호화는 KMS 를 기반으로 사용한다.
- POSIX 파일시스템을 표준으로 사용한다.
- 파일시스템 스케일을 자동으로 확장한다.

### EFS(elastic file system) - 성능
(왜 EFS를 써야 하는가?에 대한 내용)
- 1000여개의 NFS 클라이언트를 붙일 수 있다.
- 10GB+/s 의 처리량
- 퍼포먼스 모드를 셋팅할 수 있다.
  - 생성 시점에 셋팅한다.
  - 범용은 지연시간이 민감한 경우 사용한다.
  - Max 10는 높은 지연시간을 가지지만 / 높은 분산처리량을 가지고 있다.
- 처리량 모드 (throughput mode)
  - 버스팅: 1TB = 50MiB/s 에서 100MiB/s 까지 성능을 끌어올린다.
  - Provisioned: 처리량을 스토리지 사이즈에 따라 지정한다.
  - 탄력적(Elastic): 자동으로 처리량을 늘리거나 줄인다.
    - 최고 3 GiB/s 읽기
    - 최고 1 GiB/s 쓰기
    - 예측이 어려운 워크로드에서 사용한다.


## EFS(Elastic File System) - 타입 알아보기
- 저장 / 접근에 따른 구분
  - 수명주기에 따른 관리 제공
  - 스탠다드: 파일에 자주 접근하는 파일
  - EFS IA(자주 접근하지 않는 파일): 파일에 접근할때 비용 발생. 저장에 더 낮은 가격을 가지고 갖고 있다.
- 가용성과 내구성
  - 스탠다드: 멀티 AZ를 지원한다. 상용 환경에 적합합니다.
  - One zone: 한개 az만을 사용한다. 백업 자동 적용. 개발환경에 적합.

## EC2 instance store
- EBS Volume 은 네트워크 드라이브이다. 따라서 성능에 한계가 있을 수
있다.
- 고성능 하드웨어 디스크가 필요한 경우 사용
- I/0 성능은 더 좋지만 인스턴스를 멈추는 경우 스토리지가 손실
- Elasticsearch, Reids 같은 버퍼/캐시 등 임시데이터를 저장하는데 유효
- 하드웨어 이슈가 발생하는 경우 데이터 손실의 위험이 있다.
- 백업 또는 복제는 자동 지원이 되지 않으므로 S3, NAS 등에 저장 등을 사용자가 직접 수행해야 한다.


## 정리: 트레이드 오프와 선택
- 고성능 IO가 필요하지 않은 경우 -> EBS
- 분산 환경 등 여러 대의 인스턴스가 접근해서 처리해야 하는 경우 -> EFS
- 데이터에 대해서는 핸들링이 되니 고성능 IO가 필요한 경우 -> EC2 instance store


## AMI(amazon machine image)
- EC2 인스턴스를 위해 커스터마이즈 된 이미지
  - 도커 컨테이너에 띄우는 이미지들과 동일하게 사전 패키징된 소프트웨어 번들
  - 사전 패키징되기 때문에 더 빠른 로딩과 설정을 지원
- AMI 는 특정 리전을 기반으로 사용
  - 리전간 복사는 가능
- AMI 종류
  - Public AMI: AWS 에서 제공하는 이미지
  - 직접 제작 AMI
  - Marketplace AMI: 다른 사용자가 만들고 판매하는 AMI
    - 특정 소프트웨어를 사용해야 하는 서버를 올릴때 사용.
    - eg. 게임 소프트웨어 개발시 사용하는 VCS(version control system)는 일반적인 VCS와는 다르기 때문에 특정 용도의 소프트웨어가 필요 -> 이런 경우 미리 세팅이 돼있는 AMI를 구매하면 직접적으로 세팅하는 수고를 덜 수 있다.
    - 특별하게 사용하는 SW가 있고 그 SW를 위해 별도의 OS 설정이 많이 필요한 경우 여기서 먼저 찾아보는 것 추천.


### AMI 작동 방식
- 커스터마이징 하려고 하는 이미지를 기반으로 ec2 인스턴스를 시작
- 소프트웨어 설치 / 데이터 생성등 필요한 작업을 진행
- 인스턴스를 중지
- AMI 를 생성
  - EBS snapshot 도 같이 생성
- 생성한 AMI를 기반으로 다른 ec2 instance 를 시작


---

<br><br><br>

# EC2 생성

(실습)


 ---

<br><br><br>

# EC2 Auto-scaling과 설정

- security group은 서비스별로 따로 사용하는 것이 좋다

- auto-scaling 생성시 네트워크 설정

  - 주의: 인스턴스 타입에 따라 특정 가용 영역에서 지원하거나 지원하지 않는 경우가 있을 수 있다. t2.micro는 프리 티어이기 때문에 제약 조건들이 몇 가지 있다.
  - eg. c와 a의 가용 영역에서는 사용이 가능하지만 b에서는 사용 불가.  

- 로드 밸런싱
  - 되도록 기존 로드 밸런서에 연결 사용하기(auto-scale 후 요청이 새로 생성된 인스턴스로 들어오지 않을 수도 있으므로)
- 상태 확인: 인스턴스 생성후 부트스트래핑, 로딩에 시간이 오래 걸리는 경우 감안

(실습)


---

<br><br><br>

# EC2 직접 접근해보기

```
ssh -i sparta-lecture.pem ec2-user@<인스턴스-퍼블릭-IP-주소>

ps aux

sudo systemctl start httpd

aws ec2 describe-instances
```


 


