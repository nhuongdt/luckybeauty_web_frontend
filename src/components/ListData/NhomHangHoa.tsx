import { Stack, Typography } from '@mui/material';
import { OpenInNew, LocalOfferOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { IList } from '../../services/dto/IList';

export default function ListNhomHangHoa({ lst, Icon, direction, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<IList>({} as IList);
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');

    const handleHover = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(rowData);
    };
    const handleClickTreeItem = (isEdit = false, idChosing: string) => {
        clickTreeItem(isEdit, rowHover);
        setIdChosing(idChosing);
    };
    return (
        <>
            <Stack direction={direction} spacing={1}>
                {lst?.map((item: IList, index: number) => (
                    <Stack
                        padding={'12px 16px'}
                        sx={{
                            '&:hover': {
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}>
                        <Stack spacing={2} direction={'row'} position="relative" paddingRight={3}>
                            <div style={{ color: item.color }}> {Icon}</div>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                                textTransform="capitalize"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}
                                title={item.text}
                                onClick={() => handleClickTreeItem(false, item.id)}>
                                {item.text}
                            </Typography>
                            {isHover && item.id !== '' && rowHover.id === item.id && (
                                <OpenInNew
                                    onClick={() => handleClickTreeItem(true, item.id)}
                                    sx={{ position: 'absolute', right: 0.5 }}
                                />
                            )}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </>
    );
}
