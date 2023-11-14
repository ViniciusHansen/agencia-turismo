import React, { useState } from "react";

const PacoteForm = ({ goBack }) => {
  // Inicialize os estados como arrays vazios.
  const [hoteis, setHoteis] = useState({ nome: "", categoria: "", imagem: null });
  const [restaurantes, setRestaurantes] = useState([]);
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [tipoVisita, setTipoVisita] = useState(""); // Estado para armazenar o tipo de visita selecionada
  const [visita, setVisita] = useState({
    nome: "",
    descricao: "",
    imagem: null,
  }); // Estado para o objeto da visita selecionada

  const handleTipoVisitaChange = (e) => {
    setTipoVisita(e.target.value);
    // Reset os outros estados quando o tipo muda
    setHoteis([]);
    setRestaurantes([]);
    setPontosTuristicos([]);
  };

  const [pacote, setPacote] = useState({
    valor: "",
    data_ini: "",
    data_fim: "",
  });

  const [cidade, setCidade] = useState({
    cidade_nome: "",
    cidade_estado: "",
    cidade_populacao: "",
    cidade_imagem: null,
  });

  const handlePacoteChange = (e) => {
    const { name, value } = e.target;
    setPacote((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCidadeChange = (e) => {
    const { name, value } = e.target;
    if (name === "cidade_imagem") {
      setCidade((prevState) => ({
        ...prevState,
        cidade_imagem: e.target.files[0],
      }));
    } else {
      setCidade((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // let camposVisita;
  // if (tipoVisita === "hotel") {
  //   camposVisita = (
  //     <div>
  //       <input
  //         type="text"
  //         name="hoteis_nome"
  //         value={hoteis.nome}
  //         onChange={(e) => setHoteis({ ...hoteis, nome: e.target.value })}
  //         placeholder="Nome do Hotel"
  //       />
  //       <input
  //         type="text"
  //         name="hotel_categoria"
  //         value={hoteis.descricao}
  //         onChange={(e) => setHoteis({ ...hoteis, categoria: e.target.value })}
  //         placeholder="Categoria"
  //       />
  //       <input
  //         type="file"
  //         name="hotel_imagem"
  //         onChange={(e) => setHoteis({ ...hoteis, imagem: e.target.files[0] })}
  //         placeholder="Upload Imagem"
  //       />
  //     </div>
  //   );
  // } else if (tipoVisita === "restaurante") {
  //   camposVisita = (
  //     <div>
  //       <input
  //         type="text"
  //         name="restaurante_nome"
  //         value={visita.nome}
  //         onChange={(e) => setVisita({ ...visita, nome: e.target.value })}
  //         placeholder="Nome do Restaurante"
  //       />
  //       <input
  //         type="text"
  //         name="restaurante_especialidade"
  //         value={visita.descricao}
  //         onChange={(e) => setVisita({ ...visita, descricao: e.target.value })}
  //         placeholder="Especialidade"
  //       />
  //       <input
  //         type="file"
  //         name="restaurante_imagem"
  //         onChange={(e) => setVisita({ ...visita, imagem: e.target.files[0] })}
  //         placeholder="Upload Imagem"
  //       />
  //     </div>
  //   );
  // } else if (tipoVisita === "pontoTuristico") {
  //   camposVisita = (
  //     <div>
  //       <input
  //         type="text"
  //         name="pontoTuristico_nome"
  //         value={visita.nome}
  //         onChange={(e) => setVisita({ ...visita, nome: e.target.value })}
  //         placeholder="Nome do Ponto Turistico"
  //       />
  //       <input
  //         type="text"
  //         name="pontoTuristico_descricao"
  //         value={visita.descricao}
  //         onChange={(e) => setVisita({ ...visita, descricao: e.target.value })}
  //         placeholder="Descrição"
  //       />
  //       <input
  //         type="file"
  //         name="pontoTuristico_imagem"
  //         onChange={(e) => setVisita({ ...visita, imagem: e.target.files[0] })}
  //         placeholder="Upload Imagem"
  //       />
  //     </div>
  //   );
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifique se o array tem objetos com propriedades além de categorias vazias
    const typesFilled = [hoteis, restaurantes, pontosTuristicos].reduce(
      (count, currentArray) => {
        const hasData = currentArray.some((item) =>
          Object.values(item).some((value) => value !== null && value !== "")
        );
        return count + (hasData ? 1 : 0);
      },
      0
    );

    // Se mais de um tipo foi preenchido, retorna e impede o envio do formulário
    if (typesFilled > 1) {
      alert(
        "Por favor, preencha somente um campo entre Hotel, Restaurante ou Ponto Turístico."
      );
      return;
    }

    // Cria um objeto FormData para enviar os dados do formulário
    const formData = new FormData();
    formData.append("visita_nome", pacote.visita_nome);
    formData.append("data_ini", pacote.data_ini);
    formData.append("data_fim", pacote.data_fim);

    // Adiciona dados da cidade ao formData
    formData.append("cidade_nome", cidade.cidade_nome);
    formData.append("cidade_estado", cidade.cidade_estado);
    formData.append("cidade_populacao", cidade.cidade_populacao);
    if (cidade.cidade_imagem) {
      formData.append("cidade_imagem", cidade.cidade_imagem);
    }

    // if (tipoVisita === "hotel") {
    //   formData.append("hoteis_nome", hoteis.nome);
    //   formData.append("hoteis_categoria", hoteis.categoria);
    //   if (hoteis.imagem) {
    //     formData.append("hoteis_imagem", hoteis.imagem);
    //   }
    // } else if (tipoVisita === "restaurante") {
    //   formData.append("restaurante_nome", restaurantes.nome);
    //   formData.append("restaurante_especialidade", restaurantes.especialidade);
    //   formData.append("restaurante_imagem", restaurantes.imagem);
    // } else if (tipoVisita === "pontoTuristico") {
    //   formData.append("pontoTuristico_nome", pontosTuristicos.nome);
    //   formData.append("pontoTuristico_descricao", pontosTuristicos.descricao);
    //   formData.append("pontoTuristico_imagem", pontosTuristicos.imagem);
    // }
    console.log(formData);
    // Fetch ou Axios para enviar os dados do formulário para o servidor

    fetch("/add-visita", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Visita</h3>
      <input
        type="text"
        name="visita_nome"
        value={pacote.nome}
        onChange={handlePacoteChange}
        placeholder="Nome Visita"
      />
      <input
        type="time"
        name="data_ini"
        value={pacote.data_ini}
        onChange={handlePacoteChange}
        placeholder="Data Início"
      />
      <input
        type="time"
        name="data_fim"
        value={pacote.data_fim}
        onChange={handlePacoteChange}
        placeholder="Data Fim"
      />

      <h3>Cidade</h3>
      <input
        type="text"
        name="cidade_nome"
        value={cidade.cidade_nome}
        onChange={handleCidadeChange}
        placeholder="Nome"
      />
      <input
        type="text"
        name="cidade_estado"
        value={cidade.cidade_estado}
        onChange={handleCidadeChange}
        placeholder="Estado"
      />
      <input
        type="number"
        name="cidade_populacao"
        value={cidade.cidade_populacao}
        onChange={handleCidadeChange}
        placeholder="População"
      />
      <input
        type="file"
        name="cidade_imagem"
        onChange={handleCidadeChange}
        placeholder="Upload Imagem"
      />

      {/* <h3>Hotel</h3>
      {hoteis.map((hotel, index) => (
        <div key={index}>
          <input
            type="text"
            name="hotel_nome"
            value={hotel.nome}
            onChange={(e) => {
              const newHoteis = [...hoteis];
              newHoteis[index].nome = e.target.value;
              setHoteis(newHoteis);
            }}
            placeholder="Nome"
          />
          <input
            type="text"
            name="hotel_descricao"
            value={hotel.descricao}
            onChange={(e) => {
              const newHoteis = [...hoteis];
              newHoteis[index].descricao = e.target.value;
              setHoteis(newHoteis);
            }}
            placeholder="Descrição"
          />
          <input
            type="file"
            name="hotel_imagem"
            onChange={(e) => {
              const newHoteis = [...hoteis];
              newHoteis[index].imagem = e.target.files[0];
              setHoteis(newHoteis);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))}

      <h3>Restaurante</h3>
      {restaurantes.map((restaurante, index) => (
        <div key={index}>
          <input
            type="text"
            name="restaurante_${index}_especialidade"
            value={restaurante.especialidade}
            onChange={(e) => {
              const newRestaurantes = [...restaurantes];
              newRestaurantes[index].especialidade = e.target.value;
              setRestaurantes(newRestaurantes);
            }}
            placeholder="Especialidade"
          />
          <input
            type="file"
            name="restaurante_${index}_imagem"
            onChange={(e) => {
              const newRestaurantes = [...restaurantes];
              newRestaurantes[index].imagem = e.target.files[0];
              setRestaurantes(newRestaurantes);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))}

      <h3>Ponto Turístico</h3>
      {pontosTuristicos.map((ponto, index) => (
        <div key={index}>
          <input
            type="text"
            name="ponto_turistico_descricao"
            value={ponto.descricao}
            onChange={(e) => {
              const newPontos = [...pontosTuristicos];
              newPontos[index].descricao = e.target.value;
              setPontosTuristicos(newPontos);
            }}
            placeholder="Descrição"
          />
          <input
            type="file"
            name="ponto_turistico_imagem"
            onChange={(e) => {
              const newPontos = [...pontosTuristicos];
              newPontos[index].imagem = e.target.files[0];
              setPontosTuristicos(newPontos);
            }}
            placeholder="Upload Imagem"
          />
        </div>
      ))} */}

      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        {/* ... outros campos de formulário ... */}

        <select
          name="tipoVisita"
          value={tipoVisita}
          onChange={handleTipoVisitaChange}
        >
          <option value="">Selecione um tipo de visita</option>
          <option value="hotel">Hotel</option>
          <option value="restaurante">Restaurante</option>
          <option value="pontoTuristico">Ponto Turístico</option>
        </select>

        <br />
        {camposVisita}
      </form>
      <br></br>
      <br />

      <button type="submit">Adicionar Pacote</button>
      <button onClick={goBack}>Voltar</button>
    </form>
  );
};

export default PacoteForm;
