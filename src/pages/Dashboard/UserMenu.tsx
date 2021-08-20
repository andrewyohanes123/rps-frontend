import { FC, ReactElement, useCallback, useMemo } from 'react'
import { Button, Dropdown, Menu, message, } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import useAuth from 'hooks/useAuth'
import useErrorCatcher from 'hooks/useErrorCatcher'


const UserMenu: FC = (): ReactElement => {
  const { user, setLogout, auth } = useAuth();
  const { errorCatch } = useErrorCatcher();

  const logout = useCallback(() => {
    auth.remove().then(resp => {
      console.log(resp);
      message.success(`Logout berhasil`);
      setLogout();
    }).catch(errorCatch)
  }, [errorCatch, auth, setLogout]);

  const clickMenu = useCallback((ev: MenuInfo) => {
    if (ev.key === 'logout') logout();
  }, [logout]);

  const menu = useMemo(() => (
    <Menu onClick={clickMenu}>
      <Menu.Item key="change_password" icon={<LockOutlined />}>Ubah Password</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
    </Menu>
  ), [clickMenu]);

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="link" icon={<UserOutlined />}>{user.name}</Button>
    </Dropdown>
  )
}

export default UserMenu
