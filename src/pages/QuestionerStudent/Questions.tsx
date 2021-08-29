import { FC, ReactElement, useMemo } from "react"
import { Form, Radio } from "antd"
import { QuestionerAttributes } from "types";

interface props {
  questions: QuestionerAttributes[];
}

const { Item, List } = Form;

const Questions: FC<props> = ({ questions }): ReactElement => {
  const memoizedQuestions: QuestionerAttributes[] = useMemo<QuestionerAttributes[]>((): QuestionerAttributes[] => (questions), [questions]);

  // const addFormList = useCallback((add: (defaultValue?: any, index?: number) => void) => {
  //   memoizedQuestions.forEach((question, index: number) => {
  //     add(undefined, index);
  //   });
  // }, [memoizedQuestions]);

  return (
    <List name="questions">
      {(fields) => {
        // addFormList(add);
        return (memoizedQuestions.map((field, index) => (
          // @ts-ignore
          <Item key={field.id} name={[index, "question"]} rules={[{ required: true, message: 'Pilih jawaban' }]} label={memoizedQuestions[index].question}>
            <Radio.Group buttonStyle="solid" optionType="button">
              <Radio.Button value={{id: field.id, answer: "Sangat Tidak Setuju"}}>Sangat Tidak Setuju</Radio.Button>
              <Radio.Button value={{id: field.id, answer: "Tidak Setuju"}}>Tidak Setuju</Radio.Button>
              <Radio.Button value={{id: field.id, answer: "Ragu - ragu"}}>Ragu - ragu</Radio.Button>
              <Radio.Button value={{id: field.id, answer: "Setuju"}}>Setuju</Radio.Button>
              <Radio.Button value={{id: field.id, answer: "Sangat Setuju"}}>Sangat Setuju</Radio.Button>
            </Radio.Group>
          </Item>
        )))
      }}
    </List>
  )
}

export default Questions
