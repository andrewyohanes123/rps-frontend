import { FC, ReactElement } from "react"
import { Modal, Form, Input, DatePicker, Button } from 'antd'

interface props {
  visible: boolean;
  onCancel: () => void;
  onOpen: () => void;
}

const { YearPicker } = DatePicker;
const { Item, useForm } = Form;

const AddSemester: FC<props> = ({ visible, onCancel, onOpen }): ReactElement => {
  const [form] = useForm();

  return (
    <>
      <Button onClick={onOpen}>Tambah data semester</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah Semester" footer={null} >
        <Form form={form} layout="vertical">
          <Item name="semester" required rules={[{ required: true, message: 'Masukkan semester' }, {pattern: /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, message: 'Masukkan format semester yang valid'}]} label="Semester">
            <Input placeholder="Semester" />
          </Item>
          <Item name="year" required rules={[{ required: true, message: 'Pilih tahun semester' }]}>
            <YearPicker placeholder="Pilih tahun semester" />
          </Item>
          <Item>
            <Button type="primary">Tambah</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddSemester
