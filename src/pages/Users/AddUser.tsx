import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select } from "antd"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { addDataModal, ClassRoomAttributes, UserAttributes } from "types"

export type userForm = {
  username: string;
  name: string;
  password?: string;
  type: 'lecturer' | 'chief' | 'administrator';
  class_room_id?: number;
}

interface props extends addDataModal {
  onSubmit: (val: userForm, cb: () => void) => void;
  user?: UserAttributes;
}

const { useForm, Item } = Form;

const AddUser: FC<props> = ({ visible, onCancel, onOpen, onSubmit, user }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [classRooms, setClassRooms] = useState<ClassRoomAttributes[]>([]);
  const { models: { ClassRoom } } = useModels();
  const { errorCatch } = useErrorCatcher();
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

  const getClassRooms = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name'],
      include: [{
        model: 'Semester',
        attributes: ['name']
      }]
    }).then(resp => {
      setClassRooms(resp.rows as ClassRoomAttributes[]);
    }).catch(errorCatch);
  }, [ClassRoom, errorCatch]);

  useEffect(() => {
    getClassRooms();
  }, [getClassRooms]);

  useEffect(() => {
    if (typeof user !== 'undefined') {
      form.setFieldsValue({
        ...user
      });
    }
  }, [user, form]);

  const isEdit: boolean = useMemo(() => typeof user !== 'undefined', [user]);

  const onValuesChange = useCallback((val: any, changedVal: userForm) => {
    setUserType(changedVal.type ?? '');
  }, []);

  return (
    <>
      <Button onClick={onOpen}>Tambah Pengguna</Button>
      <Modal visible={visible} afterClose={resetForm} onCancel={onCancel} title="Tambah pengguna" footer={null}>
        <Form onValuesChange={onValuesChange} form={form} layout="vertical" onFinish={loading ? () => console.log('sabar') : onFinish}>
          <Item name="name" label="Nama" rules={[{ required: true, message: 'Masukkan nama' }]}>
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Nama" />
          </Item>
          <Item name="username" label="Username" rules={[{ required: true, message: 'Masukkan username' }]}>
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Username" />
          </Item>
          <Item name="password" label="Password" rules={[{ required: !isEdit, message: 'Masukkan password' }]}>
            <Input.Password prefix={loading && <LoadingOutlined spin />} placeholder="Password" />
          </Item>
          <Item name="type" label="Tipe pengguna" rules={[{ required: true, message: 'Pilih tipe pengguna' }]}>
            <Select loading={loading} placeholder="Pilih tipe pengguna">
              <Select.Option value="administrator">Administrator</Select.Option>
              <Select.Option value="lecturer">Dosen</Select.Option>
              <Select.Option value="chief">Kepala Program Studi</Select.Option>
              <Select.Option value="chairman">Ketua Kelas</Select.Option>
            </Select>
          </Item>
          {userType === 'chairman' && <Item name="class_room_id" label="Kelas" rules={[{ required: true, message: 'Pilih kelas' }]}>
            <Select showSearch optionFilterProp="children" allowClear loading={loading} placeholder="Pilih kelas">
              {
                classRooms.map((room) => (
                  <Select.Option key={`${room.id}`} value={room.id}>{room.semester.name} {room.name}</Select.Option>
                ))
              }
            </Select>
          </Item>}
          <Item>
            <Button loading={loading} htmlType="submit">Tambah Pengguna</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddUser
