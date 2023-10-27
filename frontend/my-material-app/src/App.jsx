import React from "react";
import Button from "@mui/material/Button";
import { PhotoCamera } from "@mui/icons-material";
import Autocomplete from "@mui/joy/Autocomplete";
import Input from "@mui/joy/Input";
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const destinos = ["Joinville", "Florianópolis"];

const App = () => {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          {/* <PhotoCamera /> */}
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
              Pacotes em Destaque
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Esses são os pacotes disponíveis para reserva.
            </Typography>
            <div className={classes.button}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Autocomplete placeholder="Destino" options={destinos} />
                </Grid>

                <Grid item>
                  <Button variant="contained" color="primary">
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12}>
                <Card className={classes.card}>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image Title"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CardContent className={classes.CardContent}>
                        <Typography gutterBottom variant="h5">
                          Heading
                        </Typography>
                        <Typography>
                          Descrição do conteudo. escala junto com o tamanho do
                          grid
                        </Typography>
                      </CardContent>
                      <CardActions className={classes.buttonVerMais}>
                        <Button size="small" color="primary">
                          Ver mais
                        </Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
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

export default App;
