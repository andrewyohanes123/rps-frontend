import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Card, Divider, Form, Input, Select } from "antd"
import { Container } from "components/Container"
import { ClassRoomAttributes, QuestionerAttributes, SemesterAttributes, SubjectAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { LogoImage } from "components/LogoImage";
import Questions from "./Questions";

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
  const [subjects, setSubjects] = useState<SubjectAttributes[]>([]);
  const [questioners, setQuestioners] = useState<QuestionerAttributes[]>([]);
  const [semesterId, setSemesterId] = useState<number>(0);
  const { models: {Semester, Subject, ClassRoom, Questioner} } = useModels();
  const {errorCatch} = useErrorCatcher();
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
  
  const getSubjects = useCallback(() => {
    Subject.collection({
      attributes: ['name', 'semester_id', 'type'],
      where: {
        semester_id: semesterId
      }
    }).then(resp => {
      setSubjects(resp.rows as SubjectAttributes[]);
    }).catch(errorCatch);
  }, [Subject, errorCatch, semesterId]);

  const getQuestioners = useCallback(() => {
    Questioner.collection({
      attributes: ['id', 'question'],
    }).then(resp => {
      setQuestioners(resp.rows as QuestionerAttributes[]);
    }).catch(errorCatch);
  }, [Questioner, errorCatch]);

  useEffect(() => {
    getClassRooms();
    getSubjects();
    getSemesters();
    getQuestioners();
  }, [getSemesters, getSubjects, getClassRooms, getQuestioners]);

  const onValueChange = useCallback((val: any, changeValue: questionerResponseType) => {
    setSemesterId(changeValue.semester_id ?? 0);
  }, []);

  // useEffect(() => {
  //   form.
  // }, [])

  return (
    <Container widthLimit={1000} padding={0}>
      <LogoImage />
      <Card>
        <Form onValuesChange={onValueChange} form={form} layout="vertical">
          <Item label="Nama Lengkap" name="name" rules={[{required: true, message: 'Masukkan nama lengkap'}]}>
            <Input placeholder="Nama Lengkap" />
          </Item>
          <Item label="NIM" name="nim" rules={[{required: true, message: 'Masukkan NIM'}, {len: 8, message: 'Masukkan NIM yang valid'}]}>
            <Input maxLength={8} placeholder="NIM" />
          </Item>
          <Item label="Semester" name="semester_id" rules={[{required: true, message: 'Pilih semester'}]}>
            <Select placeholder="Pilih Semester">
              {semesters.map(semester => (
                <Select.Option key={`${semester.id}`} value={semester.id}>Semester {semester.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Item label="Kelas" name="class_room_id" rules={[{required: true, message: 'Pilih kelas'}]}>
            <Select placeholder="Pilih Kelas">
              {classRooms.map(classRoom => (
                <Select.Option key={`${classRoom.id}`} value={classRoom.id}>{classRoom.semester.name}&nbsp;{classRoom.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Item label="Mata Kuliah" name="subject_id" rules={[{required: true, message: 'Pilih mata kuliah'}]}>
            <Select placeholder="Pilih Mata Kuliah">
              {subjects.map(subject => (
                <Select.Option key={`${subject.id}`} value={subject.id}>{subject.type}&nbsp;{subject.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Divider />
          {questioners.length > 0 && <Questions questions={questioners} />}
        </Form>
      </Card>
    </Container>
  )
}

export default Layout
