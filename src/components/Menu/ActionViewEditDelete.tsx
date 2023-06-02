import { useEffect, useState } from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';
import { Info, Edit, DeleteForever } from '@mui/icons-material';

export default function ActionViewEditDelete({ elmHTML, handleClickAction }: any) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (elmHTML) {
            setShow(true);
        }
    }, [elmHTML]);
    return (
        <>
            <Menu
                // id={`actions-menu-${this.state.selectedRowId}`}
                anchorEl={elmHTML}
                keepMounted
                open={show}
                onClose={() => setShow(false)}
                sx={{ minWidth: '120px' }}>
                <MenuItem onClick={() => handleClickAction(0)}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Xem
                    </Typography>
                    <Info sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem onClick={() => handleClickAction(1)}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Sửa
                    </Typography>
                    <Edit sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem onClick={() => handleClickAction(2)}>
                    <Typography
                        color="#F1416C"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Xóa
                    </Typography>
                    <DeleteForever sx={{ color: '#F1416C' }} />
                </MenuItem>
            </Menu>
        </>
    );
}
