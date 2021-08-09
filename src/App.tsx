import { FC, ReactElement } from 'react';
import Adapter from '@edgarjeremy/sirius.adapter';
import { Route, Switch } from 'react-router-dom';
import { useConnectServer } from 'hooks/useConnectServer';
import { Login } from 'pages/Login';
import './App.css';
import './styles/app.css'
import FourOFour from 'pages/404';
import Dashboard from 'pages/Dashboard';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

const connect = new Adapter(`${REACT_APP_IP_ADDRESS}`, parseInt(`${REACT_APP_PORT}`), localStorage);

const App: FC = (): ReactElement => {
  const { ready, error } = useConnectServer(connect);

  document.title = "RPS"

  return (
    error ?
      <div>
        error
      </div>
      :
      ready ?
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="*" component={FourOFour} />
        </Switch>
        :
        <div>
          loading
        </div>
  );
}

export default App;
