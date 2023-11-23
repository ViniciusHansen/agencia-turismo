import React, { useState, useEffect } from "react";
import axios from "axios";

const VisitaInput = ({ goBack }) => {
  const [visita, setVisita] = useState({
    nome: "",
    endereco: "",
    hora_ini: "",
    hora_fim: "",
    tipo_visita: "",
    cidade: null,
    restaurante: null,
    pontoTuristico: null,
    hotel: null,
  });

  const [cidades, setCidades] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [hoteis, setHoteis] = useState([]);
  const [tipoSelecao, setTipoSelecao] = useState("");

  useEffect(() => {
    axios.get("/cidades").then((response) => {
      const cidadeOptions = response.data.map((cidade) => ({
        value: cidade.nome,
        label: cidade.nome,
      }));
      setCidades(cidadeOptions);
    });

    axios.get("/restaurantes").then((response) => {
      const restauranteOptions = response.data.map((restaurante) => ({
        value: restaurante.nome,
        label: restaurante.nome,
      }));
      setRestaurantes(restauranteOptions);
    });

    axios.get("/pontos-turisticos").then((response) => {
      const pontoTuristicoOptions = response.data.map((ponto) => ({
        value: ponto.nome,
        label: ponto.nome,
      }));
      setPontosTuristicos(pontoTuristicoOptions);
    });

    axios.get("/hoteis").then((response) => {
      const hotelOptions = response.data.map((hotel) => ({
        value: hotel.nome,
        label: hotel.nome,
      }));
      setHoteis(hotelOptions);
    });

    if (tipoSelecao !== "restaurante") {
      setVisita((v) => ({ ...v, restaurante: null }));
    }
    if (tipoSelecao !== "pontoTuristico") {
      setVisita((v) => ({ ...v, pontoTuristico: null }));
    }
    if (tipoSelecao !== "hotel") {
      setVisita((v) => ({ ...v, hotel: null }));
    }
  }, [tipoSelecao]);

  useEffect(() => {
    // ...

    axios
      .get(`/restaurantes?cidade=${visita.cidade ? visita.cidade.value : ""}`)
      .then((response) => {
        const restauranteOptions = response.data.map((restaurante) => ({
          value: restaurante.nome,
          label: restaurante.nome,
        }));
        setRestaurantes(restauranteOptions);
      });

    axios
      .get(
        `/pontos-turisticos?cidade=${visita.cidade ? visita.cidade.value : ""}`
      )
      .then((response) => {
        const pontoTuristicoOptions = response.data.map((ponto) => ({
          value: ponto.nome,
          label: ponto.nome,
        }));
        setPontosTuristicos(pontoTuristicoOptions);
      });

    axios
      .get(`/hoteis?cidade=${visita.cidade ? visita.cidade.value : ""}`)
      .then((response) => {
        const hotelOptions = response.data.map((hotel) => ({
          value: hotel.nome,
          label: hotel.nome,
        }));
        setHoteis(hotelOptions);
      });

  }, [visita.cidade]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisita({ ...visita, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    // Ajustar apenas para restaurante, pontoTuristico e hotel
    if (["restaurante", "pontoTuristico", "hotel"].includes(name)) {
      if (selectedOption.value) {
        setTipoSelecao(name);
      } else {
        setTipoSelecao("");
      }
    }
    setVisita({ ...visita, [name]: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(visita);
    axios.post("/add-visita", visita).then((response) => {
      alert(response.data.message);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome da Visita</label>
        <input
          type="text"
          name="nome"
          value={visita.nome}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Endereço</label>
        <input
          type="text"
          name="endereco"
          value={visita.endereco}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Hora Inicial</label>
        <input
          type="time"
          name="hora_ini"
          value={visita.hora_ini}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Hora Final</label>
        <input
          type="time"
          name="hora_fim"
          value={visita.hora_fim}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Cidade</label>
        <select
          name="cidade"
          value={visita.cidade ? visita.cidade.value : ""}
          onChange={(e) =>
            handleSelectChange("cidade", {
              value: e.target.value,
              label: e.target.value,
            })
          }
        >
          <option value="">Selecione uma cidade</option>
          {cidades.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Restaurante</label>
        <select
          name="restaurante"
          value={visita.restaurante ? visita.restaurante.value : ""}
          onChange={(e) =>
            handleSelectChange("restaurante", {
              value: e.target.value,
              label: e.target.value,
            })
          }
          disabled={
            (tipoSelecao && tipoSelecao !== "restaurante") || !visita.cidade
          }
        >
          <option value="">Selecione um restaurante</option>
          {restaurantes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Ponto Turístico</label>
        <select
          name="pontoTuristico"
          value={visita.pontoTuristico ? visita.pontoTuristico.value : ""}
          onChange={(e) =>
            handleSelectChange("pontoTuristico", {
              value: e.target.value,
              label: e.target.value,
            })
          }
          disabled={
            (tipoSelecao && tipoSelecao !== "pontoTuristico") || !visita.cidade
          }
        >
          <option value="">Selecione um ponto turístico</option>
          {pontosTuristicos.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Hotel</label>
        <select
          name="hotel"
          value={visita.hotel ? visita.hotel.value : ""}
          onChange={(e) =>
            handleSelectChange("hotel", {
              value: e.target.value,
              label: e.target.value,
            })
          }
          disabled={(tipoSelecao && tipoSelecao !== "hotel") || !visita.cidade}
        >
          <option value="">Selecione um hotel</option>
          {hoteis.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Cadastrar Visita</button>
      <button type="button" onClick={goBack}>
        Voltar
      </button>
    </form>
  );
};

export default VisitaInput;
