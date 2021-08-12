import { FC, ReactElement, useCallback, useEffect, useState } from "react"
import useModels from "hooks/useModels"
import { useParams } from "react-router-dom";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ClassRoomAttributes, ModelCollectionResult, SemesterAttributes } from "types";
import { Container } from "components/Container";
import { List, Typography } from "antd";
import AddClassRoom from "./AddClassRoom";

const Layout: FC = (): ReactElement => {
  const [classes, setClasses] = useState<ModelCollectionResult<ClassRoomAttributes>>({ rows: [], count: 0 });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [semester, setSemester] = useState<SemesterAttributes | undefined>(undefined);
  const [modal, toggleModal] = useState<boolean>(false);
  const { models: { Semester, ClassRoom } } = useModels();
  const { id } = useParams<{ id: string }>();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Kelas";

  const getSemesterDetail = useCallback(() => {
    Semester.single(parseInt(id)).then(resp => {
      console.log(resp);
      setSemester(resp as SemesterAttributes);
    }).catch(e => {
      errorCatch(e);
    })
  }, [Semester, id, errorCatch]);

  useEffect(() => {
    getSemesterDetail();
  }, [getSemesterDetail]);

  const getClassRooms = useCallback(() => {
    const offset = (page - 1) * limit;
    ClassRoom.collection({
      offset,
      limit,
      attributes: ['name', 'semester_id'],
      include: [{
        model: 'Semester',
        attributes: ['name']
      }],
      where: {
        semester_id: id
      }
    }).then(resp => {
      setClasses(resp as ModelCollectionResult<ClassRoomAttributes>);
    }).catch(e => {
      errorCatch(e);
    });
  }, [page, limit, ClassRoom, errorCatch, id]);

  useEffect(() => {
    getClassRooms();
  }, [getClassRooms]);

  const createClassRoom = useCallback((val: { name: string }, cb: () => void) => {
    ClassRoom.create({
      ...val,
      semester_id: id
    }).then(resp => {
      console.log(resp);
      cb();
      toggleModal(false);
      getClassRooms();
    }).catch(e => {
      errorCatch(e);
    })
  }, [id, ClassRoom, errorCatch, getClassRooms]);

  return (
    <Container>
      <Typography.Title level={4}>Semester {semester?.name}</Typography.Title>
      <AddClassRoom
        onCancel={() => toggleModal(false)}
        visible={modal}
        onOpen={() => toggleModal(true)}
        onSubmit={createClassRoom}
      />
      <List
        dataSource={classes.rows}
        rowKey={classroom => classroom.id.toString()}
        renderItem={item => (
          <List.Item>
            <Typography.Text>
              {item.name}
            </Typography.Text>
            <Typography.Text type="secondary">Semester {item.semester.name}</Typography.Text>
          </List.Item>
        )}
        pagination={{ current: page, onChange: setPage, pageSize: limit, total: classes.count }}
      />
    </Container>
  )
}

export default Layout