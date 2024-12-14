import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/joy/Autocomplete";
import useStyles from "./styles";
import axios from "axios";
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

const App = () => {
  const classes = useStyles();
  let listaAtivos = ["BBAS3", "ITUB3"];
  const skip = () => {
    return;
  }
  
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        
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
              Lista de Preços Teto
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              O preço teto é o preço limite para a compra de uma ação, calculado com base em indicadores fundamentalistas.
              Quando o preço de mercado está abaixo do preço teto, teoricamente a empresa estaria barata. <br/> Não é recomendação de investimento.
            </Typography>
            <div className={classes.button}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Autocomplete
                    placeholder="Ticker do ativo"
                    options={listaAtivos}
                    onChange={skip
                    }
                  />
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={skip}
                  >
                    Adicionar à lista
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
              <Grid item key={1} xs={12} md={12}>
                <Card className={classes.card}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      Ticker <br/>
                     BBAS3 <br/>
                     ITUB3
                    </Grid>

                    <Grid item xs={12} sm={4}>
                     Preço teto (Bazin) <br/>
                     R$ 21,20 <br/>
                     R$ 17,14
                    </Grid>

                    <Grid item xs={12} sm={4}>
                     Preço Atual <br/>
                     R$ 27,71 <br/>
                     R$ 27,43
                    </Grid>

                  </Grid>
                </Card>
              </Grid>
          </Grid>
        </Container>
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          © 2024
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          mais coisas
        </Typography>
      </footer>
    </>
  );
}

export default App;
