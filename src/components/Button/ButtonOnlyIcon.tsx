import { Stack } from '@mui/material';
import { FC, ReactNode } from 'react';
import { CSSProperties } from 'react';

const ButtonOnlyIcon: FC<{ style?: CSSProperties; icon: ReactNode }> = ({ style, icon }) => {
    return (
        <Stack className="btnIcon" style={style} justifyContent={'center'} alignItems={'center'}>
            {icon}
        </Stack>
    );
};
export default ButtonOnlyIcon;
