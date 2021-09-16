import { FC, ReactElement, useCallback, useState, useEffect, useMemo } from "react"
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Button, message, Space, Table, Tooltip, Popconfirm, Divider, PageHeader } from "antd";
import { ModelCollectionResult, SubjectAttributes } from "types"
import { Container } from "components/Container"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined, ScheduleOutlined } from "@ant-design/icons";
import AddSubject, { subjectForm } from "./AddSubject";
import useAuth from "hooks/useAuth";

const Layout: FC = (): ReactElement => {
  const [subjects, setSubjects] = useState<ModelCollectionResult<SubjectAttributes>>({ rows: [], count: 0 });
  const [subject, setSubject] = useState<SubjectAttributes | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [modal, toggleModal] = useState<boolean>(false);
  const { models: { Subject } } = useModels();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { errorCatch } = useErrorCatcher();
  const { push } = useHistory();
  const { pathname } = useLocation();

  document.title = "Dashboard - Mata Kuliah"

  const getSubjects = useCallback(() => {
    const offset = (page - 1) * limit;
    Subject.collection({
      attributes: ['name', 'practice', 'theory', 'code', 'creator_id', 'coordinator_id', 'guide', 'journal', 'software', 'hardware', 'practice_weight', 'theory_weight', 'program_study_achievement', 'subject_achievement', 'subject_cluster'],
      where: {
        semester_id: id,
        ...(user.type === 'lecturer' &&
        {
          $or: [
            {
              coordinator_id: user.id
            },
            {
              creator_id: user.id
            }
          ]
        })
      },
      limit,
      offset,
      include: [
        // @ts-ignore
        { model: 'User', as: 'Coordinator', attributes: ['name'] },
        // @ts-ignore
        { model: 'User', as: 'Creator', attributes: ['name'] },
        {
          model: 'SupportLecturer', attributes: ['user_id', 'subject_id'], include:
            [{
              model: 'User',
              attributes: ['name']
            }]
        }
      ]
    }).then(resp => {
      setSubjects(resp as ModelCollectionResult<SubjectAttributes>);
    }).catch(errorCatch);
  }, [Subject, id, limit, page, errorCatch, user]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  const createSubject = useCallback((val: subjectForm, cb: () => void) => {
    Subject.create({ ...val, semester_id: id }).then(resp => {
      message.success(`Mata kuliah ${resp.name} berhasil ditambah`);
      getSubjects();
      cb();
    }).catch(errorCatch);
  }, [id, errorCatch, Subject, getSubjects]);

  const updateSubject = useCallback((val: subjectForm, cb: () => void) => {
    if (typeof subject !== 'undefined') {
      subject.update({ ...val }).then(resp => {
        message.success(`Data MK ${resp.name} berhasil disimpan`);
        cb();
        toggleModal(false);
        getSubjects();
      }).catch(errorCatch);
    }
  }, [subject, getSubjects, errorCatch]);

  const deleteSubject = useCallback((subject: SubjectAttributes) => {
    subject.delete().then(resp => {
      getSubjects();
      message.success(`Mata kuliah ${resp.name} berhasil dihapus`);
    }).catch(errorCatch);
  }, [errorCatch, getSubjects]);

  const columns: ColumnsType<SubjectAttributes> = useMemo<ColumnsType<SubjectAttributes>>(() => ([
    {
      title: 'Mata Kuliah',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Pembuat RPS',
      key: 'creator',
      render: (row: SubjectAttributes) => (
        row.Creator.name
      )
    },
    {
      title: 'Koordinator MK',
      key: 'coordinator',
      render: (row: SubjectAttributes) => (
        row.coordinator_id === null ? '-' : row.Coordinator.name
      )
    },
    {
      title: 'Jenis Mata Kuliah',
      key: 'type',
      render: (row: SubjectAttributes) => (
        [...(row.practice ? ['Praktek'] : []), ...(row.theory ? ['Teori'] : [])].join(', ')
      )
    },
    {
      title: 'RPS | Edit | Hapus',
      key: 'action',
      render: (row: SubjectAttributes) => (
        <Space split={<Divider type="vertical" />} size={2}>
          <Tooltip title={`RPS ${row.name}`}>
            <Button onClick={() =>
              ['lecturer', 'program_chief'].includes(user.type) ?
                push(`${pathname}/mata-kuliah/${row.id}`)
                :
                push(`${pathname}/${row.id}`)
            } icon={<ScheduleOutlined />} size="small" />
          </Tooltip>
          <Tooltip title={`Edit ${row.name}`}>
            <Button onClick={() => {
              setSubject(row);
              toggleModal(true);
            }} icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip placement="topRight" title={`Hapus ${row.name}?`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus MK ${row.name}?`}
              okText="Hapus"
              cancelText="Batal"
              okType="primary"
              okButtonProps={{ danger: true }}
              placement="topRight"
              onConfirm={() => deleteSubject(row)}
            >
              <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }
  ]), [deleteSubject, pathname, push, user]);

  return (
    <Container>
      {user.type === 'administrator' &&
        <AddSubject
          subject={subject}
          visible={modal}
          onCancel={() => {
            toggleModal(false);
            setSubject(undefined);
          }}
          onOpen={() => toggleModal(true)}
          onSubmit={typeof subject !== 'undefined' ? updateSubject : createSubject}
        />}
      {['lecturer', 'chief'].includes(user.type) &&
        <PageHeader title="Mata Kuliah" onBack={() => push('/dashboard/jadwal')} />
      }
      <Table
        dataSource={subjects.rows}
        columns={columns}
        pagination={{ current: page, onChange: setPage, total: subjects.count, pageSize: limit }}
        bordered
        rowKey={item => `${item.id}`}
        style={{ marginTop: 12 }}
      />
    </Container>
  )
}

export default Layout
