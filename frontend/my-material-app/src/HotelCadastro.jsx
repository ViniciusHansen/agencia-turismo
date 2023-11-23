import React, { useState } from "react";
import axios from "axios";

const HotelCadastro = ({ goBack, cidades }) => {
  const [hotelData, setHotelData] = useState({
    cidadeAssociada: "",
    nome: "",
    categoria: "",
    descricao: "",
    imagem: null, // Para carregar a imagem do hotel
  });

  const handleSelectChange = (fieldName, selectedOption) => {
    setHotelData({ ...hotelData, [fieldName]: selectedOption.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleImagemChange = (e) => {
    const imagem = e.target.files[0];
    setHotelData({ ...hotelData, imagem });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cidadeAssociada", hotelData.cidadeAssociada)
    formData.append("nome", hotelData.nome);
    formData.append("categoria", hotelData.categoria);
    formData.append("descricao", hotelData.descricao);
    formData.append("imagem", hotelData.imagem);
    console.log("Formulario [HotelCastro.jsx]: ",formData)
    try {
      const response = await axios.post("/add-hotel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      // Limpe o estado do formulário após o cadastro bem-sucedido
      setHotelData({
        nome: "",
        categoria: "",
        descricao: "",
        imagem: null,
      });
    } catch (error) {
      console.error("Erro ao cadastrar hotel:", error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cidade Associada:</label>
          <select
            name="cidade"
            value={hotelData.cidade ? hotelData.cidade.value : ""}
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
            value={hotelData.nome}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Categoria:</label>
          <input
            type="text"
            name="categoria"
            value={hotelData.categoria}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={hotelData.descricao}
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
          <button type="submit">Cadastrar Hotel</button>
        </div>
        <button onClick={goBack}>Voltar</button>
      </form>
    </div>
  );
};

export default HotelCadastro;
