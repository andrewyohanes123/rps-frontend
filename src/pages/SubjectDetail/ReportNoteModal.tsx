import { FC, ReactElement } from "react"
import { Modal, Typography } from 'antd'

interface props {
  visible: boolean;
  onCancel: () => void;
  note?: string;
  afterClose: () => void;
}

const ReportNoteModal: FC<props> = ({ visible, onCancel, note, afterClose }): ReactElement => {
  return (
    <Modal visible={visible} title="Catatan Laporan" footer={null} afterClose={afterClose} onCancel={onCancel}>
      <Typography.Text>{note}</Typography.Text>
    </Modal>
  )
}

export default ReportNoteModal
