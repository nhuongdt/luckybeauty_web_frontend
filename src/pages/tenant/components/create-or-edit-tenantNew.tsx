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
import CloseIcon from '@mui/icons-material/Close';
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
                        Thêm mới Tenant
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap="16px"
                        marginTop="16px"
                        sx={{
                            '& label': {
                                fontSize: '14px'
                            }
                        }}>
                        <Box>
                            <label htmlFor="name">
                                <span style={{ color: 'red', marginRight: '3px' }}>*</span>
                                Tenant Name
                            </label>
                            <TextField id="name" type="text" size="small" fullWidth />
                        </Box>
                        <Box>
                            <label htmlFor="name2">Name</label>
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
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontSize: '14px'
                                    }
                                }}
                                control={<Checkbox />}
                                label="Dùng chung cơ sở dữ liệu với Host"
                            />
                        </Box>

                        <Box>
                            <label htmlFor="chuoi-ket-noi">Chuỗi kết nối</label>
                            <TextField id="chuoi-ket-noi" type="text" size="small" fullWidth />
                        </Box>
                        <Typography variant="body1" fontSize="14px" textAlign="center">
                            Mật khẩu mặc định là : 123qwe
                        </Typography>
                        <Box>
                            <FormControlLabel
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontSize: '14px'
                                    }
                                }}
                                control={<Checkbox />}
                                label="IsActive"
                            />
                        </Box>
                        <Box
                            display="flex"
                            marginLeft="auto"
                            gap="8px"
                            sx={{
                                '& button': {
                                    textTransform: 'unset!important'
                                }
                            }}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: '#7C3367!important',
                                    color: '#7C3367'
                                }}
                                onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: '#7C3367!important' }}>
                                Lưu
                            </Button>
                        </Box>
                        <Button
                            onClick={onClose}
                            sx={{
                                minWidth: 'unset',
                                position: 'absolute',
                                right: '16px',
                                top: '16px'
                            }}>
                            <CloseIcon sx={{ color: '#000' }} />
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
export default CreateOrEditTenantNew;
