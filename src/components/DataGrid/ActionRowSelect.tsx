import {
    Box,
    Typography,
    Grid,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent,
    Stack,
    Select,
    MenuItem,
    Icon
} from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { IList } from '../../services/dto/IList';
import { useState, useRef, useEffect, ReactElement } from 'react';

export default function ActionRowSelect({ lstOption, countRowSelected, title, choseAction }: any) {
    const myRef = useRef();
    const [expandAction, setExpandAction] = useState(false);

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // });

    const clickAction = (item: any) => {
        choseAction(item);
        setExpandAction(false);
    };

    return (
        <>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                <Box sx={{ position: 'relative' }}>
                    <Button
                        variant="contained"
                        endIcon={<ExpandMoreOutlined />}
                        onClick={() => setExpandAction(!expandAction)}>
                        Thao tác
                    </Button>

                    <Box
                        sx={{
                            display: expandAction ? '' : 'none',
                            zIndex: 1,
                            position: 'absolute',
                            borderRadius: '4px',
                            border: '1px solid #cccc',
                            minWidth: 150,
                            backgroundColor: 'rgba(248,248,248,1)',
                            '& .MuiStack-root .MuiStack-root:hover': {
                                backgroundColor: '#cccc'
                            }
                        }}>
                        <Stack alignContent={'center'}>
                            {lstOption?.map((item: IList, index: number) => (
                                <Stack
                                    direction={'row'}
                                    key={index}
                                    spacing={1}
                                    padding={'6px'}
                                    onClick={() => clickAction(item)}>
                                    {/* {item.icon} */}
                                    <Typography variant="subtitle2" marginLeft={1}>
                                        {item.text}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                <Stack direction={'row'}>
                    <Typography variant="body2" color={'red'}>
                        {countRowSelected}&nbsp;
                    </Typography>
                    <Typography variant="body2">{title ?? 'bản ghi'} được chọn</Typography>
                </Stack>
            </Stack>
        </>
    );
}
