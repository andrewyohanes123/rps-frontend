import { Skeleton } from 'antd'
import { FC, ReactElement, Suspense, lazy } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import FourOFour from 'pages/404';
import { Container } from 'components/Container';

const Semesters = lazy(() => import('pages/Semesters/Routes'));
const Schedules = lazy(() => import('pages/Schedules/Routes'));

const ContentRoutes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Suspense fallback={
      <Container>
        <Skeleton paragraph={{ rows: 20 }} loading active />
      </Container>
    }>
      <Switch>
        <Route path={`${path}`} exact >
          Dashboard
        </Route>
        <Route path={`${path}/semester`} component={Semesters} />
        <Route path={`${path}/jadwal`} component={Schedules} />
        <Route path={`${path}/*`} component={FourOFour} />
      </Switch>
    </Suspense>
  )
}

export default ContentRoutes
