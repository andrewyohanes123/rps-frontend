import { FC, ReactElement, useCallback, useEffect, useState } from "react"
import useModels from "hooks/useModels"
import { useParams } from "react-router-dom";
import useErrorCatcher from "hooks/useErrorCatcher";
import { ClassRoomAttributes, ModelCollectionResult, SemesterAttributes } from "types";
import { Container } from "components/Container";
import { Button, Divider, List, Space, Tooltip, Typography } from "antd";
import AddClassRoom from "./AddClassRoom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const Layout: FC = (): ReactElement => {
  const [classes, setClasses] = useState<ModelCollectionResult<ClassRoomAttributes>>({ rows: [], count: 0 });
  const [classRoom, setClassRoom] = useState<ClassRoomAttributes | undefined>(undefined);
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
        semester={semester?.name ?? ''}
        onCancel={() => {
          toggleModal(false);
          setClassRoom(undefined);
        }}
        visible={modal}
        onOpen={() => toggleModal(true)}
        onSubmit={createClassRoom}
        classRoom={classRoom}
      />
      <List
        bordered
        style={{ marginTop: 8 }}
        dataSource={classes.rows}
        rowKey={classroom => classroom.id.toString()}
        renderItem={item => (
          <List.Item>
            <span>
              <Typography.Text type="secondary">{item.semester.name}&nbsp;</Typography.Text>
              <Typography.Text>
                {item.name}
              </Typography.Text>
            </span>
            <Space split={<Divider type="vertical" />} size={2}>
              <Tooltip title={`Edit ${item.name}`}>
                <Button onClick={() => {
                  toggleModal(true);
                  setClassRoom(item);
                }} size="small" icon={<EditOutlined />} />
              </Tooltip>
              <Tooltip placement="topRight" title={`Hapus ${item.name}?`}>
                <Button size="small" danger type="primary" icon={<DeleteOutlined />} />
              </Tooltip>
            </Space>
          </List.Item>
        )}
        pagination={{ current: page, onChange: setPage, pageSize: limit, total: classes.count }}
      />
    </Container>
  )
}

export default Layout
