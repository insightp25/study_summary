import { useState } from 'react'
import './App.css'

function App() {
  
  let [modal, setModal] = useState(false);

  let [postTitle, setPostTitle] = useState(["남자 코트 추천", "여자 코트 추천", "아이템 추천"]);
  let [likes, setLikes] = useState([0, 0, 0]);

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
              <h4>{title} <span onClick={()=>{
                let copy = [...likes];
                copy[i] = copy[i] + 1;
                setLikes(copy);
              }}>👍</span> {likes[i]} </h4>
              <p>2월 17일 발행</p>
            </div>
          );
        })
      }

      <button onClick={() => {
        let copy = [...postTitle];
        copy.sort();
        setPostTitle(copy);
      }}>가나다 순 정렬</button>

      {
        modal === true ? <Modal /> : null
      }

      <button onClick={() => {
        let copy = [...postTitle];
        copy[0] = "남자 구두 추천";
        setPostTitle(copy)
      }}>첫 번째 글 제목 변경</button>






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
