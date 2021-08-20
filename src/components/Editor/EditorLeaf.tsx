import { FC, ReactElement, useMemo } from "react"
import { RenderLeafProps } from "slate-react"

const EditorLeaf: FC<RenderLeafProps> = ({ leaf, children, attributes }): ReactElement => {
  const renderedChildren = useMemo(() => {
    // @ts-ignore
    if (leaf.bold) {
      return <strong>{children}</strong>
    }

    // @ts-ignore
    if (leaf.code) {
      return <code>{children}</code>
    }

    // @ts-ignore
    if (leaf.italic) {
      return <em>{children}</em>
    }

    // @ts-ignore
    if (leaf.underline) {
      return <u>{children}</u>
    }
  }, [children, leaf]);

  return <span {...attributes}>{renderedChildren}</span>
}

export default EditorLeaf
