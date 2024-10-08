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





<br><br><br>

# IAM 보안 관리하기











<br><br><br>

# IAM 콘솔 사용자 생성






 

<br><br><br>

# IAM CLI 접근









<br><br><br>

# IAM 정책 생성






 

<br><br><br>

# EC2와 인스턴스 타입








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





 


