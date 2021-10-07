import { FC, ReactElement, useCallback, useState } from "react"
import { Modal, Form, Input, Button } from 'antd'

interface props {
  visible: boolean;
  onSubmit: (val: { note: string }, cb: () => void) => void;
  onCancel: () => void;
}

const { useForm, Item } = Form;

const ReportNote: FC<props> = ({ visible, onSubmit, onCancel }): ReactElement => {
  const [loading, toggeLoading] = useState<boolean>(false);
  const [form] = useForm();

  const resetForm = useCallback(() => {
    toggeLoading(false);
    form.resetFields(['note']);
  }, [form]);

  const onFinish = useCallback((val: { note: string }) => {
    toggeLoading(true);
    onSubmit(val, resetForm)
  }, [resetForm, onSubmit]);

  return (
    <Modal confirmLoading={loading} keyboard={!loading} maskClosable={!loading} visible={visible} onCancel={onCancel} title="Catatan Pertemuan" footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Item label="Catatan" name="note" rules={[{ required: true, message: 'Masukkan catatan' }]}>
          <Input.TextArea rows={10} disabled={loading} placeholder="Catatan" />
        </Item>
        <Item>
          <Button loading={loading} type="primary" htmlType="submit" block>Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
}

export default ReportNote
