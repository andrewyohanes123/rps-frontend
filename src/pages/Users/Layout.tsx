import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Container } from "components/Container"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import { ModelCollectionResult, UserAttributes } from "types";
import AddUser, { userForm } from "./AddUser"

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [users, setUsers] = useState<ModelCollectionResult<UserAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const { models: { User } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Pengguna"

  const getUsers = useCallback(() => {
    User.collection({
      attributes: ['username', 'name', 'type'],
    }).then(resp => {
      setUsers(resp as ModelCollectionResult<UserAttributes>);
    }).catch(errorCatch);
  }, [User, errorCatch]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const createUser = useCallback((val: userForm, cb: () => void) => {
    User.create({ ...val }).then(resp => {
      message.success(`Pengguna ${resp.name} berhasil ditambah`);
      getUsers();
      cb();
    }).catch(errorCatch);
  }, [getUsers, User, errorCatch]);

  const deleteUser = useCallback((user: UserAttributes) => {
    user.delete().then(resp => {
      message.success`Pengguna ${resp.name} berhasil dihapus`;
      getUsers();
    }).catch(errorCatch);
  }, [getUsers, errorCatch]);

  const columns: ColumnsType<UserAttributes> = useMemo<ColumnsType<UserAttributes>>(() => ([
    {
      title: 'Nama',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Username',
      key: 'username',
      dataIndex: 'username'
    },
    {
      title: 'Jenis Pengguna',
      key: 'type',
      dataIndex: 'type',
      render: (type: 'lecturer' | 'chief' | 'administrator' | 'chairman') => type === 'chief' ? 'Kepala Program Studi' : type === 'administrator' ? 'Administrator' : type === 'chairman' ? 'Ketua Kelas' : 'Dosen'
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row: UserAttributes) => (<Space>
        <Tooltip title={`Edit  ${row.name}?`}>
          <Button icon={<EditOutlined />} size="small" />
        </Tooltip>
        <Tooltip title={`Hapus ${row.name}?`}>
          <Popconfirm
            title={`Apakah Anda ingin menghapus ${row.name}?`}
            okText="Hapus"
            okType="primary"
            okButtonProps={{ danger: true }}
            cancelText="Batal"
            onConfirm={() => deleteUser(row)}
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
          </Popconfirm>
        </Tooltip>
      </Space>)
    }
  ]), [deleteUser]);

  return (
    <Container>
      <AddUser onSubmit={createUser} visible={modal} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />
      <Table
        columns={columns}
        style={{ marginTop: 12 }}
        pagination={{ current: page, onChange: setPage, pageSize: limit, total: users.count }}
        dataSource={users.rows}
        rowKey={item => item.id.toString()}
        bordered
      />
    </Container>
  )
}

export default Layout
