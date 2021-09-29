import { FC, ReactElement, useMemo, useEffect, useState, useCallback } from "react"
import { Button, Divider, message, Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import { parse } from 'query-string'
import { ColumnType } from "antd/lib/table";
import { ReportAttributes, ScheduleAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { useParams, useLocation } from "react-router-dom";
import { DeleteOutlined, EditOutlined, CheckOutlined, LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import AddPlan, { scheduleType } from "./AddPlan";
import useAuth from "hooks/useAuth";

interface scheduleColumns extends ColumnType<ScheduleAttributes> {
  group?: ColumnType<ScheduleAttributes>[];
}

const { Column, ColumnGroup } = Table;

const ScheduleList: FC = (): ReactElement => {
  const [schedules, setSchedules] = useState<ScheduleAttributes[]>([]);
  const [schedule, setSchedule] = useState<ScheduleAttributes | undefined>(undefined);
  const [loading, toggleLoading] = useState<boolean>(true);
  const [modal, toggleModal] = useState<boolean>(false);
  const { user } = useAuth();
  const { search } = useLocation();
  const { models: { Schedule, Report } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { subject_id } = useParams<{ subject_id: string }>();
  const { kelas } = useMemo(() => parse(search), [search]);

  const getSchedules = useCallback((loading = false) => {
    toggleLoading(loading);
    Schedule.collection({
      attributes: ['week_count', 'capabilities', 'description', 'indicator', 'scoring_format_criteria', 'study_material', 'study_method', 'value', 'created_at'],
      where: {
        subject_id
      },
      ...(
        ['lecturer', 'chief'].includes(user.type) &&
        {
          include: [
            {
              model: 'Report',
              attributes: ['check', 'schedule_id', 'class_room_id', 'user_id'],
              where: {
                class_room_id: kelas
              },
              // @ts-ignore
              required: false
            }
          ]
        }),
      order: [['created_at', 'asc']]
    }).then(resp => {
      toggleLoading(false);
      setSchedules(resp.rows as ScheduleAttributes[]);
    }).catch(errorCatch)
  }, [Schedule, errorCatch, subject_id, kelas, user]);

  useEffect(() => {
    getSchedules(true);
  }, [getSchedules]);

  const createSchedule = useCallback((val: scheduleType, cb: () => void) => {
    Schedule.create({ ...val, subject_id }).then(resp => {
      console.log(resp);
      message.success('Jadwal berhasil ditambah');
      cb();
      toggleModal(false);
      getSchedules();
    }).catch(errorCatch);
  }, [Schedule, errorCatch, getSchedules, subject_id]);

  const getSumToCurrentIndex = useCallback((index: number) => {
    if (index > 0) {
      return schedules.filter((val, idx) => idx <= index).map(row => (row.week_count)).reduce((a, b) => (a + b));
    } else {
      return 1;
    }
  }, [schedules]);

  const getMultipleWeekCount = useCallback((value: number, count: number): string => {
    return Array(count).fill(0).map((element: number, index) => (element) + (index + (value - 1))).join(', ')
  }, []);

  const deleteSchedule = useCallback((schedule: ScheduleAttributes) => {
    schedule.delete().then(resp => {
      getSchedules();
      message.success('Jadwal berhasil dihapus');
      console.log(resp);
    }).catch(errorCatch);
  }, [getSchedules, errorCatch]);

  const updateSchedule = useCallback((val: scheduleType, cb: () => void) => {
    if (typeof schedule !== 'undefined') {
      schedule.update(val).then(resp => {
        message.success(`Data pertemuan berhasil di-update`);
        getSchedules(false);
        console.log(resp);
        cb();
        toggleModal(false);
        setSchedule(undefined);
      }).catch(errorCatch);
    }
  }, [schedule, getSchedules, errorCatch]);

  const createReport = useCallback((schedule_id: number, check: boolean) => {
    Report.create({ check, user_id: user.id, schedule_id, class_room_id: kelas }).then(resp => {
      message.success('Ceklis berhasil');
      getSchedules(false);
    }).catch(errorCatch);
  }, [getSchedules, user, Report, errorCatch, kelas]);

  const columns: scheduleColumns[] = useMemo<scheduleColumns[]>((): scheduleColumns[] => ([
    {
      title: 'Minggu Ke',
      align: 'center',
      dataIndex: 'week_count',
      width: 100,
      fixed: 'left',
      render: (value: number, row: ScheduleAttributes, idx) => (
        value > 1 ?
          getMultipleWeekCount(getSumToCurrentIndex(idx), value)
          :
          getSumToCurrentIndex(idx)
        // v > 1 ?
        //   getMultipleWeekCount(idx, v)
        //   :
        //   getWeekCount(idx)
      )
    },
    {
      title: 'Kemampuan akhir yang diharapkan (sesuai tahapan belajar)',
      dataIndex: 'capabilities',
      width: 180,
      render: (val: string, row: ScheduleAttributes, idx: number) => (
        !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
          (
            val
          ) : (
            {
              children: ['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
                getSumToCurrentIndex(idx) === 8 ?
                  'Evaluasi Tengah Semester: Melakukan validasi hasil penilaian dan evaluasi'
                  :
                  getSumToCurrentIndex(idx) === 16 ?
                    'Evaluasi Akhir Semester: Melakukan validasi hasil penilaian akhir dan menentukan kelulusan mahasiswa'
                    :
                    'Evaluasi'
                : val,
              props: {
                colSpan: 7
              }
            }
          )
      )
    },
    {
      title: 'Bahan kajian (materi ajar)',
      dataIndex: 'study_material',
      width: 180,
      render: (val: string, row: ScheduleAttributes, idx: number) => (
        !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
          (
            val
          ) : (
            {
              children: val,
              props: {
                colSpan: 0
              }
            }
          )
      )
    },
    {
      title: 'Metode pembelajaran dan estimasi waktu',
      dataIndex: 'study_method',
      width: 180,
      render: (val: string, row: ScheduleAttributes, idx: number) => (
        !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
          (
            val
          ) : (
            {
              children: val,
              props: {
                colSpan: 0
              }
            }
          )
      )
    },
    {
      title: 'Asesmen',
      key: 'asesmen',
      group: [{
        title: 'Indikator',
        dataIndex: 'indicator',
        width: 180,
        render: (val: string, row: ScheduleAttributes, idx: number) => (
          !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
            (
              val
            ) : (
              {
                children: val,
                props: {
                  colSpan: 0
                }
              }
            )
        )
      },
      {
        title: 'Kriteria dan bentuk penilaian',
        dataIndex: 'scoring_format_criteria',
        width: 180,
        render: (val: string, row: ScheduleAttributes, idx: number) => (
          !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
            (
              val
            ) : (
              {
                children: val,
                props: {
                  colSpan: 0
                }
              }
            )
        )
      },
      {
        title: 'Deskripsi tugas',
        dataIndex: 'description',
        width: 180,
        render: (val: string, row: ScheduleAttributes, idx: number) => (
          !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
            (
              val
            ) : (
              {
                children: val,
                props: {
                  colSpan: 0
                }
              }
            )
        )
      },
      {
        title: 'Bobot',
        dataIndex: 'value',
        width: 180,
        render: (val: string, row: ScheduleAttributes, idx: number) => (
          !['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ?
            (
              val
            ) : (
              {
                children: val,
                props: {
                  colSpan: 0
                }
              }
            )
        )
      },],
    }, {
      title: user.type === 'chief' ? 'Laporan' : 'Laporan | Edit | Hapus',
      key: 'action',
      render: (row: ScheduleAttributes, record, idx: number) => (
        <Space split={<Divider type="vertical" />}>
          {['lecturer', 'chief'].includes(user.type) &&
            <>
              {
                (row.reports.length === 0 && user.type === 'lecturer') ?
                  <>
                    <Tooltip title={`Sesuai`}>
                      <Button onClick={() =>
                        row.reports.length === 0 ?
                          createReport(row.id, true)
                          :
                          message.info(`Pertemuan ${getSumToCurrentIndex(idx)} sudah di-ceklis`)
                      } type={row.reports.length > 0 ? "primary" : 'default'} icon={<CheckOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title={`Tidak Sesuai`}>
                      <Button onClick={() =>
                        row.reports.length === 0 ?
                          createReport(row.id, false)
                          :
                          message.info(`Pertemuan ${getSumToCurrentIndex(idx)} sudah di-ceklis`)
                      } type={row.reports.length > 0 ? "primary" : 'default'} danger icon={<CloseOutlined />} size="small" />
                    </Tooltip>
                  </>
                  :
                  row.reports.length > 1 ?
                    row.reports.map((report: ReportAttributes) => (
                      report.check ?
                        <Tag color="green">Sesuai</Tag>
                        :
                        <Tag color="error">Tidak Sesuai</Tag>
                    ))
                    :
                    <Tag color="blue">Belum dilapor</Tag>
              }
            </>
          }
          {['administrator', 'lecturer'].includes(user.type) &&
            <>
              <Tooltip title={'Edit'}>
                <Button
                  onClick={() => {
                    setSchedule(row);
                    toggleModal(true);
                  }}
                  icon={<EditOutlined />} size="small" />
              </Tooltip>
              <Tooltip title="Hapus jadwal">
                <Popconfirm
                  title="Apakah Anda ingin menghapus jadwal ini?"
                  placement="topRight"
                  okText="Hapus"
                  cancelText="Batal"
                  okButtonProps={{ type: 'primary', danger: true }}
                  onConfirm={() => deleteSchedule(row)}
                >
                  <Button icon={<DeleteOutlined />} danger type="primary" size="small" />
                </Popconfirm>
              </Tooltip>
            </>}
        </Space>
      ),
      width: 250,
      fixed: 'right'
    }
  ]), [getMultipleWeekCount, deleteSchedule, user, createReport, getSumToCurrentIndex]);

  return (
    <div>
      {['administrator', 'lecturer'].includes(user.type) &&
        <AddPlan schedule={schedule}
          onSubmit={typeof schedule !== 'undefined' ? updateSchedule : createSchedule}
          onCancel={() => {
            toggleModal(false);
            setSchedule(undefined);
          }}
          onOpen={() => toggleModal(true)}
          visible={modal}
        />}
      <Table
        dataSource={schedules}
        loading={{ spinning: loading, size: 'large', tip: 'Mengambil data jadwal', indicator: <LoadingOutlined spin /> }}
        // columns={columns}
        rowKey={item => `${item.id}`}
        bordered
        pagination={false}
        style={{ marginTop: 12 }}
        scroll={{ x: 'calc(700px + 50%)' }}
      >
        {columns.map(column => (
          typeof column.group !== 'undefined' ?
            <ColumnGroup key={`${column.title}`} {...column} title={column.title}>
              {column.group.map(colGroup => (
                <Column key={`${colGroup.title}`} {...colGroup} />
              ))}
            </ColumnGroup>
            :
            <Column key={`${column.title}`} {...column} />
        ))}
      </Table>
    </div>
  )
}

export default ScheduleList
