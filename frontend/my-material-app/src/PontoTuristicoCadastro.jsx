import React, { useState } from "react";
import axios from "axios";

const PontoTuristicoCadastro = ({ goBack, cidades}) => {
  const [pontoTuristicoData, setPontoTuristicoData] = useState({
    cidadeAssociada : "",
    nome: "",
    descricao: "",
    imagem: null, // Para carregar a imagem do ponto turístico
  });

  const handleSelectChange = (fieldName, selectedOption) => {
    setPontoTuristicoData({ ...pontoTuristicoData, [fieldName]: selectedOption.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPontoTuristicoData({ ...pontoTuristicoData, [name]: value });
  };

  const handleImagemChange = (e) => {
    const imagem = e.target.files[0];
    setPontoTuristicoData({ ...pontoTuristicoData, imagem });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cidadeAssociada", pontoTuristicoData.cidadeAssociada)
    formData.append("nome", pontoTuristicoData.nome);
    formData.append("descricao", pontoTuristicoData.descricao);
    formData.append("imagem", pontoTuristicoData.imagem);
    console.log("Formulario [PontoTuristicoCadastro.jsx]: ",formData)
    try {
      const response = await axios.post("/add-ponto-turistico", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      // Limpe o estado do formulário após o cadastro bem-sucedido
      setPontoTuristicoData({
        nome: "",
        descricao: "",
        imagem: null,
      });
    } catch (error) {
      console.error("Erro ao cadastrar ponto turístico:", error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Ponto Turístico</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cidade Associada:</label>
          <select
            name="cidade"
            value={
              pontoTuristicoData.cidade ? pontoTuristicoData.cidade.value : ""
            }
            onChange={(e) =>
              handleSelectChange("cidadeAssociada", {
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
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={pontoTuristicoData.nome}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={pontoTuristicoData.descricao}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Imagem:</label>
          <input
            type="file"
            name="imagem"
            accept="image/*"
            onChange={handleImagemChange}
          />
        </div>
        <div>
          <button type="submit">Cadastrar Ponto Turístico</button>
        </div>
        <button onClick={goBack}>Voltar</button>
      </form>
    </div>
  );
};

export default PontoTuristicoCadastro;
