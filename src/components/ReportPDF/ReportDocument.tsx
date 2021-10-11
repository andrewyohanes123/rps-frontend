import { FC, ReactElement } from "react"
import { PDFViewer, Document, Page, Font } from "@react-pdf/renderer"
import Header from './Header'
import { ReportAttributes, SubjectAttributes } from "types";
import SubHeader from "./SubHeader";
import ReportBody from "./ReportBody";
import font from 'fonts/times.ttf'
import fontBold from 'fonts/timesbd.ttf'
import Footer from "./Footer";
import emojiFont from 'fonts/seguiemj.ttf'

interface props {
  subject: SubjectAttributes;
  reports: ReportAttributes[];
}

const height = window.innerHeight / 100 * 80;

Font.register({
  family: 'Times',
  fonts: [
    {
      src: font,
      fontWeight: 'normal'
    },
    {
      src: fontBold,
      fontWeight: 'bold',
    },
    // {
    //   src: require('fonts/timesbi.ttf'),
    //   fontStyle: 'italic',
    //   fontWeight: 'bold'
    // },
    // {
    //   src: require('fonts/timesi.ttf'),
    //   fontStyle: 'italic'
    // },
  ]
});

Font.register({
  family: 'Segoe',
  src: emojiFont
})

const ReportDocument: FC<props> = ({ subject, reports }): ReactElement => {

  return (
    <PDFViewer style={{ width: '100%', height }}>
      <Document>
        <Page size="A4" style={{ padding: 12, fontFamily: 'Times' }} >
          <Header />
          <SubHeader subject={subject} />
          <ReportBody reports={reports} />
          <Footer />
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default ReportDocument
