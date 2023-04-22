import { Box, Button } from "@mantine/core"
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks"
import { api } from "src/utils/api"
import { ContentTypeMap } from "../Block";
import { BlockType } from "@prisma/client";

type Props = {
    pageId: string;
    contextMenu: { x: number, y: number } | null
    setContextMenu: (value: { x: number, y: number } | null) => void
}
const AddBlock = ({ pageId, contextMenu, setContextMenu }: Props) => {

    const ctx = api.useContext();
    const addBlock = api.page.addBlock.useMutation({
        onSuccess: () => {
            ctx.page.getBlocks.invalidate()
        }
    })

    const handleAddBlock = async (type: BlockType) => {
        await addBlock.mutateAsync({ pageId, type, content: { "text": "", "type": type.toLowerCase() } })
        setContextMenu(null)
    }

    return (
        contextMenu &&
        <Box
            className="absolute py-2 px-1 rounded-md border border-gray-600"
            style={{ left: contextMenu.x, top: contextMenu.y }} sx={(theme) => ({
                backgroundColor: theme.colors.dark[6],
            })}
        >
            <div className="flex flex-col items-start space-y-1">
                <MenuItem onClick={handleAddBlock} type="H1">Heading 1</MenuItem>
                <MenuItem onClick={handleAddBlock} type="H2">Heading 2</MenuItem>
                <MenuItem onClick={handleAddBlock} type="P">Text</MenuItem>
                <div></div>
            </div>
        </Box>

    )
}
export default AddBlock

const MenuItem = ({ children, onClick, type }: { children: React.ReactNode, onClick: (type: BlockType) => Promise<void>, type: BlockType }) => (
    <Button onClick={() => onClick(type)} fullWidth styles={(theme) => ({
        root: {
            backgroundColor: "transparent",
            ":hover": {
                backgroundColor: theme.colors.dark[4]
            }
        },
        inner: {
            justifyContent: "start"
        }
    })} >{children}</Button>
)

