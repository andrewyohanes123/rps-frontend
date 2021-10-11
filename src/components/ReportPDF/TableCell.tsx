import { FC, ReactElement } from "react"
import ReactPDF, { View, Text, } from "@react-pdf/renderer"

interface props {
  text: string;
  flex: number,
  style?: ReactPDF.Style;
}

const TableCell: FC<props> = ({ text, flex, style }): ReactElement => {
  return (
    <View style={{ flex, padding: 5, border: '1px solid black', ...style, borderColor: 'black', borderWidth: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
      <Text style={{textAlign: 'center', fontFamily: 'Times-Roman'}}>{text}</Text>
    </View>
  )
}

export default TableCell
