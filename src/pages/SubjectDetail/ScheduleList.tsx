import { FC, ReactElement, useMemo, useEffect, useState, useCallback } from "react"
import { Table } from 'antd'
import { ColumnType } from "antd/lib/table";
import { ScheduleAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { useParams } from "react-router";
import { LoadingOutlined } from "@ant-design/icons";

interface scheduleColumns extends ColumnType<ScheduleAttributes> {
  group?: ColumnType<ScheduleAttributes>[];
}

const { Column, ColumnGroup } = Table;

const ScheduleList: FC = (): ReactElement => {
  const [schedules, setSchedules] = useState<ScheduleAttributes[]>([]);
  const [loading, toggleLoading] = useState<boolean>(false);
  const { models: { Schedule } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { subject_id } = useParams<{ subject_id: string }>();

  const getSchedules = useCallback(() => {
    toggleLoading(true);
    Schedule.collection({
      attributes: ['week_count', 'capabilities', 'description', 'indicator', 'scoring_format_criteria', 'study_material', 'study_method', 'value', 'created_at'],
      where: {
        subject_id
      }
    }).then(resp => {
      toggleLoading(false);
      setSchedules(resp.rows as ScheduleAttributes[]);
    }).catch(errorCatch)
  }, [Schedule, errorCatch, subject_id]);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  const columns: scheduleColumns[] = useMemo<scheduleColumns[]>((): scheduleColumns[] => ([
    {
      title: 'Minggu Ke',
      align: 'center',
      dataIndex: 'week_count'
    },
    {
      title: 'Kemampuan akhir yang diharapkan (sesuai tahapan belajar)',
      align: 'center',
      dataIndex: 'capabilities'
    },
    {
      title: 'Bahan kajian (materi ajar)',
      align: 'center',
      dataIndex: 'material'
    },
    {
      title: 'Metode pembelajaran dan estimasi waktu',
      align: 'center',
      dataIndex: 'study_method'
    },
    {
      title: 'Asesmen',
      group: [{
        title: 'Indikator',
        align: 'center',
        dataIndex: 'indicator'
      },
      {
        title: 'Kriteria dan bentuk penilaian',
        align: 'center',
        dataIndex: 'scoring_format_criteria'
      },
      {
        title: 'Deskripsi tugas',
        align: 'center',
        dataIndex: 'description'
      },
      {
        title: 'Bobot',
        align: 'center',
        dataIndex: 'value',
      },]
    }
  ]), []);

  return (
    <Table
      dataSource={schedules}
      loading={{ spinning: loading, size: 'large', tip: 'Mengambil data jadwal', indicator: <LoadingOutlined spin /> }}
      // columns={columns}
      rowKey={item => `${item.id}`}
      bordered
      pagination={false}
      style={{ marginTop: 12 }}
    >
      {columns.map(column => (
        typeof column.group !== 'undefined' ?
          <ColumnGroup title={column.title}>
            {column.group.map(colGroup => (
              <Column {...colGroup} />
            ))}
          </ColumnGroup>
          :
          <Column {...column} />
      ))}
    </Table>
  )
}

export default ScheduleList
