import {Button, Navbar, Container, Nav, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import bg from './redwing.jpeg'

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">KREAM</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="main-bg"></div>

      <Row>
        <Col>
          <img src={bg}/>
          <h4>KREAM</h4>
          <p>KREAM is a platform for buying and selling products online.</p>
        </Col>
        <Col>
          <img src={bg}/>
          <h4>KREAM</h4>
          <p>KREAM is a platform for buying and selling products online.</p>
        </Col>
        <Col>
          <img src={bg}/>
          <h4>KREAM</h4>
          <p>KREAM is a platform for buying and selling products online.</p>
        </Col>
      </Row>
    </div>
  )
}

export default App
