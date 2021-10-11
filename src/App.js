import React, { useState, useCallback } from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  Col,
  Row,
  Container,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import ListarMoedas from "./components/Listar-moedas";
import axios from "axios";
function App() {
  const BASE =
    "http://data.fixer.io/api/latest?access_key=ac5ded36f89a3a9155f766450410ae3f";

  const [valor, setValor] = useState(1);
  const [moedaDe, setMoedaDe] = useState("BRL");
  const [moedaPa, setMoedaPa] = useState("USD");
  const [showSpinner, setShowSpinner] = useState(false);
  const [formValidado, setFormValidado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState("");
  const [alertShow, setAlertShow] = useState(false);

  function handleValor(e) {
    //pegar todos os dados n numericos invertar para ''
    setValor(e.target.value.replace(/\D/g, ""));
  }

  function handleMoedaDe(e) {
    setMoedaDe(e.target.value);
  }

  function handleMoedaPa(e) {
    setMoedaPa(e.target.value);
  }
  const obterCotacao = useCallback(
    (res) => {
      if (!res || res.success !== true) {
        return false;
      }
      const cotacaoDe = res.rates[moedaDe];
      const cotacaoPa = res.rates[moedaPa];
      const resultado = (1 / cotacaoDe) * cotacaoPa * valor;
      return resultado.toFixed(2);
    },
    [valor, moedaPa, moedaDe]
  );

  const handleRegister = useCallback(
    (e) => {
      e.preventDefault();
      setFormValidado(true);
      if (e.currentTarget.checkValidity() === true) {
        //chamada do fixer
        setShowSpinner(true);

        axios
          .get(BASE)
          .then((response) => {
            let cotacao = obterCotacao(response.data);
            if (cotacao) {
              setResult(`${valor} ${moedaDe} = ${cotacao} ${moedaPa}`);
              setShowModal(true);
              setShowSpinner(false);
              setAlertShow(false);
            } else {
              defineAlert();
            }
          })
          .catch((error) => {
            console.log(error);
            defineAlert();
          });
      }
    },
    [valor, moedaDe, moedaPa, obterCotacao]
  );

  function handleCloseModal() {
    setValor(1);
    setMoedaDe("BRL");
    setMoedaPa("USD");
    setFormValidado(false);
    setShowModal(false);
  }

  function defineAlert() {
    setAlertShow(true);
    setShowSpinner(false);
  }

  return (
    <Container>
      <h1 className="mt-4 mb-4">Conversor de moedas</h1>
      <Alert variant="danger" show={alertShow}>
        Error ao obter os dados, tente novamente!
      </Alert>
      <Form onSubmit={handleRegister} noValidate validated={formValidado}>
        <Row>
          <Col sm="3">
            <Form.Control
              placeholder="0"
              value={valor}
              onChange={handleValor}
              required
            />
          </Col>
          <Col sm="3">
            <Form.Control as="select" value={moedaDe} onChange={handleMoedaDe}>
              <ListarMoedas />
            </Form.Control>
          </Col>
          <Col sm="1" className="text-center" style={{ paddingTop: "5px" }}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Col>
          <Col sm="3">
            <Form.Control as="select" value={moedaPa} onChange={handleMoedaPa}>
              <ListarMoedas />
            </Form.Control>
          </Col>
          <Col sm="2">
            <Button variant="success" type="submit" data-testid="btn-converter">
              <span className={showSpinner ? "" : "hidden"}>
                <Spinner animation="border" size="sm" />
              </span>
              <span className={showSpinner ? "hidden" : ""}>Converter</span>
            </Button>
          </Col>
        </Row>
      </Form>
      <Modal
        data-testid="modal"
        show={showModal}
        style={{ color: "#222" }}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Conversão</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="success">
            Nova Conversão
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
