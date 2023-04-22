import { useClickOutside } from "@mantine/hooks";
import { FormEvent, KeyboardEvent, useRef, useState, } from "react";
import { monsterrat } from "src/pages/_app";
import { api } from "src/utils/api";
import { ContentTypeMap } from "../Block";
import { Textarea } from "@mantine/core";

type Props = {
    text: string | null;
    type: keyof ContentTypeMap
    id: string;
}
const EditableBlock = ({ text, type, id }: Props) => {
    const ctx = api.useContext();
    const editBlock = api.page.editBlock.useMutation({
        onSuccess: () => {
            ctx.page.get.invalidate();
        }
    });

    const deleteBlock = api.page.deleteBlock.useMutation({
        onSuccess: () => {
            ctx.page.getBlocks.invalidate();
        }
    });

    const handleMutations = (e?: FormEvent) => {
        e?.preventDefault();

        if (type === "h1" || type === "p") {
            editBlock.mutate({ id, content: { type, text: ref.current.value } })
        }

        fakeRef.current?.focus();
    }

    const fakeRef = useRef<HTMLSpanElement>(null);

    const ref = useClickOutside(handleMutations);

    const [value, setValue] = useState<string | undefined>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        if (e.target.value === "") {
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Backspace" && value === "") {
            console.log("delete")
            deleteBlock.mutate({ id })
        }
    }

    return (
        <>
            <form onSubmit={handleMutations}>
                <Textarea
                    ref={ref}
                    styles={{
                        input: {
                            ...monsterrat.style,
                            fontSize: type === "h1" ? "2em" : "14px"
                        }
                    }}
                    classNames={{
                        input: `w-full h-auto bg-transparent outline-none `
                    }}
                    placeholder={type === "h1" ? "Heading 1" : "\'/\' for commands..."}
                    variant="unstyled"
                    autosize
                    value={value ?? text ?? ""}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </form>
            <span ref={fakeRef}></span>
        </>
    )
}
// {"text": "Hello World", "type": "h1"}
export default EditableBlock