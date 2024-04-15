[02.v.06] 본문
신뢰할 수 없는 여러 부품으로 신뢰할 수 있는 시스템 구축하기

  # 📢 들어가며

SNS나 플랫폼 서비스의 애플리케이션은 반드시 증가하는 트래픽에 효과적으로 대처할 수 있도록 설계되어야 한다. 최근, 세계적으로 신규 런칭 서비스의 유저 1억 명 달성 기간 주기가 점점 짧아지고 있다. 바이트댄스사의 'Tiktok'은 서비스 런칭후 가입자 1억 명 달성까지 9개월, 오픈AI사 ‘ChatGPT’는 2개월, 메타(전 페이스북)사 ’Threads’는 불과 5일이 소요되었다.

이전 포스팅에서 언급했듯이, SNS나 플랫폼 서비스에서 유저들은 니즈의 수요자, 공급자로서 참여하고 서로 수혜를 주고 받게 되며, 유저 수가 많아질 수록 외부 유저의 유입 메리트 또한 커지는 선순환 구조(네트워크 효과)를 갖는다. 이는 반대로 유저의 이탈이 그만큼 서비스에 치명적일 수 있음을 의미하기도 한다.

트래픽이 증가해 부하가 커지면 지연시간이 늘어나거나 시스템에 장애가 생겨 서비스가 중단될 수 있다. 이는 유저 이탈을 유발하기 때문에 부하 증가에 효과적으로 대처할 수 있는 애플리케이션의 '확장성'이 필수이다.

이번 포스팅에서는 이와 관련하여:

>* 트래픽과 부하가 증가하는 상황에서 성능을 유지하는 방법
* 결함내성을 위한 분산 데이터 시스템과 제약조건, 트레이드 오프
* 애플리케이션에 적합한 데이터 저장소 선택의 기준들

등 확장성 있는 애플리케이션을 위한 고민, 설계 및 구현 과정을 정리해보고자 한다.

<br><br><br>

---
# 📢 문제1. 트래픽의 지속적인 증가

계속하여 늘어나는 트래픽에 대처하고 성능을 개선하기 위해서는 서버를 확장해야 한다. 서버 확장에는 어떤 방법들이 있을까?

<br>

## 🖋️ 스케일업 vs. 스케일아웃

서버의 확장의 방법에는 스케일업과 스케일아웃이 있다.

>* 스케일업: 수직 확장이라고도 하며, 단일 서버(하드웨어)의 성능을 증가시켜서 더 많은 요청을 처리하는 방법이다. 단일 하드웨어의 성능을 높이기 위해 CPU, 메모리, 하드디스크를 업그레이드 하거나 추가하는 것이다. 

>* 스케일아웃: 수평 확장이라고도 하며, 동일 사양의 새로운 서버(하드웨어)를 추가하는 방법이다.

<br> 

### 📌 트레이드오프

스케일업과 스케일아웃에는 각각의 트레이드오프가 존재한다. 이를 정리하자면 다음과 같다.

![](https://velog.velcdn.com/images/rmndr/post/897f62df-96f9-4145-89b3-d09c2d9c78ec/image.jpg)


<br>

## 💡 솔루션

다음을 근거로 스케일아웃이 타임라인 API에 더 적합하다고 판단하였다. 트위터의 경우 단일 요청에 대한 연산이 단순한 반면 개별 요청의 빈도가 높다는 특징을 갖고 있다. 이런 경우 스케일 아웃과 함께 로드밸런싱으로 부하를 분산할 수 있으므로 트래픽 증가에 효과적인 대처가 가능하다. 반면 스케일업 방식으로는 트위터가 요구하는 연산 특징상 효율적이지 않고, 비용효과적이지도 않으며, 물리적 확장에 한계가 있다. 또한 SNS 특성상 스케일업을 위한 서비스 중단은 감수하기에 너무나 큰 비용이다. 

이런 상황에서는 한 노드에 연산 능력을 집중하는 것보다, 여러 노드에 데이터를 분산시키고 로드밸런싱을 통해 부하를 고르게 분산할 수 있는 스케일 아웃이 적합하다고 판단하였다.

여기에 더해 데이터의 가용성을 보장하기 위해서도 스케일 아웃이 반드시 필요하다.

<br><br><br>





























---

# 📢 문제2. 결함에 견고한 데이터 시스템 만들기


<br>

## 🖋️ 데이터 분산의 제약조건과 트레이드오프

### 📌 데이터 분산의 종류와 이점

스케일 아웃은 곧 여러 노드로의 데이터 분산을 의미한다. 데이터 분산에는 크게 복제와 파티셔닝이 있다.

#### 복제(replication)
복제는 동일한 데이터를 중복하여 다른 노드에 추가로 저장하는 방법이다. 복제는 크게 두 가지 이점이 있다. 첫 째로는 데이터를 여러 노드에 복제함으로써 데이터 접근 부하를 분산시켜 성능을 개선할 수 있고, 둘 째로 한 노드가 장애로 단절된다고 하여도 다른 노드에서 데이터에 접근할 수 있다. 즉, 가용성을 높인다.

#### 복제와 고가용성
보통 한 대 이상의 리더(마스터) 노드와 한 대 이상의 팔로워(또는 레플리카) 노드를 두며, 주로 쓰기 요청은 리더 노드에서, 읽기 요청은 팔로워 노드에서 처리한다. 리더 노드나 네트워크에 문제가 생겨 리더가 단절될 시 그 외의 정족수(quorum) 노드의 동의하에 팔로워 노드를 리더로 승격시켜 쓰기 작업을 할 수 있도록 한다.

#### 파티셔닝(partitioning)
파티셔닝은 데이터를 여러 노드에 중복없이 작은 단위로 나누어 저장하는 방법이다. 파티셔닝은 쓰기 성능 개선에 기여한다. 각 노드는 더 작은 단위의 데이터를 갖게 되므로, 데이터 갱신시 색인 조정에 드는 부하도 줄어들게 된다. 또한 여러대의 노드에서 동시에 쓰기 작업을 할 수 있게 되므로 쓰기 부하를 분산할 수 있다. 후술할 레디스 같은 싱글 스레드 기반 데이터 저장소는 노드에 CPU가 다수 개 있어도 하나밖에 사용하지 않게 되므로, 파티셔닝으로 여러 노드를 사용하면 쓰기 성능에 추가 이점이 생긴다.

#### 파티셔닝과 일관성 해싱(consistent hashing)
...🐣🐣🐣

<br>

### 📌 분산 시스템의 비용

분산 시스템에서는 노드간의 단절로 인해 여러 제약사항이 따르게 된다. 분산 환경은 네트워크를 통해 여러 대의 노드가 서로 연결되어 구축된다. 불행히 네트워크의 장애와 지연은 일상적이며, 또한 개별 노드에 문제가 생겨 해당 서버가 중단되거나 지연이 발생할 수도 있다. 이로 인해 개발자는 서비스의 요구사항에 따라 다음중 선택과 포기를 하게 된다.

> * 일관성(consistency): 모든 시스템은 특정 순간 항상 동일한(일관된) 데이터를 갖는다.

>* 가용성/내결함성(availability/fault-tolerance): 시스템에 대한 모든 요청에 항상 응답을 반환할 수 있다.

>* 분단 내성(partition-tolerance): 네트워크 분단(network partition) 등 어떤 상황에서도 시스템은 동작할 수 있다.

분산 시스템에서 네트워크가 올바르게 동작할 때는 시스템이 일관성(선형성)과 완전한 가용성 모두를 제공할 수 있다. 하지만 네트워크 장애는 일종의 결함이고 상시적이며 선택할 수 있는 것이 아니므로, 네트워크 분단이 생겼을 때 일관성과 가용성 중 하나를 선택할 수 밖에 없다(원래 CAP 정리는 일관성과 가용성, 분단 내성 셋 중 두 가지를 고르라'는 내용이지만, 현실에서 네트워크 분단은 선택 사항이 아니다).

<br>

### 📌 선형성과 가용성

선형성(linearization)을 구현하는 애플리케이션에서는 쓰기 작업이 모든 리더와 팔로워 노드에 동기화 되어 특정 순간 항상 동일한 데이터를 가지며 일관성을 보장한다. 애플리케이션은 모든 요청에 대한 일관성 있는 응답을 보장하거나, 불가시 아예 반환하지 않는다(장애가 복구될 때 까지 기다리거나 오류 반환). 이 때, 

* 구조상 전체 시스템이 마치 하나와 같이 움직여 한 노드의 장애에도 전체 시스템이 취약해질 수 있고,
* 한 요청에서 특정 데이터에 대한 문제가 생길시 다른 요청에서도 해당 데이터에 접근할 수 없게 되며(가용성 포기), 
* 하나의 요청과 연관된 노드 모두에 잠금(lock)이 필연적이므로 성능이라는 큰 비용 또한 지불해야 한다.

반면, 가용성을 지원하는 시스템에서는 모든 요청에 대한 응답을 반드시 보장한다. 네트워크 분단 상황에서 일관성이 아닌 가용성을 택할시 트레이드 오프가 발생하는데, 데이터가 최신이 아닐 수도 있게 된다. 즉, 데이터의 일관성을 포기한다. 다만 시간이 흐르면서 장애가 복구되거나 하여 분산 노드간 데이터는 최종적으로 일관성을 갖게 되는데 이를 최종적 일관성(eventual consistency)라고 한다.

<br>

### 📌 가용성과 BASE

현실의 분산 시스템에서는 성능과 결함에 대한 취약성 이슈로 선형성을 구현하는 애플리케이션은 드물며, 대부분의 분산 시스템이 가용성을 택한다. 가용성을 제공하는 분산 시스템의 데이터와 관련한 특징은 흔히 'BASE'로 정리되기도 한다.

- Basically Available: ‘기본적으로’ 가용하다는 뜻으로, 데이터는 항상 가용하되 일관성이 보장되지 않음을 뜻한다.
- Soft state: 일관성이 보장되지 않기에 특정 시점의 상태(state)에 대해 명확히(solid) 정의할 수 없다.
- Eventual Consistency: 충분한 시간이 흐를시 시스템의 모든 데이터는 최신 상태가 보장된다.

BASE의 반대 개념으로 'ACID'를 꼽기도 하는데, 이는 다음 포스팅의 '분산 트랜잭션' 주제에 관해 다룰 때 함께 정리하고자 한다.

<br>

## 💡 솔루션

유저들 모두의 타임라인이 반드시 '동시에' 동일해야 할까? 이같은 높은 일관성을 요구하는 서비스의 대표적 예로는 계좌 이체 서비스가 있다. 계좌 이체 서비스에는 아주 잠깐이라도 계좌의 잔고가 다르게 조회될시 치명적인 문제를 야기할 수 있다.

반면 타임라인의 경우, 수 초에서 수 분동안 서로 다르게 보이더라도 유저의 경험에 큰 해악이 없다. 즉 높은 일관성이 요구되지 않는다. 다만 그 동일하지 않은 시간이 너무 길어지지 않도록 일정 시간이 흐르면 결과적으로 모든 유저가 일관성 있는 데이터를 접하게 되는 결과적 일관성으로 타협이 가능하다.

일관성을 포기함으로써 낮은 지연시간으로 응답할 수 있는 성능이 얻을 수 있다. 더하여 트위터는 글로벌 서비스이므로, 세계 각 지역에 데이터 센터를 구축해 관리하는 것이 지연시간 단축에 유리할 수 있다.

또한 장비의 결함이나 네트워크의 장애는 일상적으로 일어나는 통제 범위 밖의 영역이다. 전술했듯 가용성은 트위터에서 가장 민감한 이슈이다. 장애에 빠르게 대처가 불가하다면 이는 곧 사용자 이탈로 이어질 수 있기 때문이다. 일관성을 포기함으로써 어떤 상황에서라도 요청에 대해 응답할 수 있는 가용성을 확보하는 것이 중요하다.

<br><br><br>



































---

# 📢 문제3. 타임라인 API에 적합한 저장소 선택하기

> 💡 데이터 저장소의 선택은 곧 정보를 어떻게 구성하고 접근하며 분산(확장)할 것인지를 결정한다. 이는 애플리케이션의 성능과 구현 복잡도, 유지보수에까지 광범위한 영향을 미친다. 그렇다면 데이터 저장소의 선택 기준에는 어떤 것들이 있으며, 어떻게 애플리케이션에 맞는 데이터 저장소를 고를 수 있을까?

<br>



## 🖋️ 데이터 모델과 저장소

데이터 모델 관점에서 저장소의 발전 과정(맥락)에 대해 알아보고, 다양한 데이터 모델 저장소들의 특징을 비교해 봄으로써 애플리케이션의 성능과 확장성 요구사항에 맞는 합리적인 결정을 내릴 수 있다.


### 📌 다대다 관계와 저장소의 발전

역사 초기의 저장소들은 트리 구조로 데이터의 일대다 관계를 표현했지만 다대다 관계라는 한계에 부딪혀 지원하지 않거나, 지원하더라도 개발자가 수동으로 관리해야 하는 등 유지에 큰 비용이 발생하였다. 이후 관계형 모델을 통해 다대다 관계를 효율적으로 표현하고 질의 최적화기로 관리를 추상화하면서 편의와 접근성을 끌어올렸다. 최근엔 대용량, 비정형 데이터에 대한 새로운 니즈가 대두되면서 확장성을 강조한 비관계형 저장소가 새롭게 떠오르게 되었다.

주요 데이터 모델, 저장소의 발전과정은 아래와 같다.

1. `계층 모델`: 1960년대 IBM의 정보 관리 시스템(IMS)의 ‘계층 모델’은 모든 데이터를 레코드 내에 중첩된 레코드 트리로 표현하였다. 이는 일대다 관계에서는 잘 동작했지만 다대다 관계 표현은 어려웠고, 조인 또한 지원하지 않았다. 개발자는 (비정규화된)데이터를 중복할지, 다른 레코드의 참조를 수동으로 해결할지 결정해야 했다(현재 문서 데이터 저장소의 문제와 매우 유사).
2. `네트워크 모델`: 네트워크 모델은 계층 모델을 일반화했으며, 계층 모델의 트리 구조에서 모든 레코드가 정확히 하나의 부모를 가졌던 것과 다르게 다중 부모를 허용하여 다대다 관계를 모델링할 수 있었다. 하지만 이 방식에서 레코드에 접근하는 유일한 방법은 최상위 레코드(root record)에서부터 연속된 연결 경로(접근 경로)를 따르는 것이었다. 다양한 다른 경로가 같은 레코드로 이어질 수 있기 때문에, 개발자는 이러한 접근 경로를 계속 추적하고 변경시 재작성 해야 했으며, 애플리케이션의 데이터 모델을 바꾸는 일이 매우 어려웠다.
3. `관계형 모델`: 관계(테이블)는 단순히 튜플(로우)의 컬렉션이 전부이고, 새로운 방식으로 데이터에 질의하고 싶으면 색인을 선언하기만 하면 된다. 관계형 데이터 저장소의 큰 차이점은 질의 최적화기(query optimizer)인데, 질의의 순서와 사용할 색인을 자동으로 결정해주며, 따라서 “접근 경로”를 따로 생각할 필요가 없다.
4. `문서 모델`: 문서 데이터 모델에서는 데이터가 문서 자체에 포함돼 있으며, 하나의 문서와 다른 문서 간 관계가 거의 없는 사용 사례를 대상으로 한다. 문서 데이터 저장소는 한 가지 측면에서 계층 모델로 회귀하였는데, 다대다 관계 표현시 별도 테이블이 아닌 상위 레코드 내 중첩된 레코드를 저장한다는 점이 그 것이다. 또한 관계형 데이터 저장소와 문서 데이터 저장소는 다대일과 다대다 관계를 표현할 때 본질적으로 다르지 않은데, 관련 항목을 고유 식별자(전자의 경우 ‘외래 키’, 후자의 경우 ‘문서 참조’)로 참조하고 이를 조인이나 후속 질의를 통해 읽기 시점에 확인한다는 점에서 그렇다. (지정하는 스키마가 없이 사용된다.🐣🐣🐣)
5. `그래프 모델`: 그래프형 모델은 다대다 관계가 매우 일반적인 경우에 사용하며, 모든 것이 잠재적으로 관계가 있다는 사례를 주요 대상으로 한다는 점에서 문서 데이터 저장소와 정반대이다. 그래프는 정점(vertex)와 간선(edge)의 두 객체로 이뤄지며, 간선에 의해 모든 유형(관계형 모델에서의 테이블 또는 관계)의 정점이 연결될 수 있다. 이는 완전히 다른 유형의 객체를 일관성 있게 저장할 수 있는 강력한 방법을 제공한다. 

<br>



### 📌 데이터 모델과 선택지


#### 키-값 모델

키 하나로 데이터 하나를 저장하고 조회할 수 있는 단일 키-값 구조를 가진다. 대부분의 키-값 모델 저장소는 단순한 저장구조로 인해 복잡한 조회 연산을 지원하지 않으며, 고속 읽기 및 쓰기에 최적화된 경우가 많다. 비교적 API가 단순하여 쉬운 접근성을 제공한다. 대부분 저장된 데이터에 대한 검증이나 데이터 내용에 기반한 조회를 지원하지 않으며, 저장 값을 의미 없는 바이너리 데이터로 처리한다.

주의할 점: 한 사용자의 구매 목록이 많을 때는 더 많은 연산이 필요하게 되어 NoSQL의 장점을 살리지 못하게 된다. 이 같은 요구사항을 처리하기 위해 키-값 모델 NoSQL을 사용해 반환을 적용한다면 시말서를 쓸지도 모른다. 이럴 땐 다른 모델의 NoSQL을 선정하는 것이 타당하다. 

지정하는 스키마가 없이 사용된다.


#### 컬럼 모델

하나의 키(로우키+컬럼키 조합)에 여러 개의 컬럼 이름과 컬럼 값의 쌍을 데이터로 저장하고 조회하며, 저장과 조회의 기본 단위는 컬럼이다. 컬럼 모델 데이터 저장소는 대부분 구글 빅테이블의 영향을 받아 로우키, 컬럼키, 컬럼 패밀리, 테이블(로우의 집합/키 스페이스) 같은 개념을 공통적으로 사용한다.
관계형 모델과 유사하지만 관계형 데이터 저장소는 물리적으로 데이터를 저장할 때 컬럼의 집합인 레코드를 기준으로 데이터 파일을 생성하지만, 컬럼 모델 데이터 저장소는 컬럼 패밀리를 기준으로 데이터 파일을 생성한다. 따라서 하나의 로우에 저장된 모든 컬럼을 조회하는 것보다 로우키에 해당하는 컬럼 패밀리를 조회하는 것이 더 빠르며, 하나의 로우에 많은 컬럼 패밀리를 지정하면 응답시간이 늘어나게 된다.
또 다른 차이점은 컬림의 타임스탬프(버전)인데, 컬럼 모델에서 모든 컬럼은 항상 타임스탬프값과 함께 저장되며, 동일한 로우키와 컬럼키를 가진 필드를 추가하고 유지할 수 있다. 이미 저장되어 있는 컬럼과 동일한 로우키와 컬럼키를 가진 필드를 추가하면 최근의 타임스탬프를 가진 새로운 컬럼이 추가되어 동일한 이름을 가진 컬럼에 두 개의 값이 유지된다.
컬럼 모델은 로우키의 사전식 정렬 저장을 기본 전제로 하며, 범위 질의가 가능하다. 마찬가지로 컬럼도 저장시 동일한 컬럼 패밀리 내에서 컬럼 이름(컬럼키) 순으로 저장한다.
스키마 레벨에서 저장 가능한 필드 개수가 고정인 관계형 데이터 저장소와 달리, 컬럼 모델 데이터 저장소의 스키마는 테이블의 이름과 컬럼 패밀리의 이름을 지정하는 스키마를 생성하며(느슨한 스키마 제공), 로우키 하나에 저장 가능한 컬럼 개수 제한이 없다.

<br>






## 🖋️ 자료구조와 저장소

이번엔 데이터를 저장하는 주요 방법과 데이터를 다시 찾을 수 있는 방법들에 대해 알아보겠다. 크게 SS테이블과 LSM 트리 기반의 로그 구조(log-structured) 계열 저장소 엔진과 B-tree 기반의 페이지 지향(page-oriented) 계열 저장소 엔진이 있다.

### 📌 페이지 vs. 로그 구조


#### 페이지 지향 색인
페이지 지향 계열 저장소는 색인을 위해 대표적으로 B-tree를 기반으로 한다.

#### B-tree

가장 널리 사용되는 색인 구조이다. 대부분의 관계형 데이터베이스에서 표준 색인 구현으로 사용하며, 많은 비관계형 데이터베이스에서도 사용한다.

전통적으로 4KB의 고정 크기 블록이나 페이지로 나누고 한 번에 하나의 페이지에 읽기 또는 쓰기를 한다. 디스크가 고정 크기 블록으로 배열되기 때문에 이런 설계는 근본적으로 하드웨어와 조금 더 밀접한 관련이 있다.
각 페이지는 주소나 위치를 이용해 식별할 수 있다. 이 방식으로 하나의 페이지가 다른 페이지를 참조할 수 있다(포인터와 비슷하지만 메모리 대신 디스크에 있음).

한 페이지는 B-tree의 루트(root)로 지정된다. 색인에서 키를 찾으려면 루트에서 시작한다. 페이지는 여러 키와 하위 페이지의 참조를 포함한다. 각 하위 페이지는 키가 계속 이어지는 범위를 담당하고 참조 사이의 키는 해당 범위 경계가 어디인지 나타낸다.

최종적으로는 개별 키(리프 페이지(leaf page))를 포함하는 페이지에 도달한다. 이 페이지는 각 키의 값을 포함하거나 값을 찾을 수 있는 페이지의 참조를 포함한다.

B 트리의 한 페이지에서 하위 페이지를 참조하는 수를 분기 계소(branching factor)라고 부른다. 실제로 분기 계수는 페이지 참조와 범위 경계를 저장할 공간의 양에 의존적인데, 보통 수백 개에 달한다.

B 트리에 존재하는 키의 값을 갱신하려면 키를 포함하고 있는 리프 페이지를 검색하고 페이지의 값을 바꾼 다음 페이지를 디스크에 다시 기록한다(페이지에 대한 모든 참조는 계속 유효하다). 새로운 키를 추가하려면 새로운 키를 포함하는 범위의 페이지를 찾아 해당 페이지에 키와 값을 추가한다. 새로운 키를 수용한 페이지에 충분한 여유 공간이 없다면 페이지 하나를 반쯤 채워진 페이지 둘로 나누고 상위 페이지가 새로운 키 범위의 하위 부분들을 알 수 있게 갱신한다.

이 알고리즘은 트리가 계속 균형을 유지하는 것을 보장한다. n개의 키를 가진 B 트리는 깊이가 항상 O(log n)이다. 대부분의 데이터베이스는 B 트리의 깊이가 3이나 4단계 정도면 충분하므로 검색하려는 페이지를 찾기 위해 많은 페이지 참조를 따라가지 않아도 된다(분기 계수 500의 4KB 페이지의 4 단계는 256TB까지 저장할 수 있다).

500^4 * 4096B = 256TB

<br>

#### 로그 구조 지향 색인

로그 구조 계열 저장소는 색인을 위해 주로 SS테이블을 활용한 LSM 트리를 기반으로 한다.

#### SS테이블

키-값 쌍의 연속. 이 쌍은 쓰여진 순서대로 나타난다. 같은 키를 갖는 값 중 나중의 값이 이전 값보다 우선한다.
일련의 키-값 쌍을 키로 정렬한다.
키-값 쌍의 연속이며 키로 정렬된 형식.

#### LSM 트리

로그 구조화 병합 트리(log-structured merge-tree)(또는 LSM 트리)는 로그 구조화 파일 시스템의 초기 작업의 기반이 됐으며, 이렇게 정렬된 파일 병합과 컴팩션 원리를 기반으로 하는 저장소 엔진을 LSM 저장소 엔진이라 부른다.

...(원리 설명?)
* 쓰기가 들어오면 인메모리 균형 트리(balanced tree 또는 멤테이블(memtable)) 자료구조에 추가한다.
* 멤테이블이 보통 수 메가바이트 정도의 임곗값보다 커지면 SS테이블 파일로 디스크에 기록한다.
* 읽기 요청은 최신에서 오래된 순의 세그먼트에서 찾는다.
* 백그라운드에서 병합과 컴팩션 과정을 수행한다.

LSM 트리는 백그라운드에서 연쇄적으로 SS테이블을 지속적으로 병합한다. 데이터셋이 가능한 메모리보다 훨씬 더 크더라도 여전히 효과적이다. 데이터가 정렬된 순서로 저장돼있기 때문에 범위 질의를 효율적으로 실행할 수 있으며, 디스크의 쓰기는 순차적이기 때문에 매우 높은 쓰기 처리량을 보장할 수 있다.




#### B-tree vs. LSM Tree

B-트리가 LSM 트리보다 일반적으로 구현 성숙도가 더 높지만 LSM 트리도 그 성능 특성 때문에 관심을 받고 있다. 경험적으로 LSM 트리는 보통 쓰기에서 더 빠른 반면, B 트리는 읽기에서 더 빠르다고 여긴다. 읽기가 보통 LSM 트리에서 더 느린 이유는 각 컴팩션 단계에 있는 여러 가지 데이터 구조와 SS테이블을 확인해야 하기 때문이다.

![](https://velog.velcdn.com/images/rmndr/post/d8013030-e517-452d-9dc2-8d72951eecf0/image.jpg)


벤치마크는 보통 결정적이지 않고 작업부하의 세부 사항에 민감하다. 비교가 유효하려면 실제 필요한 작업부하로 시스템을 테스트해야 한다.



<br>


### 📌 저장소로서의 메모리

디스크는 메인 메모리와 비교해 다루기 어렵다. 자기 디스크와 SSD 사용시 읽기 및 쓰기의 좋은 성능을 위해서는 주의해 데이터를 디스크에 배치해야 한다. 그럼에도 디스크를 사용하는 이유는 지속성과 용량당 가격 때문이다.

하지만 램이 점점 저렴해졌고 데이터셋 대부분은 그리 크지 않아서, 메모리에 전체를 보관하는 방식이 현실적인 범위 안으로 들어왔다. 더하여 여러 장비 간 분산 보관도 가능하다. 이런 이유로 인메모리 데이터베이스가 개발됐다.

멤캐시드 같은 일부 인메모리 키-값 저장소는 데이터 손실을 허용하는 캐시 용도로만 사용된다. 하지만 다른 인메모리 데이터베이스는 지속성을 목표로 한다. 이 목표를 달성하는 방법에는
- 특수 하드웨어(배터리 전원 공급 RAM 등) 사용
- 디스크에 변경 사항 로그 기록
- 디스크에 주기적인 스냅숏 기록
- 다른 장비에 인메모리 상태 복제
등이 있다.

디스크는 전적으로 지속성을 위한 추가 전용 로그로 사용되고 읽기는 전적으로 메모리에서 제공된다.

레디스(Redis)와 카우치베이스(Couchbase)는 비동기로 디스크에 기록하기 때문에 약한 지속성을 제공한다.

직관에 어긋나지만 인메모리 데이터베이스의 성능 장점은 디스크에서 읽지 않아도 된다는 사실 때문은 아니다. 디스크 기반 저장소 엔진도 운영체제가 최근에 사용한 디스크 블록을 메모리에 캐시하기 때문에 충분한 메모리를 가진 경우 디스크에서 읽을 필요가 없기 때문이다. 그보단 인메모리 데이터 구조를 디스크에 기록하기 위한 형태로 부호화하는 오베헤드를 피할 수 있어 더 빠를 수도 있다.

성능 외에도 디스크 기반 색인으로 구현하기 어려운 데이터 모델을 제공한다. 예를 들어 레디스는 우선순위 큐와 셋(set) 같은 다양한 데이터 구조를 데이터베이스 같은 인터페이스로 제공한다. 또한 메모리에 모든 데이터를 유지하기 때문에 구현이 비교적 간단하다.

최근 연구에 따르면 인메모리 데이터베이스 아키텍처가 디스크 중심 아키텍처에서 발생하는 오버헤드 없이 가용한 메모리보다 더 큰 데이터셋을 지원하게끔 확장할 수 있다. 소위 안티 캐싱(anti-caching) 접근 방식은 메모리가 충분하지 않을 때 가장 최근에 사용하지 않은 데이터를 메모리에서 디스크로 내보내고 나중에 다시 접근할 때 메모리에 적재하는 방식으로 동작한다. 이것은 운영체제가 가상 메모리와 스왑 파일에서 수행하는 방식과 유사하지만 데이터베이스는 전체 메모리 페이지보다 개별 레코드 단위로 작업할 수 있기 때문에 OS보다 더 효율적으로 메모리를 관리할 수 있다. 하지만 이 접근 방식은 여전히 전체 색인이 메모리에 있어야 한다.


<br>









## 💡 솔루션

### 📌 저장소의 기준과 선택

저장소를 선택함에 있어 관계형 저장소와 비관계형 저장소를 필요에 맞게 혼합해 사용하기로 하였다.

#### 관계형 저장소

데이터 모델링에 있어 핵심 요소에 유저, 좋아요, 팔로우, 트윗 엔티티가 있고 이는 서로 일대다, 다대다의 다양한 관계를 맺으며, 관계형 저장소로 이러한 다양한 관계를 표현하기에 용이했기 때문에 관계형 저장소를 선택하였다.

더하여 타임라인 API의 Pull과 Push 방식중 Pull 방식의 구현을 위해 관계형 저장소를 사용하였다.


![](https://velog.velcdn.com/images/rmndr/post/5f51dd4e-831a-4939-a157-a42c4304f529/image.png)

<p align="center">- 트위터 API 엔티티 관계 다이어그램 -</p>


관계형 저장소로는 MySQL을 선택하였다. 오픈소스이고 트랜잭션과 확장성을 위한 JTA(Java Trnasactiona API)를 지원하며, 공식문서가 잘 정리되어 있고 많은 유저들에게 가장 광범위하게 사용되어 커뮤니티의 정보 접근에도 이점이 있다. 또한 MySQL 제공하는 기능들로 트위터의 핵심 API를 구현함에 무리가 없었다.

<br>

#### 비관계형 저장소

Push 방식의 타임라인 API 구현시 읽기 성능, 쓰기 성능 모두와 데이터를 쉽게 분산할 수 있는 능력 측면에서 비관계형 저장소를 고려해 보았다. 대표적 키-값 저장소로서 Redis와 Memcached, 문서 기반 저장소로서 MongoDB, 그리고 컬럼 기반 저장소로서 Cassandra를 검토하였다.

- Memcached: 멀티 스레드 아키텍처를 특징으로 하여 빠른 병렬처리가 가능하고, slab 할당기를 사용하여 메모리 할당을 빠르게 하면서 파편화를 방지해 메모리를 효율적으로 활용할 수 있다. 하지만 이 방식은 데이터 크기가 변할 경우 재할당을 필요로 해 추가 부하를 일으키며, 결정적으로 Redis가 제공하는 백업, 복원, 트랜잭션, 고가용성을 위한 복제 등의 추가 기능을 지원하지 않아 타임라인 API 구현에는 부적합하다고 판단하였다.
- MongoDB: 기본적으로 B-tree 색인 전략을 지원하며, 비정형 데이터를 효과적으로 다룰 수 있는 장점이 있다. B-tree는 읽기 작업에 유리하지만 쓰기 작업에서 성능 저하의 가능성이 있다. fan-out시 쓰기 병목이 생길 수 있고, 타임라인 API 특성상 MongoDB의 최대 장점중 하나인 비정형 데이터 지원을 활용하지 않으므로 상대적 메리트가 줄어든다.
- Cassandra: SS테이블을 기반으로 하는 로그 구조 지향 저장소이며 고성능의 쓰기 작업을 가능하게 한다. 또한, MongoDB와 같이 다양한 컬럼을 추가할 수 있는 유연성을 가지고 있으나 주로 한 컬럼에 속한 여러 로우의 빠른 조회에 최적화되어 있다. 따라서 타임라인 API의 요구사항과는 다소 거리가 있으며, 그보다는 데이터 분석이나 비정형 데이터를 다루는 요구사항에 더 적합할 수 있다.

최종적으로 이러한 비교와 더불어 아래와 같은 이유로 레디스를 비관계형 저장소로서 선택하였다.


![](https://velog.velcdn.com/images/rmndr/post/ae537f5e-7318-46fe-b949-0669722a491d/image.jpg)




### 📌 MySQL + Redis

#### 레디스 아키텍처



<br>





#### 레디스 센티넬 vs. 클러스터






<br>

이제까지 위의 3개 장에서 다음 3가지의 문제:

1. 트래픽의 지속적인 증가
2. 결함에 견고한 데이터 시스템
3. 적합한 저장소 선택

에 대해 정의하고 이를 해결하기 위한 이론적 근거와 선택지들에 대해 의논하였다. 이제 위에서 논의한 것들을 모두 함께 종합하여 선택을 해야한다.

선택을 위한 주요 기준, 그리고 최종적으로 선택한 해결 방법에 대한 이유는 다음과 같다. 또한 선택한 해결 방법에 대해 조금 더 자세히 알아보도록 하겠다.








<br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br>


---

# 📢 구현








<br><br><br><br><br><br><br><br><br>

<br><br><br>

---
---

# 📢 reference











---
- mongodb, redis, cassandra, graph

cost: 응답시간latency

동기식-선형성 vs. 비동기식
일관성 vs 최종 일관성

Redis
AOF(append only file, RDB)





---
* 유연성 필요: 유저 베이스가 큰 만큼 트래픽도 편차가 심할 수 있고 유연성이 필요할 수 있다. 어떨 땐 사용자 수가 폭발적으로 늘어나거나 심하게 쏠림현상이 생길 수도 있다. 예를 들어 주말 오후나 저녁 시간대에는 트래픽이 많이 쏠리고, 평일 오전 오후에는 트래픽이 훨씬 적을 수 있다.




---
읽기 요청은 db의 격리 수준isolation level에 따라 달라진다.
read committed, repeatable read, serialization




---
이점

1. 단순성: 확장이 기술적으로는 복잡하지 않다. 단순히 CPU나 RAM, 저장소를 추가하기만 하면 된다.
2. 호환성: 애플리케이션이 분산 환경을 감안하지 않아도 된다.
3. 성능: 집중 연산 능력을 요구하는 일부 작업에 효과적이며, 모든 자원들이 한 하드웨어 내에서 모두 연결돼있으므로 지연이 보다 낮을 수 있다.

트레이드오프

1. 비용: 하드웨어의 성능이 높아질 수록 비용 대비 개선 효과가 줄어들며 비싸다.
2. 물리적 제약: 아무리 좋은 하드웨어와 고사양 부품이 있다고 하더라도 단일 장비에 설치할 수 있는 슬롯에 한계가 있다.
3. 단일 고장점(SPOF, Single Point of Failure): 장애에 취약하다. 만약 고사양의 서버에 장애가 생기면 그만큼 타격이 클 수 밖에 없다.
4. 확장 편의성: 중간에 부하가 늘어나 추가로 확장하기 위해선 스케일업 과정중 백업할 비슷한 사양의 1회성 서버가 한 대가 더 필요하고 불필요한 비용이 발생하게 된다. 또한 늘어나는 속도를 예측하지 못할시 중간에 서버를 중단시켜야 할 수 있고, 기존 서버 데이터를 옮기고 데이터를 정리하려면 그 작업 시간만큼 서비스가 중단될 것이다. 이 작업은 적게는 수 시간에서 많게는 하루 이상이 걸릴 수 있는데, 사용자가 늘어날 때마다 이런 작업을 반복할 수는 없을 것이다.

---
'### 📌 스케일 아웃

스케일아웃은 수평확장이라고도 하며, 동일 사양의 새로운 서버(하드웨어)를 추가하는 방법이다.

이점

1. 유연성: 필요에 따라 장비를 추가하거나 줄일 수 있어 비용효과적이다.
2. 가용성(내결함성): 고가용성을 제공할 수 있고 데이터 분산을 통해 특정 장비의 결함에 보다 견고하다.
3. 확장성: 기본적으로 얼마나 확장할지에 대한 상한이 없으며 계속 노드를 추가할 수 있다.
4. 로드밸런싱: 로드밸런싱을 통해 부하를 고르게 분산시킬 수 있다.

트레이드오프



1. 복잡성: 분산을 위해 더 복잡한 시스템 아키텍처가 필요하며, 소프트웨어가 분산 환경에서 동작할 수 있어야 한다.
2. 관리: 노드가 늘어날 수록 노드를 관리할 수 있는 시스템이 더 많이 필요하게 되며, 운영에 필요한 부하와 복잡성이 증가한다.
3. 네트워크 의존성: 노드간 네트워크 장애나 지연에 취약하다
4. 비일관성inconsistency: 노드간 데이터 일관성과 동기화 이슈가 있을 수 있다.



<br>
---
저장 기술은 무엇을 선택할까? 확장에 유연하고 결함에 강한 분산 데이터 시스템 구축하기
확장성있는 고가용성 분산 시스템의 제약 조건과 트레이드오프(feat. 데이터 모델, 저장소, 색인)
부하 증가에 대처하는 확장과 고가용성, 그를 따르는 제약조건과 트레이드오프



<br>

---

결함은 장애(failure)와 동일하지 않다. 일반적으로 결함은 사양에서 벗어난 시스템의 한 구성 요소로 정의
장애는 사용자에게 필요한 서비스를 제공하지 못하고 시스템 전체가 멈춘 경우
결함 확률을 0으로 줄이는 것은 불가능. 따라서 대개 결함으로 인해 장애가 발생하지 않게끔 내결함성 구조를 설계하는 것이 가장 좋다.
신뢰할 수 없는 여러 부품으로 신뢰할 수 있는 시스템 구축하는 다양한 기법
(p.7)
신뢰할 수 없는 여러 부품으로 신뢰할 수 있는 시스템 구축하기(feat. 데이터 모델, 저장소, 색인)
확장성 있는 분산 데이터 시스템의  제약 조건과 트레이드오프(feat. 데이터 모델, 저장소, 색인)


<br>

---

* 비정형 데이터: 트위터 핵심 기능인 타임라인의 경우 fan-out 구현시 데이터가 비정형적이다. 지난 포스팅의 내용처럼 fan-out을 할 경우 경우 각 유저마다 타임라인을 구성해야 한다. 즉, 유저별로 타임라인이라는 데이터를 저장하게 될 것이고, 모든 유저의 타임라인은 형태가 다를 것이며 또 수시로 변한다고 볼 수 있다.

비정형 데이터는...요청할 때 데이터가 중구난방인 것인데...트위터는 요청시 정형적이지 않나? 타임라인의 경우 비록 저장하는 형태가 비정형이지만...

데이터 모델은 스키마와 관련이 있다. 형태가 있는지 없는지. 그리고 각 로우간 관계도 고려할 수 있다.


<br>

---


비관계형 데이터 저장소가 필요한 경우는 대표적으로 다음과 같다.

* 대량의 단순 정보를 빠르게 쓰고 읽을 때
* 관계형 데이터베이스가 처리하지 못하는 대량(보통 수십 기가바이트)의 데이터를 입력할 때
* 스키마가 고정되지 않은 데이터를 저장하고 조회할 때

<br>

---


보통 데이터 저장소하면 가장 범용적으로 사용되는 디스크 기반 관계형 데이터 저장소인 MySQL, PostgreSQL 등을 떠올린다. 하지만 과연 관계형 데이터 저장소가 트위터 애플리케이션에 최적일까? 다른 선택지에는 무엇이 있으며, 어떤 기준으로 데이터 저장소를 선택해야 할까?

<br>

---

'#### B-tree

가장 널리 사용되는 색인 구조이다. 대부분의 관계형 데이터베이스에서 표준 색인 구현으로 사용하며, 많은 비관계형 데이터베이스에서도 사용한다.

전통적으로 4KB의 고정 크기 블록이나 페이지로 나누고 한 번에 하나의 페이지에 읽기 또는 쓰기를 한다. 디스크가 고정 크기 블록으로 배열되기 때문에 이런 설계는 근본적으로 하드웨어와 조금 더 밀접한 관련이 있다.
각 페이지는 주소나 위치를 이용해 식별할 수 있다. 이 방식으로 하나의 페이지가 다른 페이지를 참조할 수 있다(포인터와 비슷하지만 메모리 대신 디스크에 있음).

한 페이지는 B-tree의 루트(root)로 지정된다. 색인에서 키를 찾으려면 루트에서 시작한다. 페이지는 여러 키와 하위 페이지의 참조를 포함한다. 각 하위 페이지는 키가 계속 이어지는 범위를 담당하고 참조 사이의 키는 해당 범위 경계가 어디인지 나타낸다.

최종적으로는 개별 키(리프 페이지(leaf page))를 포함하는 페이지에 도달한다. 이 페이지는 각 키의 값을 포함하거나 값을 찾을 수 있는 페이지의 참조를 포함한다.

B 트리의 한 페이지에서 하위 페이지를 참조하는 수를 분기 계소(branching factor)라고 부른다. 실제로 분기 계수는 페이지 참조와 범위 경계를 저장할 공간의 양에 의존적인데, 보통 수백 개에 달한다.

B 트리에 존재하는 키의 값을 갱신하려면 키를 포함하고 있는 리프 페이지를 검색하고 페이지의 값을 바꾼 다음 페이지를 디스크에 다시 기록한다(페이지에 대한 모든 참조는 계속 유효하다). 새로운 키를 추가하려면 새로운 키를 포함하는 범위의 페이지를 찾아 해당 페이지에 키와 값을 추가한다. 새로운 키를 수용한 페이지에 충분한 여유 공간이 없다면 페이지 하나를 반쯤 채워진 페이지 둘로 나누고 상위 페이지가 새로운 키 범위의 하위 부분들을 알 수 있게 갱신한다.

이 알고리즘은 트리가 계속 균형을 유지하는 것을 보장한다. n개의 키를 가진 B 트리는 깊이가 항상 O(log n)이다. 대부분의 데이터베이스는 B 트리의 깊이가 3이나 4단계 정도면 충분하므로 검색하려는 페이지를 찾기 위해 많은 페이지 참조를 따라가지 않아도 된다(분기 계수 500의 4KB 페이지의 4 단계는 256TB까지 저장할 수 있다).

500^4 * 4096B = 256TB

<br>


'### 📌 B 트리 vs. LSM 트리

B-트리가 LSM 트리보다 일반적으로 구현 성숙도가 더 높지만 LSM 트리도 그 성능 특성 때문에 관심을 받고 있다. 경험적으로 LSM 트리는 보통 쓰기에서 더 빠른 반면, B 트리는 읽기에서 더 빠르다고 여긴다. 읽기가 보통 LSM 트리에서 더 느린 이유는 각 컴팩션 단계에 있는 여러 가지 데이터 구조와 SS테이블을 확인해야 하기 때문이다.

벤치마크는 보통 결정적이지 않고 작업부하의 세부 사항에 민감하다. 비교가 유효하려면 실제 필요한 작업부하로 시스템을 테스트해야 한다. 이번 절에서는 저장소 엔진의 성능을 측정할 때 고려하면 좋은 사항 몇 가지를 간략히 설명한다.

'#### LSM 트리의 장점

B 트리 색인은 모든 데이터 조각을 최소한 두 번 기록해야 한다. 쓰기 전 로그 한 번과 트리 페이지에 한 번(페이지가 분리될 때 다시 기록)이다. 해당 페이지 내 몇 바이트만 바뀌어도 한 번에 전체 페이지를 기록해야 하는 오버헤드도 있다. 일부 저장소 엔진은 심지어 전원에 장애가 발생했을 때 일부만 갱신된 페이지로 끝나지 않게 동일한 페이지를 두 번 덮어쓴다.

로그 구조화 색인 또한 SS테이블의 반복된 컴팩션과 병합으로 인해 여러 번 데이터를 다시 쓴다. 데이터베이스에 쓰기 한 번이 데이터베이스 수명 동안 디스크에 여러 번의 쓰기를 야기하는 이런 효과를 쓰기 증폭(write amplification)이라 한다. SSD는 수명이 다할 때까지 블록 덮어쓰기 횟수가 제한되기 때문에 쓰기 증폭은 SSD의 경우 특별한 관심사다.

쓰기가 많은 애플리케이션에서 성능 병목은 데이터베이스가 디스크에 쓰는 속도일 수 있다. 이 경우 쓰기 증폭은 바로 성능 비용이다. 저장소 엔진이 디스크에 기록할수록 디스크 대역폭 내 처리할 수 있는 초당 쓰기는 점점 줄어든다.

더욱이 LSM 트리는 보통 B 트리보다 쓰기 처리량을 높게 유지할 수 있다. (저장소 엔진 설정과 작업부하에 따라 다르긴 하지만)LSM 트리가 상대적으로 쓰기 증폭이 더 낮고 트리에서 여러 페이지를 덮어쓰는 것이 아니라 순차적으로 컴팩션된 SS테이블 파일을 쓰기 때문이다. 이런 차이는 자기 하드드라이브에서 특히 중요하다. 자기 하드드라이브는 순차 쓰기가 임의 쓰기보다 훨씬 더 빠르다.

LSM 트리는 압축률이 더 좋다. 그래서 보통 B 트리보다 디스크에 더 적은 파일을 생성한다. B 트리 저장소 엔진은 파편화로 인해 사용하지 않는 디스크 공간 일부가 남는다. 페이지를 나누거나 로우가 기존 페이지에 맞지 않을 때 페이지의 일부 공간은 사용하지 않게 된다. LSM 트리는 페이지 지향적이지 않고 주기적으로 파편화를 없애기 위해 SS테이블을 다시 기록하기 때문에 저장소 오버헤드가 더 낮다. 레벨 컴팩션(leveled compaction)을 사용하면 특히 그렇다.

대다수의 SSD의 펌웨어는 내장 저장소 칩에서 임의 쓰기를 순차 쓰기로 전환하기 위해 내부적으로 로그 구조화 알고리즘을 사용한다. 그래서 저장소 엔진의 쓰기 패턴이 SSD에 미치는 영향은 분명하지 않다. 하지만 낮은 쓰기 증폭과 파편화 감소는 SSD의 경우 훨씬 유리하다. 데이터를 더 밀집해 표현하면 가능한 I/O 대역폭 내에서 더 많은 읽기와 쓰기 요청이 가능하다.

'#### LSM 트리의 단점

로그 구조화 저장소의 단점은 컴팩션 과정이 때로는 진행 중인 읽기와 쓰기의 성능에 영향을 준다는 점이다. 저장소 엔진은 컴팩션을 점진적으로 수행하고 동시 접근의 영향이 없게 수행하려 한다. 하지만 디스크가 가진 자원은 한계가 있다. 그래서 디스크에서 비싼 컴팩션 연산이 끝날 때까지 요청이 대기해야 하는 상황이 발생하기 쉽다. 처리량과 평균 응답 시간이 성능에 미치는 영향은 대개 작다. 하지만 로그 구조화 저장소 엔진의 상위 백분위 질의의 응답 시간은 때때로 꽤 길다. 반면 B 트리의 성능은 로그 구조화 저장소 엔진보다 예측하기 쉽다.

또 다른 컴팩션 문제는 높은 쓰기 처리량에서 발생한다. 디스크의 쓰기 대역폭은 유한하다. 초기 쓰기(로깅(logging)과 멤테이블을 디스크로 방출(flushing))와 백그라운드에서 수행되는 컴팩션 스레드가 이 대역폭을 공유해야 한다. 빈 데이터베이스에 쓰는 경우 전체 디스크 대역폭은 초기 쓰기만을 위해 사용할 수 있지만 데이터베이스가 점점 커질수록 컴팩션을 위해 더 많은 디스크 대역폭이 필요하다.

쓰기 처리량이 높음에도 컴팩션 설정을 주의 깊게 하지 않으면 컴팩션이 유입 쓰기 속도를 따라갈 수 없다. 이 경우 디스크 상에 병합되지 않은 세그먼트 수는 디스크 공간이 부족할 때까지 증가한다. 그리고 더 많은 세그먼트 파일을 확인해야 하기 때문에 읽기 또한 느려진다. 보통 SS테이블 기반 저장소 엔진은 컴팩션 유입 속도를 따라가지 못해도 유입의 쓰기 속도를 조절하지 않으므로 이런 상황을 감지하기 위한 명시적 모니터링이 필요하다.

B 트리의 장점은 각 키가 색인의 한 곳에만 정확하게 존재한다는 점이다. 반면 로그 구조화 저장소 엔진은 다른 세그먼트에 같은 키의 다중 복사본이 존재할 수 있다. 이런 측면 때문에 강력한 트랜잭션 시맨틱(semantic)을 제공하는 데이터베이스에는 B 트리가 훨씬 매력적이다. 많은 관계형 데이터베이스에서 트랜잭션 격리(transactional isolation)는 키 범위의 잠금을 사용해 구현한 반면 B 트리 색인에서는 트리에 직접 잠금을 포함시킨다.

<br>


'### 📌 인메모리 저장소

디스크는 메인 메모리와 비교해 다루기 어렵다. 자기 디스크와 SSD 사용시 읽기 및 쓰기의 좋은 성능을 위해서는 주의해 데이터를 디스크에 배치해야 한다. 그럼에도 디스크를 사용하는 이유는 지속성과 용량당 가격 때문이다.

하지만 램이 점점 저렴해졌고 데이터셋 대부분은 그리 크지 않아서, 메모리에 전체를 보관하는 방식이 현실적인 범위 안으로 들어왔다. 더하여 여러 장비 간 분산 보관도 가능하다. 이런 이유로 인메모리 데이터베이스가 개발됐다.

멤캐시드 같은 일부 인메모리 키-값 저장소는 데이터 손실을 허용하는 캐시 용도로만 사용된다. 하지만 다른 인메모리 데이터베이스는 지속성을 목표로 한다. 이 목표를 달성하는 방법에는
- 특수 하드웨어(배터리 전원 공급 RAM 등) 사용
- 디스크에 변경 사항 로그 기록
- 디스크에 주기적인 스냅숏 기록
- 다른 장비에 인메모리 상태 복제
등이 있다.

디스크는 전적으로 지속성을 위한 추가 전용 로그로 사용되고 읽기는 전적으로 메모리에서 제공된다.

레디스(Redis)와 카우치베이스(Couchbase)는 비동기로 디스크에 기록하기 때문에 약한 지속성을 제공한다.

직관에 어긋나지만 인메모리 데이터베이스의 성능 장점은 디스크에서 읽지 않아도 된다는 사실 때문은 아니다. 디스크 기반 저장소 엔진도 운영체제가 최근에 사용한 디스크 블록을 메모리에 캐시하기 때문에 충분한 메모리를 가진 경우 디스크에서 읽을 필요가 없기 때문이다. 그보단 인메모리 데이터 구조를 디스크에 기록하기 위한 형태로 부호화하는 오베헤드를 피할 수 있어 더 빠를 수도 있다.

성능 외에도 디스크 기반 색인으로 구현하기 어려운 데이터 모델을 제공한다. 예를 들어 레디스는 우선순위 큐와 셋(set) 같은 다양한 데이터 구조를 데이터베이스 같은 인터페이스로 제공한다. 또한 메모리에 모든 데이터를 유지하기 때문에 구현이 비교적 간단하다.

최근 연구에 따르면 인메모리 데이터베이스 아키텍처가 디스크 중심 아키텍처에서 발생하는 오버헤드 없이 가용한 메모리보다 더 큰 데이터셋을 지원하게끔 확장할 수 있다. 소위 안티 캐싱(anti-caching) 접근 방식은 메모리가 충분하지 않을 때 가장 최근에 사용하지 않은 데이터를 메모리에서 디스크로 내보내고 나중에 다시 접근할 때 메모리에 적재하는 방식으로 동작한다. 이것은 운영체제가 가상 메모리와 스왑 파일에서 수행하는 방식과 유사하지만 데이터베이스는 전체 메모리 페이지보다 개별 레코드 단위로 작업할 수 있기 때문에 OS보다 더 효율적으로 메모리를 관리할 수 있다. 하지만 이 접근 방식은 여전히 전체 색인이 메모리에 있어야 한다.

<br>

---



'## 🖋️ ???





<br>

'## 🖋️ 트위터와 저장소

* 대용량 트래픽과 데이터: 지난 포스팅에서 알아본 것처럼, 트위터는 2022년 기준 초당 6,000개의 트윗 쓰기 요청과 초당 약 450,000회 트윗 읽기 요청이 발생하고 있다.

* 성능: 이전 포스팅에서 언급한 바와 같이 SNS는 기본적으로 쓰기 대비 높은 읽기 성능이 요구되며, 트위터의 읽기 쓰기 비율을 약 750:1로 가정하였다. 더하여 읽기 성능을 획기적으로 개선하기 위해 push 방식의 fan-out 알고리즘을 고안하였고, 이에 추가적으로 강력한 쓰기 성능 또한 요구된다.

* 확장성: SNS 특성상 가용성과 데이터 분산 또한 필수적이므로, 저장소의 서버 차원에서 데이터 자동 복제 및 파티셔닝 등 자체적 클러스터링 솔루션 제공여부가 고려사항이 될 수 있다. 또한 확장에 용이한 데이터 모델을 제공할 수 있어야 한다.

* 비정형 데이터: fan-out 구현시 각 유저의 타임라인은 스키마가 없는 비정형적인 데이터로 볼 수 있다. 모든 유저의 타임라인은 각각 형태가 다르며 또 수시로 변한다고 볼 수 있다. 즉, 정해진 스키마가 없다고 볼 수 있다.

(Push 방식의 fan-out 알고리즘에 대한 내용은 이전 포스팅을 참고🐣🐣🐣)

<br>

---



































<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br>

'### 📌 트위터, 관계형 DB

관계를 지양함으로써 얻는 이점은 데이터를 분산 저장할 때 특히 두드러진다.

단순하게 트윗 모아보기의 예를 들자면, 내가 팔로잉하는 유저1의 트윗이 노드1에 있다고 가정해보자. 내가 누구를 팔로잉하는지 찾기 위해선 n개의 노드를 순회하며 모두 찾아야 할 것이고, 또 팔로잉이 작성한 트윗들을 찾기 위해서 다시 n개의 노드를 순회해야 한다(어디어디에 따르면 관계형 DB를 파티셔닝시 10배가 느려진다는 말이 있다).

반면 NoSQL은 관계 자체를 지양한다. 스키마가 없기 때문에 분산처리에 자유롭고 분산 환경에서 잘 동작하도록 설계되어 있다. 즉, 동일한 성격의 데이터가 물리적으로 다른 하드웨어에 저장되고 조회된다. 각각의 개별 로우로만 데이터를 구분하니 일관성 해싱(consistent hashing)과 같은 효율적인 알고리즘을 사용해 O(1)로 데이터를 곧바로 얻을 수 있고, 중첩 구조를 지원해 복잡한 구조도 저장할 수 있도록 한다. 따라서 파티셔닝(샤딩)이 용이하고 자동 샤딩또한 지원한다.

NoSQL은 쓰기/읽기 성능 특화, 2차 인덱스 지원, 자동 샤딩 지원와 같은 공통적인 특징이 있으며, 일반적으로 관계형 데이터베이스에 비해 읽기 또는 쓰기 성능이 월등히 빠르다.

NoSQL에는 다음과 같은 두 가지 주요 갈래가 있다.

- 문서 데이터베이스: 데이터가 문서 자체에 포함돼 있으면서 하나의 문서와 다른 문서 간 관계가 거의 없는 사용 사례를 대상으로 한다.

- 그래프 데이터베이스: 문서 데이터베이스와는 정반대로 모든 것이 잠재적으로 관련 있다는 사용 사례를 대상으로 한다.

둘의 공통점 중 하나는 일반적으로 저장할 데이터를 위한 스키마를 강제하지 않는다는 점이며, 따라서 변화하는 요구사항에 맞춰 쉽게 애플리케이션 변경이 가능하다.

<br>

---



'## 🖋️ 비관계형 저장소와 적절한 경우, 정의

과거 데이터를 하나의 큰 트리(계층 모델)로 표현하려고 노력했지만 다대다 관계를 표현하기에는 트리 구조가 적절하지 않았고, 이를 해결하기 위해 관계형 모델이 고안됐다. 하지만 개발자들은 관계형 모델에도 적합하지 않은 애플리케이션이 있다는 사실을 발견했으며, 상상조차 불가능한 양의 데이터, 그리고 비정형 데이터가 포함된 데이터를 분산해 저장하고 사용하는 방법을 연구하며 NoSQL(비관계형 데이터 저장소)이라고 불리우는 새로운 데이터 저장소 유형이 등장하였다.

NoSQL의 정의에 대해 명확히 합의된 바는 없지만, 대표적으로 마틴파울러의 정의에 따르면 다음과 같다.

- 대용량 웹 서비스를 위해 만들어진 데이터 저장소
- 관계형 데이터 모델을 지양하며 대량의 데이터를 저장하고 조회하는 데 특화된 저장소
- 스키마 없이 사용 가능하거나 느슨한 스키마를 제공하는 저장소

여기에서 핵심은 '관계형 데이터 모델을 사용하지 않는다'라기 보다, '관계형 데이터 모델로 제한하지 않는다'이다.

NoSQL이 등장하게 된 이유는 근본적으로 RDBMS의 확장성의 한계에 기인한다고 볼 수 있다. RDB도 파티셔닝을 지원하긴 하지만, 태생적으로 확장 가능한 분산 환경을 제공함에 한계가 있기 때문이다.

'### 📌 ACID의 약점, 관계형 DB, 트위터 예시

MySQL과 같은 관계형 DB는 ACID의 강한 일관성을 제공한다. 이는 분산 데이터 환경에서는 되려 취약점이 된다.

다시 단순하게 트위터의 예를 들어 보자. 한 유저의 사용자 정보를 변경하려 했을 때, 해당 유저의 정보를 참조하는(관계가 있는) 다른 무수한 테이블과 로우들을 다른 사람들이 조회 조회하거나 변경하려 한다면? 데이터 정합성이 깨질 우려가 있다. 나아가 해당 데이터들이 n개의 노드들에 분산되어 저장돼 있다면? 데이터 정합성을 위해선 해당 유저 정보를 갖고 있는 모든 노드의 모든 로우에 잠금을 해야 하고 이는 현실적이지 않을 것이다.

모든 노드에 락을 걸어야하면 일관성을 확보할 수 있겠지만, 성능을 희생해야하며, 네트워크 장애 등 결함에 더욱 취약해질 수 밖에 없다.


<br>

---

'### 📌 모호해지는 SQL, NoSQL의 관계

최근에는 관계형 DB에서도 json 데이터 타입을 지원하는 등 필드내 중첩구조를 허용하면서 점차 SQL 저장소와 NoSQL 저장소간의 경계가 모호해지고 있는 추세이다.


<br>

---



'## 🖋️ 데이터 저장소의 주요 선택 기준들

어떤 종류의 저장소를 선택해야할까? 선택지는 다음과 같다.

'#### 데이터 모델에 따른 분류

	- 관계형 데이터 베이스
    - 키-값 저장소(자료구조 저장소)
    - 문서 저장소
    - 와이드 컬럼 저장소(컬럼 패밀리 저장소)
    - 그래프 저장소

'#### disk-based database vs. in-memory database

- disk에 접근하기 위해서는 disk I/O의 비용이 든다. 이는 직렬화와 디스크 위치 

- disk-based database vs. in-memory database(memcached 비교 가능. 캐싱 솔루션으론 부적합. string만 지원.)
- 동기식 vs. 비동기식
- 탐색과 색인 알고리즘: b-tree, lsm tree, skip-list, 전문 색인 등


<br>

---

'## 🖋️ 비관계형 데이터 저장소 선택의 기준들

* 일관성 모델: 제공하는 서비스에서 어느 정도의 일관성이 필요한지, 저장소에서 어떤 일관성을 제공하는지를 말한다(일관성 vs. 최종적 일관성).
* 데이터 모델: 키-값과 같이 간단한 데이터 모델로 처리 가능한지, 문서 모델과 같이 중첩 구조 지원하는지, 엄격한 스키마 정립이 필요한지, 혹은 모든 필드가 모든 관계를 맺을 수 있는지 여부 등이 있다.
* 읽기 쓰기 성능: 읽기 비율이 높을시 b-tree를 지원하는 저장소를, 쓰기 비율이 높을시 lsm tree를 지원하는 저장소를, 읽기 쓰기에 모두 성능이 필요할 시 인메모리 저장소를 고려할 수 있다.
* 단일 고장점: 단일 고장점이란 시스템을 구성하는 개별 요소 중 하나의 요소가 망가졌을 때 시스템 전체를 멈추게 만드는 요소이다. 단일 고장점을 가진 저장소는 자체적으로 가용성을 지원하지 못하며 별도 솔루션 함께 사용하기도 한다. 또한 단일 고장점이 있을시 쉬운 복구가 가능한지 여부도 고려할 수 있다. 무정지 서비스가 중요 목표라면 단일 고장점 저장소는 되도록 피해야 한다.
    * 예를 들어 HBase의 경우 단일 고장점 있지만 장애 상황에서 하드웨어적인 방법으로 빠른 복구가 가능하다.
* 원자성 지원: 트랜잭션 지원 여부, 단일 연산에 대한 원자성 지원 여부 등을 고려할 수 있다. 원자성 지원이 어느 쪽(서버, 클라이언트)에서 지원되는지 확인 요소가 되며, 클라이언트에서 지원하는 단일 연산 원자성은 코드 복잡성 증가시킬 수 있다.
* 하드웨어 구성
* 무중단 시스템: 시스템 확장시 중단이 필요한지 여부와 같은 시스템의 특성 확인해야 한다. 
    * eg. MongoDB는 자동 샤딩을 지원하며, 운영중 시스템 추가가 가능하다. 단, 자동 샤딩 중 서비스 응답시간 느려지기도 한다.
    
    
<br>


스케일 아웃 방식을 택했고 일관성을 일부 합의하였으며, 저장소로 MySQL과 Redis를 선택하였다.

(데이터가 적거나 요청량이 적을 때, 증가량을 사전에 예측할 수 있을 때는 일반 RDBMS를 사용해도 문제가 없겠지만, 데이터 증가량을 측정하기 어렵거나, 서비스 요청량 증가를 예측하기 어려운 상황에서는 NoSQL 저장소가 더 적합할 수 있다고 생각했다.)

트위터의 타임라인(모아보기) 읽기, 트윗 쓰기 등 개별 요청에 요구되는 연산은 단순하다. 따라서 복잡하고 집중적인 연산에 적합한 스케일 업 방식은 효과적이지 않을 것이다. . 또한 트래픽이 지속적으로 증가하며 예측할 수 없다.

또한 스케일 아웃이 적합한 중요한 이유가 더 있는데, 바로 다음에서 다룰 가용성의 문제이다.

<br>

장비의 결함이나 네트워크의 장애는 일상적으로 일어나는 통제 범위 밖의 영역이다. 따라서 장애 상황을 가정하고 수평 확장과 노드간의 느슨한 결합을 통해 데이터를 분산하고 단일 고장점을(SPOF, single point of failure)를 줄이는 것이 현실적이다. 

<br>

수평 확장과 노드간의 느슨한 결합을 통해 데이터를 분산하고 단일 고장점(SPOF, single point of failure)을 줄여 

<br>

### 📌 저장소의 기준과 선택

* 일관성 모델: 제공하는 서비스에서 어느 정도의 일관성이 필요한지, 저장소에서 어떤 일관성을 제공하는지를 말한다(일관성 vs. 최종적 일관성).
* 데이터 모델: 키-값과 같이 간단한 데이터 모델로 처리 가능한지, 문서 모델과 같이 중첩 구조 지원하는지, 엄격한 스키마 정립이 필요한지, 혹은 모든 필드가 모든 관계를 맺을 수 있는지 여부 등이 있다.
* 읽기 쓰기 성능: 읽기 비율이 높을시 b-tree를 지원하는 저장소를, 쓰기 비율이 높을시 lsm tree를 지원하는 저장소를, 읽기 쓰기에 모두 성능이 필요할 시 인메모리 저장소를 고려할 수 있다.
* 단일 고장점: 단일 고장점이란 시스템을 구성하는 개별 요소 중 하나의 요소가 망가졌을 때 시스템 전체를 멈추게 만드는 요소이다. 단일 고장점을 가진 저장소는 자체적으로 가용성을 지원하지 못하며 별도 솔루션 함께 사용하기도 한다. 또한 단일 고장점이 있을시 쉬운 복구가 가능한지 여부도 고려할 수 있다. 무정지 서비스가 중요 목표라면 단일 고장점 저장소는 되도록 피해야 한다.
    * 예를 들어 HBase의 경우 단일 고장점 있지만 장애 상황에서 하드웨어적인 방법으로 빠른 복구가 가능하다.
* 원자성 지원: 트랜잭션 지원 여부, 단일 연산에 대한 원자성 지원 여부 등을 고려할 수 있다. 원자성 지원이 어느 쪽(서버, 클라이언트)에서 지원되는지 확인 요소가 되며, 클라이언트에서 지원하는 단일 연산 원자성은 코드 복잡성 증가시킬 수 있다.
* 하드웨어 구성
* 무중단 시스템: 시스템 확장시 중단이 필요한지 여부와 같은 시스템의 특성 확인해야 한다. 
    * eg. MongoDB는 자동 샤딩을 지원하며, 운영중 시스템 추가가 가능하다. 단, 자동 샤딩 중 서비스 응답시간 느려지기도 한다.


- pull과 push의 혼합 방식을 구현하기 위해 관계형 데이터 저장소로써 MySQL을, 비관계형 데이터 저장소로써 Redis를 선택하였다. 
    - 관계형 데이터 저장소로 MySQL을 선택한 이유는 다음과 같다
        - 오픈소스이며, Java 애플리케이션 자체 API를 제공한다.
        - 클러스터링과 자동 샤딩을 제공한다.
            - 샤딩시 데이터 일자별로 샤딩이 가능해 쓰기 부하를 줄일 수 있다.
    - 비관계형 데이터 저장소로 Redis를 선택한 이유는 다음과 같다(레디스에 대해 보다 많은 조사 필요).
        - 그래프 형식과 와이드 컬럼 형식의 저장소는 트위터의 모아보기 api와 크게 해당이 없을 것이라고 생각하여 배제하였다. 와이드 컬럼 저장소의 경우 데이터 분석에 초점이 맞춰져 있고, 카산드라의 경우 lsm tree를 활용해 읽기보다 쓰기에 성능 초점이 맞춰져 있으며, 타임라인 모아보기는 많은 컬럼을 필요로 하지 않는다. 또한 타임라인의 로우들이 다른 테이블의 로우들과의 관계성도 한계가 있기에 그래프 저장소도 배제하였다.

        - 일관성 모델: 레디스 클러스터 조사-결과적 일관성 제공으로 작성
        - 데이터 모델: 레디스는 키-값 구조의 데이터 모델을 제공하며, 값으로 리스트, 정렬된 셋 등 다양한 자료구조를 제공한다. 특히 리스트나 정렬된 셋 등의 자료구조는 트위터를 fan-out할 시 유저 개개인의 타임라인을 저장하기에도 적합하다고 판단하였다.
        - 읽기 쓰기 성능: 트위터의 경우 읽기와 쓰기 양쪽 모두에서 높은 성능을 요구하므로 인메모리 데이터베이스를 고려하였다. 타임라인의 fan-out구현에 있어서 유저의 읽기, 쓰기 모두에서 값의 자료구조 선택에 O(1)에서 O(logN)의 저렴한 비용으로 수행 가능하다. 관계형 DB와 혼합해 사용하므로 영속성의 요건 또한 갖춤과 동시에 성능의 이점 또한 얻을 수 있다.
        - 단일 고장점: 레디스는 센티넬과 클러스터라는 고가용성을 지원하여, 리더 노드에 문제가 생길시 즉시 대처가 가능하다. 또한 클러스터로 다중 리더 시스템을 구축하여 단일 고장점 자체를 없앨 수 있다. 일관성 해싱을 지원해 효율적인 분산이 가능하다.
        - 원자성 지원: 레디스는 클라이언트(Java 애플리케이션)와 서버 모두에서 트랜잭션을 지원하지만, 중간에 장애가 생길시 연산 전체의 원자성을 보장하지는 않아 fan-out시 데이터의 정합성에 문제가 있을 수 있다. 이 문제는 비동기 메시징 시스템으로 해결하려고 하였으며, 다음 포스팅에서 다루기로 하겠다.
        - 무중단 시스템: 레디스 클러스터는 자동 샤딩을 지원하여 시스템 확장시 중단이 필요 없다.(추가 조사 필요)

<br>

주로 성능과 확장성(쉽게 데이터 분산 가능) 측면에서 타임라인 API의 Push 방식 구현에 비관계형 저장소가 적합하다고 판단했다.

타임라인 API의 Push 방식 구현을 위해서는 유저를 키로 하고 유저의 타임라인용 트윗들을 값으로 구현해야 했는데, 후보로써 단순한 키-값 저장소로 Redis와 Memcached, 문서 모델 저장소로 MongoDB, 컬럼 모델 저장소로 Cassandra를 고려했다.

Redis를 선택한 이유는 아래와 같다.


![](https://velog.velcdn.com/images/rmndr/post/ae537f5e-7318-46fe-b949-0669722a491d/image.jpg)

Memcached는 레디스와 다르게 멀티 스레드 아키텍처이며, 메모리 관리 측면에서 강점이 있다. Memcached는 데이터별로 메모리를 할당하는 것이 아니라, slab allocator라는 것을 사용한다. slab은 일종의 메모리 할당 단위로 이는 다양한 크기의 다수의 chunk로 이루어져 있다. 데이터 저장시 같거나 큰 크기의 chunk를 가진 slab을 찾거나 없을시 새로운 chunk들로 이루어진 slab을 생성한다. 이렇게 가용한 메모리를 미리 할당해 사용하기 때문에 Redis보다 빠른 할당이 가능하며, 메모리 파편화를 예방할 수 있다.
하지만 만약 데이터의 크기가 달라지면 위의 저장 절차를 다시 실행해야하기 때문에 효율성이 감소한다. 그외에 일관성 해싱을 통한 데이터 분산을 지원한다.

다만 값으로 문자열만 지원하며, 레디스가 제공하는 백업 및 복원, 트랜잭션, 복제(고가용성) 등 그 외의 다른 모든 부가 기능을 지원하지 않는다.


MongoDB는 색인 전략으로 B-tree와 LSM tree 모두를 지원한다. 또한 비정형 데이터를 다룸에 있어 강점이 있다. 또한 데이터를 디스크에 저장한다. B-tree를 사용할 경우 읽기에서 이점이 있고 LSM tree를 쓸 경우 쓰기에 강점이 있다. 하지만 양쪽 모두를 동시에 제공할 수는 없으며 비효율적일 것이다. B-tree를 사용할 경우 관계형 저장소와 크게 차이가 없을 것이다(관계형 저장소도 Json을 데이터형으로 허용함으로써 중첩 구조를 지원하기 시작했다). 하지만 쓰기 성능을 희생해야할 것이다.

Cassandra는 SS테이블을 기반으로 하는 로그 구조 지향 저장소이다. 따라서 쓰기 처리 성능에 초점이 더 맞춰져 있다. MongoDB와 마찬가지로 무한의 컬럼을 추가할 수 있어 비정형 데이터 처리에 강점이 있다. 데이터를 디스크에 저장한다. 한 컬럼에 대한 여러 로우를 조회할 때 최상의 성능을 보일 수 있다는 점에서 타임라인 API와는 조금 거리가 있으며, 데이터 분석에 좀 더 적합할 수 있다.

<br>

Memcached는 레디스와 다르게 멀티 스레드 아키텍처이며, 메모리 관리 측면에서 강점이 있다. Memcached는 데이터별로 메모리를 할당하는 것이 아니라, slab allocator라는 것을 사용한다. slab은 일종의 메모리 할당 단위로 이는 다양한 크기의 다수의 chunk로 이루어져 있다. 데이터 저장시 같거나 큰 크기의 chunk를 가진 slab을 찾거나 없을시 새로운 chunk들로 이루어진 slab을 생성한다. 이렇게 가용한 메모리를 미리 할당해 사용하기 때문에 Redis보다 빠른 할당이 가능하며, 메모리 파편화를 예방할 수 있다.
하지만 만약 데이터의 크기가 달라지면 위의 저장 절차를 다시 실행해야하기 때문에 효율성이 감소한다. 그외에 일관성 해싱을 통한 데이터 분산을 지원한다.

다만 값으로 문자열만 지원하며, 레디스가 제공하는 백업 및 복원, 트랜잭션, 복제(고가용성) 등 그 외의 다른 모든 부가 기능을 지원하지 않는다.


MongoDB는 색인 전략으로 B-tree와 LSM tree 모두를 지원한다. 또한 비정형 데이터를 다룸에 있어 강점이 있다. 또한 데이터를 디스크에 저장한다. B-tree를 사용할 경우 읽기에서 이점이 있고 LSM tree를 쓸 경우 쓰기에 강점이 있다. 하지만 양쪽 모두를 동시에 제공할 수는 없으며 비효율적일 것이다. B-tree를 사용할 경우 관계형 저장소와 크게 차이가 없을 것이다(관계형 저장소도 Json을 데이터형으로 허용함으로써 중첩 구조를 지원하기 시작했다). 하지만 쓰기 성능을 희생해야할 것이다.

Cassandra는 SS테이블을 기반으로 하는 로그 구조 지향 저장소이다. 따라서 쓰기 처리 성능에 초점이 더 맞춰져 있다. MongoDB와 마찬가지로 무한의 컬럼을 추가할 수 있어 비정형 데이터 처리에 강점이 있다. 데이터를 디스크에 저장한다. 한 컬럼에 대한 여러 로우를 조회할 때 최상의 성능을 보일 수 있다는 점에서 타임라인 API와는 조금 거리가 있으며, 데이터 분석에 좀 더 적합할 수 있다.

<br>

📒✏️🔔🔈📢🌐💻📝💡📍🌿📌🌞🫐⌨️🗺️🎙️🕯️📎🖇️🔍🔎🔐🔒🔓🔑🗝️⚙️🛰️🚀🛸🎷🎲🏆🧩⚠️♻️🔖🎾🐚🪙🎁🖊️🖋️✒️🖌️🖍️📁🗂️📢