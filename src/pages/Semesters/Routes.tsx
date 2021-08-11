import ClassRooms from "pages/ClassRooms";
import { FC, ReactElement } from "react"
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Semesters from ".";

const Routes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={Semesters} exact />
      <Route path={`${path}/:id`} component={ClassRooms} exact />
    </Switch>
  )
}

export default Routes
