import { FC, ReactElement } from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import Schedules from ".";

const Routes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} component={Schedules} />
    </Switch>
  )
}

export default Routes
