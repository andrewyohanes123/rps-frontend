import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import { Table, Button, Space, Tooltip, Divider, DatePicker } from 'antd'
import moment from "moment";
import { Link, useRouteMatch } from 'react-router-dom'
import useModels from "hooks/useModels";
import { Container } from "components/Container"
import AddSemester, { semesterValue } from "./AddSemester";
import { ModelCollectionResult, SemesterAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";

const currentDate = new Date();

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [semesters, setSemesters] = useState<ModelCollectionResult<SemesterAttributes>>({ rows: [], count: 0 });
  const [currentYear, setCurrentYear] = useState<moment.Moment>(moment(currentDate));
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const { models: { Semester } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { user } = useAuth();
  const { path } = useRouteMatch();

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
      ...(user.type === 'administrator' ? [{
        title: 'Edit | Hapus',
        render: (row: SemesterAttributes) => (
          <Space split={<Divider type="vertical" />} size={2}>
            <Tooltip title={`Edit semester ${row.name}`}>
              <Button size="small" icon={<EditOutlined />} />
            </Tooltip>
            <Tooltip title={`Hapus semester ${row.name}?`}>
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Space>
        )
      }] : [])
    ]
  ), [path, user])

  const getSemester = useCallback(() => {
    const offset: number = (page - 1) * limit;
    Semester.collection({
      limit,
      offset,
      attributes: ['name', 'year'],
      where: {
        year: {
          $lte: moment(currentYear).endOf('year').format('YYYY-MM-DD'),
          $gte: moment(currentYear).startOf('year').format('YYYY-MM-DD'),
        }
      }
    }).then(resp => {
      setSemesters(resp as ModelCollectionResult<SemesterAttributes>);
    }).catch(e => {
      errorCatch(e);
    })
  }, [Semester, limit, page, errorCatch, currentYear]);

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
      <Space split={<Divider type="vertical" />}>
        {user.type === 'administrator' && <AddSemester onSubmit={createSemester} visible={modal} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />}
        <DatePicker.YearPicker allowClear={false} value={currentYear} onChange={(val) => setCurrentYear(val as moment.Moment)} placeholder="Pilih periode tahun semester" />
      </Space>
      <Table
        style={{ marginTop: 10 }}
        dataSource={semesters.rows}
        columns={columns}
        bordered
        rowKey={item => `${item.id}`}
        pagination={{ onChange: setPage, current: page, pageSize: limit, total: semesters.count }}
      />
    </Container>
  )
}

export default Layout
