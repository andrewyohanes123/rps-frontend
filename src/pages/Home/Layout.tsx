import { FC, ReactElement } from "react"
import { Button, Divider } from "antd"
import { HomeContainer } from "components/Container"
import { LogoImage } from "components/LogoImage"
import Header from "./Header"
import { FormOutlined, LoginOutlined } from "@ant-design/icons"
import { useHistory } from "react-router-dom"

const Layout: FC = (): ReactElement => {
  const { push } = useHistory();
  document.title = "Sistem RPS"
  return (
    <HomeContainer>
      <LogoImage />
      <Header />
      <Button onClick={() => push('/login')} icon={<LoginOutlined />} type="primary" size="large" block>Login</Button>
      <Divider>atau</Divider>
      <Button onClick={() => push('/kuesioner')} icon={<FormOutlined />} size="large" block>Jawab Kuesioner</Button>
    </HomeContainer>
  )
}

export default Layout
