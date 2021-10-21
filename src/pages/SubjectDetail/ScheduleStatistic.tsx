import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import { Row, Col, Statistic, Card, Divider } from 'antd'
import { parse } from 'query-string'
import { useParams, useLocation } from "react-router-dom";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

const ScheduleStatistic: FC = (): ReactElement => {
  const [checkedSchedule, setCheckedSchedule] = useState<number>(2);
  const [totalSchedule, setTotalSchedule] = useState<number>(2);
  const [uncheckedSchedule, setUncheckedSchedule] = useState<number>(2);
  const { subject_id } = useParams<{ id: string, subject_id: string }>();
  const { search } = useLocation();
  const { models: { Schedule, Report } } = useModels();
  const { kelas } = useMemo(() => parse(search), [search]);
  const { errorCatch } = useErrorCatcher();

  const getSchedules = useCallback(() => {
    Schedule.collection({
      attributes: ['id', 'week_count'],
      where: {
        subject_id
      }
    }).then(resp => {
      console.log(resp)
      const total: number = resp.rows.map(row => (row.week_count)).reduce((a, b) => (a + b));
      setTotalSchedule(total);
    }).catch(errorCatch);
  }, [Schedule, subject_id, errorCatch]);

  const getCheckedSchedule = useCallback(() => {
    Report.collection({
      attributes: ['schedule_id', 'class_room_id', 'check'],
      where: {
        class_room_id: kelas,
        check: true,
      },
      include: [{
        model: 'Schedule',
        attributes: ['subject_id', 'week_count'],
        where: {
          subject_id
        }
      }]
    }).then(resp => {
      const checkedReports: number = resp.rows.length;
      const checked: number = checkedReports <= 1 ? checkedReports : resp.rows.map(row => row.schedule.week_count).reduce((a: number, b: number) => (a + b));
      setCheckedSchedule(checked);
    }).catch(errorCatch);
  }, [Report, subject_id, kelas, errorCatch]);

  const getUncheckedSchedule = useCallback(() => {
    Report.collection({
      attributes: ['schedule_id', 'class_room_id', 'check'],
      where: {
        class_room_id: kelas,
        check: false
      },
      include: [{
        model: 'Schedule',
        attributes: ['subject_id', 'week_count'],
        where: {
          subject_id
        }
      }]
    }).then(resp => {
      const uncheckedReports: number = resp.rows.length;
      const unchecked: number = uncheckedReports <= 1 ? uncheckedReports : resp.rows.map(row => row.schedule.week_count).reduce((a: number, b: number) => (a + b));
      setUncheckedSchedule(unchecked);
    }).catch(errorCatch);
  }, [Report, subject_id, kelas, errorCatch]);

  useEffect(() => {
    getSchedules();
    getCheckedSchedule();
    getUncheckedSchedule();
  }, [getSchedules, getUncheckedSchedule, getCheckedSchedule]);

  const checkedSchedulePercentage: number = useMemo<number>(() => ((checkedSchedule / totalSchedule) * 100), [checkedSchedule, totalSchedule]);
  const uncheckedSchedulePercentage: number = useMemo<number>(() => ((uncheckedSchedule / totalSchedule) * 100), [uncheckedSchedule, totalSchedule]);

  return (
    <div>
      {/* <Divider /> */}
      <Row gutter={[8, 8]}>
        <Col md={6}>
          <Card>
            <Statistic title="Persentasi Kesesuaian" suffix={`%`} value={checkedSchedulePercentage} />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Statistic title="Persentasi Tidaksesuaian" suffix={`%`} value={uncheckedSchedulePercentage} />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Statistic title="Jumlah Kesesuaian" suffix={`/ ${totalSchedule - 2}`} value={checkedSchedule} />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Statistic title="Jumlah Tidaksesuaian" suffix={`/ ${totalSchedule - 2}`} value={uncheckedSchedule} />
          </Card>
        </Col>
      </Row>
      <Divider />
    </div>
  )
}

export default ScheduleStatistic
