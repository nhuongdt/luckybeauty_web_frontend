import { Avatar, Button, Divider, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import TabPanel from '../../../components/TabPanel/TabPanel';
import '../style.css';
import '../../../App.css';

import PageThuNgan from './page_thu_ngan';
import TabKhachHangNoBooking from '../../check_in/tab_khach_hang_nobooking';
import { PagedKhachHangResultRequestDto } from '../../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import TabKhachHangBooking from '../../check_in/tab_khach_hang_booking';
import TrangThaiFilter from '../../../enum/TrangThaiFilter';
import { TextTranslate } from '../../../components/TableLanguage';
import { useNavigate } from 'react-router-dom';
import { LoaiChungTu, LoaiHoaHongDichVu } from '../../../lib/appconst';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import utils from '../../../utils/utils';
import Cookies from 'js-cookie';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { Guid } from 'guid-typescript';
import ModalFilterNhomHangHoa from '../../../components/Dialog/modal_filter_nhom_hang_hoa';
import { SuggestChiNhanhDto } from '../../../services/suggests/dto/SuggestChiNhanhDto';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import { handleClickOutside } from '../../../utils/customReactHook';
import MenuWithDataHasSearch from '../../../components/Menu/MenuWithData_HasSearch';

const TabMain = {
    KHACH_HANG: 1,
    CUOC_HEN: 2,
    THU_NGAN: 3
};

type IPropDropdownChiNhanh = {
    idChosed: string;
    lstData: IList[];
    handleChoseChiNhanh: (itemChosed: IList) => void;
};

export const ThuNganSetting = ({ idChosed, lstData, handleChoseChiNhanh }: IPropDropdownChiNhanh) => {
    const [lblChiNhanh, setLblChiNhanh] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const expandDropdownChiNhanh = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const choseChiNhanh = (item: IList) => {
        setAnchorEl(null);
        handleChoseChiNhanh(item);
    };

    useEffect(() => {
        const itemChosed = lstData?.filter((x) => x.id == idChosed);
        if (itemChosed?.length > 0) {
            setLblChiNhanh(itemChosed[0].text);
        }
    }, [idChosed]);
    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <LocationOnOutlinedIcon />
            <Stack>
                <Typography variant="body1" onClick={handleClick}>
                    {lblChiNhanh}
                </Typography>
                <MenuWithDataHasSearch
                    open={expandDropdownChiNhanh}
                    lstData={lstData}
                    anchorEl={anchorEl}
                    handleClose={() => setAnchorEl(null)}
                    handleChoseItem={choseChiNhanh}
                />
            </Stack>
            <SettingsOutlinedIcon />
        </Stack>
    );
};

export default function MainPageThuNgan() {
    const navigation = useNavigate();
    const idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
    const [txtSearch, setTextSearch] = useState('');
    const [isShowModalFilterNhomHangHoa, setIsShowModalFilterNhomHangHoa] = useState(false);
    const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);

    const [tabMainActive, setTabMainActive] = useState(TabMain.KHACH_HANG);
    const [thungan_tabActive, setThungan_tabActive] = useState(LoaiChungTu.HOA_DON_BAN_LE);

    const [idChiNhanhChosed, setIdChiNhanhChosed] = useState<string>(idChiNhanh);
    const [customerIdChosed, setCustomerIdChosed] = useState<string>();
    const [idHoaDonChosing, setIdHoaDonChosing] = useState<string>();
    const [pageThuNgan_LoaiHoaDon, setPageThuNgan_LoaiHoaDon] = useState<number>();

    const [allInvoiceWaiting, setAllInvoiceWaiting] = useState<PageHoaDonDto[]>([]);
    const [allChiNhanh_byUser, setAllChiNhanh_byUser] = useState<SuggestChiNhanhDto[]>([]);

    const onClickBack_Forward = (tabNew: number) => {
        setTabMainActive(tabNew);
        setThungan_tabActive(LoaiChungTu.HOA_DON_BAN_LE);
    };

    const PageLoad = () => {
        GetListtHoaDon_fromCache();
        GetChiNhanhByUser();
    };

    const GetChiNhanhByUser = async () => {
        const data = await chiNhanhService.GetChiNhanhByUser();
        setAllChiNhanh_byUser(data);
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const changeActiveTabMain = (event: React.SyntheticEvent, tabNew: number) => {
        setTabMainActive(tabNew);
    };
    const changeTabHoaDon = (event: React.SyntheticEvent, tabNew: number) => {
        setThungan_tabActive(tabNew);
    };

    const onAgreeFilterNhomHang = (arrIdNhomHang: string[]) => {
        setArrIdNhomHangFilter([...arrIdNhomHang]);
        setIsShowModalFilterNhomHangHoa(false);
    };

    const changeChiNhanh = (item: IList) => {
        setIdChiNhanhChosed(item?.id);
    };

    const GetListtHoaDon_fromCache = async () => {
        const allHD = await dbDexie.hoaDon
            .where('idChiNhanh')
            .equals(idChiNhanh as string)
            .sortBy('ngayLapHoaDon');
        setAllInvoiceWaiting(allHD);
    };

    const getMaHoaDonMax = (loaiHoaDon: number): string => {
        const arrMaHD = allInvoiceWaiting
            ?.filter((x) => x.idLoaiChungTu === loaiHoaDon)
            .map((x) => {
                return x?.maHoaDon;
            });

        const numbers = arrMaHD
            .flatMap((item) => item.match(/\d+/g)) // Extract arrays of number strings
            .map(Number) // Convert to numbers
            .filter((num) => !isNaN(num));
        const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 1;
        if (maxNumber < 10) {
            return '0' + maxNumber;
        } else {
            return maxNumber.toString();
        }
    };

    const onClickAddHoaDon = (customerId: string, loaiHoaDon: number, bookingId?: string) => {
        setTabMainActive(TabMain.THU_NGAN);
        setThungan_tabActive(loaiHoaDon);
        setCustomerIdChosed(customerId);
        setPageThuNgan_LoaiHoaDon(loaiHoaDon);

        const hdOfCustomer = allInvoiceWaiting?.filter((x) => x.idKhachHang == customerId);
        if (hdOfCustomer?.length > 0) {
            setIdHoaDonChosing(hdOfCustomer[0]?.id);
        } else {
            const maxMaHD = getMaHoaDonMax(loaiHoaDon);
            let maHD = '';
            switch (loaiHoaDon) {
                case LoaiChungTu.HOA_DON_BAN_LE:
                    {
                        maHD = 'HD' + maxMaHD;
                    }
                    break;
                case LoaiChungTu.GOI_DICH_VU:
                    {
                        maHD = 'GDV' + maxMaHD;
                    }
                    break;
            }
            const newHD = new PageHoaDonDto({
                id: Guid.create().toString(),
                maHoaDon: maHD,
                idKhachHang: customerId as unknown as null,
                idChiNhanh: idChiNhanh,
                tenKhachHang: 'Khách lẻ'
            });
        }
    };
    return (
        <Stack className="main_page_thu_ngan" padding={2} justifyContent={'space-between'} position={'relative'}>
            <ModalFilterNhomHangHoa
                isShow={isShowModalFilterNhomHangHoa}
                onClose={() => setIsShowModalFilterNhomHangHoa(false)}
                onAgree={onAgreeFilterNhomHang}
            />
            <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
                justifyContent={'space-between'}
                spacing={{ xs: 2, sm: 2, lg: 4 }}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={2}
                    flex={tabMainActive !== TabMain.THU_NGAN ? 2 : 2}>
                    <HomeOutlinedIcon
                        onClick={() => navigation('/home')}
                        sx={{ color: 'var(--color-main)', '&:hover': { cursor: 'pointer' } }}
                    />
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        {tabMainActive === TabMain.THU_NGAN ? (
                            <>
                                <KeyboardDoubleArrowLeftIcon
                                    sx={{ width: '32px', height: '32px' }}
                                    onClick={() => onClickBack_Forward(TabMain.KHACH_HANG)}
                                />
                                <Tabs
                                    value={tabMainActive}
                                    onChange={changeActiveTabMain}
                                    aria-label="nav tabs example">
                                    <Tab label="Thu ngân" value={TabMain.THU_NGAN} />
                                </Tabs>
                            </>
                        ) : (
                            <>
                                <Tabs
                                    value={tabMainActive}
                                    onChange={changeActiveTabMain}
                                    aria-label="nav tabs example">
                                    <Tab label="Khách hàng" value={TabMain.KHACH_HANG} />
                                    <Tab label="Cuộc hẹn" value={TabMain.CUOC_HEN} />
                                </Tabs>
                                <KeyboardDoubleArrowRightIcon
                                    sx={{ width: '32px', height: '32px' }}
                                    onClick={() => onClickBack_Forward(TabMain.THU_NGAN)}
                                />
                            </>
                        )}
                    </Stack>
                </Stack>
                {tabMainActive != TabMain.THU_NGAN ? (
                    <Stack flex={{ sm: 2, lg: 3, xs: 2, md: 1 }} direction={'row'} spacing={1}>
                        <Stack flex={5}>
                            <TextField
                                size="small"
                                placeholder="Tìm kiếm khách hàng"
                                onChange={(e) => setTextSearch(e.target.value)}
                                InputProps={{ startAdornment: <SearchIcon /> }}
                            />
                        </Stack>
                        <Stack flex={2}>
                            {tabMainActive === TabMain.KHACH_HANG ? (
                                <Button variant="outlined" color="info" startIcon={<AddOutlinedIcon />}>
                                    Thêm mới khách
                                </Button>
                            ) : (
                                <Button variant="outlined" color="info" startIcon={<AddOutlinedIcon />}>
                                    Thêm lịch hẹn
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                ) : (
                    <Stack flex={{ sm: 2, lg: 5, xs: 2, md: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm dịch vụ"
                            onChange={(e) => setTextSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                                endAdornment: (
                                    <FilterAltOutlinedIcon
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => setIsShowModalFilterNhomHangHoa(true)}
                                    />
                                )
                            }}
                        />
                    </Stack>
                )}
                {tabMainActive == TabMain.THU_NGAN ? (
                    <Stack flex={{ sm: 2, lg: 5, xs: 2, md: 1 }}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Tabs value={thungan_tabActive} onChange={changeTabHoaDon} aria-label="nav tabs example">
                                <Tab label="Hóa đơn" value={LoaiChungTu.HOA_DON_BAN_LE} />
                                <Tab label="Gói dịch vụ" value={LoaiChungTu.GOI_DICH_VU} />
                            </Tabs>
                            <ThuNganSetting
                                idChosed={idChiNhanh}
                                lstData={allChiNhanh_byUser?.map((x) => {
                                    return {
                                        id: x.id,
                                        text: x.tenChiNhanh
                                    } as IList;
                                })}
                                handleChoseChiNhanh={changeChiNhanh}
                            />
                        </Stack>
                    </Stack>
                ) : (
                    <Stack direction={'row'} spacing={1} flex={2} justifyContent={'end'}>
                        <ThuNganSetting
                            idChosed={idChiNhanh}
                            lstData={allChiNhanh_byUser?.map((x) => {
                                return {
                                    id: x.id,
                                    text: x.tenChiNhanh
                                } as IList;
                            })}
                            handleChoseChiNhanh={changeChiNhanh}
                        />
                    </Stack>
                )}
            </Stack>

            {tabMainActive !== TabMain.THU_NGAN ? (
                <>
                    <TabPanel
                        value={tabMainActive}
                        index={TabMain.KHACH_HANG}
                        style={{ minHeight: '86vh', position: 'relative' }}>
                        <TabKhachHangNoBooking txtSearch={txtSearch} onClickAddHoaDon={onClickAddHoaDon} />
                    </TabPanel>
                    <TabPanel
                        value={tabMainActive}
                        index={TabMain.CUOC_HEN}
                        style={{ minHeight: '86vh', position: 'relative' }}>
                        <TabKhachHangBooking txtSearch={txtSearch} onClickAddHoaDon={onClickAddHoaDon} />
                    </TabPanel>
                </>
            ) : (
                <TabPanel value={tabMainActive} index={TabMain.THU_NGAN}>
                    <PageThuNgan
                        txtSearch={txtSearch}
                        customerIdChosed={customerIdChosed}
                        loaiHoaDon={pageThuNgan_LoaiHoaDon}
                    />
                </TabPanel>
            )}
        </Stack>
    );
}
