import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = ({ goBack }) => {
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/admin/pacotes");
      setPacotes(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Painel de Administração</h1>
      <div>
        {pacotes.map((pacote, index) => (
          <div key={index}>
            <h2>Pacote {pacote.pacote_codigo}</h2>
            <p>Cliente: {pacote.cliente.email}</p>
            <h3>Visitas:</h3>
            <ul>
              {pacote.visitas.map((visita, idx) => (
                <li key={idx}>{visita.nome}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={goBack}>Voltar</button>
    </div>
  );
};

export default AdminPanel;
