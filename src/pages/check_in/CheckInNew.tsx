import {
    Box,
    Button,
    Grid,
    Stack,
    InputAdornment,
    TextField,
    Typography,
    IconButton,
    ButtonGroup,
    Avatar
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import utils from '../../utils/utils';

import { Add, Menu, CalendarMonth, MoreHoriz, QueryBuilder, Search } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import { PropConfirmOKCancel, PropModal } from '../../utils/PropParentToChild';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import CloseIcon from '@mui/icons-material/Close';
import { Guid } from 'guid-typescript';
import Utils from '../../utils/utils';
import CheckinService from '../../services/check_in/CheckinService';
import ModelNhanVienThucHien from '../nhan_vien_thuc_hien/modelNhanVienThucHien';

import { dbDexie } from '../../lib/dexie/dexieDB';
import MauInServices from '../../services/mau_in/MauInServices';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import EventIcon from '@mui/icons-material/Event';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import { ListNhanVienDataContext } from '../../services/nhan-vien/dto/NhanVienDataContext';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';

const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: 'var(--color-main)'
                }
            }
        }
    }
});

export default function CustomersChecking({ hanleChoseCustomer }: any) {
    const MaxPc1490 = useMediaQuery('(max-width: 1490px)');
    const [txtSearch, setTextSeach] = useState('');
    const [allCusChecking, setAllCusChecking] = useState<PageKhachHangCheckInDto[]>([]);
    const [idCheckinDelete, setIdCheckinDelete] = useState('');

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);

    const GetListCustomerChecking = async () => {
        const input = { keyword: '', SkipCount: 0, MaxResultCount: 50 };
        const list = await CheckinService.GetListCustomerChecking(input);
        setAllCusChecking([...list]);
    };

    const GetAllNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setLstNhanVien([...data.items]);
    };

    const PageLoad = () => {
        GetListCustomerChecking();
        GetAllNhanVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const SearhCusChecking = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allCusChecking.filter(
                (x) =>
                    (x.maKhachHang !== null &&
                        x.maKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenKhachHang !== null &&
                        x.tenKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null &&
                        x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maKhachHang !== null &&
                        utils.strToEnglish(x.maKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.tenKhachHang !== null &&
                        utils.strToEnglish(x.tenKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null &&
                        utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
            );
            return data;
        } else {
            return allCusChecking;
        }
    };

    const deleteCusChecking = async () => {
        setAllCusChecking(
            allCusChecking.filter((x: PageKhachHangCheckInDto) => x.idCheckIn !== idCheckinDelete)
        );
        await CheckinService.UpdateTrangThaiCheckin(idCheckinDelete, 0);
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );

        const dataCheckIn_Dexie = await dbDexie.khachCheckIn
            .where('idCheckIn')
            .equals(idCheckinDelete)
            .toArray();
        if (dataCheckIn_Dexie.length > 0) {
            await dbDexie.khachCheckIn
                .where('idCheckIn')
                .equals(idCheckinDelete)
                .delete()
                .then((deleteCount: any) =>
                    console.log('idcheckindelete ', idCheckinDelete, 'deletecount', deleteCount)
                );

            await dbDexie.hoaDon
                .where('idKhachHang')
                .equals(dataCheckIn_Dexie[0].idKhachHang as string)
                .delete()
                .then((deleteCount: any) => console.log('deleteHoadon', deleteCount));
        }
    };

    const listCusChecking = SearhCusChecking();

    const saveCheckInOK = async (dataCheckIn: any) => {
        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn.idKhachHang,
            idCheckIn: dataCheckIn.idCheckIn,
            maKhachHang: dataCheckIn.maKhachHang,
            tenKhachHang: dataCheckIn.tenKhachHang,
            soDienThoai: dataCheckIn.soDienThoai,
            tongTichDiem: dataCheckIn.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn
        });
        setAllCusChecking([...allCusChecking, cusChecking]);

        // check exist dexie
        if (dataCheckIn.idKhachHang !== Guid.EMPTY) {
            const cus = await dbDexie.khachCheckIn
                .where('idCheckIn')
                .equals(dataCheckIn.idCheckIn)
                .toArray();
            if (cus.length > 0) {
                // remove & add again
                await dbDexie.khachCheckIn.delete(dataCheckIn.idCheckIn);
                await dbDexie.khachCheckIn.add(cusChecking);
            } else {
                // add to dexie
                await dbDexie.khachCheckIn.add(cusChecking);
            }
        }
    };

    const handleClickCustomer = async (item: any) => {
        hanleChoseCustomer(item);

        // add to dexie
        const cus = await dbDexie.khachCheckIn.where('idCheckIn').equals(item.idCheckIn).toArray();
        if (cus.length === 0) {
            await dbDexie.khachCheckIn.add(item);
        }
    };

    return (
        <>
            <ListNhanVienDataContext.Provider value={lstNhanVien}>
                <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            </ListNhanVienDataContext.Provider>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteCusChecking}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
                <Box
                    sx={{
                        position: 'absolute',
                        height: '100vh',
                        width: '100vw',
                        left: '0',
                        top: '0',
                        pointerEvents: 'none',
                        bgcolor: '#f8f8f8',
                        zIndex: '-5'
                    }}></Box>
                <Grid container>
                    <Grid item xs={12}>
                        <Stack
                            flexWrap="wrap"
                            useFlexGap
                            justifyContent={{
                                md: 'flex-end',
                                lg: 'flex-end',
                                sm: 'flex-start',
                                xs: 'flex-start'
                            }}
                            spacing={{ xs: 2, sm: 2, md: 1, lg: 1 }}
                            direction="row"
                            display="flex"
                            alignItems="center">
                            <TextField
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important',
                                    borderWidth: '1px!important',
                                    maxWidth: '300px'
                                }}
                                size="small"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(event) => {
                                    setTextSeach(event.target.value);
                                }}
                            />
                            <EventIcon
                                sx={{
                                    width: 38,
                                    height: 36.5,
                                    borderRadius: '4px',
                                    border: '1px solid #cccc',
                                    padding: '6px',
                                    display: 'none'
                                }}
                            />

                            <Button
                                className=" btn-container-hover"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'var(--color-main)!important'
                                }}
                                startIcon={<Add />}
                                onClick={() =>
                                    setTriggerAddCheckIn({
                                        ...triggerAddCheckIn,
                                        isShow: true
                                    })
                                }>
                                Thêm khách
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container paddingLeft={2} paddingTop={2} columnSpacing={2} rowSpacing={2}>
                {listCusChecking.map((item: any, index: any) => (
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        key={index}
                        sx={{ position: 'relative' }}>
                        <Button
                            sx={{
                                position: 'absolute',
                                top: '16px',
                                right: 0,
                                minWidth: 'unset',
                                borderRadius: '50%!important'
                            }}>
                            <CloseIcon
                                sx={{ color: '#333233' }}
                                onClick={() => {
                                    setIdCheckinDelete(item.idCheckIn);
                                    setinforDelete(
                                        new PropConfirmOKCancel({
                                            show: true,
                                            title: 'Xác nhận xóa',
                                            mes: `Bạn có chắc chắn muốn hủy bỏ khách  ${item?.tenKhachHang}  đang check in không?`
                                        })
                                    );
                                }}
                            />
                        </Button>
                        <Stack
                            padding={3}
                            direction="column"
                            justifyContent={'space-between'}
                            sx={{
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                height: '100%',
                                border: '1px solid transparent',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}
                            onClick={() => {
                                handleClickCustomer(item);
                            }}>
                            <Stack direction={'row'} spacing={2}>
                                {utils.checkNull(item?.avatar) ? (
                                    <BadgeFistCharOfName
                                        firstChar={utils.getFirstLetter(item?.tenKhachHang ?? '')}
                                    />
                                ) : (
                                    // <Avatar src={item.avatar} />
                                    <img
                                        src={item.avatar}
                                        style={{ width: 40, height: 40, borderRadius: '100%' }}
                                    />
                                )}

                                <div>
                                    <Typography variant="subtitle2" title={item.tenKhachHang}>
                                        {item.tenKhachHang}
                                    </Typography>
                                    <Typography color="#999699" variant="caption">
                                        {item.soDienThoai}
                                    </Typography>
                                </div>
                            </Stack>
                            <Stack spacing={1}>
                                <Box display="flex" gap="8px" marginTop="8px">
                                    <Typography variant="body2" color={'#3D475C'}>
                                        Điểm tích lũy:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="700">
                                        {item.tongTichDiem}
                                    </Typography>
                                </Box>
                                <Grid container>
                                    <Grid item xs={7} sm={7} md={7}>
                                        <Stack spacing={1} direction={'row'} color={'#3D475C'}>
                                            <Typography variant="body2">
                                                {item.dateCheckIn}
                                            </Typography>
                                            <Typography
                                                display="flex"
                                                alignItems="center"
                                                variant="body2">
                                                <QueryBuilder
                                                    style={{
                                                        fontSize: '12px',
                                                        marginRight: '5px'
                                                    }}
                                                />
                                                {item.timeCheckIn}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={5} sm={5} md={5}>
                                        <Box
                                            component="span"
                                            sx={{
                                                padding: '4px 12px ',
                                                borderRadius: '20px',
                                                backgroundColor: '#FFF8DD',
                                                color: '#FFC700',
                                                fontSize: '12px',
                                                float: 'right'
                                            }}>
                                            {item.txtTrangThaiCheckIn}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
