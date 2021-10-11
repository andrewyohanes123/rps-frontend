import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from 'antd'
import { addDataModal, ReportAttributes, SubjectAttributes } from "types"
import ReportDocument from "./ReportDocument"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { parse } from "query-string";
import { useLocation, useParams } from "react-router-dom";

interface props extends addDataModal {
  subject: SubjectAttributes;
}

const width: number = window.innerWidth / 100 * 90;

const ReportPDF: FC<props> = ({ visible, onCancel, onOpen, subject }): ReactElement => {
  const {subject_id} = useParams<{subject_id: string}>();
  const { search } = useLocation();
  const { kelas } = useMemo(() => parse(search), [search]);
  const [reports, setReports] = useState<ReportAttributes[]>([]);
  const { models: { Report } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getReports = useCallback(() => {
    Report.collection({
      attributes: ['created_at', 'schedule_id', 'class_room_id', 'lecturer_id', 'chairman_id'],
      where: {
        class_room_id: kelas
      },
      include: [{
        model: 'Schedule',
        attributes: ['study_material', 'week_count', 'subject_id', 'id'],
        where: {
          subject_id,
        },
        // @ts-ignore
        required: true
      }]
    }).then(resp => {
      setReports(resp.rows as ReportAttributes[]);
    }).catch(errorCatch);
  }, [Report, kelas, subject_id, errorCatch]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  return (
    <Modal style={{ top: 15 }} width={width} visible={visible} title="Cetak Laporan" footer={null} onCancel={onCancel}>
      <ReportDocument reports={reports} subject={subject} />
    </Modal>
  )
}

export default ReportPDF
