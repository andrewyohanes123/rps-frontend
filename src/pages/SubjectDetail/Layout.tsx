import { FC, ReactElement, useEffect, useCallback, useState } from "react"
import { useParams, useHistory } from 'react-router-dom'
import { PageHeader, Descriptions, Skeleton, Space, Divider, Typography, Collapse } from "antd";
import useModels from "hooks/useModels";
import { SemesterAttributes, SubjectAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import { Container } from "components/Container";
import moment from "moment";
import ScheduleList from "./ScheduleList";

const { Item } = Descriptions;
const { Panel } = Collapse;

const Layout: FC = (): ReactElement => {
  const { id, subject_id } = useParams<{ id: string; subject_id: string }>();
  const { push } = useHistory();
  const { models: { Semester, Subject } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const [semester, setSemester] = useState<SemesterAttributes | undefined>(undefined);
  const [subject, setSubject] = useState<SubjectAttributes | undefined>(undefined);

  const getSemester = useCallback(() => {
    Semester.single(parseInt(id)).then(resp => {
      setSemester(resp as SemesterAttributes);
    }).catch(errorCatch)
  }, [Semester, id, errorCatch]);

  document.title = `Dashboard - ${subject?.name ?? 'MK'}`

  const getSubject = useCallback(() => {
    Subject.single(parseInt(subject_id)).then(resp => {
      setSubject(resp as SubjectAttributes);
    }).catch(errorCatch);
  }, [Subject, subject_id, errorCatch]);

  useEffect(() => {
    getSubject();
    getSemester();
  }, [getSemester, getSubject]);

  return (
    <div>
      <PageHeader title={`${subject?.name ?? ''}`} subTitle={`Semester ${semester?.name ?? ''}`} onBack={() => push(`/dashboard/semester/${id}/mata-kuliah`)} />
      <Container padding={18}>
        {
          typeof subject !== 'undefined' ?
            <>
              <Descriptions size="small" column={6} layout="vertical" bordered>
                <Item label="Mata Kuliah">{subject.name}</Item>
                <Item label="Kode">{subject.code}</Item>
                <Item label="Rumpun MK">{subject.subject_cluster}</Item>
                <Item label="Bobot (SKS)">
                  <Space split={<Divider type="vertical" />}>
                    <Typography.Title level={5}>T</Typography.Title>
                    <Typography.Text>{subject.theory_weight}</Typography.Text>
                    <Typography.Title level={5}>P</Typography.Title>
                    <Typography.Text>{subject.practice_weight}</Typography.Text>
                  </Space>
                </Item>
                <Item label="Semester">{semester?.name}</Item>
                <Item label="Disusun Tanggal">{moment(subject.created_at).format('DD MMMM YYYY')}</Item>
              </Descriptions>
              <Divider />
              <Collapse defaultActiveKey={['otorisasi', 'achievement', 'media', 'support_lecturers', 'prerequisites']}>
                <Panel key="otorisasi" header={<Typography.Title level={5}>OTORISASI</Typography.Title>}>
                  <Descriptions size="small" layout="vertical" bordered>
                    <Item label="Pembuat RPS">{subject.Creator.name}</Item>
                    <Item span={2} label="Koordinator MK">{subject.coordinator_id === null ? '-' : subject.Coordinator.name}</Item>
                    <Item span={2} label="Ka PRODI">Test</Item>
                  </Descriptions>
                </Panel>
                <Panel key="achievement" header={<Typography.Title level={5}>Capaian Pembelajaran</Typography.Title>}>
                  <Descriptions size="small" bordered layout="vertical">
                    <Item span={5} label="Program Studi">
                      {subject.program_study_achievement ?? '-'}
                    </Item>
                    <Item span={5} label="Mata Kuliah">
                      {subject.subject_achievement ?? '-'}
                    </Item>
                  </Descriptions>
                </Panel>
                <Panel key="media" header={<Typography.Title level={5}>Media Pembelajaran</Typography.Title>}>
                  <Descriptions column={2} size="small">
                    <Item label={<Typography.Title level={5}>Software</Typography.Title>}>
                      {subject.software ?? '-'}
                    </Item>
                    <Item label={<Typography.Title level={5}>Hardware</Typography.Title>}>
                      {subject.hardware ?? '-'}
                    </Item>
                    <Item label={<Typography.Title level={5}>Jurnal</Typography.Title>}>
                      {subject.journal ?? '-'}
                    </Item>
                    <Item label={<Typography.Title level={5}>Hardware</Typography.Title>}>
                      {subject.guide ?? '-'}
                    </Item>
                  </Descriptions>
                </Panel>
                <Panel key="support_lecturers" header={<Typography.Title level={5}>Dosen Pengampu</Typography.Title>}>
                  {subject.support_lecturers.length > 0 ?
                    subject.support_lecturers.map(user => user.name).join(", ")
                    :
                    "-"
                  }
                </Panel>
                <Panel key="prerequisites" header={<Typography.Title level={5}>Mata Kuliah Prasyarat</Typography.Title>}>
                  Mata Kuliah core subject
                </Panel>
              </Collapse>
            </>
            :
            <Skeleton paragraph={{ rows: 6 }} active />
        }
        <ScheduleList />
      </Container>
    </div >
  )
}

export default Layout
