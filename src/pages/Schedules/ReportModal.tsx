import { FC, ReactElement, useMemo, useState, useCallback, useEffect } from "react"
import { Modal, Typography } from "antd"
import moment from 'moment'
import { ReportAttributes, ScheduleAttributes } from "types"
import useModels from "hooks/useModels"
import useErrorCatcher from "hooks/useErrorCatcher"
import ReportCard from "./ReportCard"
import useAuth from "hooks/useAuth"
import { RcFile } from "antd/lib/upload"

interface props {
  schedule?: ScheduleAttributes;
  visible: boolean;
  onCancel: () => void;
}

const ReportModal: FC<props> = ({ schedule, visible, onCancel }): ReactElement => {
  const [reports, setReports] = useState<ReportAttributes[]>([]);
  const [loading, toggleLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { errorCatch } = useErrorCatcher();
  const { models: { Report } } = useModels();
  const hourLate: number = useMemo((): number =>
    (typeof schedule !== 'undefined' ? moment().diff(moment(schedule.daytime), 'hours') : 0),
    [schedule]);

  const getReports = useCallback(() => {
    toggleLoading(true);
    if (typeof schedule !== 'undefined') {
      Report.collection({
        attributes: ['file', 'created_at', 'updated_at', 'schedule_id', 'user_id'],
        where: {
          schedule_id: schedule.id,
        },
        include: [{
          model: 'User',
          attributes: ['name']
        }]
      }).then(resp => {
        toggleLoading(false);
        setReports(resp.rows as ReportAttributes[]);
      }).catch(errorCatch);
    }
  }, [errorCatch, schedule, Report]);

  useEffect(() => {
    (typeof schedule !== 'undefined') && getReports();
  }, [getReports, schedule]);

  const createReport = useCallback((file: RcFile, cb: () => void) => {
    const formData = new FormData();
    formData.append('report', file);
    formData.append('user_id', `${user?.id}`);
    formData.append('schedule_id', `${schedule?.id}`);
    formData.append('class_room_id', `${schedule?.class_room_id}`);
    Report.create(formData).then(resp => {
      console.log(resp);
      getReports();
      cb();
    }).catch(errorCatch);
  }, [schedule, user, Report, getReports, errorCatch]);

  return (
    <Modal footer={null} visible={visible} onCancel={onCancel} title="Laporan" style={{ top: 15 }} width={1000}>
      {
        hourLate > 4 ?
          <>
            <Typography.Text type="danger">Laporan tidak bisa dimasukkan</Typography.Text>
          </>
          :
          <ReportCard reports={reports} loading={loading} onUploadReport={createReport} />
      }
    </Modal>
  )
}

export default ReportModal
