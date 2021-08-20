import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { List, Modal } from "antd"
import useModels from "hooks/useModels";
import { addDataModal, PlanAttributes, ScheduleAttributes } from "types"
import useErrorCatcher from "hooks/useErrorCatcher";
import SlateEditor from "components/Editor/SlateEditor";

export interface props extends addDataModal {
  schedule?: ScheduleAttributes;
}

const UploadPlan: FC<props> = ({ visible, onCancel, schedule }): ReactElement => {
  const [plans, setPlans] = useState<PlanAttributes[]>([]);
  const [retry, setRetry] = useState<number>(0);
  const { models: { Plan } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getPlans = useCallback(() => {
    Plan.collection({
      attributes: ['file', 'description'],
      where: {
        schedule_id: schedule?.id
      }
    }).then(resp => {
      setPlans(resp.rows as PlanAttributes[]);
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    })
  }, [schedule, Plan, errorCatch]);

  useEffect(() => {
    (typeof schedule !== 'undefined' && retry < 4) && getPlans();
  }, [getPlans, schedule, retry]);

  return (
    <Modal visible={visible} footer={null} title="Upload RPS" onCancel={onCancel}>
      <SlateEditor />
      <List
        dataSource={plans}
        rowKey={item => `${item.id}`}
        renderItem={item => (
          <List.Item>{item.description.toString()}</List.Item>
        )}
      />
    </Modal>
  )
}

export default UploadPlan
