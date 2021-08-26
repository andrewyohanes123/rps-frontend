import { FC, ReactElement, useCallback, useMemo } from "react"
import { Form, Radio } from "antd"
import { QuestionerAttributes } from "types";

interface props {
  questions: QuestionerAttributes[];
}

const { Item, List } = Form;

const Questions: FC<props> = ({ questions }): ReactElement => {
  const memoizedQuestions: QuestionerAttributes[] = useMemo<QuestionerAttributes[]>((): QuestionerAttributes[] => (questions), [questions]);

  const addFormList = useCallback((add: (defaultValue?: any, index?: number) => void) => {
    memoizedQuestions.forEach((question, index: number) => {
      add(undefined, index);
    });
  }, [memoizedQuestions]);

  return (
    <List name="questions">
      {(fields, { add }) => {
        addFormList(add);
        return (fields.map((field, index) => (
          <Item key={field.key} name={[index, "question"]} rules={[{ required: true, message: 'Pilih jawaban' }]} label={memoizedQuestions[index].question}>
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
            </Radio.Group>
          </Item>
        )))
      }}
    </List>
  )
}

export default Questions
