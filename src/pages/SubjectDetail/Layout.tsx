import { FC, ReactElement, useEffect, useCallback, useState, useMemo } from "react"
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { PageHeader, Select, Space, Button, Divider, Result } from "antd";
import { parse } from "query-string";
import useModels from "hooks/useModels";
import { ClassRoomAttributes, SemesterAttributes, SubjectAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import { Container } from "components/Container";
import ScheduleList from "./ScheduleList";
import useAuth from "hooks/useAuth";
import SubjectDescription from "./SubjectDescription";

const Layout: FC = (): ReactElement => {
  const { id, subject_id } = useParams<{ id: string; subject_id: string }>();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const { push } = useHistory();
  const { search, pathname } = useLocation();
  const { models: { Semester, Subject, ClassRoom } } = useModels();
  const { user } = useAuth();
  const { errorCatch } = useErrorCatcher();
  const [semester, setSemester] = useState<SemesterAttributes | undefined>(undefined);
  const [subject, setSubject] = useState<SubjectAttributes | undefined>(undefined);
  const [classRooms, setClassRooms] = useState<ClassRoomAttributes[]>([]);
  const parsedQuery = useMemo(() => parse(search), [search]);

  const getSemester = useCallback(() => {
    Semester.single(parseInt(id)).then(resp => {
      setSemester(resp as SemesterAttributes);
    }).catch(errorCatch)
  }, [Semester, id, errorCatch]);

  const getClassRooms = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name'],
      where: {
        semester_id: id,
      }
    }).then(resp => {
      setClassRooms(resp.rows as ClassRoomAttributes[]);
    }).catch(errorCatch);
  }, [ClassRoom, id, errorCatch]);

  document.title = `Dashboard - ${subject?.name ?? 'MK'}`

  const getSubject = useCallback(() => {
    Subject.single(parseInt(subject_id)).then(resp => {
      setSubject(resp as SubjectAttributes);
    }).catch(errorCatch);
  }, [Subject, subject_id, errorCatch]);

  useEffect(() => {
    getSubject();
    getSemester();
    getClassRooms();
  }, [getSemester, getSubject, getClassRooms]);

  return (
    <div>
      <PageHeader title={`${subject?.name ?? ''}`} subTitle={`Semester ${semester?.name ?? ''}`} onBack={() =>
        ['chief', 'lecturer'].includes(user.type) ?
          push(`/dashboard/jadwal/${id}`)
          :
          push(`/dashboard/semester/${id}/mata-kuliah`)
      } />
      <Container padding={18}>
        {['chief', 'lecturer'].includes(user.type) &&
          <Space style={{ marginBottom: 12 }} split={<Divider type="vertical" />}>
            <Select
              // @ts-ignore
              onChange={val => setSelectedClass(val ?? '')}
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Pilih kelas untuk membuat laporan RPS"
              defaultValue={parsedQuery.kelas ?? undefined}
            >
              {classRooms.map(classroom => (
                <Select.Option value={`${classroom.id}`} key={`${classroom.id}`}>{semester?.name} {classroom.name}</Select.Option>
              ))}
            </Select>
            <Button disabled={selectedClass.length === 0} onClick={() => (push({ pathname, search: selectedClass.length > 0 ? `?kelas=${selectedClass}` : '' }))} type="primary">Pilih Kelas</Button>
          </Space>}
        {
          !['chief', 'lecturer'].includes(user.type) ?
            <>
              <SubjectDescription semester={semester} subject={subject} />
              <ScheduleList />
            </>
            :
            (['chief', 'lecturer'].includes(user.type) && typeof parsedQuery.kelas !== 'undefined') ?
              <>
                <SubjectDescription semester={semester} subject={subject} />
                <ScheduleList />
              </>
              :
              <Result status="info" title="Pilih kelas terlebih dahulu" subTitle="Pilih kelas untuk membuat laporan RPS" />
        }
      </Container>
    </div >
  )
}

export default Layout
