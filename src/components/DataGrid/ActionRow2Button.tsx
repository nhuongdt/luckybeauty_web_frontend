import { Stack } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BorderHorizontalOutlinedIcon from '@mui/icons-material/BorderHorizontalOutlined';
import { TypeAction } from '../../lib/appconst';

export default function ActionRow2Button({ handleClickAction }: any) {
    const onClickAction = (type: number) => {
        handleClickAction(type);
    };
    return (
        <>
            <Stack spacing={1} direction={'row'}>
                <BorderHorizontalOutlinedIcon
                    sx={{ width: '16px', color: 'blue' }}
                    onClick={() => onClickAction(TypeAction.UPDATE)}
                />
                <ClearIcon sx={{ width: '16px', color: 'red' }} onClick={() => onClickAction(TypeAction.DELETE)} />
            </Stack>
        </>
    );
}
