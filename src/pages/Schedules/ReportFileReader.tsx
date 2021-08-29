import { FC, ReactElement, useCallback, useState } from "react"
import { Button, Divider, Space, Spin, Typography } from "antd"
import moment from "moment"
import { Document, Page, pdfjs } from 'react-pdf'
import { ReportAttributes } from "types"
import { PlanCardDiv } from "components/PlanCardDiv"
import { baseUrl } from "App"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface props {
  report: ReportAttributes;
}

const ReportFileReader: FC<props> = ({ report }): ReactElement => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const onLoadPdf = useCallback((pdf: any) => {
    setTotalPages(pdf.numPages);
  }, []);

  return (
    <PlanCardDiv>
      <Typography.Title level={5}>Di-upload oleh {report.user.name}</Typography.Title>
      <Typography.Text type="secondary"><small>{moment(report.created_at).format('DD MMMM YYYY')}</small></Typography.Text>
      <Divider />
      <Document
        file={`${baseUrl}/public/files/${report.file}`}
        onLoadSuccess={onLoadPdf}
        onLoadError={e => console.log({ e })}
        renderMode="svg"
        onLoadProgress={() => console.log('loading')}
      >
        <Page loading={<Spin size="large" tip="Loading Halaman" spinning />} pageNumber={page} />
      </Document>
      <Space>
        <Button disabled={page === 1} onClick={() => setPage((page - 1) < 1 ? 1 : page - 1)} >Sebelumnya</Button>
        <Button disabled={page === totalPages} onClick={() => setPage((page + 1) > totalPages ? totalPages : page + 1)} >Selanjutnya</Button>
        <Typography.Text>{page}/{totalPages} halaman</Typography.Text>
      </Space>
    </PlanCardDiv>
  )
}

export default ReportFileReader;
