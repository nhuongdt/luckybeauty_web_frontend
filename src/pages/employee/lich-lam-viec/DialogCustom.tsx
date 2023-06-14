import React from 'react';
import { Box, Menu, Button, MenuItem } from '@mui/material';
interface DialogComponentProps {
    open: boolean;
    handleClose: () => void;
    selectedRowId: any;
    anchorEl: any;
}

const CustomEmployee: React.FC<DialogComponentProps> = ({
    open,
    handleClose,
    selectedRowId,
    anchorEl
}) => {
    return (
        <Menu
            id={`actions-menu-${selectedRowId}`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
                '& .MuiMenuItem-root': {
                    color: '#4C4B4C',
                    fontWeight: '400',
                    fontSize: '14px',

                    justifyContent: 'start'
                },
                padding: '9px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
            <Box>
                <MenuItem onClick={undefined}>Thêm ca làm việc thường xuyên</MenuItem>
                <MenuItem onClick={undefined}>Xóa nhân viên khỏi lịch làm việc</MenuItem>
                <MenuItem onClick={undefined}>Xóa tất cả ca làm việc</MenuItem>
                <MenuItem onClick={undefined}>Chỉnh sửa nhân viên</MenuItem>
            </Box>
        </Menu>
    );
};
export default CustomEmployee;
