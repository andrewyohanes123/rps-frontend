import { FC, ReactElement, useCallback, useState } from "react"
import { Modal, Form, Input, DatePicker, Button } from 'antd'
import moment from "moment";

export type semesterValue = {
  name: string;
  year: moment.Moment;
}

interface props {
  visible: boolean;
  onCancel: () => void;
  onOpen: () => void;
  onSubmit: ({name, year}: semesterValue, cb: () => void) => void;
}

const { YearPicker } = DatePicker;
const { Item, useForm } = Form;

const AddSemester: FC<props> = ({ visible, onCancel, onOpen, onSubmit }): ReactElement => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState<boolean>(false);

  const clearForm = useCallback(() => {
    form.resetFields(['name','year'])
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val: semesterValue) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [clearForm, onSubmit])

  return (
    <>
      <Button onClick={onOpen}>Tambah data semester</Button>
      <Modal confirmLoading={loading} visible={visible} onCancel={onCancel} title="Tambah Semester" footer={null} >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Item name="name" required rules={[{ required: true, message: 'Masukkan semester' }, {pattern: /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i, message: 'Masukkan format semester yang valid'}]} label="Semester">
            <Input disabled={loading} placeholder="Semester" />
          </Item>
          <Item name="year" required rules={[{ required: true, message: 'Pilih tahun semester' }]}>
            <YearPicker disabled={loading} placeholder="Pilih tahun semester" />
          </Item>
          <Item>
            <Button disabled={loading} loading={loading} htmlType="submit" type="primary">Tambah</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddSemester
