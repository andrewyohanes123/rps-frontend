import { FC, ReactElement } from "react"
import { PDFViewer, Document, Page, Font } from "@react-pdf/renderer"
import Header from './Header'
// import timesRegular from '../../fonts/times.ttf'

const height = window.innerHeight / 100 * 80;



const ReportDocument: FC = (): ReactElement => {
  return (
    <PDFViewer style={{ width: '100%', height }}>
      <Document>
        <Page size="A4" style={{padding: 12}} >
          <Header />
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default ReportDocument
