import { Skeleton } from "antd";
import { Container } from "components/Container";
import { FC, ReactElement, lazy, Suspense } from "react"
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Semesters from ".";

const ClassRooms = lazy(() => import('pages/ClassRooms/Routes'));

const Routes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Suspense fallback={
      <Container>
        <Skeleton paragraph={{ rows: 10 }} />
      </Container>
    }>
      <Switch>
        <Route path={`${path}`} component={Semesters} exact />
        <Route path={`${path}/:id`} component={ClassRooms} />
      </Switch>
    </Suspense>
  )
}

export default Routes
