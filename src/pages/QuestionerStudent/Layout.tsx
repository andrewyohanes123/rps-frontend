import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Button, Card, Divider, Form, Input, message, Select } from "antd"
import { Container } from "components/Container"
import { ClassRoomAttributes, QuestionerAttributes, ScheduleAttributes, SemesterAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { LogoImage } from "components/LogoImage";
import Questions from "./Questions";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

const { Item, useForm } = Form;

export type questionerResponseType = {
  name: string;
  nim: string;
  semester_id?: number;
  class_room_id?: number;
  subject_id?: number;
}

const Layout: FC = (): ReactElement => {
  const [semesters, setSemesters] = useState<SemesterAttributes[]>([]);
  const [classRooms, setClassRooms] = useState<ClassRoomAttributes[]>([]);
  const [schedules, setSchedules] = useState<ScheduleAttributes[]>([]);
  const [questioners, setQuestioners] = useState<QuestionerAttributes[]>([]);
  const [semesterId, setSemesterId] = useState<number>(0);
  const [classRoomId, setClassRoomId] = useState<number>(0);
  const [loading, toggleLoading] = useState<boolean>(false);
  const { models: { Semester, Schedule, ClassRoom, Questioner, Student } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const [form] = useForm();

  const getSemesters = useCallback(() => {
    Semester.collection({
      attributes: ['name']
    }).then(resp => {
      setSemesters(resp.rows as SemesterAttributes[]);
    }).catch(errorCatch);
  }, [Semester, errorCatch]);

  const getClassRooms = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name', 'semester_id'],
      include: [{
        model: 'Semester',
        attributes: ['name']
      }],
      where: {
        semester_id: semesterId
      }
    }).then(resp => {
      setClassRooms(resp.rows as ClassRoomAttributes[]);
    }).catch(errorCatch);
  }, [ClassRoom, errorCatch, semesterId]);

  const getSchedule = useCallback(() => {
    Schedule.collection({
      attributes: ['class_room_id', 'subject_id', 'daytime'],
      where: {
        class_room_id: classRoomId,
        daytime: {
          $lte: moment().endOf('week').format('YYYY-MM-DD'),
          $gte: moment().startOf('week').format('YYYY-MM-DD')
        },
      },
      include: [
        {
          model: 'Subject', attributes: ['name', 'type']
        }
      ]
    }).then(resp => {
      setSchedules(resp.rows as ScheduleAttributes[]);
    }).catch(errorCatch);
  }, [Schedule, errorCatch, classRoomId]);

  const getQuestioners = useCallback(() => {
    Questioner.collection({
      attributes: ['id', 'question'],
    }).then(resp => {
      setQuestioners(resp.rows as QuestionerAttributes[]);
    }).catch(errorCatch);
  }, [Questioner, errorCatch]);

  useEffect(() => {
    getClassRooms();
    getSchedule();
    getSemesters();
    getQuestioners();
  }, [getSemesters, getSchedule, getClassRooms, getQuestioners]);

  const onValueChange = useCallback((val: any, changeValue: questionerResponseType) => {
    setSemesterId(changeValue.semester_id ?? 0);
    setClassRoomId(changeValue.class_room_id ?? 0);
  }, []);

  const onFinish = useCallback((val:any) => {
    toggleLoading(true);
    Student.create(val).then(resp => {
      console.log(resp);
      message.success('Kuesioner berhasil diisi');
      toggleLoading(false);
      form.resetFields(['name', 'nim', 'semester_id', 'class_room_id', 'schedule_id', 'questions']);
    }).catch(errorCatch);
  }, [form, errorCatch, Student]);

  // useEffect(() => {
  //   form.
  // }, [])

  return (
    <Container widthLimit={1000} padding={0}>
      <LogoImage />
      <Card>
        <Form onFinish={loading ? undefined : onFinish} onValuesChange={onValueChange} form={form} layout="vertical">
          <Item label="Nama Lengkap" name="name" rules={[{ required: true, message: 'Masukkan nama lengkap' }]}>
            <Input prefix={loading && <LoadingOutlined />} placeholder="Nama Lengkap" />
          </Item>
          <Item label="NIM" name="nim" rules={[{ required: true, message: 'Masukkan NIM' }, { len: 8, message: 'Masukkan NIM yang valid' }]}>
            <Input prefix={loading && <LoadingOutlined />} maxLength={8} placeholder="NIM" />
          </Item>
          <Item label="Semester" name="semester_id" rules={[{ required: true, message: 'Pilih semester' }]}>
            <Select loading={loading} placeholder="Pilih Semester">
              {semesters.map(semester => (
                <Select.Option key={`${semester.id}`} value={semester.id}>Semester {semester.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Item label="Kelas" name="class_room_id" rules={[{ required: true, message: 'Pilih kelas' }]}>
            <Select loading={loading} placeholder="Pilih Kelas">
              {classRooms.map(classRoom => (
                <Select.Option key={`${classRoom.id}`} value={classRoom.id}>{classRoom.semester.name}&nbsp;{classRoom.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Item label="Mata Kuliah" name="schedule_id" rules={[{ required: true, message: 'Pilih mata kuliah' }]}>
            <Select loading={loading} placeholder="Pilih Mata Kuliah">
              {schedules.map(schedule => (
                <Select.Option key={`${schedule.id}`} value={schedule.id}>[{moment(schedule.daytime).format('DD MMM YYYY HH:mm a')}]&nbsp;{schedule.subject.type} {schedule.subject.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Divider />
          {questioners.length > 0 && <Questions questions={questioners} />}
          <Item>
            <Button loading={loading} type="primary" htmlType="submit" block>Masukkan kuesioner</Button>
          </Item>
        </Form>
      </Card>
    </Container>
  )
}

export default Layout
