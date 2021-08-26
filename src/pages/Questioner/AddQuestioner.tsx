import { FC, ReactElement, useCallback, useState, useEffect, useMemo } from "react"
import { Button, Modal, Form, Input } from "antd"
import { addDataModal, QuestionerAttributes } from "types"

export type questionerForm = {
  question: string;
}

interface props extends addDataModal {
  onSubmit: (val: questionerForm, cb: () => void) => void;
  question?: QuestionerAttributes;
}

const { useForm, Item } = Form;

const AddQuestioner: FC<props> = ({ visible, onCancel, onOpen, onSubmit, question }): ReactElement => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState<boolean>(false);

  const isEdit: boolean = useMemo<boolean>(() => (typeof question !== 'undefined'), [question])

  const clearForm = useCallback(() => {
    form.resetFields(['question']);
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val: questionerForm) => {
    onSubmit(val, clearForm);
  }, [clearForm, onSubmit]);

  useEffect(() => {
    isEdit && form.setFieldsValue({ question: question!.question });
  }, [form, question, isEdit, clearForm]);

  return (
    <>
      <Button onClick={onOpen}>Tambah Kuesioner</Button>
      <Modal afterClose={clearForm} destroyOnClose={true} visible={visible} title={isEdit ? `Edit Pertanyaan` : "Tambah Kuesioner"} footer={null} onCancel={onCancel}>
        <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
          <Item rules={[{ required: true, message: 'Masukkan pertanyaan' }]} label="Pertanyaan" name="question">
            <Input.TextArea disabled={loading} placeholder="Masukkan pertanyaan" rows={6} />
          </Item>
          {isEdit ?
            <Item>
              <Button htmlType="submit" loading={loading} type="primary">Simpan</Button>
            </Item>
            :
            <Item>
              <Button htmlType="submit" loading={loading} type="primary">Tambah</Button>
            </Item>
          }
        </Form>
      </Modal>
    </>
  )
}

export default AddQuestioner
