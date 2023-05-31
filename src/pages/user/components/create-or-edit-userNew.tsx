import React from 'react';
import {
    Box,
    TextField,
    Dialog,
    Typography,
    Tab,
    Grid,
    Select,
    MenuItem,
    Checkbox,
    Button,
    FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import fileIcon from '../../../images/file.svg';
import fileUpload from '../../../images/fi_upload-cloud.svg';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}

const CreateOrEditUserNew: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <Box borderRadius="16px" sx={{ overflowX: 'hidden' }}>
                <Box padding="20px 24px" bgcolor="#fff" width="600px" overflow="auto">
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        Thêm mới quyền
                    </Typography>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab
                                        label="User detail"
                                        value="1"
                                        sx={{ textTransform: 'unset!important' }}
                                    />
                                    <Tab
                                        label="Role"
                                        value="2"
                                        sx={{ textTransform: 'unset!important' }}
                                    />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Grid
                                    container
                                    sx={{
                                        '& label': {
                                            marginBottom: '4px'
                                        }
                                    }}>
                                    <Grid item sm={4} position="relative">
                                        <Box padding="20px" position="absolute" textAlign="center">
                                            <img src={fileIcon} />
                                            <Box display="flex" gap="10px">
                                                <img src={fileUpload} />
                                                <Typography
                                                    variant="body1"
                                                    fontSize="14px"
                                                    fontWeight="500"
                                                    color="#7C3367"
                                                    marginTop="16px">
                                                    Tải ảnh lên
                                                </Typography>
                                            </Box>
                                            <input
                                                type="file"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    height: '100%',
                                                    width: '100%',
                                                    opacity: '0',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <Typography variant="body1" fontSize="14px">
                                                File định dạng{' '}
                                                <b style={{ display: 'block' }}>jpeg, png</b>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        sm={8}
                                        display="flex"
                                        flexDirection="column"
                                        gap="16px">
                                        <Box>
                                            <Typography variant="body1" fontSize="14px">
                                                Nhân sự đã có
                                            </Typography>
                                            <Select fullWidth size="small">
                                                <MenuItem>option</MenuItem>
                                                <MenuItem>option</MenuItem>
                                            </Select>
                                        </Box>
                                        <Box>
                                            <label htmlFor="ho" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Họ
                                            </label>
                                            <TextField id="ho" type="text" fullWidth size="small" />
                                        </Box>
                                        <Box>
                                            <label htmlFor="ten-lot" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Tên lót
                                            </label>

                                            <TextField
                                                id="ten-lot"
                                                type="text"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        flexDirection="column"
                                        gap="16px">
                                        <Box>
                                            <label htmlFor="email" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Email
                                            </label>
                                            <TextField
                                                id="email"
                                                type="email"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <label htmlFor="email" style={{ fontSize: '14px' }}>
                                                Số điện thoại
                                            </label>
                                            <TextField
                                                id="email"
                                                type="email"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <label htmlFor="email" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Tên truy cập
                                            </label>
                                            <TextField
                                                id="email"
                                                type="email"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <label htmlFor="email" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Mật khẩu
                                            </label>
                                            <TextField
                                                id="email"
                                                type="email"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <label htmlFor="email" style={{ fontSize: '14px' }}>
                                                <span style={{ color: 'red' }}>*</span>
                                                Nhập lại mật khẩu
                                            </label>
                                            <TextField
                                                id="email"
                                                type="email"
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="Kích hoạt"
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
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <Box display="flex" gap="16px">
                                    <FormControlLabel control={<Checkbox />} label="Tài" />
                                    <FormControlLabel control={<Checkbox />} label="Tài2222" />
                                </Box>
                            </TabPanel>
                        </TabContext>
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
    );
};
export default CreateOrEditUserNew;
