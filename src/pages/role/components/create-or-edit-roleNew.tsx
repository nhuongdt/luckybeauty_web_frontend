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
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import fileIcon from '../../../images/file.svg';
import fileUpload from '../../../images/fi_upload-cloud.svg';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}
const CreateOrEditRoleNew: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <Box position="relative">
                    <Box padding="20px 24px" width="600px" overflow="auto" bgcolor="#fff">
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            color="rgb(51, 50, 51)"
                            fontWeight="700">
                            Thêm mới vai trò
                        </Typography>
                        <Box>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="lab API tabs example"
                                        sx={{
                                            '& .MuiTabs-flexContainer': { gap: '24px' },
                                            '& button': {
                                                fontSize: '14px'
                                            }
                                        }}>
                                        <Tab
                                            label="RoleDetails"
                                            value="1"
                                            sx={{ textTransform: 'unset!important', padding: '0' }}
                                        />
                                        <Tab
                                            label="RolePermission"
                                            value="2"
                                            sx={{ textTransform: 'unset!important', padding: '0' }}
                                        />
                                    </TabList>
                                </Box>
                                <TabPanel
                                    value="1"
                                    sx={{
                                        padding: '0',
                                        '& label': {
                                            fontSize: '14px'
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        marginTop: '16px'
                                    }}>
                                    <Box>
                                        <label htmlFor="name">
                                            <span style={{ color: 'red ', marginRight: '5px' }}>
                                                *
                                            </span>
                                            RoleName
                                        </label>
                                        <TextField fullWidth size="small" id="name" type="text" />
                                    </Box>
                                    <Box>
                                        <label htmlFor="name">
                                            <span style={{ color: 'red ', marginRight: '5px' }}>
                                                *
                                            </span>
                                            DisplayName
                                        </label>
                                        <TextField fullWidth size="small" id="name" type="text" />
                                    </Box>
                                    <Box>
                                        <label htmlFor="name">Description</label>
                                        <TextField fullWidth size="small" id="name" type="text" />
                                    </Box>
                                    <Box
                                        display="flex"
                                        width="fit-content"
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
                                </TabPanel>
                                <TabPanel value="2" sx={{ padding: '0' }}>
                                    <Box display="flex">
                                        <TextField size="small" fullWidth />
                                        <Button
                                            sx={{
                                                minWidth: 'unset',
                                                borderColor: '#666466!important'
                                            }}
                                            size="small"
                                            variant="outlined">
                                            <SearchIcon sx={{ color: '#666466' }} />
                                        </Button>
                                    </Box>
                                    <Box display="flex" gap="16px">
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            '& .MuiFormControlLabel-root': {
                                                width: '100%'
                                            },
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            maxHeight: '300px'
                                        }}>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />{' '}
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />{' '}
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />{' '}
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />{' '}
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Check All"
                                        />
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
        </>
    );
};
export default CreateOrEditRoleNew;
