import { FC, ReactElement } from "react"
import { View, Text } from "@react-pdf/renderer"
import { SubjectAttributes } from "types"

interface props {
  subject: SubjectAttributes;
}

const SubHeader: FC<props> = ({subject}): ReactElement => {
  return (
    <View style={{ paddingVertical: 6, fontSize: 11.5, fontFamily: 'Times-Roman' }}>
      <View style={{marginVertical: 5}}>
        <Text>MATA KULIAH : {subject.name}</Text>
      </View>
      <View style={{marginVertical: 5}}>
        <Text>DOSEN PENGAJAR : {subject.Creator.name}</Text>
      </View>
    </View>
  )
}

export default SubHeader
