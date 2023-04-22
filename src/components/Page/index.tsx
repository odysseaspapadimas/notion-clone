import { type Page as PageType, Property as PropertyType } from "@prisma/client"
import Property, { Icon as PropertyIcon } from "./Property"
import { Box, Button, Divider, Menu, Textarea } from "@mantine/core"
import Editable from "../Editable"
import { IconPlus } from "@tabler/icons-react"
import { api } from "src/utils/api"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { monsterrat } from "src/pages/_app"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import Block, { ContentTypeMap } from "../Block"
import AddBlock from "./AddBlock"
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks"

const propertyTypes: { name: string, type: PropertyType["type"] }[] = [
    { name: 'Text', type: 'TEXT' },
    { name: 'Number', type: 'NUMBER' },
    { name: 'Date', type: 'DATE' },
    { name: 'Checkbox', type: 'CHECKBOX' },
]

const Page = ({ id, title, properties, content }: PageType & { properties: PropertyType[] }) => {

    const ref = useRef<HTMLTextAreaElement>(null);

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

    useHotkeys([['Escape', () => {
        setContextMenu(null)
        console.log('lol')
    }]])

    const [text, setText] = useState<string | undefined>(undefined);

    const ctx = api.useContext();
    const addProperty = api.page.addProperty.useMutation({
        onSuccess: () => {
            ctx.page.get.invalidate();
        }
    });

    const { data: pageBlocks } = api.page.getBlocks.useQuery({ id });

    const handleNewProperty = async (prop: { name: string, type: PropertyType["type"] }) => {
        try {
            const res = await addProperty.mutateAsync({ pageId: id, name: prop.name, type: prop.type })
        } catch (error: unknown) {
            //@ts-ignore
            if (error.message?.includes("Unique")) {
                let counter = 0;
                for (const property of properties) {
                    if (property.type === prop.type) {
                        counter++;
                    }
                }
                console.log(`${prop.name} ${counter}`, 'create new + 1')
                addProperty.mutate({ pageId: id, name: `${prop.name} ${counter}`, type: prop.type })
            }
        }

    }


    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (!ref.current) return;

        if (e.target.value.at(-1) === "/") {
            const { x: cursorX, y: cursorY } = getCursorXY(ref.current, ref.current.selectionStart)
            console.log(ref.current.selectionStart, ref.current.offsetLeft, cursorX, cursorY, 'rect')

            setContextMenu({ x: cursorX + 120, y: cursorY - 58 })
        }
    }
    const getCursorXY = (input: HTMLTextAreaElement, selectionPoint: number) => {
        const {
            offsetLeft: inputX,
            offsetTop: inputY,
        } = input
        // create a dummy element that will be a clone of our input
        const div = document.createElement('div')
        // get the computed style of the input and clone it onto the dummy element
        const copyStyle = getComputedStyle(input)
        for (const prop of copyStyle) {
            //@ts-ignore
            div.style[prop] = copyStyle[prop]
        }
        // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
        const swap = '.'
        const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
        // set the div content to that of the textarea up until selection
        const textContent = inputValue.substr(0, selectionPoint)
        // set the text content of the dummy element div
        div.textContent = textContent
        if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
        // if a single line input then the div needs to be single line and not break out like a text area
        if (input.tagName === 'INPUT') div.style.width = 'auto'
        // create a marker element to obtain caret position
        const span = document.createElement('span')
        // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
        span.textContent = inputValue.substr(selectionPoint) || '.'
        // append the span marker to the div
        div.appendChild(span)
        // append the dummy element to the body
        document.body.appendChild(div)
        // get the marker position, this is the caret position top and left relative to the input
        const { offsetLeft: spanX, offsetTop: spanY } = span
        // lastly, remove that dummy element
        // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
        document.body.removeChild(div)
        // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
        return {
            x: inputX + spanX,
            y: inputY + spanY,
        }
    }

    return (
        <>
            <div>
                <Editable text={title} type="title" id={id} />
                <div className="flex flex-col items-start space-y-2 m-2">
                    {properties.map((property) => (
                        <Property key={property.id} {...property} />
                    ))}
                </div>
                <Menu transitionProps={{ transition: "pop" }} width={200} position="bottom-start" offset={2}>
                    <Menu.Target>
                        <Button variant="subtle" leftIcon={<IconPlus />} my={8}>Add a property</Button>
                    </Menu.Target>

                    <Menu.Dropdown py={12}>
                        <span className="text-gray-400 text-sm font-semibold mx-4">Type</span>

                        <div className="flex flex-col items-start mt-2">
                            {propertyTypes.map((prop) => (
                                <Button key={prop.type} onClick={() => handleNewProperty(prop)} leftIcon={<PropertyIcon type={prop.type} />} fullWidth styles={(theme) => ({
                                    root: {
                                        backgroundColor: "transparent",
                                        ":hover": {
                                            backgroundColor: theme.colors.dark[4]
                                        }
                                    },
                                    inner: {
                                        justifyContent: "start"
                                    }
                                })} >{prop.name}</Button>
                            ))}
                        </div>

                    </Menu.Dropdown>
                </Menu>

                <Divider my="md" />


                {pageBlocks?.map((block) => {

                    if (block.type === "H1" || block.type === "H2" || block.type === "H3" || block.type === "P") {
                        const content = block.content as { text: string, type: "h1" | "p" };
                        return <Block key={block.id} id={block.id} type={content.type} content={content.text} />
                    } else if (block.type === "LIST") {
                        const content = block.content as { items: { id: number, text: string }[] };
                        return <Block key={block.id} id={block.id} type={"list"} content={content.items} />
                    }
                })}

                <Textarea
                    ref={ref}
                    styles={{
                        input: monsterrat.style
                    }}
                    autosize
                    value={text ?? content ?? ""}
                    onChange={handleChangeText}
                    variant="unstyled"
                    placeholder="Write away..."
                    onKeyDown={getHotkeyHandler([
                        ['Escape', (e) => {
                            if (contextMenu !== null) setContextMenu(null)
                            else {
                                const target = e.target as HTMLTextAreaElement;

                                target.blur();
                            }
                        }],
                    ])}
                />
            </div>

            <AddBlock pageId={id} contextMenu={contextMenu} setContextMenu={setContextMenu} />
        </>

    )
}
export default Page