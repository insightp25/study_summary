// /* eslint-disable */

import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useCallback } from 'react';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // 서버에 데이터 전송
    setIsModalOpen(false);
  };
  const [modalIndex, setModalIndex] = useState(0); // is this be called seamless?
  let blogTitle = '히나냥이 TEST BLOG';
  let [modal, setModal] = useState(false);
  let [post, setPost] = useState([
    {title: '남자 코트 추천', date: '10월 2일', like: 0}, 
    {title: '여자 코트 추천', date: '10월 3일', like: 0}, 
    {title: '가방 추천', date: '10월 5일', like: 0}
  ]);
  let [input, setInput] = useState('');

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
              <button onClick={(e) => {
                  e.stopPropagation();
                  let copy = [...post];
                  copy.splice(i, 1);
                  setPost(copy);
                }}>delete</button>
            </div>
          )
        })
      }

      <input onChange={(e) => {
        setInput(e.target.value);
        console.log(input);
      }}/>
      <button onClick={() => {
        let copy = [...post];
        copy.unshift({title: input, date: new Date().toLocaleDateString(), like: 0});
        setPost(copy);
        setInput('');
      }}>post!</button>

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

      <button onClick={() => {
        let sortedTitles = [...post].sort((a, b) => a.title.localeCompare(b.title));
        setPost(sortedTitles);
      }}>sort posts by title in ascending order</button>

      <button onClick={() => {
        let copy = [...post];
        copy[0].title = '테스트중입니다';
        setPost(copy);
      }}>글 제목 수정</button>

      <div className="consultation-bar" onClick={() => setIsModalOpen(true)}>
        상담이 필요하신가요?
      </div>

      <ConsultationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
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

function ConsultationModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const phoneNumber = '01012345678';

  const resetForm = useCallback(() => {
    setName('');
    setPhone('');
    setAgreeToTerms(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleCall = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert(`Please call ${phoneNumber} for immediate consultation.`);
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>상담 신청</h2>
        <input 
          type="text" 
          placeholder="이름" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="tel" 
          placeholder="전화번호" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />
        <label>
          <input 
            type="checkbox" 
            checked={agreeToTerms} 
            onChange={(e) => setAgreeToTerms(e.target.checked)} 
          />
          개인정보 제3자 제공에 동의합니다.
        </label>
        <a href="#">자세히 보기</a>
        <button onClick={() => {
          onSubmit({ name, phone, agreeToTerms });
          resetForm();
        }}>
          신청하기
        </button>
        <button onClick={handleCall} className="call-button">
          지금 바로 전화하기
        </button>
      </div>
    </div>
  );
}

export default App;
