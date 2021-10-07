import { FC, ReactElement } from "react"
import { Modal } from 'antd'
import { addDataModal } from "types"

interface props extends addDataModal {

}

const ReportPDF: FC<props> = ({ visible, onCancel, onOpen, }): ReactElement => {
  return (
    <Modal visible={visible} title="Cetak Laporan" footer={null} onCancel={onCancel}>

    </Modal>
  )
}

export default ReportPDF
