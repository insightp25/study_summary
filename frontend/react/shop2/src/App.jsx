import {Button, Navbar, Container, Nav, Row, Col} from 'react-bootstrap';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import data from './data.js';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import DetailPage from './DetailPage.jsx';

function App() {
  let [shoes] = useState(data);

  let navigate = useNavigate();

  return (
    <div className="App">

      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">KREAM</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/detail')}>Detail</Nav.Link>
            <Nav.Link onClick={() => navigate('/about')}>About</Nav.Link>

          </Nav>  
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={
          <div>
            <div className="main-bg"></div>
            <Row>
              {
                shoes.map((shoe, i) => {
                  return (
                    <Card shoe={shoe} i={i} />
                  )
                })
              }
            </Row>
          </div>
        }/>

        <Route path="/detail" element={<div><DetailPage /></div>}/>
        <Route path="/about" element={<About />}>
          <Route path="member" element={<div>멤버소개</div>} />
          <Route path="location" element={<div>찾아오는 길</div>} />
        </Route>
        <Route path="/event" element={<Event />}>
          <Route path="one" element={<div>첫 주문시 양배추즙 서비스</div>} />
          <Route path="two" element={<div>생일기념 쿠폰받기</div>} />
        </Route>
        <Route path="*" element={<div>404 NOT FOUND</div>} />
      </Routes>

      
    </div>
  )
}

function Card(props) {
  return (
    <Col>
      <img src={"./shoe" + props.i + ".jpeg"} />
      <h4>{props.shoe.title}</h4>
      <p>{props.shoe.price}</p>
    </Col>
  )
}

function About() {
  return (
    <div>
      <h4>회사소개</h4>
      <p>주소 : 서울시 강남구 테헤란로 77길 77 남도빌딩 3층</p>
      <p>전화번호 : 02-777-1234</p>
      <p>이메일 : kream@kream.com</p>
      <Outlet></Outlet>
    </div>
  )
}

function Event() {
  return (
    <div>
      <h4>오늘의 이벤트</h4>
      <Outlet></Outlet>
    </div>
  )
}

export default App
