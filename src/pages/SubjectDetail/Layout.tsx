import { FC, ReactElement, useEffect, useCallback, useState } from "react"
import { useParams, useHistory } from 'react-router-dom'
import { PageHeader, Descriptions, Skeleton, Space, Divider, Typography } from "antd";
import useModels from "hooks/useModels";
import { SemesterAttributes, SubjectAttributes } from "types";
import useErrorCatcher from "hooks/useErrorCatcher";
import { Container } from "components/Container";
import moment from "moment";

const { Item } = Descriptions;

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
  }, [getSemester, getSubject])

  return (
    <div>
      <PageHeader title={`${subject?.name ?? ''}`} subTitle={`Semester ${semester?.name ?? ''}`} onBack={() => push(`/dashboard/semester/${id}/mata-kuliah`)} />
      <Container>
        {
          typeof subject !== 'undefined' ?
            <Descriptions column={6} layout="vertical" bordered>
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
              <Item><Typography.Title level={4}>OTORISASI</Typography.Title></Item>
              <Item label="Pembuat RPS">Test</Item>
              <Item span={2} label="Koordinator MK">Test</Item>
              <Item span={2} label="Ka PRODI">Test</Item>
              <Item><Typography.Title level={4}>Capaian Pembelajaran</Typography.Title></Item>
              <Item span={5} label="Program Studi">
                Test
              </Item>
              <Item>
                <span></span>
              </Item>
              <Item span={5} label="Mata Kuliah">
                Test
              </Item>
            </Descriptions>
            :
            <Skeleton paragraph={{ rows: 6 }} active />
        }
      </Container>
    </div>
  )
}

export default Layout
