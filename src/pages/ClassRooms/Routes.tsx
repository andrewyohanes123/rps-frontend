import { Switch, Route, useRouteMatch, useHistory, useLocation, Redirect } from "react-router-dom"
import { FC, ReactElement } from "react"
import { Menu, PageHeader } from "antd";
import ClassRooms from ".";
import Subjects from "pages/Subjects";
import { BookOutlined, ClusterOutlined } from "@ant-design/icons";

const Routes: FC = (): ReactElement => {
  const { path, url } = useRouteMatch();
  const { push } = useHistory();
  const { pathname } = useLocation();


  return (
    <>
      <PageHeader onBack={() => push('/dashboard/semester')} title="Semester" />
      <Menu activeKey={pathname} selectedKeys={[pathname]} onClick={e => push(e.key)} mode="horizontal" theme="light">
        <Menu.Item icon={<ClusterOutlined />} key={`${url}/kelas`}>Kelas</Menu.Item>
        <Menu.Item icon={<BookOutlined />} key={`${url}/mata-kuliah`}>Mata Kuliah</Menu.Item>
      </Menu>
      <Switch>
        <Route path={`${path}/kelas`} component={ClassRooms} />
        <Route path={`${path}/mata-kuliah`} component={Subjects} />
        <Route path={`${path}`}>
          <Redirect to={`${url}/kelas`} />
        </Route>
      </Switch>
    </>
  )
}

export default Routes
