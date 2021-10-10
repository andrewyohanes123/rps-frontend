import { FC, ReactElement } from "react"
import { StyleSheet, View, Text, Image } from "@react-pdf/renderer"
import poli from 'assets/poli.png'
import logoQ from 'assets/logo-q.jpg'

const Header: FC = (): ReactElement => {
  return (
    <View style={{ flex: 0, flexDirection: 'column', }}>
      <View style={styles.head}>
        <View style={styles.logoPoli}>
          <Image src={poli} style={styles.logo} />
        </View>
        <View style={styles.headTextContainer}>
          <Text style={styles.headText}>Politeknik Negeri Manado</Text>
        </View>
        <View style={styles.logoPoli}>
          <Image src={logoQ} style={{ width: 56, height: 48, marginTop: 6 }} />
        </View>
      </View>
      <View style={[styles.head, {backgroundColor: '#777', fontSize: 12}]}>
        <View style={styles.subHeadTextContainer}>
          <Text>FORMULIR</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text>FM-072 ed.A rev.1</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text>ISSUE: A</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text>Issued: 31-01-2007</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text>UPDATE: 1</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text>Updated: 07-01-2017</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: '#dbdbdb',
    flex: 0,
    padding: 8,
    flexDirection: 'row',
  },
  logoPoli: {
    flex: 0,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headText: {
    textAlign: 'left',
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  subHeadTextContainer: {
    display: 'flex',
    flex: 0,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  }
})

export default Header
