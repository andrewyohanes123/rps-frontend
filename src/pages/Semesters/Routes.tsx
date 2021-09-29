import { Skeleton } from "antd";
import { Container } from "components/Container";
import useAuth from "hooks/useAuth";
import SubjectDetail from "pages/SubjectDetail";
import Subjects from "pages/Subjects/Router";
import { FC, ReactElement, lazy, Suspense } from "react"
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Semesters from ".";

const ClassRooms = lazy(() => import('pages/ClassRooms/Routes'));

const Routes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  const { user } = useAuth();

  return (
    <Suspense fallback={
      <Container>
        <Skeleton paragraph={{ rows: 10 }} />
      </Container>
    }>
      <Switch>
        <Route path={`${path}`} component={Semesters} exact />
        {
          (['lecturer', 'chief'].includes(user?.type) && user !== null) ?
            <Route path={`${path}/:id`} component={Subjects} />
            :
            user !== null ?
              <Route path={`${path}/:id`} component={ClassRooms} />
              :
              <Route path={`${path}/:id`} component={Subjects} />
        }
        {user !== null && <Route path={`${path}/:id/mata-kuliah/:subject_id`} exact component={SubjectDetail} />}
      </Switch>
    </Suspense>
  )
}

export default Routes
