import { useState } from 'react'
import './App.css'

function App() {
  
  let [modal, setModal] = useState(false);

  let [postTitle, setPostTitle] = useState(["남자 코트 추천", "영화 추천", "도서 추천"]);
  let [likes, setLikes] = useState([0, 0, 0]);
  let [titleIndex, setTitleIndex] = useState(0);
  let [inputValue, setInputValue] = useState('');

  // const initialPosts = [
  //   { id: 1, title: "남자 코트 추천", date: "1월 17일 발행", likes: 0 },
  //   { id: 2, title: "여자 코트 추천", date: "2월 18일 발행", likes: 0 },
  //   { id: 3, title: "아무거나 추천", date: "3월 19일 발행", likes: 0 }
  // ];

  // let [posts, setPosts] = useState(initialPosts);

  return (
    <div className="App">
      <div className="black-nav">
        <h4>THIS IS A MOCK BLOG</h4>
      </div>

      <h4>ARTICLES</h4>

      {
        postTitle.map((title, i) => {
          return (
            <div className="list" key={i}>
              <h4 onClick={()=>{setModal(true); setTitleIndex(i)}}> {title} <span onClick={(e)=>{
                e.stopPropagation();
                let copy = [...likes];
                copy[i] = copy[i] + 1;
                setLikes(copy);
              }}>👍</span> {likes[i]} </h4>
              <p>2월 17일 발행</p>
              <button onClick={() => {
                let copy = [...postTitle];
                copy.splice(i, 1);
                setPostTitle(copy);
              }}>삭제</button>
            </div>
          );
        })
      }

      <button onClick={() => {
        let copy = [...postTitle];
        copy.sort();
        setPostTitle(copy);
      }}>가나다 순 정렬</button>

      <button onClick={() => {
        let copy = [...postTitle];
        copy[0] = "여자 코트 추천";
        setPostTitle(copy)
      }}>첫 번째 글 제목 변경</button>

      {
        modal === true ? <Modal postTitle={postTitle} titleIndex={titleIndex} setPostTitle={setPostTitle} color="skyblue"/> : null
      }

      <input onChange={(e) => {setInputValue(e.target.value);}}></input>

      <button onClick={() => {
        let copy = [...postTitle];
        let copyLikes = [...likes];
        copy.push(inputValue);
        copyLikes.push(0);
        setPostTitle(copy);
        setLikes(copyLikes);
      }}>글 추가</button>




      {/* {
        posts.map((post) => {
          return (
            <div className="list" key={post.id}>
              <h4>
                {post.title} 
                <span onClick={() => {
                  const updatedPosts = posts.map(p => 
                    p.id === post.id ? {...p, likes: p.likes + 1} : p
                  );
                  setPosts(updatedPosts);
                }}>👍</span> 
                {post.likes}
              </h4>
              <p>{post.date}</p>
            </div>
          );
        })
      }

      <button onClick={() => {
        const copy = [...posts].sort((a, b) => a.title.localeCompare(b.title));
        setPosts(copy);
      }}>가나다 순 정렬</button>

      <button onClick={() => {
        const copy = posts.map(post => 
          post.id === 1 ? {...post, title: "남자 구두 추천"} : post
        );
        setPosts(copy);
      }}>첫 번째 글 제목 변경</button> */}

    </div>
  )
}

function Modal(props) {
  return (
    <div className="modal" style={{background: props.color}}>
      <h4>{props.postTitle[props.titleIndex]}</h4>
      <p>Date</p>
      <p>Content</p>
      <button onClick={()=>{
        let copy = [...props.postTitle];
        copy[0] = "여자 코트 추천";
        props.setPostTitle(copy);
      }}>글 수정</button>
    </div>
  )
}

export default App
