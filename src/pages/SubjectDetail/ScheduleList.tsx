import { FC, ReactElement, useMemo, useEffect, useState, useCallback } from "react"
import { Button, Divider, message, Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import { parse } from 'query-string'
import { ColumnType } from "antd/lib/table";
import { ScheduleAttributes, SubjectAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { useParams, useLocation } from "react-router-dom";
import { DeleteOutlined, EditOutlined, CheckOutlined, LoadingOutlined, CloseOutlined, PrinterOutlined, FormOutlined } from "@ant-design/icons";
import AddPlan, { scheduleType } from "./AddPlan";
import useAuth from "hooks/useAuth";
import ReportNote from "./ReportNote";
import ReportNoteModal from "./ReportNoteModal";
import ReportPDF from "components/ReportPDF";

interface scheduleColumns extends ColumnType<ScheduleAttributes> {
  group?: ColumnType<ScheduleAttributes>[];
}

interface props {
  subject: SubjectAttributes;
}

const { Column, ColumnGroup } = Table;

const ScheduleList: FC<props> = ({ subject }): ReactElement => {
  const [schedules, setSchedules] = useState<ScheduleAttributes[]>([]);
  const [schedule, setSchedule] = useState<ScheduleAttributes | undefined>(undefined);
  const [loading, toggleLoading] = useState<boolean>(true);
  const [modal, toggleModal] = useState<boolean>(false);
  const [reportNoteModal, toggleReportNoteModal] = useState<boolean>(false);
  const [reportModal, toggleReportModal] = useState<boolean>(false);
  const [pdfModal, togglePdfModal] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
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
        ['lecturer', 'chief', 'chairman'].includes(user?.type) &&
        {
          include: [
            {
              model: 'Report',
              attributes: ['check', 'schedule_id', 'class_room_id', 'lecturer_id', 'chairman_id', 'chief_id', 'id', 'note'],
              where: {
                class_room_id: kelas
              },
              // @ts-ignore
              required: false,
              include: [
                {
                  model: 'User',
                  attributes: ['name', 'id'],
                  as: 'Lecturer'
                },
                {
                  model: 'User',
                  attributes: ['name', 'id'],
                  as: 'Chairman'
                },
                {
                  model: 'User',
                  attributes: ['name', 'id'],
                  as: 'Chief'
                },
              ]
            },
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
    Schedule.create({
      ...val, subject_id,
      lecturer_id: user?.id
    }).then(resp => {
      console.log(resp);
      message.success('Jadwal berhasil ditambah');
      cb();
      toggleModal(false);
      getSchedules();
    }).catch(errorCatch);
  }, [Schedule, errorCatch, getSchedules, subject_id, user]);

  const getSumToCurrentIndex = useCallback((index: number) => {
    if (index > 0) {
      return schedules.filter((val, idx) => idx <= index).map(row => (row.week_count)).reduce((a, b) => (a + b));
    } else {
      return 1;
    }
  }, [schedules]);

  const getMultipleWeekCount = useCallback((value: number, count: number): string => {
    return Array(count).fill(0).map((element: number, index) => (element) + (index + ((count === 3 ? value - 1 : value) - 1))).join(', ')
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
    Report.create({
      check,
      ...(user?.type === 'lecturer' ? { lecturer_id: user?.id } : { chairman_id: user?.id })
      , schedule_id, class_room_id: kelas
    }).then(resp => {
      message.success('Ceklis berhasil');
      getSchedules(false);
      console.log(resp);
    }).catch(errorCatch);
  }, [getSchedules, user, Report, errorCatch, kelas]);

  const notSuitableButton = useCallback((row: ScheduleAttributes, index: number) => {
    if (row.report === null) {
      toggleReportNoteModal(true);
      setSchedule(row);
    } else {
      message.info(`Pertemuan ${getSumToCurrentIndex(index)} sudah di-ceklis`)
    }
  }, [getSumToCurrentIndex]);

  const createReportWithNote = useCallback((val: { note: string }, cb: () => void) => {
    Report.create({
      check: false,
      schedule_id: schedule?.id,
      class_room_id: kelas,
      note: val.note,
      ...(user?.type === 'lecturer' ? { lecturer_id: user?.id } : { chairman_id: user?.id })
    }).then(resp => {
      message.success('Ceklis berhasil');
      getSchedules(false);
      console.log(resp);
      cb();
      toggleReportNoteModal(false);
      setSchedule(undefined);
    }).catch(errorCatch);
  }, [kelas, schedule, user, Report, errorCatch, getSchedules]);

  const approveReport = useCallback((report_id: number) => {
    Report.single(report_id).then(report => {
      report.update({
        ...(user?.type === 'chairman' ?
          {
            chairman_id: user?.id
          }
          :
          {
            chief_id: user?.id
          })
      }).then(resp => {
        getSchedules();
        message.success('Laporan berhasil di-approve');
        console.log(resp)
      }).catch(errorCatch);
    }).catch(errorCatch);
  }, [Report, errorCatch, user, getSchedules]);

  useEffect(() => {
    const mainLayout: Element | null = document.querySelector('main.ant-layout-content');
    if (mainLayout !== null) {
      mainLayout.setAttribute('style', modal ? "background: white; overflow: hidden; position: relative;" : 'background: white; overflow: auto; position: relative;')
    }
  }, [modal])

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
    },
    // @ts-ignore
    ...(
      user === null ?
        []
        :
        [{
          title: user?.type === 'chief' ? 'Laporan' : 'Laporan | Edit | Hapus',
          key: 'action',
          render: (row: ScheduleAttributes, record: ScheduleAttributes, idx: number) => (
            <Space size={2} split={<Divider type="vertical" />}>
              {['lecturer', 'chief', 'chairman'].includes(user?.type) &&
                <>
                  {
                    (row.report === null && user?.type === 'lecturer') ?
                      <>
                        <Tooltip title={`Sesuai`}>
                          <Button onClick={() =>
                            row.report === null ?
                              createReport(row.id, true)
                              :
                              message.info(`Pertemuan ${getSumToCurrentIndex(idx)} sudah di-ceklis`)
                          } type={row.report !== null ? "primary" : 'default'} icon={<CheckOutlined />} size="small" />
                        </Tooltip>
                        <Tooltip title={`Tidak Sesuai`}>
                          <Button onClick={() => notSuitableButton(row, idx)} type={row.report !== null ? "primary" : 'default'} danger icon={<CloseOutlined />} size="small" />
                        </Tooltip>
                      </>
                      :
                      row.report !== null ?
                        row.report.chief_id === null ?
                          ['lecturer', 'chairman'].includes(user?.type) ?
                            <Tag color="blue">Belum di-Approve Kaprodi</Tag>
                            :
                            <Tooltip title={user?.type === 'chairman' ? `Tandai Laporan` : `Approve Laporan`}>
                              <Button onClick={() => approveReport(row.report.id)} icon={<CheckOutlined />} size="small" />
                            </Tooltip>
                          :
                          row.report.check ?
                            <Tag color="green">Sesuai</Tag>
                            :
                            <>
                              <Tag color="error">Tidak Sesuai</Tag>
                              <Tooltip title={`Catatan Laporan`}>
                                <Button onClick={() => {
                                  toggleReportModal(true);
                                  setNote(row.report.note);
                                }} icon={<FormOutlined />} size="small" />
                              </Tooltip>
                            </>
                        :
                        <Tag color="blue">Belum dilapor</Tag>
                  }
                </>
              }
              {['administrator', 'lecturer'].includes(user?.type) &&
                <>
                  {!['8', '16'].includes(getSumToCurrentIndex(idx).toString()) ? <Tooltip title={'Edit Pertemuan'}>
                    <Button
                      onClick={() => {
                        setSchedule(row);
                        toggleModal(true);
                      }}
                      icon={<EditOutlined />} size="small" />
                  </Tooltip>
                    :
                    <Button disabled icon={<EditOutlined />} size="small" />
                  }
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
          width: user?.type === 'chief' ? 150 : 300,
          fixed: 'right'
        }])
  ]), [getMultipleWeekCount, deleteSchedule, user, createReport, getSumToCurrentIndex, notSuitableButton, approveReport]);

  return (
    <div>
      <Space align="baseline">
        {['administrator', 'lecturer'].includes(user?.type) &&
          <AddPlan schedule={schedule}
            onSubmit={typeof schedule !== 'undefined' ? updateSchedule : createSchedule}
            onCancel={() => {
              toggleModal(false);
              setSchedule(undefined);
            }}
            onOpen={() => toggleModal(true)}
            visible={modal}
          />}
        {
          (schedules.length === schedules.filter(schedule => schedule.report !== null).length) &&
          <Button style={{ marginTop: 8 }} onClick={() => togglePdfModal(true)} type="primary" icon={<PrinterOutlined />}>Print Laporan</Button>
        }
      </Space>
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
      <ReportNote onCancel={() => toggleReportNoteModal(false)} visible={reportNoteModal} onSubmit={createReportWithNote} />
      <ReportNoteModal visible={reportModal} onCancel={() => toggleReportModal(false)} note={note} afterClose={() => setNote('')} />
      <ReportPDF subject={subject} visible={pdfModal} onCancel={() => togglePdfModal(false)} onOpen={() => console.log('open')} />
    </div>
  )
}

export default ScheduleList
