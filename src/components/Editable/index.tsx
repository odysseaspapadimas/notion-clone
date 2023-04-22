import { useClickOutside } from "@mantine/hooks";
import { FormEvent, useRef, } from "react";
import { monsterrat } from "src/pages/_app";
import { api } from "src/utils/api";

type Props = {
    text: string | null;
    type: "title" | "property" | "block"
    id: string;
}
const Editable = ({ text, type, id }: Props) => {
    const ctx = api.useContext();
    const editTitle = api.page.editTitle.useMutation({
        onSuccess: () => {
            ctx.page.get.invalidate();
        }
    });
    const editProperty = api.page.editProperty.useMutation({
        onSuccess: () => {
            ctx.page.get.invalidate();
        }
    });

    const editBlock = api.page.editBlock.useMutation({
        onSuccess: () => {
            ctx.page.get.invalidate();
        }
    });

    const handleMutations = (e?: FormEvent) => {
        e?.preventDefault();
        if (type === "title") {
            editTitle.mutate({ id, title: ref.current.value })
        } else if (type === "property") {
            editProperty.mutate({ id, content: ref.current.value })
        } else if (type === "block") {
            editBlock.mutate({ id, content: ref.current.value })
        }

        fakeRef.current?.focus();
    }

    const fakeRef = useRef<HTMLSpanElement>(null);

    const ref = useClickOutside(handleMutations);

    return (
        <>
            <form onSubmit={handleMutations}>
                <input ref={ref} style={monsterrat.style} className={`bg-transparent outline-none ${type === "title" ? "text-[2em]" : null}`} defaultValue={text ?? ""} placeholder={!text ? type === "title" ? "Untitled" : "Empty" : undefined} />
            </form>
            <span ref={fakeRef}></span>
        </>
    )
}
export default Editable