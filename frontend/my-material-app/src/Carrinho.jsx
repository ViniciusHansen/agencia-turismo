import React, { useEffect } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import useStyles from "./styles";
import {
  Card,
  CardContent,
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

const Carrinho = ({ itens, onRemove, goBack, username }) => {
  const classes = useStyles();

  useEffect(() => {
    console.log("Itens [Carrinho.jsx]: ", itens);
  }, [itens]);

  const handleCheckout = async () => {
    try {
      // Enviar os itens do carrinho para o back-end para processamento
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itens: itens, usuario: username }), // Envie os itens do carrinho e o nome do usuário
      });
      console.log("Check-out [Carrinho.jsx]: ", itens, username);
      if (response.ok) {
        const data = await response.json();
        alert(
          "Check-out realizado com sucesso! Código do Pacote: " +
            data.pacoteCodigo
        );
        goBack(); // ou redirecionar para outra página
      } else {
        throw new Error("Falha no checkout");
      }
    } catch (error) {
      console.error("Erro no check-out:", error);
      alert("Erro ao realizar check-out!");
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">Agência de Viagens</Typography>
          <div style={{ flexGrow: 1 }}></div>

          <>
            <Typography variant="subtitle1" style={{ marginRight: "16px" }}>
              {username}
            </Typography>
          </>
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
              Carrinho
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            ></Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {itens.map((item, index) => (
              <Grid item key={index} xs={12} md={6}>
                <Card className={classes.card}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={
                          item.imagem ||
                          "https://demofree.sirv.com/nope-not-here.jpg"
                        }
                        title={item.nome}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5">
                          {item.nome}
                        </Typography>
                        {/* Outros detalhes do item podem ser adicionados aqui */}
                      </CardContent>
                      <CardActions className={classes.buttonVerMais}>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => onRemove(item.codigo)}
                        >
                          Remover
                        </Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <div className={classes.button}>
          <Grid container spacing={5} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCheckout();
                }}
              >
                Check-out
              </Button>
              <Button variant="outlined" color="primary" onClick={goBack}>
                Voltar
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

export default Carrinho;
