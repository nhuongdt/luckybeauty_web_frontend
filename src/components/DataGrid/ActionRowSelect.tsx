import { Box, Typography, Button, Stack } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { IList } from '../../services/dto/IList';
import { useState, useRef, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

// check click outside button Thaotac
export function useComponentVisible(initialIsVisible: boolean) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentVisible, setIsComponentVisible };
}

export default function ActionRowSelect({ lstOption, countRowSelected, title, choseAction, removeItemChosed }: any) {
    const [expandAction, setExpandAction] = useState(false);
    const { ref, isComponentVisible } = useComponentVisible(true);

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
                            minWidth: 160,
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
                <ClearIcon color="error" onClick={removeItemChosed} />
            </Stack>
        </>
    );
}
