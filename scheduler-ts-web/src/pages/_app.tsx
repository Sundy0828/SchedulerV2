import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { createMemoryHistory } from 'history'
import {
  Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import theme from '../theme'
import { Home } from './Home';
import Login from './Login';

function MyApp({ Component, pageProps }) {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/login' exact component={Login}/>
        {/* <Route path='/' render={() => <div>404</div>} /> */}
      </Switch>
    </Router>
    // <ChakraProvider resetCSS theme={theme}>
    //   <ColorModeProvider
    //     options={{
    //       useSystemColorMode: true,
    //     }}
    //   >
    //     <Component {...pageProps} />
    //   </ColorModeProvider>
    // </ChakraProvider>
  )
}

export default MyApp
