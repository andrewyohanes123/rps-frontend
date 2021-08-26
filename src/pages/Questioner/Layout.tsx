import { FC, ReactElement, useState, useCallback, useEffect, useMemo } from "react"
import { List, Button, Tooltip, Space, message } from "antd";
import { Container } from "components/Container"
import AddQuestioner, { questionerForm } from "./AddQuestioner";
import { ModelCollectionResult, QuestionerAttributes } from "types";
import useModels from "hooks/useModels";
import useErrorCatcher from "hooks/useErrorCatcher";
import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";

const Layout: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<ModelCollectionResult<QuestionerAttributes>>({ rows: [], count: 0 });
  const [question, setQuestion] = useState<QuestionerAttributes | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, toggleLoading] = useState<boolean>(true);
  const [retry, setRetry] = useState<number>(0);
  const { models: { Questioner } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getQuestions = useCallback((loading: boolean = false) => {
    toggleLoading(loading);
    const offset: number = (page - 1) * limit;
    Questioner.collection({
      attributes: ['question', 'created_at'],
      limit,
      offset,
    }).then(resp => {
      setRetry(0);
      toggleLoading(false);
      setQuestions(resp as ModelCollectionResult<QuestionerAttributes>)
    }).catch(e => {
      errorCatch(e);
      setRetry(retry => retry + 1);
    })
  }, [errorCatch, Questioner, limit, page]);

  useEffect(() => {
    retry < 4 && getQuestions(true);
  }, [getQuestions, retry]);

  const createQuestion = useCallback((val: questionerForm, cb: () => void) => {
    Questioner.create(val).then(resp => {
      cb();
      message.success(`Pertanyaan berhasil ditambah`);
      getQuestions(false);
      toggleModal(false);
      setPage(1);
      console.log(resp.toJSON());
    }).catch(errorCatch);
  }, [Questioner, errorCatch, getQuestions]);

  useEffect(() => {
    typeof question !== 'undefined' && toggleModal(true);
  }, [question]);

  const onModalCancel = useCallback(() => {
    toggleModal(false);
    setQuestion(undefined);
  }, []);

  const updateQuestion = useCallback((val: questionerForm, cb: () => void) => {
    if (typeof question !== 'undefined') {
      question.update(val).then(resp => {
        cb();
        message.success(`Pertanyaan berhasil diubah`);
        getQuestions(false);
        toggleModal(false);
        console.log(resp.toJSON());
        setPage(1);
      }).catch(errorCatch);
    }
  }, [question, errorCatch, getQuestions]);

  const isEdit: boolean = useMemo<boolean>(() => (typeof question !== 'undefined'), [question]);

  document.title = "Dashboard - Kuesioner"

  return (
    <Container>
      <AddQuestioner question={question} onSubmit={isEdit ? updateQuestion : createQuestion} visible={modal} onCancel={onModalCancel} onOpen={() => toggleModal(true)} />
      <List
        dataSource={questions.rows}
        loading={{ indicator: <LoadingOutlined spin />, spinning: loading, size: 'large', tip: 'Memuat pertanyaan' }}
        rowKey={item => `${item.id}${item.created_at}`}
        renderItem={item => (
          <List.Item>
            <span style={{ whiteSpace: 'pre-line' }}>{item.question}</span>
            <span>
              <Space>
                <Tooltip title={`Edit pertanyaan`}>
                  <Button onClick={() => setQuestion(item)} icon={<EditOutlined />} size="small" />
                </Tooltip>
                <Tooltip title={`Hapus pertanyaan`}>
                  <Button icon={<DeleteOutlined />} size="small" danger type="primary" />
                </Tooltip>
              </Space>
            </span>
          </List.Item>
        )}
        style={{ marginTop: 8 }}
        bordered
        pagination={{
          current: page,
          onChange: setPage,
          onShowSizeChange: (current, size) => setLimit(size),
          pageSize: limit,
          total: questions.count,
          showSizeChanger: true,
          // position: 'both',
          // showTitle: true,
        }}
      />
    </Container>
  )
}

export default Layout
