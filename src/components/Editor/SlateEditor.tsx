import { BlockOutlined, BoldOutlined, CodeOutlined, ItalicOutlined, NumberOutlined, UnderlineOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import isHotkey from "is-hotkey";
import { FC, KeyboardEvent, ReactElement, useCallback, useMemo, useState } from "react"
import { Editor, createEditor, Descendant, Transforms, Element as SlateElement } from "slate"
import { withHistory } from "slate-history"
import { Editable, withReact, useSlate, Slate, RenderElementProps, RenderLeafProps } from "slate-react"
import EditorElement from "./EditorElement";
import EditorLeaf from "./EditorLeaf";

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const SlateEditor: FC = (): ReactElement => {
  // @ts-ignore
  const [value, setValue] = useState<Descendant[]>([{ children: [{ text: 'testing testing' }], type: 'paragraph' }]);
  // @ts-ignore
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = useCallback((props: RenderElementProps) => <EditorElement {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <EditorLeaf {...props} />, []);


  const isMarkActive = useCallback((mark: string) => {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks[mark] === true : false
  }, [editor])

  const toggleMark = useCallback((mark: string) => {
    const isActive: boolean = isMarkActive(mark);

    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  }, [editor]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        // @ts-ignore
        const mark = HOTKEYS[hotkey];
        toggleMark(mark);
      }
    }
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Space>
        <Button size="small" icon={<BoldOutlined />} />
        <Button size="small" icon={<ItalicOutlined />} />
        <Button size="small" icon={<UnderlineOutlined />} />
        <Button size="small" icon={<CodeOutlined />} />
        <Button size="small" icon={<BlockOutlined />} />
        <Button size="small" icon={<NumberOutlined />} />
      </Space>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Masukkan deskripsi"
        onKeyDown={onKeyDown}
        style={{height: 400}}
      >
      </Editable>
    </Slate>
  )
}

export default SlateEditor
