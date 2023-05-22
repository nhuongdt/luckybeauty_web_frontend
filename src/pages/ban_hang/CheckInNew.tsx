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
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import { Add, Menu, CalendarMonth, MoreHoriz, QueryBuilder, Search } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ModalAddCustomerCheckIn from '../check_in/modal_add_cus_checkin';
import { PropModal } from '../../utils/PropParentToChild';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';

import '../../App.css';
import { Guid } from 'guid-typescript';
import Utils from '../../utils/utils';
import CheckinService from '../../services/check_in/CheckinService';
import ModelNhanVienThucHien from '../nhan_vien_thuc_hien/modelNhanVienThucHien';

import { dbDexie } from '../../lib/dexie/dexieDB';

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
                    color: '#7C3367'
                }
            }
        }
    }
});

export default function CustomersChecking({ hanleChoseCustomer }: any) {
    const history = useNavigate();

    const [cusChecking, setCusChecking] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );
    const [listCusChecking, setListCusChecking] = useState<PageKhachHangCheckInDto[]>([]);

    const [triggerAddCheckIn, setTriggerAddCheckIn] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const GetListCustomerChecking = async () => {
        const input = { keyword: '', SkipCount: 0, MaxResultCount: 50 };
        const list = await CheckinService.GetListCustomerChecking(input);
        setListCusChecking(list);
    };

    const PageLoad = () => {
        GetListCustomerChecking();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const saveCheckInOK = async (dataCheckIn: any) => {
        console.log('saveCheckInOK ', dataCheckIn);

        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn.id,
            idCheckIn: dataCheckIn.idCheckIn,
            maKhachHang: dataCheckIn.maKhachHang,
            tenKhachHang: dataCheckIn.tenKhachHang,
            soDienThoai: dataCheckIn.soDienThoai,
            tongTichDiem: dataCheckIn.tongTichDiem,
            dateTimeCheckIn: dataCheckIn.dateTimeCheckIn
        });
        setListCusChecking([...listCusChecking, cusChecking]);

        dbDexie.khachCheckIn.add(cusChecking);

        // check exist dexie
        const cus = await dbDexie.khachCheckIn
            .where('idKhachHang')
            .equals(dataCheckIn.idKhachHang)
            .toArray();
        if (cus.length === 0) {
            // remove & add again
            await dbDexie.khachCheckIn.delete(dataCheckIn.idKhachHang);
            await dbDexie.khachCheckIn.add(dataCheckIn);
        } else {
            // add to dexie
            await dbDexie.khachCheckIn.add(dataCheckIn);
        }
    };

    const handleClickCustomer = async (item: any) => {
        setCusChecking((old: any) => {
            return {
                ...old,
                idCheckIn: item.idCheckIn,
                idKhachHang: item.idKhachHang,
                maKhachHang: item.maKhachHang,
                tenKhachHang: item.tenKhachHang,
                soDienThoai: item.soDienThoai,
                tongTichDiem: item.tongTichDiem
            };
        });
        console.log('item', item);
        hanleChoseCustomer(item);

        // add to dexie
        const cus = await dbDexie.khachCheckIn
            .where('idKhachHang')
            .equals(item.idKhachHang)
            .toArray();
        if (cus.length === 0) {
            await dbDexie.khachCheckIn.add(item);
        }
    };
    const [show, setShow] = useState(false);
    const handleToggle = () => {
        setShow(!show);
    };
    return (
        <>
            <ModalAddCustomerCheckIn trigger={triggerAddCheckIn} handleSave={saveCheckInOK} />
            <Grid item xs={12} sm={6} md={8} lg={9} xl={9}>
                <Grid container display="flex" justifyContent="end">
                    <Grid item xs={12} lg={7} sm={7} md={4}>
                        <TextField
                            sx={{
                                backgroundColor: '#FFFAFF',
                                borderColor: '#CDC9CD!important',
                                borderWidth: '1px!important'
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={5} sm={5} md={8}>
                        <Stack spacing={1} direction="row" display="flex" justifyContent="end">
                            <Menu className="btnIcon" />
                            <CalendarMonth className="btnIcon" />
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: '#7C3367!important',
                                    color: '#4C4B4C'
                                }}>
                                Dịch vụ
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#7C3367!important'
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

            <Grid container padding={2} columnSpacing={2} rowSpacing={2}>
                {listCusChecking.map((item: any, index: any) => (
                    <Grid
                        item
                        lg={3}
                        sm={4}
                        xs={6}
                        key={index}
                        onClick={() => {
                            handleClickCustomer(item);
                        }}>
                        <div
                            style={{
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '24px'
                            }}>
                            <Box display="flex" gap="8px">
                                <Avatar
                                    // src={Client.avatar}
                                    // alt={item.tenKhachHang}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <div>
                                    <Typography color="#333233" variant="subtitle1">
                                        {item.tenKhachHang}
                                    </Typography>
                                    <Typography color="#999699" fontSize="12px">
                                        {item.soDienThoai}
                                    </Typography>
                                </div>
                            </Box>
                            <Box display="flex" gap="8px" marginTop="16px">
                                <Typography fontSize="14px" color="#4C4B4C">
                                    Điểm tích lũy:
                                </Typography>
                                <Typography fontSize="14px" color="#4C4B4C" fontWeight="700">
                                    {item.tongTichDiem}
                                </Typography>
                            </Box>
                            <Box display="flex" marginTop="16px">
                                <Typography color="#666466" fontSize="14px">
                                    {item.dateCheckIn}
                                </Typography>
                                <Typography color="#666466" fontSize="14px" marginLeft="13px">
                                    {/* <img src={clockIcon} style={{ marginRight: '5px' }} /> */}
                                    {/* <Box>
                                            <QueryBuilder
                                                style={{ fontSize: '14px', marginTop: '-5px' }}
                                            />
                                        </Box> */}
                                    {item.timeCheckIn}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    lineHeight="16px"
                                    className="state"
                                    sx={{
                                        padding: '4px 12px ',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8DD',
                                        color: '#FFC700',
                                        marginLeft: 'auto'
                                    }}>
                                    Dang cho
                                </Typography>
                            </Box>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
