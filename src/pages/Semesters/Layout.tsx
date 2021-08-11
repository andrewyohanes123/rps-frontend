import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import moment from "moment";
import { Table, Button, Space, Tooltip } from 'antd'
import { Link, useRouteMatch } from 'react-router-dom'
import useModels from "hooks/useModels";
import { Container } from "components/Container"
import AddSemester, { semesterValue } from "./AddSemester";
import { ModelCollectionResult, SemesterAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [semesters, setSemesters] = useState<ModelCollectionResult<SemesterAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const { models: { Semester } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const {path} = useRouteMatch();

  document.title = "Dashboard - Semester";

  const columns: ColumnsType<SemesterAttributes> = useMemo<ColumnsType<SemesterAttributes>>(() => (
    [
      {
        title: 'Semester',
        key: 'semester',
        dataIndex: 'name',
        render: (semester: string, row: SemesterAttributes) => <Link to={`${path}/${row.id}`}>Semester {semester.toUpperCase()}</Link>
      },
      {
        title: 'Periode',
        key: 'year',
        dataIndex: 'year',
        render: (val: string) => `${moment(val).format('YYYY')}/${moment(val).add(1, 'year').format('YYYY')}`
      },
      {
        title: 'Edit | Hapus',
        render: (row: SemesterAttributes) => (
          <Space>
            <Tooltip title={`Edit semester ${row.name}`}>
              <Button size="small" icon={<EditOutlined />} />
            </Tooltip>
            <Tooltip title={`Hapus semester ${row.name}?`}>
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Space>
        )
      }
    ]
  ), [path])

  const getSemester = useCallback(() => {
    const offset: number = (page - 1) * limit;
    Semester.collection({
      limit,
      offset,
      attributes: ['name', 'year'],
    }).then(resp => {
      setSemesters(resp as ModelCollectionResult<SemesterAttributes>);
    }).catch(e => {
      errorCatch(e);
    })
  }, [Semester, limit, page, errorCatch]);

  useEffect(() => {
    getSemester();
  }, [getSemester]);

  const createSemester = useCallback((val: semesterValue, cb: () => void) => {
    const newVal = { name: val.name.toUpperCase(), year: moment(val.year).format('YYYY-MM-DD') };
    Semester.create(newVal).then(resp => {
      console.log(resp);
      toggleModal(false);
      getSemester();
      cb();
    }).catch(e => {
      console.log(e);
      errorCatch(e);
    })
  }, [Semester, getSemester, errorCatch]);


  return (
    <Container>
      <AddSemester onSubmit={createSemester} visible={modal} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />
      <Table
        style={{ marginTop: 10 }}
        dataSource={semesters.rows}
        columns={columns}
        bordered
        rowKey={item => `${item.id}`}
        pagination={{ onChange: setPage, current: page, pageSize: limit }}
      />
    </Container>
  )
}

export default Layout
