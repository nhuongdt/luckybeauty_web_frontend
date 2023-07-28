import { Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}
export default function TabPanel(props: TabPanelProps) {
    return (
        <div hidden={props.value !== props.index}>
            {props.value === props.index && <Box>{props.children}</Box>}
        </div>
    );
}
