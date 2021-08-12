import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select } from "antd"
import { FC, ReactElement, useCallback, useState } from "react"
import { addDataModal } from "types"

export type userForm = {
  username: string;
  name: string;
  password?: string;
  type: 'lecturer' | 'chief' | 'administrator';
}

interface props extends addDataModal {
  onSubmit: (val: userForm, cb: () => void) => void;
}

const { useForm, Item } = Form;

const AddUser: FC<props> = ({ visible, onCancel, onOpen, onSubmit }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [form] = useForm();

  const resetForm = useCallback(() => {
    form.resetFields(['name', 'username', 'password', 'type']);
    toggleLoading(false);
    onCancel();
  }, [form, onCancel]);

  const onFinish = useCallback((val: userForm) => {
    toggleLoading(true);
    onSubmit(val, resetForm);
  }, [onSubmit, resetForm]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Pengguna</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah pengguna" footer={null}>
        <Form form={form} layout="vertical" onFinish={loading ? () => console.log('sabar') : onFinish}>
          <Item name="name" label="Nama" rules={[{required: true, message: 'Masukkan nama'}]}>
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Nama" />
          </Item>
          <Item name="username" label="Username" rules={[{required: true, message: 'Masukkan username'}]}>
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Username" />
          </Item>
          <Item name="password" label="Password" rules={[{required: true, message: 'Masukkan password'}]}>
            <Input.Password prefix={loading && <LoadingOutlined spin />} placeholder="Password" />
          </Item>
          <Item name="type" label="Tipe pengguna" rules={[{required: true, message: 'Pilih tipe pengguna'}]}>
            <Select loading={loading} placeholder="Pilih tipe pengguna">
              <Select.Option value="administrator">Administrator</Select.Option>
              <Select.Option value="lecturer">Dosen</Select.Option>
              <Select.Option value="chief">Kepala Program Studi</Select.Option>
            </Select>
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit">Tambah Pengguna</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddUser
