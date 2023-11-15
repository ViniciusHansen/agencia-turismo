import React, { useState } from 'react';
import axios from 'axios';

const CidadeCadastro = ({goBack}) => {
  const [cidadeData, setCidadeData] = useState({
    nome: '',
    estado: '',
    populacao: '',
    imagem: null, // Para carregar a imagem da cidade
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCidadeData({ ...cidadeData, [name]: value });
  };

  const handleImagemChange = (e) => {
    const imagem = e.target.files[0];
    setCidadeData({ ...cidadeData, imagem });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nome', cidadeData.nome);
    formData.append('estado', cidadeData.estado);
    formData.append('populacao', cidadeData.populacao);
    formData.append('imagem', cidadeData.imagem);

    try {
      const response = await axios.post('/add-cidade', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      // Limpe o estado do formulário após o cadastro bem-sucedido
      setCidadeData({
        nome: '',
        estado: '',
        populacao: '',
        imagem: null,
      });
    } catch (error) {
      console.error('Erro ao cadastrar cidade:', error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Cidade</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text" name="nome" value={cidadeData.nome} onChange={handleInputChange} />
        </div>
        <div>
          <label>Estado:</label>
          <input type="text" name="estado" value={cidadeData.estado} onChange={handleInputChange} />
        </div>
        <div>
          <label>População:</label>
          <input type="text" name="populacao" value={cidadeData.populacao} onChange={handleInputChange} />
        </div>
        <div>
          <label>Imagem:</label>
          <input type="file" name="imagem" accept="image/*" onChange={handleImagemChange} />
        </div>
        <div>
          <button type="submit">Cadastrar Cidade</button>
        </div>
          <button onClick={goBack}>Voltar</button>
      </form>
    </div>
  );
};

export default CidadeCadastro;
