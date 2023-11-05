import React, { useState } from 'react';

const PacoteForm = () => {
  // ... [outros estados]

  const [hoteis, setHoteis] = useState([{ categoria: '', imagem: null }]);
  const [restaurantes, setRestaurantes] = useState([{ especialidade: '', imagem: null }]);
  const [pontosTuristicos, setPontosTuristicos] = useState([{ desc: '', imagem: null }]);

  const handleAddHotel = () => {
    setHoteis([...hoteis, { categoria: '', imagem: null }]);
  };

  const handleAddRestaurante = () => {
    setRestaurantes([...restaurantes, { especialidade: '', imagem: null }]);
  };

  const handleAddPontoTuristico = () => {
    setPontosTuristicos([...pontosTuristicos, { desc: '', imagem: null }]);
  };

  // ... [outros handlers]

  return (
    <form onSubmit={handleSubmit}>
      {/* ... [outros campos de formulário] */}

      <h3>Hotel</h3>
      {hoteis.map((hotel, index) => (
        <div key={index}>
          <input
            type="text"
            name="categoria"
            value={hotel.categoria}
            onChange={e => {
              const newHoteis = [...hoteis];
              newHoteis[index].categoria = e.target.value;
              setHoteis(newHoteis);
            }}
            placeholder="Categoria"
          />
          <input
            type="file"
            name="imagem"
            onChange={e => {
              const newHoteis = [...hoteis];
              newHoteis[index].imagem = e.target.files[0];
              setHoteis(newHoteis);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddHotel}>+ Add Hotel</button>

      <h3>Restaurante</h3>
      {restaurantes.map((restaurante, index) => (
        <div key={index}>
          <input
            type="text"
            name="especialidade"
            value={restaurante.especialidade}
            onChange={e => {
              const newRestaurantes = [...restaurantes];
              newRestaurantes[index].especialidade = e.target.value;
              setRestaurantes(newRestaurantes);
            }}
            placeholder="Especialidade"
          />
          <input
            type="file"
            name="imagem"
            onChange={e => {
              const newRestaurantes = [...restaurantes];
              newRestaurantes[index].imagem = e.target.files[0];
              setRestaurantes(newRestaurantes);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddRestaurante}>+ Add Restaurante</button>

      <h3>Ponto Turístico</h3>
      {pontosTuristicos.map((ponto, index) => (
        <div key={index}>
          <input
            type="text"
            name="desc"
            value={ponto.desc}
            onChange={e => {
              const newPontos = [...pontosTuristicos];
              newPontos[index].desc = e.target.value;
              setPontosTuristicos(newPontos);
            }}
            placeholder="Descrição"
          />
          <input
            type="file"
            name="imagem"
            onChange={e => {
              const newPontos = [...pontosTuristicos];
              newPontos[index].imagem = e.target.files[0];
              setPontosTuristicos(newPontos);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddPontoTuristico}>+ Add Ponto Turístico</button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PacoteForm;
