import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Dialog,
    Button,
    FormControlLabel,
    Checkbox,
    TextField
} from '@mui/material';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}

const CreateOrEditTenantNew: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <Box padding="20px 24px" bgcolor="#fff" width="600px" overflow="auto">
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        Thêm mới quyền
                    </Typography>
                    <Box>
                        <Box>
                            <label htmlFor="name">
                                <span style={{ color: 'red', marginRight: '3px' }}>*</span>
                                Tenant Name
                            </label>
                            <TextField id="name" type="text" size="small" fullWidth />
                        </Box>
                        <Box>
                            <label htmlFor="name2">
                                <span style={{ color: 'red', marginRight: '3px' }}>*</span>
                                Name
                            </label>
                            <TextField id="name2" type="text" size="small" fullWidth />
                        </Box>
                        <Box>
                            <label htmlFor="email">
                                <span style={{ color: 'red', marginRight: '3px' }}>*</span>
                                Email quản trị
                            </label>
                            <TextField id="email" type="email" size="small" fullWidth />
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Dùng chung cơ sở dữ liệu với Host"
                            />
                        </Box>
                        <Box>
                            <label htmlFor="chuoi-ket-noi">
                                <span style={{ color: 'red', marginRight: '3px' }}>*</span>
                                Tenant Name
                            </label>
                            <TextField id="chuoi-ket-noi" type="text" size="small" fullWidth />
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
export default CreateOrEditTenantNew;
