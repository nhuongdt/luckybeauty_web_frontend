import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid, Box, Stack, Typography, TextField, Button, Pagination, IconButton, Avatar, Link } from '@mui/material';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import { Add, LocalOfferOutlined, Search } from '@mui/icons-material';
import { PropConfirmOKCancel } from '../../../../../utils/PropParentToChild';
import ProductService from '../../../../../services/product/ProductService';
import { PagedProductSearchDto } from '../../../../../services/product/dto';
import utils from '../../../../../utils/utils';
import fileDowloadService from '../../../../../services/file-dowload.service';
import ConfirmDelete from '../../../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../../../components/AlertDialog/SnackbarAlert';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { OptionPage } from '../../../../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../../../../components/Pagination/LabelDisplayedRows';
import { PagedResultDto } from '../../../../../services/dto/pagedResultDto';
import { ChietKhauDichVuItemDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/ChietKhauDichVuItemDto';
import nhanVienService from '../../../../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import NhanSuItemDto from '../../../../../services/nhan-vien/dto/nhanSuItemDto';
import { ParamSearchDto } from '../../../../../services/dto/ParamSearchDto';
import { PagedRequestDto } from '../../../../../services/dto/pagedRequestDto';
import chietKhauDichVuService from '../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import Cookies from 'js-cookie';
import { Guid } from 'guid-typescript';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { NumericFormat } from 'react-number-format';
import ModalSetupHoaHongDichVu from './modal_setup_hoa_hong_dich_vu';

export const PopperApplyNhom = () => {
    return <></>;
};

export default function PageSetupHoaHongDichVu() {
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [isShowModalSetup, setIsShowModalSetup] = useState(false);
    const [txtSearchNV, setTxtSearchNV] = useState('');
    const [idNhanVienChosed, setIdNhanVienChosed] = useState<string>(Guid.EMPTY);
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);

    const [pageResultChietKhauDV, setPageResultChietKhauDV] = useState<PagedResultDto<ChietKhauDichVuItemDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    } as PagedResultDto<ChietKhauDichVuItemDto>);

    const [paramSearch, setParamSearch] = useState<PagedRequestDto>({
        skipCount: 1,
        maxResultCount: 50,
        keyword: '',
        sortBy: 'tenNhanVien'
    } as PagedRequestDto);

    const GetAllNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: '',
            skipCount: 1,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
        setLstNhanVien([...data.items]);
    };

    const getListSetupHoaHongDV = async () => {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? undefined;
        const data = await chietKhauDichVuService.GetAccordingByNhanVien(paramSearch, idNhanVienChosed, idChiNhanh);
        console.log(' pageResultChietKhauDV', data.items, 'allNhanVien ', allNhanVien);

        setPageResultChietKhauDV({
            items: data.items,
            totalCount: data.totalCount,
            totalPage: 1
        });
    };

    const PageLoad = async () => {
        await GetAllNhanVien();
        await getListSetupHoaHongDV();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    function showModalAddNhanVien(id = '') {
        //
    }

    function showModalSetup(action?: number, id = '') {
        setIsShowModalSetup(true);
    }

    const searchNhanVien = () => {
        if (!utils.checkNull(txtSearchNV)) {
            const txt = txtSearchNV.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x: NhanSuItemDto) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tenChucVu !== null && utils.strToEnglish(x.tenChucVu).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        searchNhanVien();
    }, [txtSearchNV]);

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            skipCount: value
        });
    };
    const changeNumberOfpage = (sizePage: number) => {
        setParamSearch({
            ...paramSearch,
            maxResultCount: sizePage
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.skipCount !== 1) {
            setParamSearch({
                ...paramSearch,
                skipCount: 1
            });
        } else {
            getListSetupHoaHongDV();
        }
    };

    const deleteRow = async () => {
        //
    };

    const exportToExcel = async () => {
        //fileDowloadService.downloadExportFile(result);
    };

    const downloadImportTemplate = async () => {
        // fileDowloadService.downloadExportFile(result);
    };

    const refInputCK: any = useRef([]);
    const refTienChietKhau: any = useRef([]);
    const gotoNextInputCK = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };

    const changeGtriChietKhau = (gtriNew: string, itemCK: ChietKhauDichVuItemDto) => {
        const gtriCK = utils.formatNumberToFloat(gtriNew);
    };
    const onClickPtramVND = (itemCK: ChietKhauDichVuItemDto, laPhanTram: boolean) => {
        //
        console.log('itemCK ', itemCK);
    };

    const columns: GridColDef[] = [
        {
            field: 'tenNhanVien',
            headerName: 'Nhân viên',
            flex: 0.7,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenDichVu',
            headerName: 'Tên dịch vụ',
            flex: 1.5,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenNhomDichVu',
            headerName: 'Nhóm dịch vụ',
            flex: 0.6,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Link component="button" underline="none">
                    {params.value}
                </Link>
            )
        },
        {
            field: 'giaDichVu',
            headerName: 'Giá bán',
            headerAlign: 'right',
            align: 'right',
            flex: 0.5,
            renderCell: (params) => (
                <Box display="flex" justifyContent="end" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'hoaHongThucHien',
            headerName: 'Thực hiện',
            headerAlign: 'right',
            align: 'right',
            flex: 0.6,
            renderCell: (params) => (
                <Stack direction={'row'} spacing={1}>
                    <NumericFormat
                        fullWidth
                        size="small"
                        variant="standard"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        value={params.value}
                        customInput={TextField}
                        InputProps={{
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        // inputRef={(el: any) => (refInputCK.current[params.row.id] = el)}
                        onChange={(e) => changeGtriChietKhau(e.target.value, params.row)}
                        // onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                        //     gotoNextInputCK(
                        //         e,
                        //         refInputCK.current[index === pageResultChietKhauDV?.totalCount - 1 ? 0 : index + 1]
                        //     )
                        // }
                    />
                    <Stack>
                        {params?.row?.laPhanTram ? (
                            <Avatar
                                style={{
                                    width: 25,
                                    height: 25,
                                    fontSize: '12px',
                                    backgroundColor: 'var(--color-main)'
                                }}
                                onClick={() => onClickPtramVND(params.row, true)}>
                                %
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{ width: 25, height: 25, fontSize: '12px' }}
                                onClick={() => onClickPtramVND(params.row, false)}>
                                đ
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
            ),
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
        },
        {
            field: 'hoaHongTuVan',
            headerAlign: 'right',
            headerName: 'Tư vấn',
            align: 'right',
            flex: 0.6,
            renderCell: (params) => (
                <Stack direction={'row'} spacing={1}>
                    <NumericFormat
                        fullWidth
                        size="small"
                        variant="standard"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        value={params.value}
                        customInput={TextField}
                        InputProps={{
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        // inputRef={(el: any) => (refInputCK.current[params.row.id] = el)}
                        onChange={(e) => changeGtriChietKhau(e.target.value, params.row)}
                        // onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                        //     gotoNextInputCK(
                        //         e,
                        //         refInputCK.current[index === pageResultChietKhauDV?.totalCount - 1 ? 0 : index + 1]
                        //     )
                        // }
                    />
                    <Stack>
                        {params?.row?.laPhanTram ? (
                            <Avatar
                                style={{
                                    width: 25,
                                    height: 25,
                                    fontSize: '12px',
                                    backgroundColor: 'var(--color-main)'
                                }}
                                onClick={() => onClickPtramVND(params.row, true)}>
                                %
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{ width: 25, height: 25, fontSize: '12px' }}
                                onClick={() => onClickPtramVND(params.row, false)}>
                                đ
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
            ),
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
        },
        {
            field: '#',
            headerName: '#',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
            renderHeader: () => <ClearOutlinedIcon sx={{ color: 'red' }} titleAccess="Xóa tất cả" />,
            renderCell: (params) => <ClearOutlinedIcon sx={{ color: 'red' }} titleAccess="Xóa dòng" />
        }
    ];

    return (
        <>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={''}
                onOk={deleteRow}
                onCancel={() => setInforDeleteProduct({ ...inforDeleteProduct, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ModalSetupHoaHongDichVu
                isShow={isShowModalSetup}
                allNhanVien={allNhanVien}
                onClose={() => setIsShowModalSetup(false)}
            />
            <Grid container className="dich-vu-page" gap={4} paddingTop={2}>
                <Grid item container alignItems="center" justifyContent="space-between">
                    <Grid container item xs={12} md={6} lg={6} alignItems="center">
                        <Grid container item alignItems="center">
                            <Grid item xs={6} sm={6} lg={4} md={4}>
                                <span className="page-title"> Hoa hồng theo dịch vụ</span>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} md={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#fff'
                                    }}
                                    variant="outlined"
                                    placeholder="Tìm dịch vụ"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton onClick={hanClickIconSearch}>
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                    onKeyDown={(event) => {
                                        handleKeyDownTextSearch(event);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} display="flex" gap="8px" justifyContent="end">
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<VerticalAlignBottomOutlinedIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            className=" btn-container-hover"
                            sx={{
                                minWidth: '143px',

                                fontSize: '14px'
                            }}
                            startIcon={<Add />}
                            onClick={() => showModalSetup()}>
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={2} paddingTop={1} columns={13}>
                    <Grid item lg={3} md={3} sm={4} xs={13}>
                        <Box className="page-box-left">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="12px"
                                borderRadius={'4px'}
                                sx={{ backgroundColor: 'var(--color-header-table)' }}>
                                <Typography fontSize="14px" fontWeight="700">
                                    Nhân viên
                                </Typography>

                                <Add
                                    sx={{
                                        transition: '.4s',
                                        height: '32px',
                                        cursor: 'pointer',
                                        width: '32px',
                                        borderRadius: '4px',
                                        padding: '4px 0px',
                                        border: '1px solid #cccc'
                                    }}
                                    onClick={() => showModalAddNhanVien()}
                                />
                            </Box>
                            <Box
                                sx={{
                                    overflow: 'auto',
                                    maxHeight: '66vh',
                                    // padding: '0px 24px',
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
                                <Stack spacing={1} paddingTop={1}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        placeholder="Tìm nhân viên"
                                        InputProps={{ startAdornment: <Search /> }}
                                        onChange={(e) => setTxtSearchNV(e.target.value)}
                                    />
                                    <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                        {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                            <Stack
                                                direction={'row'}
                                                spacing={1}
                                                key={index}
                                                sx={{ borderBottom: '1px dashed #cccc', padding: '8px' }}
                                                onClick={() => setIdNhanVienChosed(nvien.id)}>
                                                <Stack>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: 'var(--color-bg)',
                                                            color: 'var(--color-main)',
                                                            fontSize: '14px'
                                                        }}>
                                                        {utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                    </Avatar>
                                                </Stack>
                                                <Stack justifyContent={'center'} spacing={1}>
                                                    <Stack sx={{ fontSize: '14px' }}>{nvien?.tenNhanVien}</Stack>
                                                    <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                        {nvien?.tenChucVu}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={10} md={10} sm={9} xs={13}>
                        <Box className="page-box-right">
                            <DataGrid
                                disableRowSelectionOnClick
                                rowHeight={46}
                                className={'data-grid-row'}
                                rows={pageResultChietKhauDV.items}
                                columns={columns}
                                hideFooter
                                localeText={TextTranslate}
                            />

                            <Grid item container>
                                <Grid item xs={4} md={4} lg={4} sm={4}>
                                    <OptionPage
                                        changeNumberOfpage={changeNumberOfpage}
                                        totalRow={pageResultChietKhauDV.totalCount}
                                    />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8} sm={8}>
                                    <Stack direction="row" style={{ float: 'right' }}>
                                        <LabelDisplayedRows
                                            currentPage={paramSearch.skipCount}
                                            pageSize={paramSearch.maxResultCount}
                                            totalCount={pageResultChietKhauDV.totalCount}
                                        />
                                        <Pagination
                                            shape="rounded"
                                            // color="primary"
                                            count={pageResultChietKhauDV.totalCount}
                                            page={pageResultChietKhauDV.totalPage}
                                            defaultPage={paramSearch.skipCount}
                                            onChange={handleChangePage}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
