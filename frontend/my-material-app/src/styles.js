import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "40px",
  },
  icon: {
    marginRight: "20px",
  },
  button: {
    marginTop: "40px",
  },
  buttonVerMais: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // marginTop: "auto",
  },
  cardGrid: {
    padding: "20px 0",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // mantém a razão de aspecto 16:9
    height: "200px",
    width: "100%",
    objectFit: "cover",
  },

  cardContent: {
    flexGrow: 1,
    // flex: 1,
  },
  footer: {
    padding: "50px 0",
  },
}));

export default useStyles;
