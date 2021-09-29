import { FC, ReactElement, useState, useCallback, useEffect } from "react"
import { Row, Col, Statistic } from 'antd'
import useModels from "hooks/useModels";

const ScheduleStatistic: FC = (): ReactElement => {
  const [checkedSchedule, setCheckedSchedule] = useState<number>(0);
  const [totalSchedule, setTotalSchedule] = useState<number>(0);
  const [uncheckedSchedule, setUncheckedSchedule] = useState<number>(0);
  const { models: { Schedule } } = useModels();

  const getSchedules = useCallback(() => {
    Schedule.collection({

    })
  }, [Schedule]);

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col>
          <Statistic title="Kesesuaian RPS" suffix={`/ ${16}`} value={checkedSchedule} />
        </Col>
      </Row>
    </div>
  )
}

export default ScheduleStatistic
