import { Group } from "@mantine/core"
import type { PropertyType, Property } from "@prisma/client"
import { Icon123, IconAlphabetLatin, IconCalendar, IconCheckbox } from "@tabler/icons-react"
import Editable from "../Editable"

export const Icon = ({ type }: { type: PropertyType }) => {
    switch (type) {
        case 'TEXT':
            return <IconAlphabetLatin />
        case 'NUMBER':
            return <Icon123 />
        case 'DATE':
            return <IconCalendar />
        case 'CHECKBOX':
            return <IconCheckbox />
    }
}

const Property = ({ id, name, content, type }: Property) => {

    return (
        <Group>
            <div className="text-gray-400 flex space-x-1 w-[150px]">
                <Icon type={type} />
                <span>{name}</span>
            </div>
            <Editable text={content} id={id} type="property" />
        </Group>
    )
}
export default Property