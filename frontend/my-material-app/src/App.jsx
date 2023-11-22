import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/joy/Autocomplete";
import useStyles from "./styles";
import Detalhes from "./Detalhes";
import LoginPage from "./LoginDIY";
import Register from "./RegisterDIY";
import VisitaInput from "./VisitaInput";
import CidadeCadastro from "./CidadeCadastro";
import HotelCadastro from "./HotelCadastro";
import PontoTuristicoCadastro from "./PontoTuristicoCadastro";
import RestauranteCadastro from "./RestauranteCadastro";
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
import Carrinho from "./Carrinho";

const destinos = ["Joinville", "Florianópolis"];

const App = () => {
  const classes = useStyles();
  const [viewDetails, setViewDetails] = useState(null);
  const [viewSignInSide, setViewSignInSide] = useState(false);
  const [viewSignUp, setViewSignUp] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [viewPacoteForm, setViewPacoteForm] = useState(false);
  const [viewCadastroCidade, setViewCadastroCidade] = useState(false);
  const [viewCadastroRestaurante, setViewCadastroRestaurante] = useState(false);
  const [viewCadastroPontoTuristico, setViewCadastroPontoTuristico] =
    useState(false);
  const [viewCadastroHotel, setViewCadastroHotel] = useState(false);
  const [viewCarrinho, setViewCarrinho] = useState(false);
  const [pacotes, setPacotes] = useState([]);

  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho([...carrinho, item]);
    // console.log(carrinho);
  };

  // const removerDoCarrinho = (itemId) => {
  //   setCarrinho(carrinho.filter((item) => item.id !== itemId));
  // };

  const removerDoCarrinho = (codigoItem) => {
    setCarrinho(carrinho.filter((item) => item.codigo !== codigoItem));
  };

  useEffect(() => {
    // Função para carregar os pacotes.
    const fetchPacotes = async () => {
      try {
        const response = await fetch("/visitas"); // Seu endpoint deve corresponder à configuração do seu servidor.
        const data = await response.json();
        console.log("Visitas [App.jsx]: ", data);
        setPacotes(data); // Atualizando o estado com os dados recebidos.
      } catch (error) {
        console.error("Falha ao buscar pacotes:", error);
      }
    };

    fetchPacotes(); // Chamada da função no carregamento do componente.

    console.log("Carrinho [App.jsx]: ", carrinho);
  }, [carrinho]); // Array de dependências vazio, indica que o efeito será executado uma vez após o render inicial.

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setIsLogged(false);
    setUsername("");

    // Redirecionar o usuário para a página principal ou qualquer outra página necessária
    // Por exemplo, usando react-router-dom: history.push('/');
  };

  if (viewPacoteForm) {
    return <VisitaInput goBack={() => setViewPacoteForm(null)} />;
  }

  if (viewCadastroCidade) {
    return <CidadeCadastro goBack={() => setViewCadastroCidade(null)} />;
  }

  if (viewCadastroPontoTuristico) {
    return (
      <PontoTuristicoCadastro
        goBack={() => setViewCadastroPontoTuristico(null)}
      />
    );
  }

  if (viewCadastroRestaurante) {
    return (
      <RestauranteCadastro goBack={() => setViewCadastroRestaurante(null)} />
    );
  }

  if (viewCadastroHotel) {
    return <HotelCadastro goBack={() => setViewCadastroHotel(null)} />;
  }
  //=========SUSPEITO============
  if (viewDetails) {
    return (
      <Detalhes
        pacote={viewDetails}
        onAdd={adicionarAoCarrinho}
        goBack={() => setViewDetails(null)}
      />
    );
  }
  //=============================
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

  if (viewCarrinho) {
    return (
      <Carrinho
        itens={carrinho}
        onRemove={removerDoCarrinho}
        goBack={() => setViewCarrinho(false)}
        username={username}
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
                Cadastrar Visitas
              </Button>

              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewCadastroHotel}
              >
                Cadastrar Hotel
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewCadastroRestaurante}
              >
                Cadastrar Restaurante
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewCadastroCidade}
              >
                Cadastrar Cidade
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewCadastroPontoTuristico}
              >
                Cadastrar Ponto Turístico
              </Button>

              <Button
                color="inherit"
                variant="outlined"
                onClick={setViewCarrinho}
              >
                Carrinho
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
              Visitas em Destaque
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Essas são as visitas disponíveis para reserva. Adicione as visitas
              desejadas no carrinho. O pacote será fechado na hora da compra.
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
            {pacotes.map((pacote) => (
              <Grid item key={pacote.codigo} xs={12} md={6}>
                <Card className={classes.card}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={
                          pacote.imagem ||
                          "https://demofree.sirv.com/nope-not-here.jpg"
                        }
                        title={pacote.nome}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5">
                          {pacote.nome}
                        </Typography>
                        <Typography>
                          {`Das ${pacote.hora_ini} às ${pacote.hora_fim}`}
                        </Typography>
                      </CardContent>
                      <CardActions className={classes.buttonVerMais}>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => setViewDetails(pacote)}
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
