import { FC, ReactElement } from 'react';
import Adapter from '@edgarjeremy/sirius.adapter';
import moment from 'moment';
import 'moment/locale/id';
import locale from 'antd/lib/locale/id_ID';
import { ConfigProvider, Result } from 'antd';
import { Route, Switch } from 'react-router-dom';
import { useConnectServer } from 'hooks/useConnectServer';
import { Login } from 'pages/Login';
import './App.css';
import './styles/app.css'
import FourOFour from 'pages/404';
import Dashboard from 'pages/Dashboard';
import Home from 'pages/Home';
import QuestionerStudent from 'pages/QuestionerStudent';
import Semesters from 'pages/Semesters/Routes';
import { LoadingOutlined } from '@ant-design/icons';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

const connect = new Adapter(`${REACT_APP_IP_ADDRESS}`, parseInt(`${REACT_APP_PORT}`), localStorage);
export const baseUrl: string = `${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}`;
const App: FC = (): ReactElement => {
  const { ready, error } = useConnectServer(connect);

  document.title = "RPS"
  moment.locale('id');

  return (
    error ?
      <Result title={`Error`} subTitle="Tidak dapat terkoneksi dengan server" status="error" />
      :
      ready ?
        <ConfigProvider locale={locale} >
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/jadwal" component={Semesters} />
            <Route path="/login" exact component={Login} />
            <Route path="/kuesioner" exact component={QuestionerStudent} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="*" component={FourOFour} />
          </Switch>
        </ConfigProvider>
        :
        <Result title={`Loading`} subTitle="Tunggu Sebentar" icon={<LoadingOutlined spin />} />
  );
}

export default App;
