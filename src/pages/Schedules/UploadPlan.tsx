import { FC, ReactElement, useCallback, useState, useEffect, useMemo } from "react"
import { List, Modal, Upload, Button, message, Progress } from "antd"
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload/interface";
import useModels from "hooks/useModels";
import { addDataModal, PlanAttributes, ScheduleAttributes } from "types"
import useErrorCatcher from "hooks/useErrorCatcher";
import { baseUrl } from "App";
import useAuth from "hooks/useAuth";
import PlanCard from "./PlanCard";

export interface props extends addDataModal {
  schedule?: ScheduleAttributes;
}

const UploadPlan: FC<props> = ({ visible, onCancel, schedule }): ReactElement => {
  const [plans, setPlans] = useState<PlanAttributes[]>([]);
  const [files, setFiles] = useState<RcFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [retry, setRetry] = useState<number>(0);
  const { models: { Plan } } = useModels();
  const { user } = useAuth();
  const { errorCatch } = useErrorCatcher();

  const xAccessToken: string = useMemo<string>(() => `${localStorage.getItem('app_accessToken')}`, []);
  const xRefreshToken: string = useMemo<string>(() => `${localStorage.getItem('app_refreshToken')}`, []);

  const getPlans = useCallback(() => {
    Plan.collection({
      attributes: ['file'],
      where: {
        schedule_id: schedule?.id
      },
      include: [{
        model: 'User',
        attributes: ['name']
      }]
    }).then(resp => {
      setPlans(resp.rows as PlanAttributes[]);
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    })
  }, [schedule, Plan, errorCatch]);

  const beforeUpload = useCallback((file: RcFile,) => {
    if (file.type === 'application/pdf') {
      setFiles([file]);
    } else {
      message.error('Masukkan file PDF yang valid!')
    }

    return false;
  }, []);

  useEffect(() => {
    (typeof schedule !== 'undefined' && retry < 4) && getPlans();
  }, [getPlans, schedule, retry]);

  const uploadFile = useCallback(() => {
    const schedule_id: number = schedule?.id ?? 0;
    const formData = new FormData();
    const [file] = files;
    console.log(file, files);
    formData.append('plan', file);
    formData.append('schedule_id', `${schedule_id}`);
    formData.append('user_id', `${user.id}`);
    axios.post(`${baseUrl}/api/plans`, formData, {
      headers: {
        'x-access-token': xAccessToken,
        'x-refresh-token': xRefreshToken,
        'Content-type': 'multipart/form-data'
      },
      onUploadProgress: (progress: ProgressEvent) => (setUploadProgress(Math.round(((progress.loaded / progress.total) * 100))))
    }).then(resp => {
      setUploadProgress(0);
      if ('x-access-token' in resp.headers && 'x-refresh-token' in resp.headers) {
        localStorage.setItem('app_accessToken', resp.headers['x-access-token']);
        localStorage.setItem('app_refreshToken', resp.headers['x-refresh-token']);
      }
      setFiles([]);
      console.log(resp.headers)
      console.log(resp.data);
    }).catch(e => {
      console.log({ e });
    })
  }, [files, xRefreshToken, xAccessToken, schedule, user]);

  return (
    <Modal style={{ top: 15 }} width={1000} visible={visible} footer={null} title="Upload RPS" onCancel={onCancel}>
      {plans.length === 0 && <Upload
        accept="application/pdf"
        multiple={false}
        maxCount={1}
        beforeUpload={beforeUpload}
        fileList={files}
        onRemove={() => setFiles([])}
      >
        <Button loading={uploadProgress > 0} icon={<UploadOutlined />}>Pilih File RPS</Button>
      </Upload>}
      {files.length > 0 && <Button loading={uploadProgress > 0} onClick={uploadFile} type="primary">Upload RPS</Button>}
      {uploadProgress > 0 && <Progress percent={uploadProgress} status="active" />}
      <List
        dataSource={plans}
        rowKey={item => `${item.id}`}
        renderItem={item => (
          <PlanCard plan={item} />
        )}
      />
    </Modal>
  )
}

export default UploadPlan
