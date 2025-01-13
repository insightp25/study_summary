import { Navbar, Container, Nav } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';
import data from './data';

function App() {

  let [shoes] = useState(data);
  console.log(shoes[0].title);

  return (
    <div className="App">
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="main-bg"></div>
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="80%"/>
            <h4>{shoes[0].title}</h4>
            <p>{shoes[0].price}</p>
          </div>
          <div class="col-md-4">
            <img src="https://codingapple1.github.io/shop/shoes2.jpg" width="80%"/>
            <h4>상품명</h4>
            <p>상품설명</p>
          </div>
          <div class="col-md-4">
            <img src="https://codingapple1.github.io/shop/shoes3.jpg" width="80%"/>
            <h4>상품명</h4>
            <p>상품설명</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
