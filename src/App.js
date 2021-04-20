import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import Main from './main/Main';

function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5A3E87'
      },
      secondary: {
        main: '#FFFFFF'
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
        <div className="App">
          <Main></Main>
        </div>
    </MuiThemeProvider>
  );
}

export default App;
