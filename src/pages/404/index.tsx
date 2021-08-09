import { Button, Result } from "antd"
import useAuth from "hooks/useAuth"
import { FC, ReactElement } from "react"

const FourOFour: FC = (): ReactElement => {
  const {login} = useAuth();
  return (
    <>
      <Result status="404" title="Ooopppsss... Halaman yang Anda cari tidak ada" extra={
        login ?
        <Button>Kembali ke halaman Dashboard</Button>
        :
        <Button>Kembali ke halaman Login</Button>
      } />
    </>
  )
}

export default FourOFour
