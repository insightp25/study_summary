import {Button, Navbar, Container, Nav, Row, Col} from 'react-bootstrap';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import data from './data.js';
import { Routes, Route, Link } from 'react-router-dom';
import DetailPage from './DetailPage.jsx';

function App() {
  let [shoes] = useState(data);

  return (
    <div className="App">

      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">KREAM</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Link to="/">홈</Link>
            <Link to="/detail">상세페이지</Link>
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

export default App
