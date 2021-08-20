import { FC, ReactElement } from "react"
import { Typography } from "antd"
import { Container } from "components/Container"
import useAuth from "hooks/useAuth"

const Layout: FC = (): ReactElement => {
  const { user } = useAuth();
  return (
    <Container>
      <Typography.Title level={4}>Selamat Datang, {user.name}!</Typography.Title>
    </Container>
  )
}

export default Layout
