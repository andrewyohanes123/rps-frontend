import { Typography } from 'antd'
import { FC, ReactElement, Suspense, lazy } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import FourOFour from 'pages/404';

const Semesters = lazy(() => import('pages/Semesters'));

const ContentRoutes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Suspense fallback={<Typography.Text type="secondary" style={{ textAlign: 'center' }}>Loading halaman</Typography.Text>}>
      <Switch>
        <Route path={`${path}`} exact >
          Dshboard
        </Route>
        <Route path={`${path}/semester`} exact component={Semesters} />
        <Route path={`${path}/*`} component={FourOFour} />
      </Switch>
    </Suspense>
  )
}

export default ContentRoutes
