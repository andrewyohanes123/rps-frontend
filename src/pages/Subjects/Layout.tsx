import { FC, ReactElement, useCallback, useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom";
import { Button, message, Space, Table, Tooltip } from "antd";
import { ModelCollectionResult, SubjectAttributes } from "types"
import { Container } from "components/Container"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
      attributes: ['name', 'practice', 'theory', 'semester_id'],
      where: {
        semester_id: id,
      },
      limit,
      offset
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

  const columns: ColumnsType<SubjectAttributes> = useMemo<ColumnsType<SubjectAttributes>>(() => ([
    {
      title: 'Mata Kuliah',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Jenis Mata Kuliah',
      key: 'type',
      render: (row: SubjectAttributes) => (
        [...(row.practice ? ['Praktek'] : []), ...(row.theory ? ['Teori'] : [])].join(', ')
      )
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row: SubjectAttributes) => (
        <Space>
          <Tooltip title={`Edit ${row.name}`}>
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title={`Hapus ${row.name}?`}>
            <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
          </Tooltip>
        </Space>
      )
    }
  ]), []);

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
