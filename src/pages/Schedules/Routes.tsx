import ScheduleDetail from "pages/ScheduleDetail";
import { FC, ReactElement } from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import Schedules from ".";

const Routes: FC = (): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={Schedules} />
      <Route path={`${path}/:id`} component={ScheduleDetail} />
    </Switch>
  )
}

export default Routes
