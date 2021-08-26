import { FC, ReactElement } from "react"
import { Button, Divider } from "antd"
import { HomeContainer } from "components/Container"
import { LogoImage } from "components/LogoImage"
import Header from "./Header"
import { FormOutlined, LoginOutlined } from "@ant-design/icons"

const Layout: FC = (): ReactElement => {
  document.title = "Sistem RPS"
  return (
    <HomeContainer>
      <LogoImage />
      <Header />
      <Button icon={<LoginOutlined />} type="primary" size="large" block>Login</Button>
      <Divider>atau</Divider>
      <Button icon={<FormOutlined />} size="large" block>Jawab Kuesioner</Button>
    </HomeContainer>
  )
}

export default Layout
