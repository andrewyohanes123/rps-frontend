import { Typography } from "antd"
import { Container } from "components/Container"
import useAuth from "hooks/useAuth"
import { FC, ReactElement } from "react"
import Layout from "./Layout"

const UserMainPage: FC = (): ReactElement => {
  const { user } = useAuth();
  return (
    <Container>
      <Typography.Title level={4}>Selamat Datang, {user?.name}!</Typography.Title>
      <Layout />
    </Container>
  )
}

export default UserMainPage
