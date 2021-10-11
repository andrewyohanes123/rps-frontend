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
      <View style={[styles.head, { backgroundColor: '#777', fontSize: 10, fontWeight: 'bold', padding: 3 }]}>
        <View style={[styles.subHeadTextContainer, {flex: 2}]}>
          <Text style={{ textAlign: 'center' }}>FORMULIR</Text>
        </View>
        <View style={[styles.subHeadTextContainer, { flex: 2 }]}>
          <Text style={{ textAlign: 'center' }}>FM-046 ed.A rev.3</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text style={{ textAlign: 'center' }}>ISSUE: A</Text>
        </View>
        <View style={[styles.subHeadTextContainer, { flex: 2 }]}>
          <Text style={{ textAlign: 'center' }}>Issued: 31-01-2007</Text>
        </View>
        <View style={styles.subHeadTextContainer}>
          <Text style={{ textAlign: 'center' }}>UPDATE: 3</Text>
        </View>
        <View style={[styles.subHeadTextContainer, { flex: 2 }]}>
          <Text style={{ textAlign: 'center' }}>Updated: 22-01-2018</Text>
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
    fontFamily: 'Times',
    textAlign: 'left',
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  subHeadTextContainer: {
    display: 'flex',
    flex: 1,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: 'white'
  }
})

export default Header
