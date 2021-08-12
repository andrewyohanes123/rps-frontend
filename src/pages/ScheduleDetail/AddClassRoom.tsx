import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { Button, Modal, Select, Form } from "antd"
import { addDataModal, ClassRoomAttributes } from "types"
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

interface props extends addDataModal {

}

const { useForm, Item } = Form;

const AddClassRoom: FC<props> = ({ visible, onCancel, onOpen }): ReactElement => {
  const [classes, setClasses] = useState<ClassRoomAttributes[]>([]);
  const [retry, setRetry] = useState<number>(0);
  const [form] = useForm();
  const { models: { ClassRoom } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getClasses = useCallback(() => {
    ClassRoom.collection({
      attributes: ['name', 'semester_id'],
      include: [{
        model: 'Semester',
        attributes: ['name']
      }]
    }).then(resp => {
      setClasses(resp.rows as ClassRoomAttributes[]);
      setRetry(0);
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    })
  }, [ClassRoom, errorCatch]);

  useEffect(() => {
    (retry < 4 && visible) && getClasses();
  }, [visible, retry, getClasses]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Kelas</Button>
      <Modal onCancel={onCancel} title="Tambah Kelas" visible={visible} footer={null}>
        <Form form={form} layout="vertical">
          <Item rules={[{ required: true, message: 'Pilih kelas' }]} label="Pilih kelas" name="class_room_ids">
            <Select allowClear showSearch optionFilterProp="children" optionLabelProp="children" mode="multiple" placeholder="Pilih kelas">
              {classes.map(classroom => (
                <Select.Option key={classroom.id.toString()} value={classroom.id}>{classroom.semester.name} - {classroom.name}</Select.Option>
              ))}
            </Select>
          </Item>
          <Item>
            <Button htmlType="submit">Tambah Kelas</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddClassRoom
