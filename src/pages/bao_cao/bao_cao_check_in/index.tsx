import { useRef, useState, useContext, useEffect } from 'react';
import { format, lastDayOfMonth } from 'date-fns';
import Cookies from 'js-cookie';

import {
    Grid,
    Box,
    Stack,
    TextField,
    IconButton,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TableFooter,
    SelectChangeEvent
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import { IHeaderTable, MyHeaderTable } from '../../../components/Table/MyHeaderTable';

import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import abpCustom from '../../../components/abp-custom';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { IList } from '../../../services/dto/IList';
import { LoaiSoSanh_Number, SMS_HinhThucGuiTin } from '../../../lib/appconst';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import suggestStore from '../../../stores/suggestStore';

import PopoverFilterBaoCaoCheckIn from './PopoverFilterBaoCaoCheckIn';
import {
    IBaoCaoKhachHangCheckIn,
    ParamSearchBaoCaoCheckIn
} from '../../../services/bao_cao/bao_cao_check_in/baoCaoCheckInDto';
import BaoCaoCheckInService from '../../../services/bao_cao/bao_cao_check_in/BaoCaoCheckInService';
import utils from '../../../utils/utils';

export default function BaoCaoKhachHangCheckIn() {
    const today = new Date();
    const firstLoad = useRef(true);
    const firstLoad2 = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';
    const [txtSearch, setTxtSearch] = useState('');
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [paramSearch, setParamSearch] = useState<ParamSearchBaoCaoCheckIn>({
        textSearch: '',
        currentPage: 1,
        columnSort: 'tenKhachHang',
        typeSort: 'asc',
        idChiNhanhs: [idChiNhanhCookies],
        // mặc định: full thời gian
        fromDate: null,
        toDate: null,
        // mặc định: chỉ lấy khách hàng đã checkin
        soLanCheckIn_From: 1,
        soLanCheckIn_LoaiSoSanh: LoaiSoSanh_Number.GREATER_THAN_OR_EQUALS,
        // mặc định: chỉ lấy khách hàng chưa quay lại
        soNgayChuaCheckIn_From: 1
    } as ParamSearchBaoCaoCheckIn);
    const [pageDataBaoCao, setPageDataBaoCao] = useState<PagedResultDto<IBaoCaoKhachHangCheckIn>>(
        {} as PagedResultDto<IBaoCaoKhachHangCheckIn>
    );

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [prevParamSearch, setPrevParamSearch] = useState<ParamSearchBaoCaoCheckIn>(paramSearch);
    if (paramSearch !== prevParamSearch) {
        setPrevParamSearch(paramSearch);
    }

    const PageLoad = async () => {
        suggestStore.getSuggestNhomKhach();
        await GetBaoCaoKhachHangCheckIn();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad2.current) {
            firstLoad2.current = false;
            return;
        }
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idChiNhanhs: chinhanh?.id === '' ? [idChiNhanhCookies] : [chinhanh.id]
        });
    }, [chinhanh.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetBaoCaoKhachHangCheckIn();
    }, [prevParamSearch]);

    const GetBaoCaoKhachHangCheckIn = async () => {
        const data = await BaoCaoCheckInService.GetBaoCaoKhachHang_CheckIn(prevParamSearch);
        setPageDataBaoCao({
            ...pageDataBaoCao,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (prevParamSearch?.pageSize ?? 10))
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            textSearch: txtSearch
        });
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });
        setArrIdChosed([]);
    };

    const onSortTable = (columnSort: string) => {
        setParamSearch({
            ...paramSearch,
            columnSort: columnSort,
            typeSort: paramSearch.typeSort == '' ? 'desc' : paramSearch.typeSort == 'asc' ? 'desc' : 'asc'
        });
    };

    const onClickCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isCheck = event.currentTarget.checked;
        setIsCheckAll(isCheck);

        const arrIdThisPage = pageDataBaoCao?.items?.map((x) => {
            return x.id;
        });
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, ...arrIdThisPage]);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => !arrIdThisPage.includes(x)));
        }
    };

    const onClickCheckOne = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        const isCheck = event.currentTarget.checked;
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, rowId]);

            const arrIdThisPage = pageDataBaoCao?.items?.map((x) => {
                return x.id;
            });
            const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
            setIsCheckAll(arrIdThisPage.length === arrExist.length + 1);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => x !== rowId));
            setIsCheckAll(false);
        }
    };
    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: ParamSearchBaoCaoCheckIn) => {
        setAnchorElFilter(null);
        console.log(33, paramFilter);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idNhomKhachs: paramFilter?.idNhomKhachs,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            soNgayChuaCheckIn_From: paramFilter?.soNgayChuaCheckIn_From,
            soNgayChuaCheckIn_To: paramFilter?.soNgayChuaCheckIn_To,
            soLanCheckIn_From: paramFilter?.soLanCheckIn_From,
            soLanCheckIn_To: paramFilter?.soLanCheckIn_To,
            soLanDatHen_From: paramFilter?.soLanDatHen_From,
            soLanDatHen_To: paramFilter?.soLanDatHen_To
        });
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                break;
            case 2:
                {
                    //
                }
                break;
        }
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.pageSize = pageDataBaoCao.totalCount;
        param.currentPage = 1;
        // const data = await SoQuyServices.ExportToExcel(param);
        // fileDowloadService.downloadExportFile(data);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maKhachHang', columnText: 'Mã khách' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'soLanCheckIn', columnText: 'Số lần checkin', align: 'right' },
        { columnId: 'ngayCheckInGanNhat', columnText: 'Ngày checkin gần nhất', align: 'center' },
        { columnId: 'soNgaychuaCheckIn', columnText: 'Số ngày chưa checkin', align: 'right' }

        // { columnId: 'soLanDatHen', columnText: 'Số lần đặt hẹn', align: 'right' },
        // { columnId: 'soLanHuyHen', columnText: 'Số lần hủy hẹn', align: 'right' }
    ];

    return (
        <>
            {/* <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete> */}
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Box paddingTop={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} lg={6} md={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={5} lg={4} md={4}>
                                <span className="page-title"> Báo cáo check in</span>
                            </Grid>
                            <Grid item xs={12} sm={7} lg={8} md={8}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    onChange={(e) => {
                                        setTxtSearch(e.target.value);
                                    }}
                                    onKeyDown={handleKeyDownTextSearch}
                                    className="text-search"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton onClick={hanClickIconSearch}>
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6} md={12}>
                        <Stack
                            direction={'row'}
                            spacing={1}
                            justifyContent={'flex-end'}
                            sx={{
                                '& button': {
                                    height: '40px'
                                }
                            }}>
                            <Stack sx={{ display: 'none' }}>
                                <TextField
                                    label="Thời gian check-in"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '40px!important'
                                        },
                                        backgroundColor: 'white'
                                    }}
                                    onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                    value={`${format(
                                        new Date(paramSearch.fromDate as string),
                                        'dd/MM/yyyy'
                                    )} - ${format(new Date(paramSearch.toDate as string), 'dd/MM/yyyy')}`}
                                />
                                <DateFilterCustom
                                    id="popover-date-filter"
                                    open={openDateFilter}
                                    anchorEl={anchorDateEl}
                                    onClose={() => setAnchorDateEl(null)}
                                    onApplyDate={onApplyFilterDate}
                                />
                            </Stack>
                            <Button
                                variant="outlined"
                                onClick={exportToExcel}
                                startIcon={<FileUploadIcon />}
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px',
                                    display: abpCustom.isGrandPermission('Pages.QuyHoaDon.Export') ? '' : 'none'
                                }}
                                className="btn-outline-hover">
                                Xuất
                            </Button>

                            <FilterAltOutlinedIcon
                                titleAccess="Lọc nâng cao"
                                className="btnIcon"
                                sx={{
                                    height: '40px!important',
                                    padding: '8px!important',
                                    background: 'white'
                                }}
                                onClick={(event) => setAnchorElFilter(event.currentTarget)}
                            />
                            <PopoverFilterBaoCaoCheckIn
                                anchorEl={anchorElFilter}
                                paramFilter={paramSearch}
                                handleClose={() => setAnchorElFilter(null)}
                                handleApply={ApplyFilter}
                            />
                        </Stack>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: '24px', paddingRight: '8px' }}>
                    <Grid item xs={8}>
                        {arrIdChosed?.length > 0 && (
                            <ActionRowSelect
                                lstOption={
                                    [
                                        {
                                            id: SMS_HinhThucGuiTin.ZALO.toString(),
                                            text: 'Gửi tin zalo',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Delete')
                                        },
                                        {
                                            id: SMS_HinhThucGuiTin.SMS.toString(),
                                            text: 'Gửi tin SMS',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Print')
                                        }
                                    ] as IList[]
                                }
                                countRowSelected={arrIdChosed.length}
                                title="khách hàng"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setArrIdChosed([]);
                                    setIsCheckAll(false);
                                }}
                            />
                        )}
                    </Grid>
                </Grid>

                <Box marginTop={arrIdChosed.length > 0 ? 1 : 2}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Stack className="page-box-right">
                                <TableContainer className="data-grid-row">
                                    <Table>
                                        <TableHead>
                                            <MyHeaderTable
                                                showAction={false}
                                                isCheckAll={isCheckAll}
                                                sortBy={paramSearch?.columnSort ?? ''}
                                                sortType={paramSearch?.typeSort ?? 'asc'}
                                                onRequestSort={onSortTable}
                                                onSelectAllClick={onClickCheckAll}
                                                listColumnHeader={listColumnHeader}
                                            />
                                        </TableHead>
                                        <TableBody>
                                            {pageDataBaoCao?.items?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center" className="td-check-box">
                                                        <Checkbox
                                                            checked={arrIdChosed.includes(row.id)}
                                                            onChange={(event) => onClickCheckOne(event, row.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.maKhachHang}
                                                    </TableCell>
                                                    <TableCell
                                                        className="lableOverflow"
                                                        sx={{ maxWidth: 200 }}
                                                        title={row?.tenKhachHang}>
                                                        {row?.tenKhachHang}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.soDienThoai}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanCheckIn ?? 0)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {utils.checkNull(row?.ngayCheckInGanNhat)
                                                            ? ''
                                                            : format(
                                                                  new Date(row?.ngayCheckInGanNhat ?? new Date()),
                                                                  'dd/MM/yyyy'
                                                              )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {row?.soNgayChuaCheckIn == -1
                                                            ? ''
                                                            : new Intl.NumberFormat('vi-VN').format(
                                                                  row?.soNgayChuaCheckIn ?? 0
                                                              )}
                                                    </TableCell>
                                                    {/* <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanDatHen ?? 0)}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanHuyHen ?? 0)}
                                                    </TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        {pageDataBaoCao?.totalCount == 0 && (
                                            <TableFooter>
                                                <TableRow className="table-empty">
                                                    <TableCell colSpan={20} align="center">
                                                        Báo cáo không có dữ liệu
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Grid>
                    </Grid>

                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 0}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataBaoCao.totalCount ?? 0}
                        totalPage={pageDataBaoCao.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Box>
            </Box>
        </>
    );
}
