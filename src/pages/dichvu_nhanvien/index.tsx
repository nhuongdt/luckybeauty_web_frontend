import { Component, ReactNode } from 'react';
import { SuggestDonViQuiDoiDto } from '../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestNhanVienDichVuDto } from '../../services/suggests/dto/SuggestNhanVienDichVuDto';
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
import NhanVienDichVuTab from './components/nhanVien_DichVu_Modal';
import DichVuNhanVienTab from './components/dichVu_NhanVien_Modal';
import suggestStore from '../../stores/suggestStore';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import StarIcon from '@mui/icons-material/Star';
import { observer } from 'mobx-react';
import dichVuNhanVienStore from '../../stores/dichVuNhanVienStore';
import AppConsts from '../../lib/appconst';

class SettingDichVuNhanVien extends Component {
    // state = {
    //     visiableModal: false,
    //     suggestDichVu: [] as SuggestDonViQuiDoiDto[],
    //     suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    // };

    // onModal = () => {
    //     this.setState({ visiableModal: !this.state.visiableModal });
    // };
    // handleCloseModal = () => {
    //     this.setState({ visiableModal: false });
    // };
    state = {
        settingValue: 'Service',
        suggestDichVu: [] as SuggestDonViQuiDoiDto[],
        suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        const kyThuatViens = await suggestStore.getSuggestKyThuatVien();
        const dichVus = await suggestStore.getSuggestDichVu();
        await this.setState({
            suggestDichVus: dichVus,
            suggestkyThuatVien: kyThuatViens
        });
        dichVuNhanVienStore.idNhanVien = suggestStore.suggestKyThuatVien[0].id;
        await dichVuNhanVienStore.getDichVuNhanVienDetail(
            suggestStore.suggestKyThuatVien[0].id ?? AppConsts.guidEmpty
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
                <Box padding={'64px 32px'}>
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
                                    {suggestStore.suggestKyThuatVien?.map((item, key) => (
                                        <ListItem
                                            key={key}
                                            onClick={async () => {
                                                await dichVuNhanVienStore.getDichVuNhanVienDetail(
                                                    item.id
                                                );
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
                                <TableContainer>
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
                                                                <Avatar />{' '}
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
                                {/* <List
                                    sx={{
                                        overflow: 'auto',
                                        marginTop: '8px'
                                    }}>
                                    {dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens?.map(
                                        (item, key) => (
                                            <Box
                                                key={key}
                                                display={'flex'}
                                                flexDirection={'row'}
                                                justifyContent={'space-between'}
                                                borderBottom={'1px solid #EBEBEB'}
                                                borderTop={'1px solid #EBEBEB'}
                                                padding={'16px'}>
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    alignItems={'center'}
                                                    gap="4px">
                                                    <Avatar />{' '}
                                                    <Typography>{item.tenDichVu}</Typography>
                                                </Box>
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    alignItems={'center'}
                                                    gap={8}>
                                                    <Typography>
                                                        {item.soPhutThucHien} {' phút'}
                                                    </Typography>
                                                    <Typography>{item.donGia}</Typography>
                                                </Box>
                                            </Box>
                                        )
                                    )}
                                </List> */}
                                <Button fullWidth variant="contained">
                                    Cập nhật
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            // <div>
            //     {/* //     <Button onClick={this.onModal}>Show</Button>
            // //     <CreateOrEditDichVuNhanVienModal
            // //         visiable={this.state.visiableModal}
            // //         handleClose={this.handleCloseModal}
            // //         handleOk={this.onModal}
            // //     /> */}
            //     <Box display="flex" alignItems="center" padding={'32px'}>
            //         <Grid container display={'flex'} alignItems={'center'}>
            //             <Grid item xs={12} md={6}>
            //                 <Typography style={{ float: 'left' }}>Cài đặt theo</Typography>
            //             </Grid>
            //             <Grid item xs={12} md={6}>
            //                 <RadioGroup
            //                     style={{ float: 'right' }}
            //                     row
            //                     value={this.state.settingValue}
            //                     onChange={this.handleSettingChange}>
            //                     <FormControlLabel
            //                         value={'Service'}
            //                         control={<Radio />}
            //                         label={'Dịch vụ'}
            //                     />
            //                     <FormControlLabel
            //                         value={'Employee'}
            //                         control={<Radio />}
            //                         label={'Nhân viên'}
            //                     />
            //                 </RadioGroup>
            //             </Grid>
            //         </Grid>
            //     </Box>
            //     <Box padding={'32px'}>
            //         {this.state.settingValue == 'Employee' ? (
            //             <NhanVienDichVuTab
            //                 suggestDichVu={suggestStore.suggestDichVu}
            //                 suggestKyThuatVien={suggestStore.suggestKyThuatVien}
            //             />
            //         ) : (
            //             <DichVuNhanVienTab
            //                 suggestDichVu={suggestStore.suggestDichVu}
            //                 suggestKyThuatVien={suggestStore.suggestKyThuatVien}
            //             />
            //         )}
            //     </Box>
            // </div>
        );
    }
}
export default observer(SettingDichVuNhanVien);
