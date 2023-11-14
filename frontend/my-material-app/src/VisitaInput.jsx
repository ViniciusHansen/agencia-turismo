import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const VisitaInput = () => {
  const [visita, setVisita] = useState({
    nome: '',
    endereco: '',
    hora_ini: '',
    hora_fim: '',
    tipo_visita: '',
    cidade: null, // Para armazenar a cidade selecionada
    restaurante: null, // Para armazenar o restaurante selecionado
    pontoTuristico: null, // Para armazenar o ponto turístico selecionado
    hotel: null, // Para armazenar o hotel selecionado
  });

  const [cidades, setCidades] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [hoteis, setHoteis] = useState([]);

  useEffect(() => {
    // Carregue os dados das cidades, restaurantes, pontos turísticos e hotéis do seu backend
    axios.get('/cidades').then((response) => {
      const cidadeOptions = response.data.map((cidade) => ({
        value: cidade.nome,
        label: cidade.nome,
      }));
      setCidades(cidadeOptions);
    });

    axios.get('/restaurantes').then((response) => {
      const restauranteOptions = response.data.map((restaurante) => ({
        value: restaurante.nome,
        label: restaurante.nome,
      }));
      setRestaurantes(restauranteOptions);
    });

    axios.get('/pontos-turisticos').then((response) => {
      const pontoTuristicoOptions = response.data.map((ponto) => ({
        value: ponto.nome,
        label: ponto.nome,
      }));
      setPontosTuristicos(pontoTuristicoOptions);
    });

    axios.get('/hoteis').then((response) => {
      const hotelOptions = response.data.map((hotel) => ({
        value: hotel.nome,
        label: hotel.nome,
      }));
      setHoteis(hotelOptions);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisita({ ...visita, [name]: value });
  };

  const handleCidadeChange = (selectedOption) => {
    setVisita({ ...visita, cidade: selectedOption });
  };

  const handleRestauranteChange = (selectedOption) => {
    setVisita({ ...visita, restaurante: selectedOption });
  };

  const handlePontoTuristicoChange = (selectedOption) => {
    setVisita({ ...visita, pontoTuristico: selectedOption });
  };

  const handleHotelChange = (selectedOption) => {
    setVisita({ ...visita, hotel: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envie os dados da visita para o backend aqui
    axios.post('/add-visita', visita).then((response) => {
      // Lide com a resposta do backend, como exibir uma mensagem de sucesso
      alert(response.data.message);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nome">
        <Form.Label>Nome da Visita</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={visita.nome}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="endereco">
        <Form.Label>Endereço</Form.Label>
        <Form.Control
          type="text"
          name="endereco"
          value={visita.endereco}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Row>
        <Col>
          <Form.Group controlId="hora_ini">
            <Form.Label>Hora Inicial</Form.Label>
            <Form.Control
              type="text"
              name="hora_ini"
              value={visita.hora_ini}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="hora_fim">
            <Form.Label>Hora Final</Form.Label>
            <Form.Control
              type="text"
              name="hora_fim"
              value={visita.hora_fim}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="tipo_visita">
        <Form.Label>Tipo de Visita</Form.Label>
        <Form.Control
          type="text"
          name="tipo_visita"
          value={visita.tipo_visita}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="cidade">
        <Form.Label>Cidade</Form.Label>
        <Select
          value={visita.cidade}
          onChange={handleCidadeChange}
          options={cidades}
        />
      </Form.Group>
      <Form.Group controlId="restaurante">
        <Form.Label>Restaurante</Form.Label>
        <Select
          value={visita.restaurante}
          onChange={handleRestauranteChange}
          options={restaurantes}
        />
      </Form.Group>
      <Form.Group controlId="pontoTuristico">
        <Form.Label>Ponto Turístico</Form.Label>
        <Select
          value={visita.pontoTuristico}
          onChange={handlePontoTuristicoChange}
          options={pontosTuristicos}
        />
      </Form.Group>
      <Form.Group controlId="hotel">
        <Form.Label>Hotel</Form.Label>
        <Select
          value={visita.hotel}
          onChange={handleHotelChange}
          options={hoteis}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Cadastrar Visita
      </Button>
    </Form>
  );
};

export default VisitaInput;
