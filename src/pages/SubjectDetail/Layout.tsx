import { FC, ReactElement } from "react"
import {useParams} from 'react-router-dom'

const Layout: FC = (): ReactElement => {
  const {id, subject_id} = useParams<{id: string; subject_id: string}>();
  return (
    <div>
      id: {id}
      subject_id: {subject_id}
    </div>
  )
}

export default Layout
