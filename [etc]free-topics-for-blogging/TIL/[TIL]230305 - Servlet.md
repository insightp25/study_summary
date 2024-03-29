
> 💡서블릿은 동적인 웹 페이지를 지원하기 위해 고안된 웹 애플리케이션 서버용 프로그램이다. HTTP 파싱 및 처리, TCP/IP와 소켓 연결 및 종료, 멀티 스레드 지원 등의 기능을 제공하며, 이로 인해 개발자들이 비즈니스 로직 개발에 집중할 수 있도록 돕는 역할을 한다.

<br></br>
# Servlet의 등장 배경

서블릿이 처음 등장한 1997년에는 정적인 웹페이지를 제공하는 웹 서버가 주류였다. 웹 서버(Nginx, Apache 등)는 HTTP를 기반으로 동작하였으며 정적인 리소스를 제공하는 것이 주 기능이었다.

그 후 기존의 웹 서버의 기능에 더하여, 동적 HTML, HTTP API 통신 등을 지원하고 프로그램 코드를 실행해 애플리케이션 로직을 수행하는 웹 애플리케이션 서버(이하 WAS)가 등장(Tomcat 등)하였다.

WAS 또한 정적인 페이지를 제공할 수 있지만, 그런 경우
* 너무 많은 역할을 책임져 서버 과부하 우려가 있고, 
* 그보다 훨씬 중요한 애플리케이션 로직 수행에 지장이 올 수 있다. 

따라서 이후 정적 리소스는 웹 서버가 처리하고, 이외 애플리케이션 로직같은 동적인 처리는 WAS가 전담하는 형태로 발전해왔다.

WAS가 온전히 그 역할을 수행하기 위해서는 애플리케이션 로직 처리 외에 동적인 HTTP 해석과 TCP/IP 네트워킹, 트래픽관리(멀티스레딩) 등 다양한 전후 처리가 필요했는데, 이를 모두 대신 하는 역할을 하는 것이 바로 Servlet이다.

Servlet 덕분에 개발자들은 가장 중요한 애플리케이션 로직 개발에 힘쓸 수 있게 되었다.
<br></br>
# Servlet Container의 기능

서블릿을 지원하는 WAS를 Servlet Container라고 지칭한다. Servlet의 핵심 동작은 Servlet Container에 의해 수행된다. Servlet Container는 HTTP 요청시
* Request, Response 객체를 새로 만들고
* Servlet 객체를 호출하며
* 개발자는 Request 객체에서 HTTP 요청 정보를 꺼내서 쉽게 사용하고, 또한 Response 객체에 쉽게 HTTP 응답 정보를 입력하며
* Response 객체에 있는 내용으로 HTTP 응답 정보를 생성한다.

나아가
* Servlet 객체 생성, 초기화, 호출, 종료까지의 생명주기를 관리하며(Servlet 객체는 싱글톤으로 관리), 
* Front Controller 패턴과 스레드 풀 등을 지원해 멀티 스레딩 처리를 돕는다.
<br></br>
# 스레드 풀

Servlet Container는 효율적인 동시 요청 처리를 위해 스레드 풀을 활용한다. 이 때 스레드 풀의 개수 값을 설정할 수 있는데,
* 이 값을 너무 낮게 설정 시: 서버 리소스는 여유롭지만 금방 응답 지연이 발생할 수 있고,
* 너무 높게 설정할 시: 동시 요청이 많으면 CPU, 메모리 임계점 초과로 서버가 다운될 수 있다.

이렇게 멀티 스레드에 대한 부분을 Servlet Container가 처리해줌으로써 개발자는 멀티 스레드 관련 코드에 신경쓰지 않고 소스 코드 개발에 집중할 수 있게 된다.
<br></br>
# 주의사항
멀티 스레드 환경에서는 싱글톤 객체(Servlet, Spring bean 등)를 특히 주의해서 사용해야 한다. 그렇지 않을시 민감한 정보들이 제 3자에게 노출되는 등 치명적인 결과를 불러일으킬 수 있다.

<br></br>
