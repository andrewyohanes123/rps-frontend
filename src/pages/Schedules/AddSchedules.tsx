import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Button, Modal, Select, Form, DatePicker } from "antd"
import { addDataModal, ClassRoomAttributes, SubjectAttributes, UserAttributes } from "types"
import moment from "moment";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

export type scheduleForm = {
  subject_id: number;

  day_name: string;
  hour: moment.Moment;
  type: "Praktek" | "Teori";
}

interface props extends addDataModal {
  onSubmit: (val: scheduleForm, cb: () => void) => void;
}

const { useForm, Item } = Form;

const dayNames: string[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const AddSchedules: FC<props> = ({ onCancel, onOpen, visible, onSubmit }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<SubjectAttributes[]>([]);
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [classRooms, setClassRooms] = useState<ClassRoomAttributes[]>([]);
  const [form] = useForm();
  const { errorCatch } = useErrorCatcher();
  const { models: { Subject, ClassRoom, User } } = useModels();

  const clearForm = useCallback(() => {
    toggleLoading(false);
    onCancel();
    form.resetFields(['subject_id', 'day_name', 'hour', 'class_room_id', 'user_id']);
  }, [onCancel, form, toggleLoading]);

  const onFinish = useCallback((val: scheduleForm) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  const getSubjects = useCallback(() => {
    Subject.collection({
      attributes: ['name', 'type'],
    }).then(resp => {
      setSubjects(resp.rows as SubjectAttributes[]);
    }).catch(e => {
      errorCatch(e);
    })
  }, [errorCatch, Subject]);

  const getClassRooms = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name', 'semester_id'],
      include: [
        { model: 'Semester', attributes: ['name'] }
      ]
    }).then(resp => {
      setClassRooms(resp.rows as ClassRoomAttributes[]);
    }).catch(errorCatch);
  }, [errorCatch, ClassRoom]);

  const getUsers = useCallback(() => {
    User.collection({
      attributes: ['name'],
      where: {
        type: 'lecturer',        
      }
    }).then(resp => {
      setUsers(resp.rows as UserAttributes[]);
    }).catch(errorCatch);
  }, [errorCatch, User]);

  useEffect(() => {
    getClassRooms();
    getSubjects();
    getUsers();
  }, [getSubjects, getClassRooms, getUsers]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Jadwal</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah Jadwal" footer={null}>
        <Form onFinish={loading ? undefined : onFinish} layout="vertical" form={form}>          
          <Item name="user_id" label="Dosen" rules={[{ required: true, message: 'Pilih dosen' }]} >
            <Select showSearch allowClear optionFilterProp="children" loading={loading} placeholder="Pilih dosen">
              {
                users.map(user => (
                  <Select.Option key={`${user.name} ${user.id}`} value={user.id}>{user.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="subject_id" label="Mata Kuliah" rules={[{ required: true, message: 'Pilih mata kuliah' }]} >
            <Select loading={loading} placeholder="Pilih mata kuliah">
              {
                subjects.map(subject => (
                  <Select.Option key={`${subject.name} ${subject.id}`} value={subject.id}>{subject.type}&nbsp;{subject.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="class_room_id" label="Kelas" rules={[{ required: true, message: 'Pilih kelas' }]} >
            <Select loading={loading} placeholder="Pilih kelas">
              {
                classRooms.map(classRoom => (
                  <Select.Option key={`${classRoom.name} ${classRoom.id}`} value={classRoom.id}>{classRoom.semester.name}&nbsp;{classRoom.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item label="Masukkan hari" name="day_name" rules={[{ required: true, message: 'Pilih hari mata kuliah' }]}>
            <Select loading={loading} placeholder="Pilih hari mata kuliah">
              {
                dayNames.map(day => (
                  <Select.Option value={`${day}`} key={`${day}`}>{day}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="hour" rules={[{ required: true, message: 'Pilih jam mata kuliah' }]} label="Masukkan jam">
            <DatePicker.TimePicker inputReadOnly placeholder="Pilih jam mata kuliah" />
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit">Tambah jadwal</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddSchedules
