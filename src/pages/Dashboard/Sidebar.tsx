import { FC, ReactElement } from 'react'
import { Menu } from 'antd'
import { BuildOutlined, ClusterOutlined, DashboardOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd/lib/menu'
import { useRouteMatch } from 'react-router-dom'

export interface SidebarProps extends MenuProps {
}

const Sidebar: FC<SidebarProps> = (props): ReactElement => {
  const { path } = useRouteMatch();
  return (
    <Menu {...props} style={{ marginTop: 10, height: 'calc(100% - 106px)' }} mode="inline">
      <Menu.Item key={`${path}`} icon={<DashboardOutlined />}>Menu Utama</Menu.Item>      
      <Menu.ItemGroup title="Data Master" >
        <Menu.Item key={`${path}/Jadwal`} icon={<ClusterOutlined />}>Jadwal</Menu.Item>
        <Menu.Item key={`${path}/semester`} icon={<BuildOutlined />}>Semester</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )
}

export default Sidebar
