import React from 'react';
import { Box, Dialog, Button } from '@mui/material';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}
const CustomEmployee: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Box>
                <Button variant="text">Thêm ca làm việc thường xuyên</Button>
            </Box>
        </Dialog>
    );
};
export default CustomEmployee;
