import { FC, ReactElement } from "react"
import { View } from "@react-pdf/renderer"

const TableRow: FC = ({children}): ReactElement => {
  return (
    <View style={{ flex: 0, flexDirection: 'row', marginTop: -1 }}>
      {children}
    </View>
  )
}

export default TableRow
