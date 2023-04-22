import { Drawer } from "@mantine/core"
import { Dispatch, SetStateAction } from "react";

type Props = {
    item: {
        name: string;
        symbol: string;
        mass: number;
        position: number;
    } | null;
    setSelectedItem: Dispatch<SetStateAction<{
        position: number;
        mass: number;
        symbol: string;
        name: string;
    } | null>>
    opened: boolean;
    handlers: {
        open: () => void;
        close: () => void;
    }
}
const DrawerPage = ({ item, setSelectedItem, opened, handlers }: Props) => {
    return (
        <Drawer
            opened={opened}
            onClose={() => {
                handlers.close()
                setSelectedItem(null);
            }}
            closeOnClickOutside
            position="right"
        >
            <h1>{item?.name}</h1>
            <p>{item?.symbol}</p>
            <p>{item?.mass}</p>
            <p>{item?.position}</p>
        </Drawer>
    )
}
export default DrawerPage