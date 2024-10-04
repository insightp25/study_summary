// /* eslint-disable */

import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  let blogTitle = '히나냥이 TEST BLOG';

  let [postTitle, changePostTitle] = useState(['남자 코트 추천', '여자 코트 추천', '가방 추천']);
  let [postDate, dateFunc] = useState(['10월 2일', '10월 3일', '10월 5일']);
  let [like, updateLike] = useState(0);


  // test
  let [posts, setPosts] = useState([
    { title: '남자 코트 추천', date: '10월 2일' },
    { title: '여자 코트 추천', date: '10월 3일' },
    { title: '가방 추천', date: '10월 5일' },
  ]);

  
  return (
    <div className="App">
      <div className="black-nav">
        <h2>{blogTitle}</h2>
      </div>




      <br></br>

      <button onClick={() => {
        let sortedTitles = [...postTitle].sort();
        changePostTitle(sortedTitles);
      }}>sort posts by title in ascending order</button>



      <br></br>
      <br></br>

      <button onClick={() => {
        let copy = [...postTitle];
        copy[0] = '테스트중입니다';
        changePostTitle(copy);
      }}>글 제목 수정</button>



      <div className='list'>
        <h4>{postTitle[0]} <span onClick={() => {updateLike('hi')}}>👍</span> {like} </h4>
        <p>{postDate[0]} 발행</p>
      </div>
      <div className='list'>
        <h4>{postTitle[1]} <span onClick={() => {updateLike(like + 1)}}>👍</span> {like}</h4>
        <p>{postDate[1]} 발행</p>
      </div>
      <div className='list'>
        <h4>{postTitle[2]} <span onClick={() => {updateLike(1)}}>👍</span> {like}</h4>
        <p>{postDate[2]} 발행</p>
      </div>



      {/* test */}
      <button onClick={() => {
          let sortedPosts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
        setPosts(sortedPosts);
      }}>sort posts by title in ascending order</button>

      {posts.map((post, index) => (
        <div className='list' key={index}>
          <h4>{post.title} <span onClick={() => {updateLike(like + 1)}}>👍</span> {like}</h4>
          <p>{post.date} 발행</p>
        </div>
      ))}


    </div>
  );
}

export default App;
