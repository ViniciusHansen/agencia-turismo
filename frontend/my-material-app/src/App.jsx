import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/joy/Autocomplete";
import useStyles from "./styles";
import Detalhes from "./Detalhes";
import axios from "axios";
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
import AdminPanel from "./AdminPanel";

const App = () => {
  const classes = useStyles();
  const [viewDetails, setViewDetails] = useState(null);
  const [viewSignInSide, setViewSignInSide] = useState(false);
  const [viewSignUp, setViewSignUp] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [viewPacoteForm, setViewPacoteForm] = useState(false);
  const [viewCadastroCidade, setViewCadastroCidade] = useState(false);
  const [viewCadastroRestaurante, setViewCadastroRestaurante] = useState(false);
  const [viewCadastroPontoTuristico, setViewCadastroPontoTuristico] =
    useState(false);
  const [viewCadastroHotel, setViewCadastroHotel] = useState(false);
  const [viewCarrinho, setViewCarrinho] = useState(false);
  const [viewADMPanel, setViewADMPanel] = useState(false);
  const [pacotes, setPacotes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [pacotesFiltrados, setPacotesFiltrados] = useState([]);

  const handleBuscarClick = () => {
    // Se cidadeSelecionada for null, não faz nada
    if (!cidadeSelecionada) {
      setPacotesFiltrados(pacotes);
      return;
    }
    // console.log("Buscar clicado para a cidade:", cidadeSelecionada);
    // const codigoCidade = cidades.find(cidade => cidade.label === cidadeSelecionada)?.value;

    axios
      .get(`/obterCodigoCidade/${cidadeSelecionada}`)
      .then((response) => {
        const codigoCidade = response.data.codigo;
        if (!codigoCidade) {
          console.error(
            "Código da cidade não encontrado para:",
            cidadeSelecionada
          );
          return;
        }
        console.log("Código da cidade:", codigoCidade);

        // Agora você tem o código da cidade, você pode filtrar os pacotes
        const pacotesFiltrados_temp = pacotes.filter(
          (pacote) => pacote.cidade.codigo === codigoCidade
        );
        setPacotesFiltrados(pacotesFiltrados_temp);
        // Faça o que precisar com os pacotes filtrados
        console.log("Pacotes filtrados:", pacotesFiltrados);
      })
      .catch((error) => {
        console.error("Erro ao obter código da cidade:", error);
      });
  };

  useEffect(() => {
    fetch("/cidades")
      .then((response) => response.json())
      .then((data) => {
        // Ajuste os dados conforme necessário
        const cidades = data.map(
          //(cidade) => `${cidade.nome}, ${cidade.estado}`
          (cidade) => `${cidade.nome}`
        );
        setDestinos(cidades);
        console.log("Destinos: ", destinos);
      })
      .catch((error) => console.error("Erro ao buscar cidades:", error));
  }, []); // O array vazio como segundo argumento faz com que o useEffect rode apenas uma vez quando o componente montar.

  const adicionarAoCarrinho = (item) => {
    setCarrinho([...carrinho, item]);
    // console.log(carrinho);
  };

  const removerDoCarrinho = (codigoItem) => {
    setCarrinho(carrinho.filter((item) => item.codigo !== codigoItem));
  };

  useEffect(() => {
    // Função para carregar os pacotes.

    // const response = await fetch("/visitas"); // Seu endpoint deve corresponder à configuração do seu servidor.
    const fetchPacotes = async () => {
      try {
        const response = await fetch("/visitas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            /* seus dados aqui */
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar pacotes");
        }

        const data = await response.json();
        console.log("Visitas [App.jsx]: ", data);
        setPacotes(data); // Atualizando o estado com os dados recebidos.
        setPacotesFiltrados(data);
      } catch (error) {
        console.error("Falha ao buscar pacotes:", error);
      }
    };

    fetchPacotes(); // Chamada da função no carregamento do componente.

    console.log("Carrinho [App.jsx]: ", carrinho);
  }, [carrinho]); // Array de dependências vazio, indica que o efeito será executado uma vez após o render inicial.

  useEffect(() => {
    axios.get("/cidades").then((response) => {
      const cidadeOptions = response.data.map((cidade) => ({
        value: cidade.nome,
        label: cidade.nome,
      }));
      setCidades(cidadeOptions);
    });
  }, []);

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
        cidades={cidades}
      />
    );
  }

  if (viewCadastroRestaurante) {
    return (
      <RestauranteCadastro
        goBack={() => setViewCadastroRestaurante(null)}
        cidades={cidades}
      />
    );
  }

  if (viewCadastroHotel) {
    return (
      <HotelCadastro
        goBack={() => setViewCadastroHotel(null)}
        cidades={cidades}
      />
    );
  }
  //=========SUSPEITO============
  if (viewDetails) {
    return (
      <Detalhes
        pacote={viewDetails}
        onAdd={adicionarAoCarrinho}
        goBack={() => setViewDetails(null)}
        isLogged={isLogged}
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
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
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

  if (viewADMPanel) {
    return <AdminPanel goBack={() => setViewADMPanel(false)} />;
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

              {isAdmin ? (
                <>
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
                    onClick={setViewADMPanel}
                  >
                    ADM Panel
                  </Button>
                </>
              ) : (
                <></>
              )}

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
                  <Autocomplete
                    placeholder="Destino"
                    options={destinos}
                    onChange={(event, newValue) =>
                      setCidadeSelecionada(newValue)
                    }
                  />
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBuscarClick}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {pacotesFiltrados.map((pacote) => (
              <Grid item key={pacote.codigo} xs={12} md={6}>
                <Card className={classes.card}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {/* <CardMedia
                        className={classes.cardMedia}
                        image={
                          pacote.imagem
                            ? `data:image/jpeg;base64,${pacote.cidade.imagem}` // Assumindo que a imagem é salva como Base64
                            : "https://demofree.sirv.com/nope-not-here.jpg"
                        }
                        title={pacote.nome}
                      /> */}
                      <img
                        src={
                          pacote.cidade.imagem
                            ? `data:image/png;base64, ${pacote.cidade.imagem}`
                            : "https://demofree.sirv.com/nope-not-here.jpg"
                        }
                        alt="Imagem da cidade"
                        style={{ width: '215px', height: '200px',objectFit: 'cover'  }}
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
