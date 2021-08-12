import { FC, ReactElement } from 'react'
import { Breadcrumb, Layout, PageHeader } from 'antd';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Sidebar from './Sidebar';
import { DashboardOutlined } from '@ant-design/icons';
import UserMenu from './UserMenu';
import ContentRoutes from './ContentRoutes';

const { Sider, Content } = Layout;

const Dashboard: FC = (): ReactElement => {
  document.title = "Dashboard";

  const { push } = useHistory();
  const { pathname } = useLocation();
  const { login } = useAuth();

  return (
    !login ?
      <Redirect to={"/"} />
      :
      <Layout style={{ height: '100%' }}>
        <Sider collapsible theme={'light'} width={230}>
          <div style={{ background: '#2f3640', height: 106 }}></div>
          <Sidebar
            onClick={
              (info) => info.key !== pathname && push(`${info.key}`)
            }
            activeKey={pathname.replace(/\/$/, "")}
            defaultSelectedKeys={[pathname.replace(/\/$/, "")]}
            selectedKeys={[pathname.replace(/\/$/, "")]}
          />
        </Sider>
        <Layout>
          <PageHeader title={'Dashboard'} extra={<UserMenu />} >
            <Breadcrumb>
              <Breadcrumb.Item>
                <DashboardOutlined />
                <span>Dashboard</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Halaman Utama</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </PageHeader>
          <Content style={{ background: 'white', overflow: 'auto' }}>
            <ContentRoutes />
          </Content>
        </Layout>
      </Layout>
  )
}

export default Dashboard;
