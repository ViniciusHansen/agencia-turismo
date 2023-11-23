import React, { useState } from "react";
import Button from "@mui/material/Button";
import useStyles from "./styles";

import {
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Toolbar,
  Container,
} from "@mui/material";

const Detalhes = ({ pacote, onAdd, goBack, isLogged }) => {
  console.log("Pacote [Detalhes.jsx]: ", pacote);
  const classes = useStyles();
  let pontoInteresseImagem, pontoInteresseTitulo, pontoInteresseSubtitulo;

  //======LOGICA MERDA=======

  if (pacote.hotel) {
    // Se existir 'hotel' no pacote, defina as variáveis para renderizar informações do hotel
    pontoInteresseImagem = pacote.hoteis.imagem;
    pontoInteresseTitulo = pacote.hoteis.nome;
    pontoInteresseSubtitulo = pacote.hoteis.descricao; // Substitua pelo que for apropriado para seu app
  } else if (pacote.restaurante) {
    // Se existir 'restaurante' no pacote, defina as variáveis para renderizar informações do restaurante
    pontoInteresseImagem = pacote.restaurante.imagem;
    pontoInteresseTitulo = pacote.restaurante.nome;
    pontoInteresseSubtitulo = `Especialidade: ${pacote.restaurante.especialidade}`;
  } else if (pacote.pontoTuristico) {
    // Se existir 'pontoTuristico' no pacote, defina as variáveis para renderizar informações do ponto turístico
    pontoInteresseImagem = pacote.pontoTuristico.imagem;
    pontoInteresseTitulo = pacote.pontoTuristico.nome;
    pontoInteresseSubtitulo = pacote.pontoTuristico.descricao; // Substitua pelo que for apropriado para seu app
  }
  //==========================
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">Agência de Viagens</Typography>
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
              {pacote.nome}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              {`Das ${pacote.hora_ini} às ${pacote.hora_fim}`}
            </Typography>
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {/* Renderiza o card da cidade */}
            <Grid item key="cidade" xs={12} sm={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={
                    // pacote.cidade.imagem ||
                    "https://demofree.sirv.com/nope-not-here.jpg"
                  }
                  title={pacote.cidade.nome}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5">
                    {pacote.cidade.descricao}
                  </Typography>
                  <Typography>{pacote.cidade.estado}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Renderiza o card do ponto de interesse */}
            <Grid item key="pontoInteresse" xs={12} sm={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={
                    pontoInteresseImagem ||
                    "https://demofree.sirv.com/nope-not-here.jpg"
                  }
                  title={pontoInteresseTitulo}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5">
                    {pontoInteresseTitulo}
                  </Typography>
                  <Typography>{pontoInteresseSubtitulo}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <div className={classes.button}>
          <Grid container spacing={5} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (isLogged) {
                    onAdd(pacote);
                    alert("Visita adicionada com sucesso!");
                    goBack();
                  } else {
                    alert("Você precisa estar logado para reservar.");
                    goBack();
                  }
                }}
                // Desabilita o botão se o usuário não estiver logado
                disabled={!isLogged}
              >
                Reservar
              </Button>
              <Button variant="outlined" color="primary" onClick={goBack}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </div>
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          © 2023
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          mais coisas
        </Typography>
      </footer>
    </>
  );
};

export default Detalhes;
