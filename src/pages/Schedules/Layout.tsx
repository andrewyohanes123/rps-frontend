import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import moment from "moment";
import { Button, message, Popconfirm, Space, Table, Tooltip } from "antd";
import { Container } from "components/Container"
import AddSchedules, { scheduleForm } from "./AddSchedules"
import { ModelCollectionResult, ScheduleAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined, FilePdfOutlined, FileSyncOutlined } from "@ant-design/icons";
import UploadPlan from "./UploadPlan";
import useAuth from "hooks/useAuth";
import ReportModal from "./ReportModal";

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ModelCollectionResult<ScheduleAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [planModal, togglePlanModal] = useState<boolean>(false);
  const [reportModal, toggleReportModal] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleAttributes | undefined>(undefined);
  const [limit] = useState<number>(10);
  const { models: { Schedule } } = useModels();
  const { user } = useAuth();
  const { errorCatch } = useErrorCatcher();

  const isAdmin: boolean = useMemo<boolean>(() => user.type === 'administrator', [user]);
  const isChief: boolean = useMemo<boolean>(() => user.type === 'chief', [user]);

  const getSchedule = useCallback(() => {
    const offset = (page - 1) * limit;
    Schedule.collection({
      offset,
      limit,
      attributes: ['subject_id', 'daytime', 'class_room_id'],
      include: [{
        model: 'Subject',
        attributes: ['name']
      }, {
        model: 'ClassRoom',
        attributes: ['name', 'semester_id'],
        include: [{
          model: 'Semester',
          attributes: ['name']
        }]
      }, {
        model: 'User',
        attributes: ['name']
      }]
    }).then(resp => {
      setSchedules(resp as ModelCollectionResult<ScheduleAttributes>);
    }).catch(e => {
      errorCatch(e);
    })
  }, [page, limit, errorCatch, Schedule]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const deleteSchedule = useCallback((schedule: ScheduleAttributes) => {
    schedule.delete().then(resp => {
      message.success(`Jadwal mata kuliah ${resp.subject.name} pada hari ${resp.day_name} jam ${moment(resp.hour).format('hh:mm:ss')} telah dihapus`);
      getSchedule();
    }).catch(errorCatch)
  }, [getSchedule, errorCatch]);

  const createSchedule = useCallback((val: scheduleForm, cb: () => void) => {
    Schedule.create({ ...val, hour: moment(val.daytime).format('YYYY-MM-DD HH:mm:ss') })
      .then(resp => {
        getSchedule();
        message.success(`Jadwal mata kuliah berhasil ditambah`);
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
      render: (row: ScheduleAttributes) => (row.subject.name)
    },
    {
      title: 'Kelas',
      key: 'class',
      render: (row: ScheduleAttributes) => (`${row.class_room.semester.name} ${row.class_room.name}`)
    },
    {
      title: 'Hari/Jam',
      key: 'schedule',
      render: (row: ScheduleAttributes) => (`${moment(row.daytime).format('dddd, DD MMM YYYY / HH:mm a')}`)
    },
    {
      title: 'Dosen',
      key: 'lecturer',
      render: (row: ScheduleAttributes) => (row.user === null ? '-' : row.user.name)
    },
    {
      title: !isAdmin ? 'RPS dan Laporan' : 'Edit | Hapus',
      key: 'action',
      render: (row: ScheduleAttributes) => (<Space>
        <Tooltip title={`${!isAdmin ? 'Lihat' : !isChief ? 'Lihat' : 'Upload'} RPS ${row.subject.name}`}>
          <Button type="primary" onClick={() => {
            togglePlanModal(true);
            setSchedule(row);
          }} icon={<FilePdfOutlined />} size="small" />
        </Tooltip>
        {!isAdmin && <Tooltip title={`${isChief ? 'Lihat' : 'Upload'} Laporan RPS`}>
          <Button onClick={() => {
            toggleReportModal(true);
            setSchedule(row);
          }} icon={<FileSyncOutlined />} size="small" />
        </Tooltip>}
        {isAdmin && <>
          <Tooltip title={`Edit ${row.subject.name}?`}>
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title={`Hapus ${row.subject.name}?`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus jadwal ${row.subject.name}?`}
              okText="Hapus"
              okButtonProps={{ danger: true, type: 'primary' }}
              cancelText="Batal"
              placement="topRight"
              onConfirm={() => deleteSchedule(row)}
            >
              <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
            </Popconfirm>
          </Tooltip>
        </>}
      </Space>)
    }
  ]), [deleteSchedule, isAdmin, isChief]);

  document.title = "Dashboard - Jadwal";

  return (
    <Container>
      {isAdmin && <AddSchedules visible={modal} onSubmit={createSchedule} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />}
      <Table
        dataSource={schedules.rows}
        rowKey={item => `${item.id}`}
        columns={columns}
        bordered
        pagination={{ current: page, onChange: setPage, pageSize: limit, total: schedules.count }}
        style={{ marginTop: 12 }}
      />
      <UploadPlan visible={planModal} schedule={schedule} onCancel={() => {
        togglePlanModal(false);
        setSchedule(undefined);
      }} onOpen={() => console.log('object')} />
      <ReportModal visible={reportModal} schedule={schedule} onCancel={() => toggleReportModal(false)} />
    </Container>
  )
}

export default Layout
