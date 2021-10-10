import { Skeleton } from 'antd'
import { FC, ReactElement, Suspense, lazy } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import FourOFour from 'pages/404';
import { Container } from 'components/Container';
import useAuth from 'hooks/useAuth';

const Semesters = lazy(() => import('pages/Semesters/Routes'));
const Schedules = lazy(() => import('pages/Schedules/Routes'));
const Users = lazy(() => import('pages/Users'));
const UserMainPage = lazy(() => import('pages/UserMainPage'));
const AdminMainPage = lazy(() => import('pages/AdminMainPage'));
const Questioner = lazy(() => import('pages/Questioner'));

const ContentRoutes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  const { user } = useAuth();
  return (
    <Suspense fallback={
      <Container>
        <Skeleton paragraph={{ rows: 20 }} loading active />
      </Container>
    }>
      <Switch>
        {user?.type === 'administrator' ?
          <Route path={`${path}`} exact component={AdminMainPage} />
          :
          <Route path={`${path}`} exact component={UserMainPage} />
        }
        {['lecturer', 'chief', 'chairman'].includes(`${user?.type}`) &&
          <Route path={`${path}/jadwal`} component={Semesters} />
        }
        {user?.type === 'administrator' &&
          <>
            <Route path={`${path}/semester`} component={Semesters} />
            <Route path={`${path}/jadwal`} component={Schedules} />
            <Route path={`${path}/pengguna`} component={Users} />
            <Route path={`${path}/kuesioner`} component={Questioner} />
          </>
        }
        <Route path={`${path}/*`} component={FourOFour} />
      </Switch>
    </Suspense>
  )
}

export default ContentRoutes
