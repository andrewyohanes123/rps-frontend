import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import moment from "moment";
import { Button, message, Space, Table, Tooltip } from "antd";
import { Container } from "components/Container"
import AddSchedules, { scheduleForm } from "./AddSchedules"
import { ModelCollectionResult, ScheduleAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ModelCollectionResult<ScheduleAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const { models: { Schedule } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const {path} = useRouteMatch();

  const getSchedule = useCallback(() => {
    const offset = (page - 1) * limit;
    Schedule.collection({
      offset,
      limit,
      attributes: ['name', 'day_name', 'hour', 'type'],
    }).then(resp => {
      setSchedules(resp as ModelCollectionResult<ScheduleAttributes>);
    }).catch(e => {
      errorCatch(e);
    })
  }, [page, limit, errorCatch, Schedule]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const createSchedule = useCallback((val: scheduleForm, cb: () => void) => {
    Schedule.create({ ...val, hour: moment(val.hour).format('YYYY-MM-DD hh:mm:ss') })
      .then(resp => {
        getSchedule();
        message.success(`Jadwal mata kuliah ${resp.name}`);
        cb();
        console.log(resp);
      }).catch(e => {
        errorCatch(e);
        cb();
      })
  }, [errorCatch, Schedule, getSchedule]);

  const columns: ColumnsType<ScheduleAttributes> = useMemo<ColumnsType<ScheduleAttributes>>(() => ([
    {
      title: 'Mata Kuliah',
      key: 'name',
      dataIndex: 'name',
      render: (name: string, row: ScheduleAttributes) => (<Link to={`${path}/${row.id}`}>{name}</Link>)
    },
    {
      title: 'Hari/Jam',
      key: 'schedule',
      render: (row: ScheduleAttributes) => (`${row.day_name}/${moment(row.hour).format('hh:mm:ss')}`)
    },
    {
      title: 'Jenis Mata Kuliah',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row: ScheduleAttributes) => (<Space>
        <Tooltip title={`Edit  ${row.name}?`}>
          <Button icon={<EditOutlined />} size="small" />
        </Tooltip>
        <Tooltip title={`Hapus ${row.name}?`}>
          <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
        </Tooltip>
      </Space>)
    }
  ]), [path]);

  document.title = "Dashboard - Jadwal";

  return (
    <Container>
      <AddSchedules visible={modal} onSubmit={createSchedule} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />
      <Table
        dataSource={schedules.rows}
        rowKey={item => `${item.id}`}
        columns={columns}
        bordered
        pagination={{ current: page, onChange: setPage, pageSize: limit, total: schedules.count }}
        style={{ marginTop: 12 }}
      />
    </Container>
  )
}

export default Layout
