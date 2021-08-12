import { FC, ReactElement, useCallback, useState } from "react"
import { Button, Modal, Select, Input, Form, DatePicker } from "antd"
import { addDataModal } from "types"
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

export type scheduleForm = {
  name: string;
  day_name: string;
  hour: moment.Moment;
  type: "Praktek" | "Teori";
}

interface props extends addDataModal {
  onSubmit: (val: scheduleForm, cb: () => void) => void;
}

const { useForm, Item } = Form;

const dayNames: string[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const AddSchedules: FC<props> = ({ onCancel, onOpen, visible, onSubmit }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [form] = useForm();

  const clearForm = useCallback(() => {
    toggleLoading(false);
    onCancel();
    form.resetFields(['name', 'day_name', 'hour', 'type']);
  }, [onCancel, form, toggleLoading]);
  
  const onFinish = useCallback((val: scheduleForm) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm])

  return (
    <>
      <Button onClick={onOpen}>Tambah Jadwal</Button>
      <Modal visible={visible} onCancel={onCancel} title="Tambah Jadwal" footer={null}>
        <Form onFinish={loading ? undefined : onFinish} layout="vertical" form={form}>
          <Item name="name" label="Mata kuliah" rules={[{ required: true, message: 'Masukkan nama mata kuliah' }]} >
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Mata kuliah" />
          </Item>
          <Item name="type" label="Jenis mata kuliah" rules={[{ required: true, message: 'Pilih jenis mata kuliah' }]} >
            <Select loading={loading} placeholder="Pilih jenis mata kuliah">
              <Select.Option value="Teori">Teori</Select.Option>
              <Select.Option value="Praktek">Praktek</Select.Option>
            </Select>
          </Item>
          <Item label="Masukkan hari" name="day_name" rules={[{ required: true, message: 'Pilih hari mata kuliah' }]}>
            <Select loading={loading} placeholder="Pilih hari mata kuliah">
              {
                dayNames.map(day => (
                  <Select.Option value={`${day}`} key={`${day}`}>{day}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item name="hour" rules={[{ required: true, message: 'Pilih jam mata kuliah' }]} label="Masukkan jam">
            <DatePicker.TimePicker inputReadOnly placeholder="Pilih jam mata kuliah" />
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit">Tambah jadwal</Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddSchedules
