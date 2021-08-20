import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select } from "antd"
import { FC, ReactElement, useCallback, useState } from "react"
import { addDataModal } from "types"

interface props extends addDataModal {
  onSubmit: (val: subjectForm, cb: () => void) => void;
}

export type subjectForm = {
  name: string;
  type: "Praktek" | "Teori";
}

const { useForm, Item } = Form;

const AddSubject: FC<props> = ({ visible, onCancel, onOpen, onSubmit }): ReactElement => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState<boolean>(false);

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['name', 'type']);
    onCancel();
  }, [form, onCancel]);

  const onFinish = useCallback((val: subjectForm) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Mata Kuliah</Button>
      <Modal visible={visible} onCancel={onCancel} title='Tambah Mata Kuliah' footer={null}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Item label="Mata Kuliah" name="name" rules={[{ required: true, message: 'Masukkan nama mata kuliah' }]}>
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Mata Kuliah" />
          </Item>
          <Item label="Jenis Mata Kuliah" name="type" rules={[{ required: true, message: 'Masukkan jenis mata kuliah' }]}>
            <Select loading={loading} placeholder="Pilih jenis mata kuliah">
              <Select.Option value="Praktek">Praktek</Select.Option>
              <Select.Option value="Teori">Teori</Select.Option>
            </Select>
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit">Tambah</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddSubject
