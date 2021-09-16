import { FC, ReactElement, useCallback, useState } from "react"
import { Drawer, Form, Input, InputNumber, Button, Row, Col } from 'antd'
import { addDataModal } from 'types'

export type scheduleType = {
  week_count: number;
  capabilities: string;
  study_material: string;
  study_method: string;
  indicator: string;
  scoring_format_criteria: string;
  description: string;
  value: number;
}

interface props extends addDataModal {
  onSubmit: (value: scheduleType, cb: () => void) => void;
}

const { Item, useForm } = Form;

const initialValues: scheduleType = {
  week_count: 1,
  value: 1,
  capabilities: '',
  description: '',
  indicator: '',
  scoring_format_criteria: '',
  study_material: '',
  study_method: ''
}

const AddPlan: FC<props> = ({ visible, onCancel, onOpen, onSubmit }): ReactElement => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState<boolean>(false);

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['week_count', 'value', 'capabilities', 'study_material', 'study_method', 'indicator', 'scoring_format_criteria', 'description']);
  }, [form]);

  const onFinish = useCallback((val: scheduleType) => {
    onSubmit(val, clearForm);
  }, [clearForm, onSubmit]);

  return (
    <>
      <Button style={{ marginTop: 12 }} onClick={onOpen}>Tambah Pertemuan</Button>
      <Drawer placement="top" height="100%" style={{ position: 'absolute' }} getContainer={false} visible={visible} onClose={onCancel} title="Tambah Pertemuan">
        <Form initialValues={initialValues} onFinish={onFinish} form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Item name="week_count" label="Jumlah minggu" rules={[{ required: true, message: 'Masukkan jumlah minggu' }]}>
                <InputNumber disabled={loading} placeholder="Jumlah minggu" min={1} defaultValue={1} />
              </Item>
              <Item name="value" label="Bobot" rules={[{ required: true, message: 'Masukkan bobot' }]}>
                <InputNumber disabled={loading} placeholder="Bobot" min={1} defaultValue={1} />
              </Item>
              <Item name="capabilities" label="Kemampuan akhir yang diharapkan" rules={[{ required: true, message: 'Masukkan kemampuan akhir yang diharapkan' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Kemampuan akhir yang diharapkan" />
              </Item>
              <Item name="study_material" label="Bahan kajian" rules={[{ required: true, message: 'Masukkan bahan kajian' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Bahan kajian" />
              </Item>
              <Item name="study_method" label="Metode pembelajaran dan estimasi waktu" rules={[{ required: true, message: 'masukkan metode pembelajaran dan estimasi waktu' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Metode pembelajaran dan estimasi waktu" />
              </Item>
            </Col>
            <Col md={12}>
              <Item name="indicator" label="Indikator" rules={[{ required: true, message: 'masukkan indikator' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Indikator" />
              </Item>
              <Item name="scoring_format_criteria" label="Kriteria dan bentuk penilaian" rules={[{ required: true, message: 'masukkan kriteria dan bentuk penilaian' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Kriteria dan bentuk penilaian" />
              </Item>
              <Item name="description" label="Deskripsi tugas" rules={[{ required: true, message: 'masukkan deskripsi tugas' }]}>
                <Input.TextArea disabled={loading} rows={5} placeholder="Deskripsi tugas" />
              </Item>
            </Col>
          </Row>
          <Item>
            <Button block type="primary" loading={loading} htmlType="submit">Simpan</Button>
          </Item>
        </Form>
      </Drawer>
    </>
  )
}

export default AddPlan;
