import { FC, ReactElement, useState, useEffect, useCallback } from "react"
import { Collapse, Descriptions, Space, Typography, Divider, Skeleton } from 'antd'
import { SemesterAttributes, SubjectAttributes, UserAttributes } from "types"
import moment from "moment";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

interface props {
  subject?: SubjectAttributes;
  semester?: SemesterAttributes;
}

const { Item } = Descriptions;
const { Panel } = Collapse;

const SubjectDescription: FC<props> = ({ subject, semester }): ReactElement => {
  const [chiefs, setChiefs] = useState<UserAttributes[]>([]);
  const { models: { User } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getChiefs = useCallback(() => {
    User.collection({
      attributes: ['name'],
      where: {
        type: 'chief'
      },
      limit: 1,
      offset: 0
    }).then(resp => {
      setChiefs(resp.rows as UserAttributes[]);
    }).catch(errorCatch)
  }, [errorCatch, User,]);

  useEffect(() => {
    getChiefs();
  }, [getChiefs])

  return (
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
            <Descriptions column={5} size="small" layout="vertical" bordered>
              <Item label="Pembuat RPS">{subject.Creator.name}</Item>
              <Item span={2} label="Koordinator MK">{subject.coordinator_id === null ? '-' : subject.Coordinator.name}</Item>
              <Item span={2} label="Ka PRODI">{
                chiefs.length > 0 ? chiefs.map(chief => `${chief.name}`) : '-'
              }</Item>
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
              subject.support_lecturers.map(lecturer => lecturer.user.name).join(", ")
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
  )
}

export default SubjectDescription
