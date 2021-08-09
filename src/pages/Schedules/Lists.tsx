import { List } from "antd"
import { FC, ReactElement } from "react"
import { ScheduleAttributes } from "types"

interface props {
  data: ScheduleAttributes[];
}

const Lists: FC<props> = ({data}): ReactElement => {
  return (
    <List
    dataSource={data}
    />
  )
}

export default Lists
