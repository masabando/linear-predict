import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

function BasicExample() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Navbar className="bg-body-tertiary sticky-top">
        <Container fluid>
          <Navbar.Brand href="./">Webで機械学習</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => { setShow(true) }}>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>このページについて</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          TensorFlow.jsを使った機械学習のデモページです。<br />
          クライアントサイドで動作するため、サーバーにデータを送信することなく機械学習を体験できます。<br />
          モデルの作成、学習、推論を全てブラウザ上で行います。
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BasicExample;
