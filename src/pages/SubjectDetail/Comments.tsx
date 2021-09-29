import { FC, ReactElement, useState, useCallback, useEffect } from "react"
import { Form, Input, Comment, List, Button, Divider, message } from 'antd'
import { CommentAttributes } from "types"
import useAuth from "hooks/useAuth";
import useModels from "hooks/useModels";
import { useParams } from "react-router";
import useErrorCatcher from "hooks/useErrorCatcher";
import { LoadingOutlined } from "@ant-design/icons";

const { useForm, Item } = Form;

const Comments: FC = (): ReactElement => {
  const [comments, setComments] = useState<CommentAttributes[]>([]);
  const [loading, toggleLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { models: { Comment: CommentModel } } = useModels();
  const { subject_id } = useParams<{ subject_id: string }>();
  const { errorCatch } = useErrorCatcher();
  const [form] = useForm();

  const getComments = useCallback(() => {
    toggleLoading(true);
    CommentModel.collection({
      attributes: ['name', 'nim', 'content', 'subject_id'],
      where: {
        subject_id
      }
    }).then(resp => {
      toggleLoading(false);
      setComments(resp.rows as CommentAttributes[]);
    }).catch(errorCatch)
  }, [subject_id, CommentModel, errorCatch]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  const createComment = useCallback((val: any) => {
    CommentModel.create({ ...val, subject_id }).then(resp => {
      message.success(`Komentar ${resp.name} berhasil diupload`);
      getComments();
      form.resetFields(['name', 'nim', 'content'])
    }).catch(errorCatch);
  }, [subject_id, CommentModel, getComments, errorCatch, form]);

  return (
    <div>
      <Divider />
      {user === null &&
        <Form onFinish={createComment} form={form} layout="vertical">
          <Item label="Nama mahasiswa" name="name" rules={[{ required: true, message: 'Masukkan nama mahasiswa' }]}>
            <Input placeholder="Nama mahasiswa" />
          </Item>
          <Item label="NIM" name="nim" rules={[{ required: true, message: 'Masukkan NIM' }]}>
            <Input placeholder="NIM" />
          </Item>
          <Item label="Komentar" name="content" rules={[{ required: true, message: 'Masukkan komentar' }]}>
            <Input.TextArea placeholder="Komentar" />
          </Item>
          <Item><Button htmlType="submit" type="primary" block>Masukkan Komentar</Button></Item>
        </Form>
      }
      <List
      bordered
        dataSource={comments}
        rowKey={item => `${item.id}`}
        loading={{ spinning: loading, indicator: <LoadingOutlined spin />, size: 'large', tip: 'Mengambil data komentar' }}
        renderItem={comment => (
          <Comment
            author={comment.name}
            datetime={comment.nim}
            content={(<p style={{ whiteSpace: 'pre' }}>{comment.content}</p>)}
          />
        )}
        pagination={false}
      >

      </List>
    </div>
  )
}

export default Comments
