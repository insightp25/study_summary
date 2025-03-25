# 1트

npx create-react-app blog
npm run dev
npm install(vite 등이 설치 안됐거나 npm이 최신이 아닐 시)

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

# Part 1. 블로그 제작 & 기초 문법


# 리액트React 설치와 개발환경 세팅

npm create vite@latest

cd {프로젝트명}  
npm install  
npm run dev  

### 01
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

### 02
- css 파일 내용 모두 지우고 index.css에 body {margin: 0;}, div{box-sizing: border-box;} 설정해 깔끔하게 시작.
- app.js 파일 App() 함수 내용 모두 비우고 시작.




</br></br></br>

# 리액트에서 레이아웃 만들 때 쓰는 JSX 문법 3개

- jsx: js 안에서 html를 쉽게 작성할 수 있도록 돕는 문법/언어. .js 파일에서 쓰는 html 대용품.
  1. class 넣을 땐 `class`가 아닌 `className`
    ```jsx
    <div className="App">
      <div className="black-nav">
      // ...
    ```
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





</br></br></br>

# 중요한 데이터는 변수말고 state에 담습니다

- jsx에선 변수 외에 state에도 자료를 보관할 수 있다.
  1. `import {useState} from 'react';`
  2. useState(보관할 자료)
  3. let [이름1, 이름2]  
  ```jsx
  let [a, b] = useState('남자 코트 추천'); // ['남자 코트 추천', 함수]
  // a = 변수명
  // b = state 변경을 도와주는 함수
  ```
    - (참고) `[a, c]`: js에서 destructuring이라는 문법. array 안에 있던 자료들을 각각 변수로 빼주는 문법.
      ```jsx
      let num = [100, 200];
      // let a = num[0]; // 100
      // let b = num[1]; // 200
      let [a, c] = [100, 200];
      ```
- state는 갑자기 변경되면 해당 state를 쓰고 있는 html 전체가 자동 재렌더링 됨.
- state 사용처: 데이터 변동시 자동으로 html에 반영되게 만들고 싶으면 state 사용.
- 자주 변경될거 같은 html 부분은 state로 만들어 놓는다.
- (참고)jsx에서 모든 html 코드는 return() 안에 작성한다.
  - 무조건 하나의 태그(`<div></div>` 등)로 시작해 하나의 태그로 끝나야 한다. 병렬로 태그 2개 이상 기입 금지.
 




</br></br></br>

# 버튼에 기능개발을 해보자 & 리액트 state변경하는 법

- onClick(이벤트핸들러) 쓰는 법: 아무 html 요소에 넣을 수 있다.
  - onClick={} 안엔 함수이름(또는 함수의 정의) 하나만 넣을 수 있다(함수 실행문을 넣는 게 아니다. `()=>{}` 이런 것도 넣을 수 있음.).
- state 변경하는 법:
  - `state변경함수(새로운state)`
  - 등호로 변경 금지(eg. like = like + 1. 적용이 되긴 하는데 html에 반영이 안된다.)
  - state변경함수 칸(`let [변수, 함수] = useState()`)에 써야 html 재렌더링도 잘 된다.
    ```jsx
    <span onClick={()=>{setLike(like + 1)}}>👍</span>;
    // <span onClick={like = like + 1}>👍</span>; // nono
    ```



- (참고)서버 warning 메시지 표시 안하고 싶을 때: `/* eslint-disable */`





</br></br></br>

# array, object state 변경하는 법
- (참고)array/object 다룰 때 원본은 보존하는 게 좋다.

### state 변경함수의 원리와 특징
- 기존state == 신규state의 경우 변경 안해줌(일종의 자원절약 차원)
- array/object(reference 데이터타입)를 담은 변수엔 화살표(RAM 주소)만 저장


```jsx
// state 변경 안됨.
let [postTitle, setPostTitle] = useState(["남자 코트 추천", "여자 코트 추천", "아이템 추천"]);

return (
  <button onClick={() => {
      let copy = postTitle;
      copy[0] = "남자 구두 추천";
      setPostTitle(copy)
    }}>첫 번째 글 제목 변경</button> // copy의 값(주소) 자체가 안변했기 때문에 상태도 변경되지 않고 html이 렌더링되지 않는다. postTitle == copy
)
```
```jsx
// state 변경 됨.
let [postTitle, setPostTitle] = useState(["남자 코트 추천", "여자 코트 추천", "아이템 추천"]);

return (
  <button onClick={() => {
      let copy = [...postTitle]; // ...괄호를 벗기는 기능. 벗긴 후에 다시 새로운 배열에 값들을 넣어 참조값이 다른 변수를 만듬. shallow copy. 1차원 배열에 한해 원시 타입은 값 자체를 복사하지만 그 외 경우엔 요소들 모두 reference를 이용해 복사한다.
      copy[0] = "남자 구두 추천";
      setPostTitle(copy) // postTitle != copy. 다시 렌더링 된다.
    }}>첫 번째 글 제목 변경</button>
)
```
- `...`(스프레드 연산자): array/object의 괄호를 벗기는 기능
- state의 값이 array/object일 경우 항상 shallow copy를 하는 식으로 변경해야 한다.





</br></br></br>

# component

- html 특: 더러움 -> 리액트 component로 축약

컴포넌트 만드는 법
1. function 만들고(다른 function 바깥에+영어대문자)
2. return() 안에 html 담기(하나의 html 태그로 시작해서 끝나야)
3. <함수명></함수명> 쓰기

어떤 걸 컴포넌트로 만들면 좋은가
1. 반복적인 html 축약할 때
2. 큰 페이지들
3. 자주 변경되는 UI들

- 컴포넌트의 단점: state 가져다 쓸 때 문제 생김(state는 보통 범위가 한 함수에 속하는데, A 함수에 있던 state변수는 B 함수에 마음대로 가져다 쓸 수 없음)

- (참고1)fragment: `return()` 안에 html 병렬기입하려면 의미없는 `<div>` 대신 `<></>` 사용 가능
- (참고2)`<함수명></함수명>`, `<함수명/>` 둘 다 가능
- (참고3)컴포넌트 만드는 다양한 문법들
  ```jsx
  const Modal = () => { // 1
    return(...);
  }
  let Modal = () => { // 2
    return(...);
  }
  function Modal() { // 3
    return(...);
  }
  ```





</br></br></br>

# 모달창 만들기

동적인 UI 만드는 step
1. html css로 미리 디자인 완성
2. UI의 현재 상태를 state로 저장
3. state에 따라 UI가 어떻게 보일지 작성(조건문 등으로)
  - html 섹션에 조건문은 못 쓰지만 삼항연산자는 가능!






</br></br></br>

# map : 많은 div들을 반복문으로 줄이고 싶은 충동이 들 때

반복문으로 같은 html 반복생성하는 법

보통은 for 문법을 쓰면 되지만, html 구역 안에는 for 반복문이나 일반 조건문 사용 불가. -> map() 사용.

모든 array 뒤에는 `map()`을 붙일 수 있다. map의 파라미터로 콜백함수(간단히는 소괄호 안에 들어가게 되는 함수)를 넣는다.
```jsx
[1, 2, 3].map(function(x, i) { // x: 요소, i: 인덱스
  console.log(x);
  return 123456;
})
```

1. array 자료 갯수만큼 함수 안의 코드를 실행해줌
2. 함수의 파라미터는 array 안에 있던 자료
3. return에 뭐 적으면 array로 담아줌(array 본 횟수만큼, 기존 요소들 대체)

(참고1)일반 for 반복문 써서 html 생성도 가능

(참고2)반복문으로 html 생성하면 key={html마다 다른 숫자} 추가해야 함 - 반복문 돌릴 때마다 생성한 html들은 유니크하게(숫자, 문자 등) key 태그 속성을 갖고 있어야 함.



</br></br></br>

# 자식이 부모의 state 가져다쓰고 싶을 때는 props

부모 컴포넌트가 자식 컴포넌트를 품고있는 구조이면 자식이 부모가 갖고 있던 state 사용가능 -> 전송시 props라는 문법 사용. 부모->자식 방향으로만 가능. 자식->부모 또는 자식1->자식2와 같은 형태로는 전송 불가.

(eg. 부모: App, 자식 Modal)

부모 -> 자식 state 전송하는 법
1. `<자식컴포넌트 작명={state이름}>`
2. props 파라미터 등록후 `props.작명` 사용

컴포넌트 많아지면 props 쓰는 게 귀찮아짐

(참고)props로 일반 문자나 함수까지도 전송가능




</br></br></br>

# props를 응용한 상세페이지 만들기

(중요)state 만드는 곳은 state 사용하는 컴포넌트들 중 최상위 컴포넌트(애매할 시 최상위에 만드는 게 나을 수 있다)





</br></br></br>

# input 1 : 사용자가 입력한 글 다루기

`<input></input> `

javascript에서는 태그를 연 후 안닫아도 되긴 됐지만 react에서는 반드시 닫거나 `<input />` 등 꼭 닫도록 작성해야한다.  

input에 넣을 수 있는 요소들: text, range, checkbox...  

`<select></select>`  

`<textarea>`  

`<input>`에 뭔가 입력시 코드실행하고 싶으면: onChange/onInput  

이벤트핸들러는 매우 많다(30개 가량...암기보다 필요시 검색해서 쓸 것)  

`onClick={}`, `conChange={}`, `onInput={}`, `onMouseOver={}`, `onScroll={}`...  

반면, 암기할 것:
- state 만드는 법
- props 전송하는 법
- component 만드는 법
- UI 만드는 step

...  

```jsx
`<input onChange={(e) => { e.target.value }}>`
// `target`: 이벤트 발생한 html 태그
// `target.value`: 이벤트 발생한 html 태그에 입력한 값
```  

클릭 이벤트는 상위 html로 퍼진다(이벤트 버블링).  

```jsx
// 이벤트 버블링 발생
// span -> h4 -> div.
<div className="list" key={i}>
  <h4 onClick={()=>{setModal(true); setTitleIndex(i)}}> {title} <span onClick={()=>{
    let copy = [...likes];
    copy[i] = copy[i] + 1;
    setLikes(copy);
  }}>👍</span> {likes[i]} </h4>
  <p>2월 17일 발행</p>
</div>
```  

상위 html로 퍼지는 이벤트버블링을 막으려면 `e.stopPropagation()`  

```jsx
// 이벤트 버블링 방지
<div className="list" key={i}>
  <h4 onClick={()=>{setModal(true); setTitleIndex(i)}}> {title} <span onClick={(e)=>{ // e(for 'event instance') 추가
    e.stopPropagation(); // 전파 방지 처리
    let copy = [...likes];
    copy[i] = copy[i] + 1;
    setLikes(copy);
  }}>👍</span> {likes[i]} </h4>
  <p>2월 17일 발행</p>
</div>
```  

<input>에 입력한 값 저장하려면 보통 변수/state((e) => { setInputValue(e.target.value) })으로 저장해둠.  

```jsx
<input onChange={(e) => {setInputValue(e.target.value);
  console.log(inputValue);
}}></input>
```  

- (정보)위 코드 실행시 입력하면 바로 console 창에 입력한 값이 표시되지 않다가 다음 입력시 이전 입력했던 값이 나오는데, 이유는 state 등에 저장하는 방식은 시간이 오래걸리는 작업이므로 해당 state를 변경하는 작업을 비동기로 처리하고 바로 그 다음 라인인 `console.log(inputValue);`로 넘어가기 때문이다.







</br></br></br>

# class를 이용한 옛날 React 문법

constructor, super, render 무조건 채워넣는다.  

```jsx
// 기본 세팅
class Modal2 extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        {/*...*/}
      </div>
    );
  }
}
```  

class 컴포넌트에서 state 만드려면:

```jsx
class Modal2 extends React.Component {
  constructor(props) { // props 사용시
    super(props); // props 사용시
    this.state = { // state 만들기
      name: "kim",
      age: 20
    }
  }
  render() {
    return (
      <div>
        {this.state.name} {this.state.age} {/*{this.props}*/}
        <button onClick={() => {
          this.setState({age: 21});
        }}>나이 변경</button>
      </div>
    );
  }
}
```  


</br></br></br></br></br>

# Part 2. 쇼핑몰 프로젝트

`npm create vite@latest`

`cd 프로젝트디렉토리명`

`npm install`

`npm run dev`

react bootstrap 사이트 접속 -> 부트스트랩 설치 -> css 스크립트 삽입

(정보)이름이 대문자로 시작하면 모두 컴포넌트

App.jsx 등 파일에서 bootstrap 문서 코드스니펫의 import문 내용을 직접 import 하거나 index.html에 태그 삽입


</br></br></br>

# 이미지 넣는 법 & public 폴더 이용하기

- css파일에서 src 안의 이미지 넣을 땐 ./이미지경로
- 혹은 html 파일에선 import부터 하고 필요한 곳에서 사용(eg. `import bg(작명) from './bg.png'` ... `<div style={{ backgroundImage : 'url('+ bg +')'}}></div>`)
- `import bg(작명) from './bg.png'` `<img src={bg}/>`

3분할 이미지 사용시 bootstrap - grid

html에서 public 폴더 이미지 사용할 땐 그냥 `/이미지경로`

패키지의 public 폴더는 빌드시 압축을 하지 않고 그대로 유지된다.

public 폴더에서 이미지 등 사용시 주의점: 경로에서 하위계층이 더 생길시 문제 발생(eg. nike.com/some/problem/occurs) -> some/problem/occurs/image.png 이런 식으로 하면 되는 경우도 있어)

(이미지가 계속 추가되거나 바뀔 시 등에도 대처하기 위해?)  
create react app 사이트 가이드: `<img src={process.env.PUBLIC_URL + '/img/logo.png'}>` 이런 식으로 쓰길 권장.





</br></br></br>

# 




</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 




</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 




</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 





</br></br></br>

# 




</br></br></br>

# 





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