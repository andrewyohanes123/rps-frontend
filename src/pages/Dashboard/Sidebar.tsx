import { FC, ReactElement } from 'react'
import { Menu } from 'antd'
import { BuildOutlined, DashboardOutlined, FormOutlined, ScheduleOutlined, UserOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd/lib/menu'
import { useRouteMatch } from 'react-router-dom'
import useAuth from 'hooks/useAuth'

export interface SidebarProps extends MenuProps {
}

const Sidebar: FC<SidebarProps> = (props): ReactElement => {
  const { path } = useRouteMatch();
  const { user } = useAuth();

  return (
    <Menu {...props} style={{ marginTop: 10, height: 'calc(100% - 106px)' }} mode="inline">
      <Menu.Item key={`${path}`} icon={<DashboardOutlined />}>Menu Utama</Menu.Item>
      {['lecturer', 'chief'].includes(`${user.type}`) &&
        <Menu.Item key={`${path}/jadwal`} icon={<ScheduleOutlined />}>Jadwal</Menu.Item>
      }
      {user.type === 'administrator' &&
        <Menu.ItemGroup title="Data Master" >
          {/* <Menu.Item key={`${path}/jadwal`} icon={<ScheduleOutlined />}>Jadwal</Menu.Item> */}
          <Menu.Item key={`${path}/semester`} icon={<BuildOutlined />}>Semester</Menu.Item>
          {false && <Menu.Item key={`${path}/kuesioner`} icon={<FormOutlined />}>Kuesioner</Menu.Item>}
        </Menu.ItemGroup>}
      {user.type === 'administrator' &&
        <Menu.ItemGroup title="Pengguna">
          <Menu.Item key={`${path}/pengguna`} icon={<UserOutlined />} >Pengguna</Menu.Item>
        </Menu.ItemGroup>
      }
    </Menu>
  )
}

export default Sidebar
