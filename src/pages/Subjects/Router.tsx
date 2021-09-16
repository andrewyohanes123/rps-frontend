import { FC, ReactElement } from "react"
import { Switch, Route, useRouteMatch, } from 'react-router-dom'
import Subjects from ".";

const Router: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={Subjects} />
      <Route path={`${path}/mata-kuliah/:subject_id`} exact component={Subjects} />
    </Switch>
  )
}

export default Router
