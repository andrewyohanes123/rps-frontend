import { Typography } from "antd"
import { Container } from "components/Container"
import { FC, ReactElement } from "react"

const Header: FC = (): ReactElement => {
  return (
    <Container>
      <Typography.Title style={{ textAlign: 'center' }} level={2}>Selamat Datang di Sistem RPS</Typography.Title>
      <Typography.Text style={{ textAlign: 'center', display: 'block' }} type="secondary" >Silakan Login atau Lihat RPS</Typography.Text>
    </Container>
  )
}

export default Header
