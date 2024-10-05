// /* eslint-disable */

import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [modalIndex, setModalIndex] = useState(0); // is this be called seamless?
  let blogTitle = '히나냥이 TEST BLOG';
  let [modal, setModal] = useState(false);
  let [post, setPost] = useState([
    {title: '남자 코트 추천', date: '10월 2일', like: 0}, 
    {title: '여자 코트 추천', date: '10월 3일', like: 0}, 
    {title: '가방 추천', date: '10월 5일', like: 0}
  ]);
  
  return (
    <div className="App">
      <div className="black-nav">
        <h2>{blogTitle}</h2>
      </div>

      {
        post.map(function(x, i){
          return (
            <div className='list' key={i}>
              <h4 onClick={() => {
                  setModalIndex(i); // can this be called seamless?
                  setModal(!modal)
                }}>{x.title}
                <span onClick={(e) => {
                  e.stopPropagation();
                  let copy = [...post];
                  x.like++;
                  setPost(copy);
                }}>👍</span> 
                <span onClick={(e) => e.stopPropagation()}>{x.like}</span>
              </h4>
              <p>{x.date} 발행</p>
            </div>
          )
        })
      }

      {modal === true ? <Modal post={post} index={modalIndex} setPost={setPost}></Modal> : null}

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>


      <button onClick={() => {
        let sortedTitles = [...post].sort((a, b) => a.title.localeCompare(b.title));
        setPost(sortedTitles);
      }}>sort posts by title in ascending order</button>

      <button onClick={() => {
        let copy = [...post];
        copy[0].title = '테스트중입니다';
        setPost(copy);
      }}>글 제목 수정</button>
    </div>
  );
}

function Modal(props) {
  return (
    <div className='modal'>
      <h3>{props.post[props.index].title}</h3>
      <p>발행일: {props.post[props.index].date}</p>
      <p>좋아요: {props.post[props.index].like}</p>
      <button onClick={() => {
        let copy = [...props.post];
        copy[props.index].title = '수정된 제목';
        props.setPost(copy);
      }}>change title</button>
    </div>
  );
}

export default App;
