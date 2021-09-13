import { FC, ReactElement, useCallback, useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom";
import { Button, message, Space, Table, Tooltip, Popconfirm, Divider } from "antd";
import { ModelCollectionResult, SubjectAttributes } from "types"
import { Container } from "components/Container"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined, ScheduleOutlined } from "@ant-design/icons";
import AddSubject, { subjectForm } from "./AddSubject";

const Layout: FC = (): ReactElement => {
  const [subjects, setSubjects] = useState<ModelCollectionResult<SubjectAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [modal, toggleModal] = useState<boolean>(false);
  const { models: { Subject } } = useModels();
  const { id } = useParams<{ id: string }>();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Mata Kuliah"

  const getSubjects = useCallback(() => {
    const offset = (page - 1) * limit;
    Subject.collection({
      attributes: ['name', 'practice', 'theory', 'semester_id', 'creator_id', 'coordinator_id'],
      where: {
        semester_id: id,
      },
      limit,
      offset,
      include: [
        // @ts-ignore
        { model: 'User', as: 'Coordinator', attributes: ['name'] },
        // @ts-ignore
        { model: 'User', as: 'Creator', attributes: ['name'] },
      ]
    }).then(resp => {
      setSubjects(resp as ModelCollectionResult<SubjectAttributes>);
    }).catch(errorCatch);
  }, [Subject, id, limit, page, errorCatch]);

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
            <Button icon={<ScheduleOutlined />} size="small" />
          </Tooltip>
          <Tooltip title={`Edit ${row.name}`}>
            <Button icon={<EditOutlined />} size="small" />
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
  ]), [deleteSubject]);

  return (
    <Container>
      <AddSubject visible={modal} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} onSubmit={createSubject} />
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
