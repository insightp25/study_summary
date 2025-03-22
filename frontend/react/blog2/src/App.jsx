import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  let post = '강남 우동 맛집';
  let [post_title, setPostTitle] = useState(["남자 코트 추천", "여자 코트 추천", "아이템 추천"]);
  let [like, setLike] = useState(0);

  function test() {
    console.log('test');
  }

  return (
    <div className="App">
      <div className="black-nav">
        <h4>THIS IS A MOCK BLOG</h4>
      </div>
      <h4>ARTICLES</h4>
      <div className="list">
        <h4>{post_title[0]} <span onClick={()=>{setLike(like + 1)}}>👍</span> {like}</h4>
        <p>2월 17일 발행</p>
      </div>
      <div className="list">
        <h4>{post_title[1]}</h4>
        <p>2월 17일 발행</p>
      </div>
      <div className="list">
        <h4>{post_title[2]}</h4>
        <p>2월 17일 발행</p>
      </div>
    </div>
  )
}

export default App
