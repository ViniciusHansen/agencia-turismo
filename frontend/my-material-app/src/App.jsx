import React, { useState } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/joy/Autocomplete";
import useStyles from "./styles";
import Detalhes from "./Detalhes";
import LoginPage from "./LoginDIY";
import Register from "./RegisterDIY";
import PacoteForm from "./PacoteForm";

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
  const [viewDetails, setViewDetails] = useState(false);
  const [viewSignInSide, setViewSignInSide] = useState(false);
  const [viewSignUp, setViewSignUp] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [viewPacoteForm, setViewPacoteForm] = useState(false);

  const handleLogout = () => {
    // Limpe qualquer armazenamento local ou token de sessão
    localStorage.removeItem("access_token");

    // Atualize o estado para refletir que o usuário não está mais logado
    setIsLogged(false);
    setUsername("");

    // Redirecionar o usuário para a página principal ou qualquer outra página necessária
    // Por exemplo, usando react-router-dom: history.push('/');
  };

  if (viewPacoteForm) {
    return <PacoteForm goBack={() => setViewPacoteForm(false)} />;
  }

  if (viewDetails) {
    return <Detalhes goBack={() => setViewDetails(false)} />;
  }

  if (viewSignInSide) {
    return (
      <LoginPage
        goBack={() => setViewSignInSide(false)}
        onSuccess={() => {
          setViewSignInSide(false);
          setIsLogged(true);
        }}
        updateUsername={setUsername}
      />
    );
  }

  if (viewSignUp) {
    return (
      <Register
        goBack={() => setViewSignUp(false)}
        onSuccess={() => setViewSignUp(false)}
      />
    );
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">Agência de Viagens</Typography>
          <div style={{ flexGrow: 1 }}></div>

          {/* Se o usuário estiver logado, mostre o nome do usuário e o botão de logout */}
          {isLogged ? (
            <>
              <Typography variant="subtitle1" style={{ marginRight: "16px" }}>
                {username}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewPacoteForm}
              >
                Admin Panel
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setViewSignInSide(true)}
              >
                SignIn
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                style={{ marginLeft: "8px" }}
                onClick={() => setViewSignUp(true)}
              >
                SignUp
              </Button>
            </>
          )}
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
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => setViewDetails(true)}
                        >
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
