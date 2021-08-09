import { FC, ReactElement, useMemo } from 'react'
import { Button, Dropdown, Menu, } from 'antd'
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import useAuth from 'hooks/useAuth'


const UserMenu: FC = (): ReactElement => {
  const { user } = useAuth();
  const menu = useMemo(() => (
    <Menu>
      <Menu.Item key="change_password" icon={<LockOutlined />}>Ubah Password</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
    </Menu>
  ), [])
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="link" icon={<UserOutlined />}>{user.name}</Button>
    </Dropdown>
  )
}

export default UserMenu
