import Editable from "../Editable";
import EditableBlock from "../Editable/EditableBlock";

type ListType = { id: number, text: string };

export type ContentTypeMap = {
    "h1": string,
    "p": string,
    "list": ListType[]
}
type DefaultProps = {
    id: string
}

type Props = {
    id: string
    type: keyof ContentTypeMap
    content: ContentTypeMap[keyof ContentTypeMap]
}

type BlockProps = Props & {
    id: string,
    type: "h1",
    content: string
} | {
    id: string,
    type: "p",
    content: string
} | {
    id: string,
    type: "list",
    content: ListType[]
}


const Block = ({ id, type, content }: BlockProps) => {
    return (
        <div>
            {type === "h1" && <EditableBlock type="h1" id={id} text={content} />}
            {type === "p" && <EditableBlock type="p" id={id} text={content} />}
            {type === "list" && <ul>
                {content.map((item) => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>}
        </div>
    )
}
export default Block
