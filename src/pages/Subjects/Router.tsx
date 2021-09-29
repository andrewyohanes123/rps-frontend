import SubjectDetail from "pages/SubjectDetail";
import { FC, ReactElement } from "react"
import { Switch, Route, useRouteMatch, } from 'react-router-dom'
import Subjects from ".";

const Router: FC = (): ReactElement => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/mata-kuliah/:subject_id`} exact component={SubjectDetail} />
      <Route path={path} exact component={Subjects} />
    </Switch>
  )
}

export default Router
