import { FC, ReactElement } from "react"
import { Modal } from "antd"
import { ScheduleAttributes } from "types"

interface props {
  schedule?: ScheduleAttributes;
  visible: boolean;
  onCancel: () => void;
}

const ReportModal: FC<props> = ({ schedule, visible, onCancel }): ReactElement => {
  return (
    <Modal footer={null} visible={visible} onCancel={onCancel} title="Laporan" style={{ top: 15 }} width={1000}>

    </Modal>
  )
}

export default ReportModal
