import { FC, ReactElement } from "react"
import { Button, Modal } from "antd"
import { addDataModal } from "types"

interface props extends addDataModal {

}

const AddSchedules: FC<props> = ({onCancel, onOpen, visible}): ReactElement => {

  return (
    <>
      <Button onClick={onOpen}>Tambah Jadwal</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah Jadwal" footer={null}>
        
      </Modal>
    </>
  )
}

export default AddSchedules
