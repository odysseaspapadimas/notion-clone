import { Table as MantineTable } from "@mantine/core"

type Props = {
    data: any[]
    columnHeaders: string[]
}
const Table = ({ data, columnHeaders }: Props) => {
    return (
        <MantineTable>
            <thead>
                <tr>
                    {columnHeaders.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody></tbody>
        </MantineTable>
    )
}
export default Table