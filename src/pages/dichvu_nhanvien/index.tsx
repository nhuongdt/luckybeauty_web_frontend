import { Component, ReactNode } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    FormControlLabel,
    Grid,
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
    Typography
} from '@mui/material';
import CreateOrEditDichVuNhanVienModal from './components/create-or-edit-dichVu_nhanVien';
import suggestStore from '../../stores/suggestStore';
import StarIcon from '@mui/icons-material/Star';
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
        const kyThuatViens = await suggestStore.getSuggestKyThuatVien();
        await suggestStore.getSuggestNhanVien();
        const dichVus = await suggestStore.getSuggestDichVu();
        await this.setState({
            suggestDichVus: dichVus,
            suggestkyThuatVien: kyThuatViens
        });
        dichVuNhanVienStore.idNhanVien = suggestStore.suggestKyThuatVien[0].id;
        this.setState({ selectedItemId: suggestStore.suggestKyThuatVien[0].id });
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
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box>
                        <Typography>Cài đặt theo</Typography>
                    </Box>
                    <Box>
                        <RadioGroup
                            style={{ float: 'right' }}
                            row
                            value={this.state.settingValue}
                            onChange={this.handleSettingChange}>
                            <FormControlLabel
                                value={'Service'}
                                control={<Radio />}
                                label={'Dịch vụ'}
                            />
                            <FormControlLabel
                                value={'Employee'}
                                control={<Radio />}
                                label={'Nhân viên'}
                            />
                        </RadioGroup>
                    </Box>
                </Box>
                <Box padding={'32px 16px'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box
                                padding={'32px'}
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #E6E1E6'
                                }}>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxHeight: '470px',
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
                        <Grid item xs={12} md={8} padding={'32px'}>
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #E6E1E6',
                                    padding: '8px'
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
                                <TableContainer sx={{ maxHeight: 300 }}>
                                    <Table>
                                        <TableBody>
                                            {dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens?.map(
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
                                                            <Typography>{item.donGia}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
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
