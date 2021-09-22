import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Button, Modal, Form, Input } from "antd"
import { LoadingOutlined } from "@ant-design/icons";
import { ClassRoomAttributes } from "types";

interface props {
  visible: boolean;
  onCancel: () => void;
  onOpen: () => void;
  onSubmit: ({ name }: { name: string }, cb: () => void) => void;
  semester: string;
  classRoom?: ClassRoomAttributes;
}

const { useForm, Item } = Form;

const AddClassRoom: FC<props> = ({ visible, onCancel, onOpen, onSubmit, semester, classRoom }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [form] = useForm();

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['name']);
  }, [form]);

  const onFinish = useCallback((val: { name: string }) => {
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  useEffect(() => {
    if (typeof classRoom !== 'undefined') {
      form.setFieldsValue({
        name: classRoom.name
      });
    }
  }, [classRoom, form]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Kelas</Button>
      <Modal title={typeof classRoom !== 'undefined' ? `Edit ${semester} ${classRoom.name}` : "Tambah kelas"} afterClose={clearForm} visible={visible} onCancel={onCancel} footer={null}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Item name="name" label="Kelas" rules={[{ required: true, message: "Masukkan nama kelas" }]}>
            <Input prefix={!loading ? semester : <LoadingOutlined spin />} placeholder="Kelas" />
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit">Simpan</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddClassRoom
