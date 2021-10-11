import { Text, View } from "@react-pdf/renderer"
import { FC, ReactElement } from "react"

const Footer: FC = (): ReactElement => {
  return (
    <View style={{ flex: 2, flexDirection: 'row', fontSize: 11, marginTop: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View style={{ flex: 2, flexDirection: 'column', paddingTop: 8, textTransform: 'uppercase', fontFamily: 'Times' }}>
        <Text>Mengetahui</Text>
        <Text style={{ marginBottom: 60 }}>Ketua Jurusan,</Text>
        <Text style={{ marginBottom: .5, textDecoration: 'underline', fontWeight: 'bold' }}>Olga Engelien Melo, SST, MT</Text>
        <Text style={{ marginBottom: .5, fontWeight: 'normal' }}>NIP. 196410144993032001</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8, fontFamily: 'Times', fontSize: 11.5 }}>
        <Text style={{ textAlign: 'right' }}>Penanggung Jawab Mata Kuliah</Text>
      </View>
    </View>
  )
}

export default Footer
