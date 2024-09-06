import { Stack, Typography } from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { CSSProperties } from 'styled-components';

export type IPropPageEmpty = {
    text?: string;
    icon?: React.ReactNode;
    style?: CSSProperties;
};

export default function PageEmpty(props: IPropPageEmpty) {
    const { icon, text, style, ...other } = props;
    return (
        <Stack
            spacing={2}
            alignItems={'center'}
            justifyContent={'center'}
            {...other}
            style={style}
            sx={{ backgroundColor: '#f2f2ea' }}>
            {icon ?? <LibraryBooksOutlinedIcon style={{ width: '100px', height: '100px', color: 'burlywood' }} />}
            <Typography fontSize={'16px'}>{text ?? 'Không có dữ liệu'}</Typography>
        </Stack>
    );
}
