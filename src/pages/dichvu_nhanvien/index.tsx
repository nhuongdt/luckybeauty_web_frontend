import { Component, ReactNode } from 'react';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    FormControlLabel,
    Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Radio,
    RadioGroup,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditDichVuNhanVienModal from './components/create-or-edit-dichVu_nhanVien';
import suggestStore from '../../stores/suggestStore';
import StarIcon from '@mui/icons-material/Star';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { observer } from 'mobx-react';
import dichVuNhanVienStore from '../../stores/dichVuNhanVienStore';
import AppConsts from '../../lib/appconst';

class SettingDichVuNhanVien extends Component {
    onModal = () => {
        this.setState({ visiableModal: !this.state.visiableModal });
    };
    handleCloseModal = () => {
        this.setState({ visiableModal: false });
    };
    state = {
        visiableModal: false,
        settingValue: 'Service',
        selectedItemId: null
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        await suggestStore.getSuggestNhanVien();
        await suggestStore.getSuggestDichVu();
        await suggestStore.getSuggestNhomHangHoa();
        dichVuNhanVienStore.idNhanVien = suggestStore.suggestNhanVien[0].id;
        this.setState({ selectedItemId: suggestStore.suggestNhanVien[0].id });
        await dichVuNhanVienStore.getDichVuNhanVienDetail(
            suggestStore.suggestNhanVien[0].id ?? AppConsts.guidEmpty
        );
    }
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): ReactNode {
        return (
            <Box>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    paddingTop={'16px'}>
                    <Typography
                        fontSize={'18px'}
                        fontWeight={700}
                        color={'#3D475C'}
                        fontFamily={'Roboto'}>
                        Cài đặt dịch vụ nhân viên
                    </Typography>
                </Box>
                <Box padding={'0px 16px'}>
                    <Grid container spacing={2} padding={'0px 8px'}>
                        {window.screen.width <= 650 ? (
                            <Grid item xs={12}>
                                <Autocomplete
                                    //defaultValue={suggestStore.suggestNhanVien[0] ?? []}
                                    options={suggestStore.suggestNhanVien ?? []}
                                    getOptionLabel={(option) => `${option.tenNhanVien}`}
                                    renderOption={(props, option) => (
                                        <Box
                                            key={option.id}
                                            component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...props}>
                                            <Avatar src={option.avatar} />
                                            <Box
                                                display={'flex'}
                                                flexDirection={'column'}
                                                ml={'5px'}>
                                                <Typography>{option?.tenNhanVien}</Typography>
                                                <Typography>{option?.chucVu}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    size="small"
                                    fullWidth
                                    disablePortal
                                    onChange={async (event, option) => {
                                        await dichVuNhanVienStore.getDichVuNhanVienDetail(
                                            option?.id ?? AppConsts.guidEmpty
                                        );
                                        dichVuNhanVienStore.idNhanVien =
                                            option?.id ?? AppConsts.guidEmpty;
                                        this.setState({
                                            selectedItemId: option?.id ?? AppConsts.guidEmpty
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ bgcolor: '#fff' }}
                                            {...params}
                                            placeholder="Tìm tên"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        {params.InputProps.startAdornment}
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        ) : (
                            <Grid item xs={4}>
                                <Box
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: '1px solid #E6E1E6'
                                    }}>
                                    <List
                                        sx={{
                                            width: '100%',
                                            minHeight: '550px',
                                            maxHeight: '550px',
                                            overflow: 'auto',
                                            bgcolor: 'background.paper'
                                        }}>
                                        {suggestStore.suggestNhanVien?.map((item, key) => (
                                            <ListItem
                                                key={key}
                                                onClick={async () => {
                                                    await dichVuNhanVienStore.getDichVuNhanVienDetail(
                                                        item.id
                                                    );
                                                    dichVuNhanVienStore.idNhanVien = item.id;
                                                    this.setState({ selectedItemId: item.id });
                                                }}
                                                sx={{
                                                    backgroundColor:
                                                        this.state.selectedItemId === item.id
                                                            ? '#E6E6E6'
                                                            : 'transparent' // Apply background color based on selection
                                                }}>
                                                <ListItemAvatar>
                                                    <Avatar src={item.avatar} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.tenNhanVien}
                                                    secondary={item.chucVu}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} md={8}>
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #E6E1E6',
                                    padding: '8px',
                                    minHeight: '550px',
                                    maxHeight: '550px'
                                }}>
                                <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    alignItems={'center'}
                                    padding={'8px'}
                                    borderBottom={'1px solid #EBEBEB'}>
                                    <Avatar
                                        sx={{ width: '64px', height: '64px' }}
                                        src={dichVuNhanVienStore.dichVuNhanVienDetail?.avatar}
                                    />
                                    <Typography>
                                        {dichVuNhanVienStore.dichVuNhanVienDetail?.tenNhanVien}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={2}>
                                        <Box>
                                            {dichVuNhanVienStore.dichVuNhanVienDetail?.rate}
                                            <StarIcon
                                                style={{ opacity: 0.55 }}
                                                sx={{ color: '#EE8935' }}
                                                fontSize="inherit"
                                            />{' '}
                                            -{' '}
                                        </Box>
                                        <Chip
                                            label={dichVuNhanVienStore.dichVuNhanVienDetail?.chucVu}
                                        />
                                        <Typography>
                                            {dichVuNhanVienStore.dichVuNhanVienDetail?.soDienThoai}
                                        </Typography>
                                    </Box>
                                </Box>
                                <TableContainer style={{ height: '350px' }}>
                                    <Table>
                                        <TableBody>
                                            {dichVuNhanVienStore.dichVuNhanVienDetail
                                                ?.dichVuThucHiens.length > 0 ? (
                                                dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens?.map(
                                                    (item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell align="left">
                                                                <Box
                                                                    display={'flex'}
                                                                    flexDirection={'row'}
                                                                    alignItems={'center'}
                                                                    gap="8px">
                                                                    <Avatar variant="square" />{' '}
                                                                    <Typography>
                                                                        {item.tenDichVu}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align={'right'}>
                                                                <Typography>
                                                                    {item.soPhutThucHien} {' phút'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align={'right'}>
                                                                <Typography>
                                                                    {item.donGia}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <Box
                                                    display={'flex'}
                                                    alignItems="center"
                                                    justifyContent={'center'}
                                                    textAlign={'center'}
                                                    padding={'32px'}>
                                                    Không có bản ghi nào được hiển thị
                                                </Box>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        this.onModal();
                                    }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <CreateOrEditDichVuNhanVienModal
                    visiable={this.state.visiableModal}
                    handleClose={this.handleCloseModal}
                    handleOk={this.onModal}
                />
            </Box>
        );
    }
}
export default observer(SettingDichVuNhanVien);
