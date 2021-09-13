import { FC, ReactElement, useCallback, useState, useEffect } from "react"
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Switch, Row, Col, Select, InputNumber } from "antd"
import { addDataModal, UserAttributes } from "types"
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";

interface props extends addDataModal {
  onSubmit: (val: subjectForm, cb: () => void) => void;
}

export type subjectForm = {
  name: string;
  practice?: boolean;
  theory?: boolean;
  subject_weight: number;
}

const initialValues: subjectForm = {
  name: '',
  practice: false,
  theory: true,
  subject_weight: 0
};

const { useForm, Item } = Form;

const AddSubject: FC<props> = ({ visible, onCancel, onOpen, onSubmit }): ReactElement => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [practice, togglePractice] = useState<boolean>(false);
  const { models: { User } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['name', 'practice', 'theory', 'code', 'creator_id', 'coordinator_id', 'guide', 'journal', 'software', 'hardware', 'practice_weight', 'theory_weight']);
    onCancel();
  }, [form, onCancel]);

  const onFinish = useCallback((val: subjectForm) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  const getUsers = useCallback(() => {
    User.collection({
      attributes: ['name', 'type'],
      where: {
        type: 'lecturer',
      }
    }).then(resp => {
      setUsers(resp.rows as UserAttributes[]);
    }).catch(errorCatch);
  }, [User, errorCatch]);

  useEffect(() => {
    visible && getUsers();
  }, [visible, getUsers]);

  const handleDrawerClose = useCallback((visible: boolean) => {
    !visible && clearForm();
  }, [clearForm]);

  const onValuesChange = useCallback((changedValue: any, values: subjectForm) => {
    togglePractice(values.practice ?? false);
  }, []);

  return (
    <>
      <Button onClick={onOpen}>Tambah Mata Kuliah</Button>
      <Drawer
        getContainer={false}
        onClose={onCancel}
        afterVisibleChange={handleDrawerClose}
        height={'85%'}
        style={{ position: 'absolute' }}
        placement="top"
        visible={visible}
        title='Tambah Mata Kuliah'
        footer={null}
      >
        <Form onValuesChange={onValuesChange} initialValues={initialValues} onFinish={onFinish} form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Item label="Pembuat RPS" name="creator_id" rules={[{ required: true, message: 'Pilih pembuat RPS' }]}>
                <Select allowClear showSearch placeholder="Pembuat RPS" optionFilterProp="children">
                  {
                    users.map(user => (
                      <Select.Option value={user.id} key={`${user.id}${user.name}`}>{user.name}</Select.Option>
                    ))
                  }
                </Select>
              </Item>
              <Item label="Koodinator MK" name="coordinator_id" rules={[{ required: false, message: 'Pilih koordinator MK' }]}>
                <Select allowClear showSearch placeholder="Koordinator MK" optionFilterProp="children">
                  {
                    users.map(user => (
                      <Select.Option value={user.id} key={`${user.id}${user.name}`}>{user.name}</Select.Option>
                    ))
                  }
                </Select>
              </Item>
              <Item label="Kode Mata Kuliah" name="code" rules={[{ required: true, message: 'Masukkan kode mata kuliah' }]}>
                <Input prefix={loading && <LoadingOutlined spin />} placeholder="Kode Mata Kuliah" />
              </Item>
              <Item label="Mata Kuliah" name="name" rules={[{ required: true, message: 'Masukkan nama mata kuliah' }]}>
                <Input prefix={loading && <LoadingOutlined spin />} placeholder="Mata Kuliah" />
              </Item>
              <Row gutter={12}>
                <Col md={12}>
                  <Item label="Teori" name="theory" rules={[{ required: false, message: 'Pilih ' }]}>
                    <Switch defaultChecked />
                  </Item>
                  <Item label="Bobot Mata Kuliah Teori" name="theory_weight" rules={[{ required: true, message: 'Masukkan bobot mata kuliah' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Bobot Mata Kuliah Teori" />
                  </Item>
                </Col>
                <Col md={12}>
                  <Item label="Praktek" name="practice" rules={[{ required: false, message: 'Pilih ' }]}>
                    <Switch />
                  </Item>
                  {practice && <Item label="Bobot Mata Kuliah Praktek" name="practice_weight" rules={[{ required: true, message: 'Masukkan bobot mata kuliah' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Bobot Mata Kuliah Praktek" />
                  </Item>}
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Item name="subject_cluster" rules={[{ required: true, message: 'Masukkan rumpun MK' }]} label="Rumpun MK">
                <Input.TextArea placeholder="Rumpun Mata Kuliah" rows={3} />
              </Item>
              <Item name="guide" rules={[{ required: true, message: 'Masukkan pedoman mata kuliah' }]} label="Pedoman">
                <Input.TextArea placeholder="Pedoman Mata Kuliah" rows={3} />
              </Item>
              <Item name="journal" rules={[{ required: true, message: 'Masukkan jurnal mata kuliah' }]} label="Jurnal">
                <Input.TextArea placeholder="Jurnal Mata Kuliah" rows={3} />
              </Item>
              <Item name="software" rules={[{ required: false, message: 'Masukkan software yang dipakai di mata kuliah' }]} label="Software">
                <Input.TextArea placeholder="Software" rows={3} />
              </Item>
              <Item name="hardware" rules={[{ required: false, message: 'Masukkan hardware yang dipakai di mata kuliah' }]} label="Hardware">
                <Input.TextArea placeholder="Hardware" rows={3} />
              </Item>
            </Col>
          </Row>
          <Item>
            <Button block type="primary" loading={loading} htmlType="submit">Tambah</Button>
          </Item>
        </Form>
      </Drawer>
    </>
  )
}

export default AddSubject
