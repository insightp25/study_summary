### REST

representational state transfer

인터넷 상의 시스템 간의 상호 운용성(interoperability)을 제공하는 방법중 하나

시스템 제각각의 독립적인 진화를 보장하기 위한 방법

REST API: REST 아키텍처 스타일을 따르는 API

<br>

### REST 아키텍처 스타일

client-server

stateless

cache

uniform interface

layered system

code-on-demand(optional)

<br>

### uniform interface
identification of resources

manipulation of resources through representations

self-descriptive messages

- 메시지 스스로 메시지에 대한 설명이 가능해야 한다
- 서버가 변해서 메시지가 변해도 클라이언트는 그 메시지를 보고 해석이 가능하다.
- 확장 가능한 커뮤니케이션

hypermedia as the engine of application state
- 하이퍼미디어(링크)를 통해 애플리케이션 상태 변화가 가능해야 한다.
- 링크 정보를 동적으로 바꿀 수 있다(버저닝 할 필요 없이!)

<br><br><br>

—

# 그런 REST API로 괜찮은가

https://www.youtube.com/watch?v=RP_f5dMoHFc&t=1468s


## self-descriptive
메시지는 스스로를 설명해야 한다.
1. 어떤 문법인지 해석할 수 있어야 한다 -> content header에 해당 정보 추가 -> 파싱이 가능해지고 문법을 해석할 수 있다
2. 키 이름이 무엇을 의미하는지를 알아야 -> 미디어 타입이 정해져 있다 -> 명세를 찾아가서 이해를 하고 해석을 하면 해당 메시지의 의미를 올바르게 알 수 있게 된다.

## HATEOAS
애플리케이션 상태는 hyperlink를 이용해 전이되어야 한다.

## 왜 uniform interface?
독립적 진화
- 서버와 클라이언트가 각각 독립적으로 진화
- 서버 기능이 변경되어도 클라이언트를 업데이트할 필요가 없다
- REST를 만들게 된 계기: “how do i improve HTTP without breaking the Web.”

—

독립적 진화를 위해선 uniform interface가 반드시 만족되어야 한다.

어지간히 업데이트 좀 시키세요…업데이트 좀 적당히 해요…

서버가 변경 -> 클라이언트가 지원하는 데에 한계가 있다 -> 호환성을 갖진 못한다 -> 언젠간 업데이트를 해야한다 -> 그게 잦을 때도 있다 -> REST로 통신하지 않기 때문

안깨지게 하기 위해 피땀의 노력을 한다 -> 먼저 명세를 만든다 -> HTML5 첫 초안 권고안 7년, HTTP/1.1 명세 개정판 작업 7년 -> 하위호환성을 절대로 깨뜨리면 안되기 때문

상호운용성(interoperability)에 대한 집착: 하위호환성을 절대로 깨뜨리면 안됨
- Referer 오타지만 안 고침
- charset 잘못 지은 이름이지만 안 고침(원랜 encoding이 맞음)
- http 상태코드 416 포기
- http/0.9 아직도 지원(크롬, 파이어폭스)

## REST가 웹의 독립적 진화에 도움을 주었나
- HTTP에 지속적 영향을 줌
- Host 헤더 추가
- 길이 제한을 다루는 방법 명시(414 URI Too Long 등)
- URI에서 리소스의 정의가 추상적으로 변경됨: “식별하고자 하는 무언가”
- 기타 HTTP와 URI에 많은 영향을 줌
- HTTP/1.1 명세 최신판에서 REST에 대한 언급이 들어감
    - “HTTP 1.1에는 representation이라는 개념이 정의가 되어 있는데, 이 representation이라는 개념은 REST에서 온 것이다”
- Reminder: Roy T. Fielding이 HTTP와 URI 명세의 저자 중 한명

## 그럼 REST는 성공했는가
- REST는 웹의 독립적으로 진화하고 있다 -> 성공!

## 그런데 REST API는?
- REST API는 REST 아키텍처 스타일을 따라야 한다
- 오늘날 스스로 REST API라고 하는 API들의 대부분이 REST 아키텍처 스타일을 따르지 않는다

## REST API도 저 제약조건들을 다 지켜야 하는 건가?

그렇다고 한다

“An API that provides network-based access to resources via a uniform interface of self-descriptive messages containing hypertext to indicate potential state transitions might be part of an overall system that is a RESTful application” - Roy T. Fielding


SOAP
- 복잡하다
- 규칙이 많다
- 어렵다

REST
- 단순하다
- 규칙이 적다
- 쉽다


## 원격 API가 꼭 REST API여야 하는 건가?

아니다. 

“REST emphasizes evolvability to sustain an uncontrollable system. If you think you have control over the system or aren’t interested in evolvability, don’t waste your time arguing about REST.”

REST는 시간과 노력이 든다. 공짜가 아니다. 오랜 시간에 걸쳐 진화하는 시스템을 갖추고 싶다고 하면 REST에 관심을 가지면 된다.

## 왜 API는 REST가 잘 안되나

### 일반 웹과 비교

| |흔한 웹페이지|HTTP API|
|---|---|---|
|protocol|http|http|
|커뮤니케이션|사람-기계|기계-기계|
|media type|html|json|

모바일 앱 등 기계가 해석

| |html|json|
|---|---|---|
|hyperlink|됨(a 태그 등)|정의돼있음|
|self-descriptive|됨(html 명세)|불완전*|

html은 명세가 있고 html에 사용될 수 있는 모든 태그들이 다 정의되어 있다. json은 그렇지 않다.

*불완전: 적어도 문법은 정의돼있다. 대괄호, 중괄호 중괄호 어떻게 파싱하라, array는 어떻게 해석하라 등. 하지만 그 안에 들어가있는 값들이 어떤 의미를 가져야 된다에 대해서는 정의돼있지 않다. 의미를 해석하려면 별도로 문서(API 문서 등)가 필요하다.

### html

self-descriptive측면:

1. 응답 메시지의 content-type을 보고 media type이 (예시에 나온대로)text/html 임을 확인한다.
2. http 명세에 media type은 IANA에 등록되어있다고 하므로, IANA에서 text/html의 설명을 찾는다.
3. IANA에 따르면 text/html의 명세는 http://www.w3.org/TR/html 이므로 링크를 찾아가 명세를 해석한다.
4. 명세에 모든 태그의 해석방법이 구체적으로 나와있으므로 이를 해석할 수 있다.
-> success

hateoas 측면

a 태그를 이용해 표현된 링크를 통해 다음 상태로 전이 가능 -> success


### json

self-descriptive 측면:

1. 응답 메시지의 content-type을 보고 media type이 (예시에 나온대로)application/json 임을 확인한다.
2. http 명세에 media type은 IANA에 등록돼있다고 하므로, IANA에서 application/json의 설명을 찾는다.
3. IANA에 따르면 application/json의 명세는 draft-ietf-jsonbis-rfc7159bis-04 이므로 링크를 찾아가 명세를 해석한다.
4. 명세에 json 문서를 파싱하는 방법이 명시돼있으므로 성공적으로 파싱에 성공한다. 그러나 (예시)“id”가 무엇을 의미하고, (예시)“title”이 무엇을 의미하는지 알 방법은 없다.
-> 온전한 해석 불가 -> fail

hatoeas 측면:

(예시에선)다음 상태로 전이할 링크가 없다 -> fail


—

## 그런데 self-descriptive와 hateoas가 독립적 진화에 어떻게 도움이 될까요?

### self-descriptive: 

확장 가능한 커뮤니케이션 - 서버나 클라이언트가 변경되더라도 오고가는 메시지는 언제나 self-descriptive하므로 언제나 해석이 가능하다. -> 항상 변할 수 있다.

### hatoeas:

애플리케이션 상태 전이의 late binding - 어디서 어디로 전이가 가능한지 미리 결정되지 않는다. 어떤 상태로 전이가 완료되고 나서야 그 다음 전이될 수 있는 상태가 결정된다. 쉽게 말해서: 링크는 동적으로 변경될 수 있다. 마음대로 바꿀 수 있다. 서버가 링크를 바꾼다고 해도 클라이언트는 링크를 보고 그대로 따라가면 되므로 전혀 문제가 없다.


—-

## 그럼 REST API로 고쳐보자

(이전 json 예시를)

## 방법1: meda type

1. 미디어 타입 하나 정의
2. 미디어 타입 문서를 작성. 이 문서에 “id”가 뭐고 “title”이 뭔지 의미 정의
3. IANA에 미디어 타입 등록. 이 때, 만든 문서를 미디어 타입의 명세로 등록한다.
4. 이제 이 메시지를 보는 사람은 명세를 찾아갈 수 있으므로 이 메시지의 의미를 온전히 해석할 수 있다.

-> 성공

단점: 매번 media type을 정의해야 한다

(IANA는 모든 미디어 타입이 등록돼있는 사이트)



<br><br>

## 방법2: profile 이용


### self-descriptive message

link에 relation을 profile하면 메시지의 의미가 무엇인지 정보가 담긴 문서 링크를 달 수 있다.

헤더 내용중 예시 :

Link: <https://example.org/docs/todos>; rel=“profile”

1. “id”가 뭐고 “title”이 뭔지 의미를 정의한 명세를 작성한다.
2. Link 헤더에 profile relation으로 해당 명세를 링크한다.
3. 이제 메시지를 보는 사람은 명세를 찾아갈 수 있으므로 이 문서의 의미를 온전히 해석할 수 있다.

-> 성공

단점:

1. 클라이언트가 Link 헤더(RFC 5988)와 profile(RFC 6906)과 relation을 이해해야 한다(아래 예시 참고).
2. Content negotiation을 할 수 없다. (앞에선 media type으로 했기 때문에 만약에 클라이언트가 이를 지원하지 못하거나 하는 상황이 있을 때 서버가 그것을 알아챌 수 있지만, profile 방법은 content negotiation이 불가하다. 왜냐하면 media type으로 판단하는 것이 아니라 링크 헤더의 Link로만 판단하기 때문에)

헤더 내용중 예시 :

Link: <https://example.org/docs/todos>; rel=“profile”

<br>

### hateoas

방법1: data로

data(메시지 본문)에 다양한 방법으로 하이퍼링크를 표현한다.

-> 성공

단점: 링크 표현 방법을 직접 정의해야 한다. (Link 헤더를 이용해 profile 문서에 정의를 하거나, media type에 정의를 하거나…)

또는

JSON으로 하이퍼링크를 표현하는 방법을 정의한 명세들을 활용한다.

- json api
- HAL
- UBER
- Siren
- Collection+json
- …

-> 성공

단점: 기존 API를 많이 고쳐야 한다(침투적). 해당 명세들이 요구하는 것에 맞게 해야하기 때문에.


<br>

방법2: HTTP 헤더로

Link, Location 등의 헤더로 링크를 표현한다.

-> success

단점: 정의된 relation만 활용한다면 표현에 한계가 있다.

헤더 내용 예시:

Location /todos/1
Link: </todos/>; rel=“collection”


<br>

data, 헤더 모두 활용하면 좋습니다



—

## 그 외...

### Hyperlink는 반드시 uri여야 하는건 아닌가?

|종류|예|
|---|---|
|uri|https://toss.im/users/eungjun|
|uri reference(absolute)|/users/engjun|
|uri reference(relative)|eungjun|
|uri template|/users/{username}|


그렇진 않다. 하이퍼링크라는 것만 표현하면 다 괜찮다.


<br>

### Media type 등록은 필수인가?

그렇진 않다.

의도한 대상이 이해할 수만 있으면 상관 없다. “예를 들면 회사 안에서만 쓰는 API이고 그 사람들은 모두 다 해당 media type을 모두 다 이해하고 있다”고 하면 굳이 iana에 등록할 필요는 없다.

하지만 media type을 IANA에 등록 하면 좋다. 왜냐하면

- (등록이 되면)누구나 쉽게 사용할 수 있다
- 이름 충돌을 피할 수 있다
- 등록이 별로 어렵지 않다(고 주장함)



—-

## 정리

- 오늘날 대부분 “REST API”는 사실 REST를 따르지 않고 있다
- REST의 제약조건 중에서 특히 self-descriptive와 hateoas를 잘 만족하지 못한다.
- 사실 REST는 긴 시간에 걸쳐(수십년) 진화하는 웹 애플리케이션을 위한 것이었다.
- REST를 따를 것인지는 API를 설계하는 이들이 스스로 판단하여 결정해야 한다.
- REST를 따르겠다면, self-descriptive와 hateoas를 만족시켜야 한다.
    - self-descriptive는 custom media type이나 profile link relation 등으로 만족시킬 수 있다.
    - hateoas는 http 헤더나 본문에 링크를 담아 만족시킬 수 있다.


