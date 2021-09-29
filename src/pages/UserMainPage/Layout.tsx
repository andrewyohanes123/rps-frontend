import { FC, ReactElement } from "react"
import { Row, Col, } from "antd"
import MainPageStatistics from "./MainPageStatistics"
import useAuth from "hooks/useAuth"
import { Container } from "components/Container"

const Layout: FC = (): ReactElement => {
  const { user } = useAuth();
  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col md={6}>
          <MainPageStatistics title="Jadwal Kelas" model="ClassRoom" modelOption={{
            include: [
              {
                model: 'Schedule',
                where: {
                  user_id: user?.id
                }
              }
            ]
          }} />
        </Col>
      </Row>
    </Container>
  )
}

export default Layout
