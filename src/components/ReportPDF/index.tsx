import { FC, ReactElement } from "react"
import { Modal } from 'antd'
import { addDataModal } from "types"
import ReportDocument from "./ReportDocument"

interface props extends addDataModal {

}

const width: number = window.innerWidth / 100 * 90;

const ReportPDF: FC<props> = ({ visible, onCancel, onOpen, }): ReactElement => {
  return (
    <Modal style={{ top: 15 }} width={width} visible={visible} title="Cetak Laporan" footer={null} onCancel={onCancel}>
      <ReportDocument />
    </Modal>
  )
}

export default ReportPDF
