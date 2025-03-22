# 1트

npx create-react-app blog


### jsx

jsx 문법
1. class 넣을 땐 className
2. 데이터바인딩은 {중괄호}
3. style 넣을 땐 style={오브젝트}


</br>

### component

컴포넌트 만드는 법  
1. function 만들고
  - 다른 function 바깥에 만들 것
2. return() 안에 html 담기
3. <함수명></함수명> 쓰기

---  
- fragment - 의미없는 `<div>` 대신 `<></>` 사용 가능





</br>

### modal

동적인 UI 만드는 step
1. html css로 미리 디자인완성
2. UI의 현재 상태를 state로 저장 <- 조건문으로

참고  
- 반복문으로 html 생성하면 key={html마다 다른 숫자} 추가해야 한다.


</br>

### props

부모 -> 자식 state 전송시 props 문법 사용
1. <자식 컴포넌트 작명 = {state 이름}>
  - (보통 state 이름과 똑같이 작명)
2. props 파라미터 등록후 props.작명 사용


props 전송은 부모 -> 자식만 가능. 자식끼리도 불가.







</br></br></br></br></br>

# 2트

# 리액트React 설치와 개발환경 세팅

npm create vite@latest

cd {프로젝트명}
npm install
npm run dev

## 01
- .js와 .jsx는 큰 차이 없음
- npm: js 라이브러리 관리 도구(패키지 매니저)
- vite: 리액트, 뷰, 스벨트 등 프로젝트 생성 도와줌. 정확히는 "빌드/번들링 툴."
  1. 소스코드 사이즈 압축 가능
  2. 자바스크립트로 컴파일 가능
  3. (개발중)빠른 미리보기
- App.js -> main.js(또는 index.js) -> index.html 순으로 변환.
- public 폴더: 이미지 등 파일 보관
- package.json: 설치한 라이브러리 기록용 파일. npm 명령어 설정도 가능("scrips").
- node_modules: 설치한 라이브러리 보관해주는 곳

## 02
- css 파일 내용 모두 지우고 index.css에 body {margin: 0;}, div{box-sizing: border-box;} 설정해 깔끔하게 시작.
- app.js 파일 App() 함수 내용 모두 비우고 시작.




</br></br>

# 리액트에서 레이아웃 만들 때 쓰는 JSX 문법 3개

- jsx: js 안에서 html를 쉽게 작성할 수 있도록 돕는 문법/언어. .js 파일에서 쓰는 html 대용품.
  1. class 넣을 땐 `class`가 아닌 `className`
  2. 변수 넣을 땐 {중괄호} - 데이터바인딩이라고 한다. 변수 넣고 싶을 때 아무 데서나 중괄호 열면 된다.
    ```jsx
    let post = '강남 우동 맛집 OOO 후기';
    document.querySelector('h4').innerHTML = post; // js에서는 이렇게
    <h4> {post} </h4> // jsx에선 이렇게
    <h4 id={post}>가나다</h4> // 이런 것도 가능
    ```
  3. style 넣을 땐 style={}
    ```jsx
    <h4 style="color : red">가나다</h4> // html
    <h4 style={{color : 'red', font-size : 16}}>가나다</h4> // jsx. 중괄호 안에는 오브젝트{} 형태로 넣는다.
    // font-size 안되고 fontSize처럼 camel case로 써야 한다. js에선 `-`를 넣으면 뻴샘을 해버리기 때문. 
    ````

(참고)에러 메시지는 터미널/브라우저에서 확인 -> 그래도 없을 시 브라우저 개발자도구 확인





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 




</br>

### 





</br>

### 





</br>

### 





</br>

### 





</br>

### 