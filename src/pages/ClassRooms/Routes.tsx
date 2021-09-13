import { Switch, Route, useRouteMatch, useHistory, useLocation, Redirect, useParams } from "react-router-dom"
import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import { Menu, PageHeader } from "antd";
import ClassRooms from ".";
import Subjects from "pages/Subjects";
import { BookOutlined, ClusterOutlined } from "@ant-design/icons";
import useModels from "hooks/useModels";
import { SemesterAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import moment from "moment";

const Routes: FC = (): ReactElement => {
  const { path, url } = useRouteMatch();
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { models: { Semester } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const [retry, setRetry] = useState<number>(0);
  const [semester, setSemester] = useState<SemesterAttributes | undefined>(undefined);

  const getSemester = useCallback(() => {
    Semester.single(parseInt(id)).then(resp => {
      setSemester(resp as SemesterAttributes);
      setRetry(0);
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    });
  }, [Semester, id, errorCatch]);

  useEffect(() => {
    retry < 4 && getSemester();
  }, [retry, getSemester]);

  const semesterYear: string = useMemo<string>((): string => (
    typeof semester !== 'undefined' ?
      `${moment(semester.year).format('YYYY')}/${moment(semester.year).add(1, 'year').format('YYYY')}`
      :
      ''
  ), [semester])

  return (
    <>
      <PageHeader onBack={() => push('/dashboard/semester')} subTitle={semesterYear} title={typeof semester !== 'undefined' ? `Semester ${semester.name}` : "Semester"} />
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
