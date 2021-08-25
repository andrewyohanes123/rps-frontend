import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Button, Modal, Select, Form, DatePicker } from "antd"
import { addDataModal, ClassRoomAttributes, SemesterAttributes, SubjectAttributes, UserAttributes } from "types"
import moment from "moment";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

export type scheduleForm = {
  subject_id?: number;
  daytime: moment.Moment;
  class_room_id?: number;
  semester_id?: number;
}

interface props extends addDataModal {
  onSubmit: (val: scheduleForm, cb: () => void) => void;
}

const { useForm, Item } = Form;

// const dayNames: string[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const AddSchedules: FC<props> = ({ onCancel, onOpen, visible, onSubmit }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<SubjectAttributes[]>([]);
  const [semesters, setSemesters] = useState<SemesterAttributes[]>([]);
  const [semesterId, setSemesterId] = useState<number>(0);
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [classRooms, setClassRooms] = useState<ClassRoomAttributes[]>([]);
  const [form] = useForm();
  const { errorCatch } = useErrorCatcher();
  const { models: { Subject, ClassRoom, User, Semester } } = useModels();

  const clearForm = useCallback(() => {
    toggleLoading(false);
    onCancel();
    form.resetFields(['subject_id', 'day_name', 'hour', 'class_room_id', 'user_id']);
  }, [onCancel, form, toggleLoading]);

  const onFinish = useCallback((val: scheduleForm) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  const getSemesters = useCallback(() => {
    Semester.collection({
      attributes: ['name'],
    }).then(resp => {
      setSemesters(resp.rows as SemesterAttributes[]);
    }).catch(errorCatch);
  }, [Semester, errorCatch]);

  const getSubjects = useCallback(() => {
    Subject.collection({
      attributes: ['name', 'type', 'semester_id'],
      include: [{
        model: 'Semester',
        attributes: ['name']
      }],
      where: {
        semester_id: semesterId
      }
    }).then(resp => {
      setSubjects(resp.rows as SubjectAttributes[]);
    }).catch(e => {
      errorCatch(e);
    })
  }, [errorCatch, Subject, semesterId]);

  const getClassRooms = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name', 'semester_id'],
      include: [
        { model: 'Semester', attributes: ['name'] },
      ],
      where: {
        semester_id: semesterId
      }
    }).then(resp => {
      setClassRooms(resp.rows as ClassRoomAttributes[]);
    }).catch(errorCatch);
  }, [errorCatch, ClassRoom, semesterId]);

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
    getSemesters();
  }, [getSubjects, getClassRooms, getUsers, getSemesters]);

  const onSemesterChange = useCallback((val: any, changedValue: scheduleForm) => {
    setSemesterId(changedValue.semester_id ?? 0);
  }, []);

  const disabledDate = useCallback((current: moment.Moment) => ([0, 6].includes(moment(current).day())), []);

  return (
    <>
      <Button onClick={onOpen}>Tambah Jadwal</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah Jadwal" footer={null}>
        <Form onValuesChange={onSemesterChange} onFinish={loading ? undefined : onFinish} layout="vertical" form={form}>
          <Item name="user_id" label="Dosen" rules={[{ required: true, message: 'Pilih dosen' }]} >
            <Select showSearch allowClear optionFilterProp="children" loading={loading} placeholder="Pilih dosen">
              {
                users.map(user => (
                  <Select.Option key={`${user.name} ${user.id}`} value={user.id}>{user.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="semester_id" label="Semester" rules={[{ required: true, message: 'Pilih Semester' }]} >
            <Select loading={loading} placeholder="Pilih Semester">
              {
                semesters.map(semester => (
                  <Select.Option key={`${semester.name} ${semester.id}`} value={semester.id}>Semester {semester.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="subject_id" label="Mata Kuliah" rules={[{ required: true, message: 'Pilih mata kuliah' }]} >
            <Select loading={loading} placeholder="Pilih mata kuliah">
              {
                subjects.map(subject => (
                  <Select.Option key={`${subject.name} ${subject.id}`} value={subject.id}>{subject.type}&nbsp;{subject.name} - Semester {subject.semester.name}</Select.Option>
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
          <Item name="daytime" rules={[{ required: true, message: 'Pilih hari dan jam mata kuliah' }]} label="Pilih hari dan jam mata kuliah">
            <DatePicker disabledDate={disabledDate} format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} inputReadOnly placeholder="Pilih jam mata kuliah" />
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
