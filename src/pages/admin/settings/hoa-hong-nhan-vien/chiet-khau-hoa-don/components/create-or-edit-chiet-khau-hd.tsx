import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem,
    ListItemText,
    Tab,
    FormControl,
    InputLabel,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemIcon,
    ListItemButton,
    Autocomplete
} from '@mui/material';
import Select from '@mui/material/Select';
import { ReactComponent as CloseIcon } from '../../../../../../images/close-square.svg';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import { Form, Formik } from 'formik';
import chietKhauHoaDonStore from '../../../../../../stores/chietKhauHoaDonStore';
import { enqueueSnackbar } from 'notistack';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '../../../../../../images/search-normal.svg';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { observer } from 'mobx-react';
import suggestStore from '../../../../../../stores/suggestStore';
import { SuggestNhanSuDto } from '../../../../../../services/suggests/dto/SuggestNhanSuDto';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    formRef: CreateOrEditChietKhauHoaDonDto;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
const loaiChungTu = [
    'Hóa đơn bán lẻ',
    'Gói dịch vụ',
    'Báo giá',
    'Phiếu nhập kho nhà cung cấp',
    'Phiếu xuất kho',
    'Khách trả hàng',
    'Thẻ giá trị',
    'Phiếu kiểm kê',
    'Chuyển hàng',
    'Phiếu thu',
    'Phiếu chi',
    'Điều chỉnh giá vốn',
    'Nhận hàng'
];

class CreateOrEditChietKhauHoaDonModal extends Component<DialogProps> {
    state = {
        tabIndex: '1',
        selectedChucVuId: '',
        listIdEmployeeSelected: [] as string[],
        listEmployee: suggestStore.suggestNhanVien?.filter(
            (x) => !chietKhauHoaDonStore.createOrEditDto.idNhanViens?.includes(x.id)
        ) as SuggestNhanSuDto[],
        listEmployeeSelected: suggestStore.suggestNhanVien?.filter((x) =>
            chietKhauHoaDonStore.createOrEditDto.idNhanViens?.includes(x.id)
        ) as SuggestNhanSuDto[]
    };
    handleMoveAllRight = () => {
        this.setState({
            listEmployeeSelected: this.state.listEmployeeSelected.concat(this.state.listEmployee),
            listEmployee: [],
            listIdEmployeeSelected: this.state.listEmployee.map((item) => {
                return item.id;
            })
        });
    };

    handleMoveAllLeft = () => {
        this.setState({
            listEmployee: this.state.listEmployee.concat(this.state.listEmployeeSelected),
            listEmployeeSelected: [],
            listIdEmployeeSelected: []
        });
    };

    handleMoveToRight = (item: SuggestNhanSuDto) => {
        const { listEmployeeSelected, listIdEmployeeSelected, listEmployee } = this.state;
        const updatedLeftList = listEmployee.filter((employee) => employee.id !== item.id);
        const selectedItemsData = suggestStore.suggestNhanVien.filter(
            (employee) => employee.id === item.id
        );
        const selectId = item.id; // Just assign the id
        this.setState({
            listEmployee: updatedLeftList,
            listEmployeeSelected: [...listEmployeeSelected, ...selectedItemsData],
            listIdEmployeeSelected: [...listIdEmployeeSelected, selectId] // Use spread operator to create a new array with the selected id
        });
    };

    handleMoveToLeft = (item: SuggestNhanSuDto) => {
        const { listEmployeeSelected, listIdEmployeeSelected, listEmployee } = this.state;
        const updatedRightList = listEmployeeSelected.filter((employee) => employee.id !== item.id);
        const selectedEmployees = suggestStore.suggestNhanVien.filter(
            (employee) => employee.id === item.id
        );
        const selectedId = item.id;
        this.setState({
            listEmployeeSelected: updatedRightList,
            listEmployee: [...listEmployee, ...selectedEmployees],
            listIdEmployeeSelected: listIdEmployeeSelected.filter((id) => id !== selectedId) // Use filter to remove the selected id
        });
    };

    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        this.setState({ tabIndex: newValue });
        if (newValue === '2') {
            if (suggestStore && chietKhauHoaDonStore) {
                const { suggestNhanVien } = suggestStore;
                const { createOrEditDto } = chietKhauHoaDonStore;

                if (suggestNhanVien && createOrEditDto) {
                    this.setState({
                        listEmployee: suggestNhanVien.filter(
                            (x) => !createOrEditDto.idNhanViens.includes(x.id)
                        ),
                        listEmployeeSelected: suggestNhanVien.filter((x) =>
                            createOrEditDto.idNhanViens.includes(x.id)
                        ),
                        listIdEmployeeSelected: createOrEditDto.idNhanViens
                    });
                }
            }
        }
    };

    render(): ReactNode {
        const { title, onClose, onSave, visited } = this.props;
        const initValues: CreateOrEditChietKhauHoaDonDto = chietKhauHoaDonStore.createOrEditDto;
        return (
            <Dialog open={visited} fullWidth maxWidth="md" onClose={onClose}>
                <DialogTitle sx={{ fontSize: '24px', fontWeight: '700' }}>
                    {title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                onClose();
                                this.setState({ tabIndex: '1' });
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values) => {
                            values.idNhanViens = this.state.listIdEmployeeSelected;
                            const createOrEdit = await chietKhauHoaDonStore.createOrEdit(values);
                            enqueueSnackbar(createOrEdit.message, {
                                variant: createOrEdit.status,
                                autoHideDuration: 3000
                            });
                            this.setState({ tabIndex: '1' });
                            await onSave();
                        }}>
                        {({ handleChange, errors, touched, values, setFieldValue }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent unwanted form submission
                                    }
                                }}>
                                <TabContext value={this.state.tabIndex}>
                                    <TabList onChange={this.handleTabChange}>
                                        <Tab
                                            label="Thông tin"
                                            value="1"
                                            sx={{ textTransform: 'unset!important' }}
                                        />
                                        <Tab
                                            label="Nhân viên áp dụng"
                                            value="2"
                                            sx={{ textTransform: 'unset!important' }}
                                        />
                                    </TabList>
                                    <TabPanel value="1" sx={{ padding: '16px' }}>
                                        <Grid container spacing={4} rowSpacing={2}>
                                            <Grid item xs={12}>
                                                {/* <Typography variant="subtitle2">
                                                    Loại chiết khấu
                                                </Typography> */}
                                                <RadioGroup
                                                    name="loaiChietKhau"
                                                    value={values?.loaiChietKhau ?? 1}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio />}
                                                        label="Theo % thực thu"
                                                    />
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio />}
                                                        label=" Theo % doanh thu"
                                                    />
                                                    <FormControlLabel
                                                        value={3}
                                                        control={<Radio />}
                                                        label="Theo VNĐ"
                                                    />
                                                </RadioGroup>
                                                {errors.loaiChietKhau && touched.loaiChietKhau && (
                                                    <span className={'text-danger'}>
                                                        {errors.loaiChietKhau}
                                                    </span>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4}>
                                                <TextField
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            Giá trị chiết khấu
                                                        </Typography>
                                                    }
                                                    size="small"
                                                    name="giaTriChietKhau"
                                                    error={
                                                        errors.giaTriChietKhau &&
                                                        touched.giaTriChietKhau
                                                            ? true
                                                            : false
                                                    }
                                                    helperText={
                                                        errors.giaTriChietKhau &&
                                                        touched.giaTriChietKhau && (
                                                            <span className="text-danger">
                                                                {errors.giaTriChietKhau}
                                                            </span>
                                                        )
                                                    }
                                                    value={values?.giaTriChietKhau}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '16px',
                                                        color: '#4c4b4c'
                                                    }}></TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={8}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        options={loaiChungTu}
                                                        getOptionLabel={(option: any) => option}
                                                        size="small"
                                                        onChange={(_, newValue) => {
                                                            setFieldValue(
                                                                'chungTuApDung',
                                                                newValue
                                                            );
                                                        }}
                                                        value={values?.chungTuApDung}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography variant="subtitle2">
                                                                        Chứng từ áp dụng
                                                                    </Typography>
                                                                }
                                                                error={
                                                                    errors.chungTuApDung &&
                                                                    touched.chungTuApDung
                                                                        ? true
                                                                        : false
                                                                }
                                                                fullWidth
                                                                sx={{
                                                                    fontSize: '16px',
                                                                    color: '#4c4b4c'
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                                {errors.chungTuApDung && touched.chungTuApDung && (
                                                    <span className={'text-danger'}>
                                                        {errors.chungTuApDung}
                                                    </span>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label={
                                                        <Typography variant="subtitle2">
                                                            Ghi chú
                                                        </Typography>
                                                    }
                                                    multiline
                                                    minRows={2}
                                                    maxRows={3}></TextField>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{ padding: '16px' }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={4}>
                                                <Typography>Vị trí</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box
                                                    maxHeight={'300px'}
                                                    overflow={'auto'}
                                                    marginTop={2}
                                                    sx={{
                                                        '&::-webkit-scrollbar': {
                                                            width: '7px'
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            bgcolor: 'rgba(0,0,0,0.1)',
                                                            borderRadius: '4px'
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            bgcolor: 'var(--color-bg)'
                                                        }
                                                    }}>
                                                    <ListItem
                                                        sx={{
                                                            backgroundColor:
                                                                this.state.selectedChucVuId === ''
                                                                    ? '#E6E6E6'
                                                                    : 'transparent' // Apply background color based on selection
                                                        }}
                                                        onClick={async () => {
                                                            this.setState({
                                                                selectedChucVuId: ''
                                                            });
                                                        }}>
                                                        <ListItemText primary={'Tất cả'} />
                                                    </ListItem>
                                                    {suggestStore.suggestChucVu?.map(
                                                        (item, key) => (
                                                            <ListItem
                                                                key={key}
                                                                sx={{
                                                                    backgroundColor:
                                                                        this.state
                                                                            .selectedChucVuId ===
                                                                        item.idChucVu
                                                                            ? '#E6E6E6'
                                                                            : 'transparent' // Apply background color based on selection
                                                                }}
                                                                onClick={async () => {
                                                                    this.setState({
                                                                        selectedChucVuId:
                                                                            item.idChucVu
                                                                    });
                                                                }}>
                                                                <ListItemText
                                                                    primary={item.tenChucVu}
                                                                />
                                                            </ListItem>
                                                        )
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography>Nhân viên</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box
                                                    maxHeight={'300px'}
                                                    overflow={'auto'}
                                                    marginTop={2}
                                                    sx={{
                                                        '&::-webkit-scrollbar': {
                                                            width: '7px'
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            bgcolor: 'rgba(0,0,0,0.1)',
                                                            borderRadius: '4px'
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            bgcolor: 'var(--color-bg)'
                                                        }
                                                    }}>
                                                    <Box display={'flex'} justifyContent={'end'}>
                                                        <Button
                                                            variant="text"
                                                            onClick={this.handleMoveAllRight}>
                                                            Thêm tất cả trong trang
                                                        </Button>
                                                    </Box>
                                                    {Array.isArray(this.state.listEmployee) ? (
                                                        this.state.listEmployee.map((item, key) => (
                                                            <ListItem
                                                                key={key}
                                                                secondaryAction={
                                                                    <IconButton
                                                                        edge="end"
                                                                        onClick={() => {
                                                                            this.handleMoveToRight(
                                                                                item
                                                                            );
                                                                        }}>
                                                                        <ArrowForwardIosIcon />
                                                                    </IconButton>
                                                                }>
                                                                <ListItemIcon
                                                                    sx={{ minWidth: 'auto' }}>
                                                                    <Checkbox edge="start" />
                                                                </ListItemIcon>
                                                                <ListItemAvatar
                                                                    sx={{
                                                                        width: '40px',
                                                                        height: '40px'
                                                                    }}>
                                                                    <Avatar src={item.avatar} />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={item.tenNhanVien}
                                                                    secondary={item.chucVu}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    ) : (
                                                        // Handle the case when items is not an array
                                                        <div>No items to display</div>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography>Nhân viên áp dụng</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box
                                                    maxHeight={'300px'}
                                                    overflow={'auto'}
                                                    marginTop={2}
                                                    sx={{
                                                        '&::-webkit-scrollbar': {
                                                            width: '7px'
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            bgcolor: 'rgba(0,0,0,0.1)',
                                                            borderRadius: '4px'
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            bgcolor: 'var(--color-bg)'
                                                        }
                                                    }}>
                                                    <Box display={'flex'} justifyContent={'end'}>
                                                        <Button
                                                            variant="text"
                                                            onClick={this.handleMoveAllLeft}>
                                                            Xóa tất cả
                                                        </Button>
                                                    </Box>
                                                    {Array.isArray(
                                                        this.state.listEmployeeSelected
                                                    ) ? (
                                                        this.state.listEmployeeSelected.map(
                                                            (item, key) => (
                                                                <ListItem
                                                                    key={key}
                                                                    secondaryAction={
                                                                        <IconButton
                                                                            edge="end"
                                                                            onClick={() => {
                                                                                this.handleMoveToLeft(
                                                                                    item
                                                                                );
                                                                            }}>
                                                                            x
                                                                        </IconButton>
                                                                    }>
                                                                    <ListItemIcon
                                                                        sx={{ minWidth: 'auto' }}>
                                                                        <Checkbox edge="start" />
                                                                    </ListItemIcon>
                                                                    <ListItemAvatar
                                                                        sx={{
                                                                            width: '40px',
                                                                            height: '40px'
                                                                        }}>
                                                                        <Avatar src={item.avatar} />
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={item.tenNhanVien}
                                                                        secondary={item.chucVu}
                                                                    />
                                                                </ListItem>
                                                            )
                                                        )
                                                    ) : (
                                                        // Handle the case when items is not an array
                                                        <div>No items to display</div>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                </TabContext>

                                <DialogActions sx={{ paddingRight: '0' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            className="btn-outline-hover"
                                            variant="outlined"
                                            onClick={() => {
                                                onClose();
                                                this.setState({ tabIndex: '1' });
                                            }}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: 'var(--color-main)',
                                                borderColor: '#965C85'
                                            }}>
                                            Hủy
                                        </Button>
                                        <Button
                                            className="btn-container-hover"
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',

                                                border: 'none'
                                            }}
                                            type="submit">
                                            Lưu
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditChietKhauHoaDonModal);
