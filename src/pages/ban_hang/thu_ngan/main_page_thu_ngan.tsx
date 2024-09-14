import { Button, IconButton, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import TabPanel from '../../../components/TabPanel/TabPanel';
import '../style.css';
import '../../../App.css';

import PageThuNgan from './page_thu_ngan';
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
import MenuWithDataHasSearch from '../../../components/Menu/MenuWithData_HasSearch';
import TabKhachHangChecking from '../../check_in/tab_khach_hang_checking';

const TabMain = {
    CHECK_IN: 1,
    THU_NGAN: 2
};

type IPropDropdownChiNhanh = {
    idChosed: string;
    handleChoseChiNhanh: (itemChosed: IList) => void;
};

export const ThuNganSetting = ({ idChosed, handleChoseChiNhanh }: IPropDropdownChiNhanh) => {
    const [lblChiNhanh, setLblChiNhanh] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [allChiNhanh_byUser, setAllChiNhanh_byUser] = useState<SuggestChiNhanhDto[]>([]);

    const expandDropdownChiNhanh = Boolean(anchorEl);

    const GetChiNhanhByUser = async () => {
        const data = await chiNhanhService.GetChiNhanhByUser();
        setAllChiNhanh_byUser(data);

        if (utils.checkNull_OrEmpty(idChosed)) {
            const itemCN = data?.filter((x) => x.id === idChosed);
            if (itemCN?.length > 0) {
                setLblChiNhanh(itemCN[0]?.tenChiNhanh);

                const itemChosed: IList = {
                    id: itemCN[0]?.id,
                    text: itemCN[0]?.tenChiNhanh
                };
                handleChoseChiNhanh(itemChosed);
            }
        } else {
            setLblChiNhanh(data[0]?.tenChiNhanh);
        }
    };

    useEffect(() => {
        GetChiNhanhByUser();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const choseChiNhanh = (item: IList) => {
        setAnchorEl(null);
        setLblChiNhanh(item?.text);
        handleChoseChiNhanh(item);
    };

    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <LocationOnOutlinedIcon />
            <Stack>
                <Typography variant="body1" onClick={handleClick}>
                    {lblChiNhanh}
                </Typography>
                <MenuWithDataHasSearch
                    open={expandDropdownChiNhanh}
                    lstData={allChiNhanh_byUser?.map((x) => {
                        return {
                            id: x.id,
                            text: x.tenChiNhanh
                        } as IList;
                    })}
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
    const [txtSearch, setTextSearch] = useState('');
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [tabMainActive, setTabMainActive] = useState(TabMain.THU_NGAN);
    const [isShowModalFilterNhomHangHoa, setIsShowModalFilterNhomHangHoa] = useState(false);
    const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);

    const [idChiNhanhChosed, setIdChiNhanhChosed] = useState<string>(Cookies.get('IdChiNhanh') ?? '');
    const [customerIdChosed, setCustomerIdChosed] = useState<string>('');
    const [pageThuNgan_idChecking, setPageThuNgan_idChecking] = useState<string>();
    const [pageThuNgan_LoaiHoaDon, setPageThuNgan_LoaiHoaDon] = useState(LoaiChungTu.HOA_DON_BAN_LE);

    const changeActiveTabMain = (event: React.SyntheticEvent, tabNew: number) => {
        setTabMainActive(tabNew);
        setIsShowModalAdd(false);
    };
    const changeTabHoaDon = (event: React.SyntheticEvent, tabNew: number) => {
        setPageThuNgan_LoaiHoaDon(tabNew);
    };

    const onAgreeFilterNhomHang = (arrIdNhomHang: string[]) => {
        setArrIdNhomHangFilter([...arrIdNhomHang]);
        setIsShowModalFilterNhomHangHoa(false);
    };

    const changeChiNhanh = (item: IList) => {
        setIdChiNhanhChosed(item?.id);
    };

    // const getMaHoaDonMax = (loaiHoaDon: number): string => {
    //     const arrMaHD = allInvoiceWaiting
    //         ?.filter((x) => x.idLoaiChungTu === loaiHoaDon)
    //         .map((x) => {
    //             return x?.maHoaDon;
    //         });

    //     const numbers = arrMaHD
    //         .flatMap((item) => item.match(/\d+/g)) // Extract arrays of number strings
    //         .map(Number) // Convert to numbers
    //         .filter((num) => !isNaN(num));
    //     const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 1;
    //     if (maxNumber < 10) {
    //         return '0' + maxNumber;
    //     } else {
    //         return maxNumber.toString();
    //     }
    // };

    const onClickAddHoaDon = (customerId: string, idCheckIn?: string) => {
        setTabMainActive(TabMain.THU_NGAN);
        setCustomerIdChosed(customerId);
        setPageThuNgan_idChecking(idCheckIn ?? '');
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
                spacing={{ xs: 2, sm: 2, lg: 3 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} flex={2}>
                    <HomeOutlinedIcon
                        titleAccess="Đi đến trang chủ"
                        onClick={() => navigation('/home')}
                        sx={{ color: 'var(--color-main)', '&:hover': { cursor: 'pointer' } }}
                    />
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <Tabs value={tabMainActive} onChange={changeActiveTabMain} aria-label="nav tabs example">
                            <Tab label="Check in" value={TabMain.CHECK_IN} />
                            <Tab label="Thu ngân" value={TabMain.THU_NGAN} />
                        </Tabs>
                    </Stack>
                </Stack>
                {tabMainActive != TabMain.THU_NGAN ? (
                    <Stack flex={{ sm: 2, lg: 4, xs: 2, md: 1 }} direction={'row'} spacing={1}>
                        <Stack flex={5}>
                            <TextField
                                size="small"
                                placeholder="Tìm kiếm khách hàng"
                                onChange={(e) => setTextSearch(e.target.value)}
                                InputProps={{ startAdornment: <SearchIcon /> }}
                            />
                        </Stack>
                        <Stack flex={2}>
                            <Button
                                variant="outlined"
                                color="info"
                                startIcon={<AddOutlinedIcon />}
                                onClick={() => setIsShowModalAdd(true)}>
                                Thêm khách check in
                            </Button>
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
                                    <IconButton
                                        sx={{ cursor: 'pointer' }}
                                        aria-label="Lọc sản phẩm theo nhóm"
                                        title="Lọc sản phẩm theo nhóm"
                                        onClick={() => setIsShowModalFilterNhomHangHoa(true)}>
                                        <FilterAltOutlinedIcon />
                                    </IconButton>
                                )
                            }}
                        />
                    </Stack>
                )}
                <Stack flex={tabMainActive == TabMain.THU_NGAN ? 5 : 2}>
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={tabMainActive == TabMain.THU_NGAN ? 'space-between' : 'end'}>
                        {tabMainActive == TabMain.THU_NGAN && (
                            <Tabs
                                value={pageThuNgan_LoaiHoaDon}
                                onChange={changeTabHoaDon}
                                aria-label="nav tabs example">
                                <Tab label="Hóa đơn" value={LoaiChungTu.HOA_DON_BAN_LE} />
                                <Tab label="Gói dịch vụ" value={LoaiChungTu.GOI_DICH_VU} />
                            </Tabs>
                        )}

                        <ThuNganSetting idChosed={idChiNhanhChosed} handleChoseChiNhanh={changeChiNhanh} />
                    </Stack>
                </Stack>
            </Stack>

            {tabMainActive !== TabMain.THU_NGAN ? (
                <TabPanel
                    value={tabMainActive}
                    index={TabMain.CHECK_IN}
                    style={{ minHeight: '86vh', position: 'relative' }}>
                    <TabKhachHangChecking
                        txtSearch={txtSearch}
                        idChiNhanhChosed={idChiNhanhChosed}
                        onClickAddHoaDon={onClickAddHoaDon}
                        isShowModalAddCheckin={tabMainActive == TabMain.CHECK_IN ? isShowModalAdd : false}
                        onCloseModalAddCheckin={() => setIsShowModalAdd(false)}
                    />
                </TabPanel>
            ) : (
                <TabPanel value={tabMainActive} index={TabMain.THU_NGAN}>
                    <PageThuNgan
                        txtSearch={txtSearch}
                        loaiHoaDon={pageThuNgan_LoaiHoaDon}
                        idChiNhanhChosed={idChiNhanhChosed}
                        customerIdChosed={customerIdChosed}
                        idCheckIn={pageThuNgan_idChecking}
                        arrIdNhomHangFilter={arrIdNhomHangFilter}
                        onSetActiveTabLoaiHoaDon={(idLoaiChungTu: number) => setPageThuNgan_LoaiHoaDon(idLoaiChungTu)}
                    />
                </TabPanel>
            )}
        </Stack>
    );
}
