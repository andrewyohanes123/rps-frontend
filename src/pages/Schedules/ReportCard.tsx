import { FC, ReactElement, useState, useMemo, useCallback } from "react"
import { Button, List, Upload } from 'antd'
import { RcFile } from "antd/lib/upload"
import { ReportAttributes } from "types"
import { FilePdfOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons"
import ReportFileReader from "./ReportFileReader"

interface props {
  reports: ReportAttributes[];
  onUploadReport?: (file: RcFile, cb: () => void) => void;
  loading?: boolean;
}

const ReportCard: FC<props> = ({ reports, onUploadReport, loading }): ReactElement => {
  const [files, setFiles] = useState<RcFile[]>([]);
  const [uploading, toggleUploading] = useState<boolean>(false);
  const memoizedReports: ReportAttributes[] = useMemo(() => (reports), [reports]);

  const beforeUpload = useCallback((file: RcFile) => {
    setFiles([file]);
    return false;
  }, [])

  const cleanUpForm = useCallback(() => {
    toggleUploading(false);
    setFiles([]);
  }, []);

  const onUpload = useCallback(() => {
    toggleUploading(true);
    // @ts-ignore
    onUploadReport(files[0], cleanUpForm);
  }, [onUploadReport, files, cleanUpForm]);


  return (
    <>
      {
        (typeof onUploadReport !== 'undefined' && reports.length === 0) &&
        <>
        <Upload disabled={uploading} fileList={files} beforeUpload={beforeUpload} accept="application/pdf" maxCount={1} multiple={false} >
          <Button icon={<FilePdfOutlined />} >Pilih file laporan</Button>
        </Upload>
        <Button onClick={onUpload} loading={uploading} icon={<UploadOutlined />} >Upload</Button>
        </>
      }
      <List
        dataSource={memoizedReports}
        loading={{ indicator: <LoadingOutlined spin />, spinning: loading, tip: 'Mengambil data laporan' }}
        rowKey={item => `${item.id}`}
        renderItem={item => (
          <ReportFileReader report={item} />
        )}
      />
    </>
  )
}

export default ReportCard
