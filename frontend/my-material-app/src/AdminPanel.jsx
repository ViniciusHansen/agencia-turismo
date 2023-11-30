import React, { useState, useEffect } from "react";
import axios from "axios";
import useStyles from "./styles";

import {
  Card,
  CardContent,
  Paper,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Grid,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";

const AdminPanel = ({ goBack }) => {
  const [pacotes, setPacotes] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/admin/pacotes");
      setPacotes(response.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">Agência de Viagens</Typography>
          <div style={{ flexGrow: 1 }}></div>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.container}>
          <Container maxWidth="sm">
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Painel de Administração
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Aqui o Administrador pode ver todas as reservas do sistema.
            </Typography>
          </Container>
        </div>

        {/* <div className="admin-panel-container">
          <div className="pacotes-container">
            {pacotes.map((pacote, index) => (
              <div className="pacote" key={index}>
                <h2>Pacote {pacote.pacote_codigo}</h2>
                <p>Cliente: {pacote.cliente.email}</p>
                <h3>Visitas:</h3>
                <ul className="visitas-list">
                  {pacote.visitas.map((visita, idx) => (
                    <li key={idx}>{visita.nome}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="back-button" onClick={goBack}>
            Voltar
          </button>
        </div> */}

        <Container maxWidth="sm" className="admin-panel-container">
          {pacotes.map((pacote, index) => (
            <Paper key={index} elevation={3} style={{padding: "5 px"}} className={classes.paper}>
              <Typography variant="h5" gutterBottom>
                Pacote {pacote.pacote_codigo}
              </Typography>
              <Typography variant="body1" paragraph>
                Cliente: {pacote.cliente.email}
              </Typography>
              <Typography variant="h6" paragraph>
                Visitas:
              </Typography>
              <ul>
                {pacote.visitas.map((visita, idx) => (
                  <li key={idx}>{visita.nome}</li>
                ))}
              </ul>
            </Paper>
          ))}
          <button className={classes.backButton} onClick={goBack}>
            Voltar
          </button>
        </Container>
      </main>
    </>
  );
};

export default AdminPanel;
