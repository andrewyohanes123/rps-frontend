import { PageHeader, Skeleton } from "antd";
import { Container } from "components/Container";
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { FC, ReactElement, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { ScheduleAttributes } from "types";
import AddClassRoom from "./AddClassRoom";

const Layout: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [retry, setRetry] = useState<number>(0);
  const [schedule, setSchedule] = useState<ScheduleAttributes | undefined>(undefined);
  const [modal, toggleModal] = useState<boolean>(false);
  const { push } = useHistory();
  const { models: { Schedule } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getScheduleDetail = useCallback(() => {
    Schedule.single(parseInt(id)).then(resp => {
      setSchedule(resp as ScheduleAttributes);
      setRetry(0);
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    })
  }, [id, Schedule, errorCatch]);

  useEffect(() => {
    (retry < 4) && getScheduleDetail();
  }, [getScheduleDetail, retry]);

  useEffect(() => {
    if (typeof schedule !== 'undefined') document.title = `Dashboard - ${schedule.name} | Detail Jadwal`
  }, [schedule]);

  return (
    <>
      <PageHeader onBack={() => push(`/dashboard/jadwal`)} title={schedule?.name ?? <Skeleton paragraph={{ rows: 1 }} />} />
      <Container>
        <AddClassRoom onCancel={() => toggleModal(false)} onOpen={() => toggleModal(true)} visible={modal} />
      </Container>
    </>
  )
}

export default Layout
