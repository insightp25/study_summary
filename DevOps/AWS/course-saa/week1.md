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

aws configure
aws iam list-users

cd $HOME/.aws
vi credentials
vi config



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

## EC2 Instance Type 범용(general purpose)
- 다양한 종류의 워크로드를 지원하는데 특화
- 네트워크/메모리/연산이 고르게 분배
- t2.micro의 경우 aws free tier에서 사용 가능
  - (앞으로 진행하게 되는 모든 ec2 실습은 해당 인스턴스 타입을 이용해 진행)
  
## EC2 Instance Type 컴퓨팅 최적화(compute optimized)
- 고성능 프로세서가 필요한 연산력 특화된 작업을 수행하는데 용이
  - 배치 작업
  - 미디어 파일의 인코딩
  - 고성능이 필요한 웹서버
  - 게이밍 서버








---

<br><br><br>

# EC2 인스턴스 보안 그룹과 구매 옵션




 



<br><br><br>

# EC2 깊게 알아보기








<br><br><br>

# EC2 생성






 

<br><br><br>

# EC2 Auto-scaling과 설정



 




<br><br><br>

# EC2 직접 접근해보기





 


