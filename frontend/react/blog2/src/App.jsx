import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  let post = '강남 우동 맛집';
  let [postTitle, setPostTitle] = useState(["남자 코트 추천", "여자 코트 추천", "아이템 추천"]);
  let [like, setLike] = useState(0);
  let [modal, setModal] = useState(false);

  function test() {
    console.log('test');
  }

  return (
    <div className="App">


      
      <div className="black-nav">
        <h4>THIS IS A MOCK BLOG</h4>
      </div>

      <h4>ARTICLES</h4>

      <button onClick={() => {
        let copy = [...postTitle];
        copy.sort();
        setPostTitle(copy);
      }}>가나다 순 정렬</button>

      <div className="list">
        <h4>{postTitle[0]} <span onClick={()=>{setLike(like + 1)}}>👍</span> {like}</h4>
        <p>2월 17일 발행</p>
      </div>
      <div className="list">
        <h4>{postTitle[1]}</h4>
        <p>2월 17일 발행</p>
      </div>
      <div className="list">
        <h4 onClick={() => { setModal(!modal)}}>{postTitle[2]}</h4>
        <p>2월 17일 발행</p>
      </div>

      <button onClick={() => {
        let copy = [...postTitle];
        copy[0] = "남자 구두 추천";
        setPostTitle(copy)
      }}>첫 번째 글 제목 변경</button>


      {
        modal === true ? <Modal /> : null
      }

    </div>
  )
}

function Modal() {
  return (
    <div className="modal">
      <h4>Title</h4>
      <p>Date</p>
      <p>Content</p>
    </div>
  )
}

export default App
