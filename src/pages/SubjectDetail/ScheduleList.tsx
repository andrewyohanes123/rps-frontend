import { FC, ReactElement, useMemo, useEffect, useState, useCallback } from "react"
import { Button, Divider, message, Popconfirm, Space, Table, Tooltip } from 'antd'
import { parse } from 'query-string'
import { ColumnType } from "antd/lib/table";
import { ScheduleAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { useParams, useLocation } from "react-router-dom";
import { DeleteOutlined, EditOutlined, CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import AddPlan, { scheduleType } from "./AddPlan";
import useAuth from "hooks/useAuth";

interface scheduleColumns extends ColumnType<ScheduleAttributes> {
  group?: ColumnType<ScheduleAttributes>[];
}

const { Column, ColumnGroup } = Table;

const ScheduleList: FC = (): ReactElement => {
  const [schedules, setSchedules] = useState<ScheduleAttributes[]>([]);
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
        })
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

  const getWeekCount = useCallback((idx: number): number => {
    const prevIndex = idx - 1 < 0 ? 0 : idx - 1;
    const prevWeekCount = schedules[prevIndex].week_count;
    return prevWeekCount + (idx);
  }, [schedules]);

  const getMultipleWeekCount = useCallback((idx: number, value) => {
    // const prevRow = getWeekCount(idx);
    // console.log(prevRow);
    const prevWeekCount = schedules[idx - 1 < 0 ? 0 : idx - 1].week_count;
    return prevWeekCount > 1 ?
      Array(value).fill(0).map((i, id) => (i + 1) + (id + 1) + (idx)).join(', ')
      :
      Array(value).fill(0).map((i, id) => (i) + (id + 1) + idx).join(', ')
  }, [schedules]);

  const deleteSchedule = useCallback((schedule: ScheduleAttributes) => {
    schedule.delete().then(resp => {
      getSchedules();
      message.success('Jadwal berhasil dihapus');
      console.log(resp);
    }).catch(errorCatch);
  }, [getSchedules, errorCatch]);

  const createReport = useCallback((schedule_id: number) => {
    Report.create({ check: true, user_id: user.id, schedule_id, class_room_id: kelas }).then(resp => {
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
      render: (v: number, r, idx) => (
        v > 1 ?
          getMultipleWeekCount(idx, v)
          :
          getWeekCount(idx)
      )
    },
    {
      title: 'Kemampuan akhir yang diharapkan (sesuai tahapan belajar)',
      dataIndex: 'capabilities',
      width: 180,
      render: (val: string, row: ScheduleAttributes, idx: number) => (
        !['8', '16'].includes(getWeekCount(idx).toString()) ?
          (
            val
          ) : (
            {
              children: ['8', '16'].includes(getWeekCount(idx).toString()) ?
                getWeekCount(idx) === 8 ?
                  'Evaluasi Tengah Semester: Melakukan validasi hasil penilaian dan evaluasi'
                  :
                  getWeekCount(idx) === 16 ?
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
        !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
        !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
          !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
          !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
          !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
          !['8', '16'].includes(getWeekCount(idx).toString()) ?
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
      title: 'Laporan | Edit | Hapus',
      key: 'action',
      render: (row: ScheduleAttributes, record, idx: number) => (
        <Space split={<Divider type="vertical" />}>
          {user.type === 'lecturer' &&
            <Tooltip title={`Ceklis Pertemuan`}>
              <Button onClick={() =>
                row.reports.length === 0 ?
                  createReport(row.id)
                  :
                  message.info(`Pertemuan ${getWeekCount(idx)} sudah di-ceklis`)
              } type={row.reports.length > 0 ? "primary" : 'default'} icon={<CheckOutlined />} size="small" />
            </Tooltip>}
          <Tooltip title={'Edit'}>
            <Button icon={<EditOutlined />} size="small" />
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
        </Space>
      ),
      width: 250,
      fixed: 'right'
    }
  ]), [getWeekCount, getMultipleWeekCount, deleteSchedule, user, createReport]);

  return (
    <div>
      <AddPlan onSubmit={createSchedule} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} visible={modal} />
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
