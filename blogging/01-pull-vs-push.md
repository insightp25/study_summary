초당 450만 읽기 요청을 처리하라 - 대용량 트래픽과 데이터를 견디는 SNS 알고리즘 구현하기(feat. pull vs. push)

# 🗂️ Introduction
---
대용량 데이터와 대규모 트래픽 환경에서 낮은 지연시간(latency)을 보장하는 방법

~~왜 AI와 디지털 트윈에 매료됐는지 구체적인 내용 1~2줄로 설명 필요~~

대학원에서 인공지능과 디지털 트윈이라는 기술에 대해 학습하고 연구한 적이 있고, 지금도 두 주제는 나에게 가장 큰 관심사이다.

인공지능의 학습에 필요한 빅데이터와 디지털 트윈 구현을 위한 실시간 대용량 데이터와 대규모 트래픽 처리 과정에, 특히 데이터에 집중하여, 보다 하드코어하게 부딪혀 보고 집중하고 딥다이브 해보고 싶었고, 이에 실시간 대규모 데이터 처리로 대표되며 평소 친숙한 서비스인 트위터를 모티브로 하는 소셜 네트워크 서비스(이하 SNS)를 프로젝트 주제로 선택하였다.

(제목의 '초당 450만 읽기 요청'은 초당 45만 타임라인의 읽기 요청을 단일 트윗 조회 요청 수로 단순 환산한 것이다. 초당 타임라인 읽기 요청 45만 * 트윗 10개 = 450만.)


<br>
<br>
<br>

---

# 🗂️ 요구사항1 - 대규모 트래픽과 읽기 집중
---
## 🔎 요구사항 분석
---

### 📎 트위터의 통계 지표와 주요 성능 요구사항

시작에 앞서 트래픽의 규모를 가늠하기 위해 수집한 통계자료의 트위터 성능 관련 주요 지표들은 다음과 같다.

* `2억 3780만 mDAU` - 유료화 일간 활성 사용자수monetizable daily active users, 2022년 기준) [1]
* `초당 450,000회 읽기 요청` - 타임라인 또는 모아보기, 트윗 10개 한 번에 로드, 2013년 기준이며 최근의 수치는 공개되지 않은 듯 하나 쓰기 비율이 거의 비슷하다고 가정 [2]
* `초당 6,000회 쓰기 요청` - 트윗, 2022년 기준 [3]
* `75 : 1` - 읽기 요청 vs. 쓰기 요청 비율
(타임라인 읽기시 트윗 10개를 한 번에 로드한다고 가정하면 러프하게 `750 : 1`이라고 간주할 수도 있을 것 같다. 통상적으로 SNS의 읽기 쓰기 비율은 100:1 ~ 10,000:1라고 한다.)
* `5초 이내` - 읽기 및 쓰기 요청에 대한 응답 지연 시간(latency) 상한

너무 큰 숫자라 잘 와닿지 않을 수가 있을 것 같아, 국내 한 유명 서비스 배달의 민족의 트래픽 기록과 비교하자면
* `초당 50,000회 읽기 요청` ('배달의 민족' 서비스의 연간 프로모션 행사에서 발생한 역대급 트래픽이었다고 한다)
* `초당 1,000회 ~ 1,500회 쓰기 요청` (동일 서비스의 MySQL 노드 한 대가 받아들일 수 있는 쓰기 요청 상한선이라고 한다)

과 같다. 읽기 요청 규모를 기준으로 했을 때, 트위터에서 약 `10~100배` 넘는 트래픽이 '일상적'으로 발생하고 있는 것이다.


<br>

---

### 📎 소셜 네트워크 서비스 특성상 주요 요구사항

SNS의 공통 핵심 요구사항은 Facebook(현 메타)의 CEO 마크 저커버그를 모티브로 한 영화 'The Social Network'의 한 유명한 대사에 잘 나타나 있다이다.

![](https://velog.velcdn.com/images/rmndr/post/14a8bbe3-7dad-46e9-a727-a40b5e7c64fa/image.jpg) 
> "우리 페이스북과 다른 서비스들의 차이는, **<u>우리 서버는 절대 멈춰선 안된다는 겁니다</u>**...한 사용자가 이탈하면 다른 사용자도 이탈하기 시작할 것이고, 그렇게 도미노처럼 한 순간에 무너지는 거에요!"

대사에서 처럼 무슨 일이 생겨도 항상 서비스가 가능한 상태, 즉

1. `가용성/내결함성(availability/fault-tolerance)`

의 필요가 절대적이다(가용성을 보장하기 위한 방법은 다음 포스팅에서 알아볼 것이다).

또 무엇이 있을까? 당연할지 모르겠지만, 쾌적한 사용자 경험을 위한 

2. `낮은 지연(low latency)`

일 것이다.

더하여 SNS의 읽기와 쓰기의 비율을 고려했을 때 읽기 요청에 대한 부하가 훨씬 더 클 것이라고 예상할 수 있고, 이런 상황에서 `읽기 요청에 대한 낮은 지연`이 특히 중요할 것이다.

3. 콘텐츠의 생명주기가 짧으며(사용자는 최신의 콘텐츠를 원하며, 생산과 소비의 사이클이 빠르다), 한 번 본 컨텐츠를 다시 볼 일이 극히 적다.

<br>

---

### 📎 문제 정의

> 타임라인(모아보기) `읽기 초당 450,000 TPS`, 트윗 `쓰기 초당 6,000 TPS`의 대용량 데이터, 대규모 트래픽 상황에서 어떻게 `5초 미만`의 낮은 지연을 항상 보장할 수 있을까?



<br><br>

---
## 🔎 해결 방안
---
가장 먼저, 알고리즘 자체에 집중하기 위해 다음과 같은 전제를 한다.

>
1. 상용 서비스에서 de facto로 여겨지는 disk기반 관계형 DB를 기준으로 한다.
2. 스키마 각 테이블에 대해 적절한 인덱스 설정과 쿼리 최적화가 되어있다고 가정한다.

---
#### (인덱스에 대하여)
관계형 DB에서의 읽기 성능 개선 방법에는 대표적으로 인덱스 설정이 있다. 인덱스를 설정하면 full-table scan을 방지하고, 인덱스를 설정한 필드에 대해 범위 질의(range scan)을 효율적으로 할 수 있어 읽기 질의 성능을 크게 개선한다. 인덱스 설정시 원본 데이터 중 인덱스가 설정된 필드의 집합을 원본과 별개로 생성하고 정렬하며, 해당 정보를 '페이지'에 기록하고 관리한다. 데이터 삽입시마다 페이지를 갱신하는 연산 비용이 추가되며, 데이터의 규모가 커질 수록 인덱스 페이지 갱신 작업으로 인한 쓰기 성능이 급격히 악화된다는 단점이 있다.

#### (구조적 측면에서의 성능 개선 방법에 대하여)
스케일 업과 스케일 아웃, 데이터 분산처리, 데이터 저장소 선택(디스크 기반 저장소와 인메모리 저장소, SQL과 NoSQL) 등 구조적 성능 개선 방법에 대해선 다음 포스팅에서 다룬다.

#### 기타

이미 읽어온 데이터를 캐싱하는 방법은 요구사항 3번의 이유로 배제하였다.

#### Pull vs. Push
읽기 성능 보장을 위해 크게 다음의 'pull 방식'과, 'push 방식'의 두 가지 알고리즘을 구상하였다.

---
### 📎 알고리즘 1 - Pull 방식 시스템

첫 번째로 떠올린 알고리즘은 가장 전형적인 알고리즘이라고 볼 수 있다.

>
#### 쓰기 시:
1. 트윗을 모든 트윗들이 모여있는 전역 테이블에 바로 쓴다.

#### 읽기 시:
1. 팔로잉하는 유저(이하 팔로잉 유저)를 모두 읽는다.
2. 팔로잉 유저의 트윗을 모두 읽는다. 
3. 시간 순으로 정렬한 트윗을 벌크 로드한다.

흔히 게시판 서비스 페이징을 할 때 이런 방식을 채택한다(데이터를 필요한 당시 DB에서 조회해 '당겨 온다' 하여 'pull 방식'으로 칭하였다).

<br>

---
### 📎 알고리즘 2 - Push 방식 시스템

세 번째 생각해낸 알고리즘은 읽기를 요청 시점에 ~~허겁지겁~~ 탐색을 하는 것이 아니라, 필요할 때 즉시 가져올 수 있도록 미리 데이터를 준비 해놓을 수는 없을까?하는 아이디어에서 나왔다.

>
#### 쓰기 시:
1. 각 유저별로 자신만의 타임라인 저장소를 갖고 있다.
2. 트윗을 작성해 쓰기 요청한다.
3. 작성자를 팔로우하는 사람들의 목록을 읽는다.
4. 팔로우 목록의 각 타임라인 저장소에 트윗을 쓴다(fan-out).

#### 읽기 시:
1. 미리 쌓아둔 트윗 목록을 벌크 로드 한다.

이는 쓰기 시점 당시 수신자 각각의 저장소에 데이터를 보내두는 '메일함 서비스'와 비슷하다고 볼 수 있다. 유저의 타임라인(메일함)에 팔로잉 유저들이 쓴 트윗이 이미 정렬 및 저장돼 있고, 필요할 때 트윗 목록을 그대로 가져오기만 하면 된다(데이터를 적소에 미리 '밀어 넣어 둔다'고 하여 'push 방식'이라고 칭하였다).


#### 여담
원본 데이터를 여러 개로 복사해 '환기시키듯 퍼져나가게 한다'는 의미에서, 이런 연산을 흔히 `'fan-out'`이라 칭한다. 한편 데이터 탐색에 드는 연산을 미리 해둔다는 측면에서 `'pre-computing'`, 미리 데이터를 로드해 둔다는 측면에서 `'pre-loading'`, 필요한 데이터를 미리 캐싱해 둔다는 측면에서 `'cache-warming'` 또는 `'look-ahead cache'`라고도 할 수 있다.


<br>

---
### 📎 Pull 방식과 Push 방식의 트레이드 오프

Pull 방식과 push 방식 중 하나를 택해야 한다면 다음의 트레이드 오프들을 고려할 수 있다.

#### Pull 방식의 트레이드 오프
##### 장점
* 비용대비 moderate한 읽기 성능 제공(가성비)
* 데이터 일관성 확보

##### 단점(비용)
* 읽기 당시에 탐색 비용 지불
* 탐색의 시간 복잡도
* 일정 수준 이상으로 로우 수가 증가할시 인덱스상 쓰기에서 급격한 부하 발생


#### Push 방식의 트레이드 오프
##### 장점
* 읽기 속도의 현저한 개선

##### 단점(비용)
* 쓰기 부하 증가
* 중복 데이터로 인한 공간 비용 증가
* 파생 데이터 다수 발생으로 인한 데이터 일관성 보장 난이도 증가
* 애플리케이션 구현 복잡도 증가


<br><br>

---

## 🔎 아직 더 남은 문제
---
SNS의 읽기 요청 vs. 쓰기 요청 비율상 읽기 성능이 최우선 요구사항임을 고려했을 때, 상술한 추가 비용을 지불하고서라도 push 방식을 도입하는 것이 합리적일 수 있다.

다만 결정에 앞서 추가로 해결해야할 중요한 문제가 한 가지 더 남아있다. 트위터의 핵심 기능인 팔로우 기능과 관련된 문제이다.


<br>
<br>
<br>

---
# 🗂️ 요구사항2 - 극단의 팔로잉과 팔로워

---
## 🌿 요구사항 분석
---
### 🫐 팔로잉이 많은 사람의 타임라인 읽기 문제(Pull 방식 선택시 발생)

유저의 팔로잉 분포 범위는 팔로워 분포 범위보다 넓지 않다는 가설은 유효할 것이다. 

예를 들어, 일론 머스크의 팔로워는 1억명이 넘는 반면, 한 유저가 팔로잉하는 수는 대체로 100명에서 많아야 1,000명 수준일 것이다(한 유저가 1억 명의 유저들을 팔로우하진 않는다).

따라서 '팔로잉이 많은 사람의 타임라인 읽기 문제는 크게 고려하지 않아도 된다'고 생각할 수도 있지만, 다음처럼 Pull 방식에서 타임라인 읽기의 시간 복잡도를 생각해보자(user, tweet, follow 테이블의 인덱스가 최적화 되어있다고 가정).

>
O(`f`\*log(`N`) \* log(`N`\*`t`))
* `f`: 한 유저의 팔로잉 수
* `N`: 트위터 전체 유저 수
* `t`: 유저당 평균 트윗 수

`N`과 `t`의 값이 아무리 커진다고 해도 결과는 `로그 증가`인 반면, `f`의 경우 값에 비례해 `선형 증가`한다. 즉, `팔로잉의 수는 타임라인 읽기 연산에 큰 영향을 준다`고 볼 수 있다. 

그렇다면 과연 Pull 방식 채택 경우 모든 타임라인 읽기 요청에 대해 제한시간내 응답을 보장할 수 있을까...?


<br>

---
### 🫐 팔로워가 많은 사람의 트윗 쓰기 문제(Push 방식 선택시 발생)

Push 방식
트위터의 대표적 셀럽 유저 일론 머스크는 1억 명 이상의 팔로워를 보유하고 있다. Push 방식을 구현할 경우 일론머스크가 트윗을 할 때마다 1억 명의 타임라인에 트윗을 1개 씩 총 1억 개를 써야하는 큰 부하가 발생하게 된다.

그렇다면 과연 Push 방식 채택 경우 모든 쓰기 요청에 대해 제한시간내 응답을 보장할 수 있을까...?

<br>

---
### 🫐 문제 정의

문제1
> Pull 방식을 채택할 경우 팔로잉이 많은 유저의 타임라인 읽기시 부하가 쏠리고, Push 방식을 채택할 경우 팔로워가 많은 유저의 쓰기시 부하가 쏠리는데, 어떤 방식이 가장 합라적일까?



<br><br>

---
## 🌿 해결 방안
---
### 🫐 알고리즘 2-A: 극단의 팔로잉 우선 해결

팔로잉이 많은 사람이 pull 방식의 타임라인 읽기를 할 시 follow 테이블과 tweet 테이블 탐색에서 큰 부하가 발생한다.

따라서 트윗을 작성할시 `쓰는 유저의 팔로워의 팔로잉 수`를 임계치로 삼아, 특정 수 이상인 유저에 대해서만 push 방식의 fan-out을 적용하도록 하여 읽기와 쓰기 부하의 균형을 찾을 수 있다.

이 방식에선 유저가 트윗을 쓸 시 임계치를 넘은 유저(헤비 유저) 목록을 탐색하는 비싼 비용이 발생하는데, 이 때 `헤비 유저 목록`을 캐싱해두면 쓰기시 부하를 추가로 줄일 수 있다.


>#### 알고리즘3
쓰기 시:
1. DB에 트윗을 쓴다. 
2. 팔로워 목록 전체 중 헤비유저 목록을 추려서 불러온다.
3. 팔로워들 중 헤비유저 목록을 추린다.
4. 트윗을 헤비유저 목록의 타임라인 저장소에 쓴다.
읽기 시:
1. 본인이 헤비유저에 해당하는지 확인한다.
2. (본인이 헤비유저일시)파생 저장소에서 모든 트윗을 읽어온다.
(팔로우 완전 캐싱)
쓰는 사람 -> 팔로워 중 헤비 유저 목록 캐싱
읽는 라이트 유저 -> 팔로잉 전체 목록 캐싱 -> 읽기시 성능 개선



<br>

---
### 🫐 알고리즘 2-B: 극단의 팔로워 우선 해결

팔로워가 많은 사람이 push 방식의 트윗 쓰기를 할 시 fan-out으로 인해 큰 부하가 발생한다.

따라서 트윗 작성시 `쓰는 유저의 팔로워 수`를 임계치로 삼아, 특정 수 이하인 유저에 대해서만 push 방식의 fan-out을 적용하도록 하여 읽기와 쓰기 부하의 균형을 찾을 수 있다.

이 방식에선 유저가 타임라인을 읽을 시 임계치를 넘은 유저(셀럽) 목록을 탐색하는 비싼 비용이 발생하는데, 이 때 `셀럽 유저 목록`을 캐싱해두면 읽기시 부하를 추가로 줄일 수 있다.


> #### 알고리즘4
쓰기 시
1. DB에 트윗을 쓴다.
2. 본인이 비셀럽 유저에 해당하는지 확인한다.
3. (본인이 비셀럽일시)팔로워 목록 전체를 불러온다.
4. 트윗을 팔로워 목록의 타임라인 저장소에 쓴다.
읽기 시
1. 미리 저장해둔 비셀럽의 트윗목록을 타임라인 저장소에서 읽는다(유저아이디 하나면 ok).
2. 셀럽 목록을 파생 저장소에서 읽는다.
3. 셀럽의 트윗목록을 DB에서 읽는다.
4. 셀럽, 비셀럽 트윗목록을 병합한다.
(팔로우 완전 캐싱)
쓰는 사람 -> 팔로워 중 셀럽 유저 목록 캐싱
읽는 사람 -> 팔로잉 중 비셀럽 유저 목록 캐싱





<br><br>

---
## 🌿 선택과 결정
---
알고리즘 2-A과 2-B는 기본적으로 비슷한 읽기와 쓰기 부하를 주도록 설계할 수 있다.

단지 알고리즘 2-A의 경우 팔로잉의 임계치를, 알고리즘 2-B의 경우 팔로워의 임계치를 어떻게 설정하는지에 따라 읽기와 쓰기의 부하 분산이 가능해진다.

나는 2-B의 알고리즘을 선택하였는데, 이유는 
* 임계치로 설정할 값(팔로워 수)의 표본의 분포가 더 다양하기 때문에 임계치 설정에 있어 보다 세밀한 설정이 가능할 것이며, 
* 셀럽인지 비셀럽인지에 따라 fan-out 쓰기 여부를 결정하는 것이 시스템 구현에 있어 보다 직관적이라고 판단하였다.




<br><br><br>

---
# 🌞 구현
---
## 🌿 스프링 빈 설정 비교
---
Pull과 Push 두 방식 모두 `TweetService` 인터페이스를 구현하도록 하여(다형성), 비즈니스 로직 계층의 스프링 빈 설정만 변경하면 간단히 해당 방식대로 애플리케이션이 동작하도록 하였다.
<br>

---
### 🫐 스프링 빈 설정: Pull 방식 비즈니스 계층(알고리즘1)
Pull 방식으로 구현시 비즈니스 계층에 대한 설정은 아래와 같다.
```java
@RequiredArgsConstructor
@Configuration
public class ServiceConfig {

    ...

    private final TweetRepository tweetRepository;

    @Bean
    public TweetService tweetService() {
        return new TweetDefaultService(tweetRepository);
    }
}
```
<br>

---
### 🫐 스프링 빈 설정: Pull+Push 혼합 방식(알고리즘2-B)
Pull+push 혼합 방식으로 구현시 비즈니스 계층에 대한 설정은 아래와 같다.
```java
@RequiredArgsConstructor
@Configuration
public class ServiceConfig {

    private final UserRepository userRepository;
    private final TweetRepository tweetRepository;
    private final FollowRepository followRepository;
    private final FanOutRepository fanOutRepository;

    @Bean
    public TweetService tweetService() {
        return new TweetFanOutService(userRepository, tweetRepository, followRepository,
            fanOutRepository);
    }
}
```

<br>

Pull+push 혼합 방식을 위해 데이터 접근 계층에 `FanOutRepository`라는 클래스에 대한 설정을 아래와 같이 추가하였다.
```java
@RequiredArgsConstructor
@Configuration
public class PersistenceConfig {

    private final TweetMapper tweetMapper;

    private final RedisTemplate<String, Object> objectFanOutRedisTemplate;
    private final RedisTemplate<String, String> stringFanOutRedisTemplate;

    ...

    @Bean
    public TweetRepository tweetRepository() {
        return new TweetRepositoryV1(tweetMapper);
    }

    @Bean
    public FanOutRepository fanOutRepository() {
        return new FanOutPublisherRepository(tweetMapper, objectFanOutRedisTemplate,
            stringFanOutRedisTemplate);
    }
}
```










<br>
<br>

---
## 🌿 비즈니스 로직 구현 비교: 트윗 작성하기
---
### 🫐 트윗 작성하기 - Pull 방식(알고리즘 1)
```java
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
@Service
public class TweetDefaultService implements TweetService {

    private final TweetRepository tweetRepository;
    
    // 트윗 작성하기
    @Override
    public Tweet composeTweet(String userId, TweetComposeRequestDto tweetComposeRequestDto) {

        Tweet tweet = Tweet.builder()
            .id(UUID.randomUUID().toString())
            .text(tweetComposeRequestDto.getText())
            .userId(userId)
            .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
            .build();
            
        // 관계형 DB에 트윗 쓰기
        return tweetRepository.save(tweet);
    }
    
    ...
}
```

<br>

---
### 🫐 트윗 작성하기 - Pull+Push 혼합 방식(알고리즘 2-B)
```java
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
@Service
public class TweetFanOutService implements TweetService {

    private final UserRepository userRepository;
    private final TweetRepository tweetRepository;
    private final FollowRepository followRepository;
    private final FanOutRepository fanOutRepository;
    
    // 트윗 작성하기
    @Override
    public Tweet composeTweet(String userId, TweetComposeRequestDto tweetComposeRequestDto) {

        Tweet tweet = Tweet.builder()
                .id(UUID.randomUUID().toString())
                .text(tweetComposeRequestDto.getText())
                .userId(userId)
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        // 관계형 DB에 트윗 쓰기
        tweetRepository.save(tweet);

        // (추가 로직)본인이 셀럽계정에 해당하지 않는 경우에 한해 팬아웃 실행
        if (!checkIfCelebrity(userId)) {

            // 팔로워 userId 목록 읽기
            List<String> followerIds = followRepository.findFollowerIdsByFolloweeId(userId);

			// 팬아웃 실행
            fanOutRepository.operateFanOut(followerIds, tweet);
        }

        return tweet;
    }
    
    ...

```


<br><br>

---

## 🌿 비즈니스 로직 구현 비교: 타임라인 불러오기
---
### 🫐 타임라인 불러오기 - Pull 방식(알고리즘 1)
타임라인 불러오기는 UI 디자인상 최초 1회 로드 후 스크롤이 로드한 페이지의 끝에 도달하면 추가 로드 요청이 트리거된다고 가정하여, 최초 조회 요청과 이후 추가 요청으로 나누어 구현하였다.

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
@Service
public class TweetDefaultService implements TweetService {

    private final TweetRepository tweetRepository;
    
    ...

    // 타임라인 불러오기(최초)
    @Override
    @Transactional(readOnly = true)
    public List<Tweet> getInitialTweets(String userId) {
        return tweetRepository.findInitialTimelinePageTweets(userId);
    }

    // 타임라인 추가 불러오기
    @Override
    @Transactional(readOnly = true)
    public List<Tweet> getMoreTweets(String userId, LocalDateTime createdAtOfTweet) {
        return tweetRepository.findNextTimelinePageTweets(userId, createdAtOfTweet);
    }
```
* `@Transactional(isolation = Isolation.READ_COMMITTED)`
    * Spring JTA의 기본 트랜잭션 격리 단계는 `ISOLATION_DEFAULT`, 즉, 사용하는 RDBMS의 기본 설정에 따르도록 되어있다. 관계형 DB로써 MySQL을 선택하였고 MySQL의 기본 격리 단계 설정은 `REPEATABLE_READ`이다. 타임라인 조회의 경우 엄격한 데이터의 일관성보다 성능이 우선된다고 판단하였고, 이에 격리 단계를 `READ_COMMITTED`로 설정하였다.



<br>

---
### 🫐 타임라인 불러오기 - Pull+Push 혼합 방식(알고리즘 2-B)
Pull+Push 혼합방식 역시 타임라인 최초 조회 요청과 이후 추가 요청으로 나누어 구현하였다.
```java
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
@Service
public class TweetFanOutService implements TweetService {

    private final UserRepository userRepository;
    private final TweetRepository tweetRepository;
    private final FollowRepository followRepository;
    private final FanOutRepository fanOutRepository;

    // 타임라인 불러오기(최초)
    @Override
    @Transactional(readOnly = true)
    public List<Tweet> getInitialTweets(String userId) {

        // 1. 팔로우중인 셀럽유저의 최신 트윗 목록 관계형 DB에서 탐색 및 읽기
        List<Tweet> tweetsOfCelebFollowees = lookForTweetsOfCelebFollowees(userId);

        // 2. 팔로우중인 일반유저의 최신 트윗 목록 타임라인 전용 팬아웃 저장소에서 읽기
        Set<Object> tweetsObjectsOfNonCelebFollowees = fanOutRepository.findTweetsObjectsOfNonCelebFollowees(
                userId,
                INT_ZERO_AS_START_INDEX_OF_RANGE_SEARCH,
                TWEET_LOAD_LIMIT);

        // 3. 셀럽유저와 일반유저의 최신 트윗 목록 병합 및 반환
        return mergeFolloweeTweets(tweetsOfCelebFollowees, tweetsObjectsOfNonCelebFollowees);
    }

    // 타임라인 추가 불러오기
    @Override
    @Transactional(readOnly = true)
    public List<Tweet> getMoreTweets(String userId, LocalDateTime createdAtOfTweet) {

        // 1. 팔로우중인 셀럽유저의 최신 트윗 목록 관계형 DB에서 탐색 및 읽기
        List<Tweet> tweetsOfCelebFollowees = lookForTweetsOfCelebFollowees(userId);

        // 2. 팔로우중인 일반유저의 최신 트윗 목록 타임라인 전용 팬아웃 저장소에서 읽기
        Set<Object> tweetsObjectsOfNonCelebFollowees = fanOutRepository.findTweetsObjectsOfNonCelebFollowees(
                userId,
                Double.MIN_VALUE,
                createdAtOfTweet.toEpochSecond(ZoneOffset.UTC),
                INT_ZERO_AS_START_INDEX_OF_RANGE_SEARCH,
                TWEET_LOAD_LIMIT);

        // 3. 셀럽유저와 일반유저의 최신 트윗 목록 병합 및 반환
        return mergeFolloweeTweets(tweetsOfCelebFollowees, tweetsObjectsOfNonCelebFollowees);
    }
```
<br>

셀럽유저의 목록을 관계형 DB에서 탐색하고 읽어오기 위한 로컬함수 `lookForTweetsOfCelebFollowees()`가 아래와 같이 추가되었다. 
```java
    private List<Tweet> lookForTweetsOfCelebFollowees(String userId) {
        // 1. 팔로우중인 셀럽유저 id 목록 조회용 Redis Key 생성
        String redisKeyForCelebFolloweeIdList = PREFIX_FOR_CELEB_FOLLOWEE_ID_LIST_KEY + userId;

        // 2. 팔로우중인 셀럽유저 id 목록 Redis에서 조회
        List<String> celebFolloweeIds = fanOutRepository.findCelebFolloweeIds(
                redisKeyForCelebFolloweeIdList,
                INT_ZERO_AS_START_INDEX_OF_RANGE_SEARCH,
                INT_NEGATIVE_ONE_AS_END_INDEX_OF_RANGE_SEARCH);

        // 3. 팔로우중인 셀럽유저의 최신 tweet 목록을 관계형 DB에서 조회
        return fanOutRepository.findListOfTweetsByUserIds(celebFolloweeIds, TWEET_LOAD_LIMIT);
    }
    
    ...
```
* 2번: 관계형 DB에서의 탐색 시간을 줄이기 위해 팬아웃 전용 저장소에 팔로우중인 셀럽유저 id 목록을 미리 저장해두었다.

<br>

셀럽유저와 일반유저의 최신 트윗 목록 병합을 위한 로컬함수 `mergeFolloweeTweets()`가 아래와 같이 추가되었다.
```java
    private static List<Tweet> mergeFolloweeTweets(
            List<Tweet> tweetsOfCelebFollowees,
            Set<Object> tweetsObjectsOfNonCelebFollowees) {

		// 일반유저의 최신트윗이 존재할 경우 셀럽유저와 일반유저의 최신 트윗 목록 병합 및 반환
        if (tweetsObjectsOfNonCelebFollowees != null) {

            return Stream.concat(
                            tweetsOfCelebFollowees.stream(),
                            tweetsObjectsOfNonCelebFollowees.stream()
                                    .filter(obj -> obj instanceof Tweet)
                                    .map(obj -> (Tweet) obj))
                    .sorted(Comparator.comparing(
                            Tweet::getCreatedAt,
                            Comparator.reverseOrder()))
                    .limit(TWEET_LOAD_LIMIT)
                    .collect(Collectors.toList());
        }
        
        // 일반유저의 최신트윗이 존재하지 않을 경우 셀럽유저의 최신 트윗 목록만 반환
        return tweetsOfCelebFollowees();
    }
    
    ...
```


<br>
<br>
<br>

---
# 🌞 다음으로
---
지금까지 트위터 API의 `타임라인(모아보기) 읽기 450,000 TPS`, `트윗 쓰기 6,000 TPS`의 대용량 데이터, 대규모 트래픽 상황에서 `5초 미만의 지연시간`을 보장하기 위한 SNS 알고리즘에 대해 고민하고 API 구현 과정에 대해 정리해보았다. 하지만 이는 어디까지나 단일 노드와 애플리케이션의 비즈니스 계층 단계에서의 고민들이었다.

다음 포스팅에선 여기에서 더 나아가 아키텍처 디자인 관점에서 성능을 최적화하는 방법, 그리고 SNS의 또 다른 핵심 요구사항인 `가용성`을 보장하는 방법, 트위터 API에 최적인 저장소를 선택하는 기준들, 선택 과정과 그 이유에 대해 알아보고자 한다.





<br>
<br>
<br>

---
# 🌞 Reference
---
1.https://www.statista.com/statistics/970920/monetizable-daily-active-twitter-users-worldwide/
2. 데이터 중심 애플리케이션 설계
3. https://www.dsayce.com/social-media/tweets-day/

가독성 가독성 가독성

![](https://velog.velcdn.com/images/rmndr/post/5e0264dc-8c14-4508-8d09-e62394413546/image.png)

📒✏️🔔🔈📢🌐💻📝💡📍🌿📌🌞🫐⌨️🗺️🎙️🕯️📎🖇️🔍🔎🔐🔒🔓🔑🗝️⚙️🛰️🚀🛸🎷🎲🏆🧩⚠️♻️🔖🎾🐚🪙🎁🖊️🖋️✒️🖌️🖍️📁🗂️