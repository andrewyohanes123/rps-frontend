import { FC, ReactElement, useState } from "react"
import { Container } from "components/Container"
import AddSemester from "./AddSemester";

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);

  return (
    <Container>
      <AddSemester visible={modal} onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} />
    </Container>
  )
}

export default Layout
