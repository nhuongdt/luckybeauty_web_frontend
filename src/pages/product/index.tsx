import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Stack,
    Button,
    Pagination,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add, LocalOfferOutlined, Search } from '@mui/icons-material';

// prop for send data from parent to child
import { PropModal, PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { TextTranslate } from '../../components/TableLanguage';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
/* custom component */
import BreadcrumbsPageTitle from '../../components/Breadcrumbs/PageTitle';
import AccordionNhomHangHoa from '../../components/Accordion/NhomHangHoa';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import ActionViewEditDelete from '../../components/Menu/ActionViewEditDelete';
import { ModalNhomHangHoa } from './ModalGroupProduct';
import { ModalHangHoa } from './ModalProduct';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa, ModelHangHoaDto, PagedProductSearchDto } from '../../services/product/dto';
import { ReactComponent as UploadIcon } from '../../images/upload.svg';
import { ReactComponent as DownIcon } from '../../images/download.svg';
import Utils from '../../utils/utils'; // func common
import AppConsts from '../../lib/appconst';
import { ReactComponent as SeasrchIcon } from '../../images/search-normal.svg';
import './style.css';
import fileDowloadService from '../../services/file-dowload.service';
import { enqueueSnackbar } from 'notistack';
import uploadFileService from '../../services/uploadFileService';
import { FileUpload } from '../../services/dto/FileUpload';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import utils from '../../utils/utils';
import BangBaoLoiFileImport from '../../components/ImportComponent/BangBaoLoiFileImport';
import { BangBaoLoiFileimportDto } from '../../services/dto/BangBaoLoiFileimportDto';
import ActionRowSelect from '../../components/DataGrid/ActionRowSelect';
import CmpIListData from '../../components/ListData/CmpIListData';
import { IList } from '../../services/dto/IList';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import { ModalChuyenNhom } from '../../components/Dialog/modal_chuyen_nhom';

export default function PageProduct() {
    const [rowHover, setRowHover] = useState<ModelHangHoaDto>();
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalProduct, setTriggerModalProduct] = useState<PropModal>(new PropModal({ isShow: false }));
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(new PropModal({ isShow: false }));
    const [isShowImport, setShowImport] = useState<boolean>(false);
    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [treeNhomHangHoa, setTreeNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [treeSearchNhomHangHoa, setTreeSearchNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [lstErrImport, setLstErrImport] = useState<BangBaoLoiFileimportDto[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [isShowModalChuyenNhom, setIsShowModalChuyenNhom] = useState(false);

    const [pageDataProduct, setPageDataProduct] = useState<PagedResultDto<ModelHangHoaDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const [filterPageProduct, setFilterPageProduct] = useState<PagedProductSearchDto>({
        idNhomHangHoas: '',
        textSearch: '',
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: '',
        typeSort: ''
    });

    const GetListHangHoa = async () => {
        const list = await ProductService.Get_DMHangHoa(filterPageProduct);
        setPageDataProduct({
            totalCount: list.totalCount,
            totalPage: Utils.getTotalPage(list.totalCount, filterPageProduct.pageSize),
            items: list.items
        });
    };

    const GetListNhomHangHoa = async () => {
        // used to modal hanghoa
        const list = await GroupProductService.GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    const GetTreeNhomHangHoa = async () => {
        // used to tree at menu left
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: 'var(--color-main)'
        });
        setTreeNhomHangHoa([obj, ...list.items]);
        setTreeSearchNhomHangHoa([obj, ...list.items]);
    };

    const PageLoad = () => {
        GetListNhomHangHoa();
        GetTreeNhomHangHoa();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        GetListHangHoa();
    }, [filterPageProduct.currentPage, filterPageProduct.pageSize, filterPageProduct.idNhomHangHoas]);

    function showModalAddNhomHang(id = '') {
        setTriggerModalNhomHang({
            isShow: true,
            isNew: Utils.checkNull(id),
            id: id
        });
    }

    function showModalAddProduct(action?: number, id = '') {
        setTriggerModalProduct((old: any) => {
            return {
                ...old,
                isShow: true,
                isNew: Utils.checkNull(id),
                id: id
            };
        });
    }

    const editNhomHangHoa = (isEdit: any, item: ModelNhomHangHoa) => {
        if (isEdit) {
            setTriggerModalNhomHang({
                isShow: true,
                isNew: Utils.checkNull(item.id),
                id: item.id,
                item: item
            });
        } else {
            setFilterPageProduct({ ...filterPageProduct, idNhomHangHoas: item.id });
            setTriggerModalProduct((old: any) => {
                return {
                    ...old,
                    isShow: false,
                    item: { ...old.item, idNhomHangHoa: item.id }
                };
            });
        }
    };
    const searchNhomHang = (textSearch: string) => {
        let txt = textSearch;
        let txtUnsign = '';
        if (!utils.checkNull(txt)) {
            txt = txt.trim();
            txtUnsign = utils.strToEnglish(txt);
        }
        const arr = treeNhomHangHoa.filter(
            (x: ModelNhomHangHoa) =>
                (x.tenNhomHang ?? '').indexOf(txt) > -1 ||
                utils.strToEnglish(x.tenNhomHang ?? '').indexOf(txtUnsign) > -1
        );
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: 'var(--color-main)'
        });
        arr.unshift(obj);
        setTreeSearchNhomHangHoa(arr);
    };

    function saveNhomHang(objNew: ModelNhomHangHoa, isDelete = false) {
        if (isDelete) {
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + objNew.sLoaiNhomHang + ' thành công'
            });
            setLstProductGroup((old: ModelNhomHangHoa[]) => {
                return old.filter((x: ModelNhomHangHoa) => x.id !== objNew.id);
            });
        } else {
            if (triggerModalNhomHang.isNew) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Thêm ' + objNew.sLoaiNhomHang + ' thành công'
                });
                setLstProductGroup([objNew, ...lstProductGroup]);
            } else {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + objNew.sLoaiNhomHang + ' thành công'
                });
                setLstProductGroup(
                    lstProductGroup.map((item: ModelNhomHangHoa) => {
                        if (item.id === objNew.id) {
                            return {
                                ...item,
                                color: objNew.color,
                                tenNhomHang: objNew.tenNhomHang,
                                tenNhomHang_KhongDau: objNew.tenNhomHang_KhongDau,
                                laNhomHangHoa: objNew.laNhomHangHoa,
                                sLoaiNhomHang: objNew.sLoaiNhomHang,
                                idParent: objNew.idParent
                            };
                        } else {
                            return item;
                        }
                    })
                );
            }
        }
        setTriggerModalNhomHang({ ...triggerModalNhomHang, isShow: false });

        GetTreeNhomHangHoa();
    }

    function saveProduct(objNew: ModelHangHoaDto, type = 1) {
        // 1.insert, 2.update, 3.delete, 4.khoiphuc
        const sLoai = objNew.tenLoaiHangHoa?.toLocaleLowerCase();
        switch (type) {
            case 1:
                setPageDataProduct((olds) => {
                    return {
                        ...olds,
                        totalCount: olds.totalCount + 1,
                        totalPage: Utils.getTotalPage(olds.totalCount + 1, filterPageProduct.pageSize),
                        items: [objNew, ...olds.items]
                    };
                });
                setObjAlert({ show: true, type: 1, mes: 'Thêm ' + sLoai + ' thành công' });
                break;
            case 2:
                GetListHangHoa();
                setObjAlert({ show: true, type: 1, mes: 'Sửa ' + sLoai + ' thành công' });
                break;
            case 3:
                deleteProduct();
                break;
            case 4:
                restoreProduct();
                setObjAlert({ show: true, type: 1, mes: 'Khôi phục ' + sLoai + ' thành công' });
                break;
        }
    }

    const handleChangePage = (event: any, value: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            currentPage: value
        });
    };
    const changeNumberOfpage = (sizePage: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            pageSize: sizePage
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (filterPageProduct.currentPage !== 1) {
            setFilterPageProduct({
                ...filterPageProduct,
                currentPage: 1
            });
        } else {
            GetListHangHoa();
        }
    };

    const doActionRow = (action: any, rowItem: any) => {
        setRowHover(rowItem);
        if (action < 2) {
            showModalAddProduct(action, rowItem?.idDonViQuyDoi);
        } else {
            setInforDeleteProduct(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowItem.tenLoaiHangHoa.toLocaleLowerCase()}  ${
                        rowItem?.maHangHoa ?? ' '
                    } không?`
                })
            );
        }
    };
    const deleteProduct = async () => {
        if (!Utils.checkNull(rowHover?.idDonViQuyDoi)) {
            await ProductService.DeleteProduct_byIDHangHoa(rowHover?.idHangHoa ?? '');
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
            });
            setInforDeleteProduct({ ...inforDeleteProduct, show: false });
            setPageDataProduct((olds) => {
                return {
                    ...olds,
                    // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                    // totalCount: olds.totalCount - 1,
                    // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                    items: olds.items.map((x: any) => {
                        if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                            return { ...x, trangThai: 0, txtTrangThaiHang: 'Ngừng kinh doanh' };
                        } else {
                            return x;
                        }
                    })
                };
            });
        } else {
            if (rowSelectionModel.length > 0) {
                const result = await ProductService.DeleteMultipleProduct(rowSelectionModel);

                if (result) {
                    setObjAlert({
                        show: true,
                        type: 1,
                        mes: `Xóa ${rowSelectionModel.length} dịch vụ thành công`
                    });
                } else {
                    setObjAlert({
                        show: true,
                        type: 2,
                        mes: `Xóa ${rowSelectionModel.length} dịch vụ thất bại`
                    });
                }

                setInforDeleteProduct({ ...inforDeleteProduct, show: false });
                setPageDataProduct({
                    ...pageDataProduct,
                    items: pageDataProduct.items.map((item: ModelHangHoaDto) => {
                        if (rowSelectionModel.toString().indexOf(item.id ?? '') > -1) {
                            return { ...item, trangThai: 0, txtTrangThaiHang: 'Ngừng kinh doanh' };
                        } else {
                            return item;
                        }
                    })
                });
                setRowSelectionModel([]);
            }
        }
    };

    const restoreProduct = async () => {
        await ProductService.RestoreProduct_byIdHangHoa(rowHover?.idHangHoa ?? '');
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Khôi phục ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
        });
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        setPageDataProduct((olds) => {
            return {
                ...olds,
                // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                // totalCount: olds.totalCount - 1,
                // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                items: olds.items.map((x: any) => {
                    if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                        return { ...x, trangThai: 1, txtTrangThaiHang: 'Đang kinh doanh' };
                    } else {
                        return x;
                    }
                })
            };
        });
    };
    const exportToExcel = async () => {
        const param = { ...filterPageProduct };
        param.currentPage = 1;
        param.pageSize = pageDataProduct.totalCount;
        const result = await ProductService.ExportToExcel(filterPageProduct);
        fileDowloadService.downloadExportFile(result);
    };
    const onImportShow = () => {
        setShowImport(!isShowImport);
        setLstErrImport([]);
    };
    const handleImportData = async (input: FileUpload) => {
        const data = await ProductService.importHangHoa(input);
        setLstErrImport(data);
        if (data.length === 0) {
            setObjAlert({ ...objAlert, show: true, mes: 'Import thành công' });
        } else {
            const errImport = data.filter((x: BangBaoLoiFileimportDto) => x.loaiErr === 2).length;
            if (errImport > 0) {
                // import 1 số thành côg, 1 số thất bại
                setObjAlert({
                    ...objAlert,
                    show: true,
                    mes: `Import thành công, ${errImport} thất bại`
                });
            }
        }
        setShowImport(false);
        GetListHangHoa();
        GetTreeNhomHangHoa();
    };
    const downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('HangHoa_DichVu_ImportTemplate.xlsx');
        fileDowloadService.downloadExportFile(result);
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1: // chuyennhom
                setIsShowModalChuyenNhom(true);
                break;
            case 2:
                {
                    setInforDeleteProduct({
                        ...inforDeleteProduct,
                        show: true,
                        mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} dịch vụ này không?`
                    });
                }
                break;
        }
    };

    const chuyenNhomHang = async (item: IList) => {
        setIsShowModalChuyenNhom(false);
        const result = await ProductService.ChuyenNhomHang(rowSelectionModel, item.id);
        if (result) {
            setObjAlert({ ...objAlert, show: true, mes: 'Chuyển nhóm dịch vụ thành công' });
        }
        setRowSelectionModel([]);
        GetListHangHoa();
    };

    const columns: GridColDef[] = [
        {
            field: 'maHangHoa',
            headerName: 'Mã dịch vụ',

            minWidth: 100,
            flex: 1,
            // renderCell: (params) => (
            //     <Box color="#333233" sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            //         {params.value || ''}
            //     </Box>
            // ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            minWidth: 250,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenNhomHang',
            headerName: 'Nhóm dịch vụ',
            minWidth: 176,
            flex: 1,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'giaBan',
            headerName: 'Giá bán',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="end" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'soPhutThucHien',
            headerName: 'Thời gian (phút)',
            minWidth: 128,
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" width="100%" justifyContent="end">
                    <Typography variant="body2" color="#333233" marginLeft="9px" fontSize="12px">
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
        },
        {
            field: 'txtTrangThaiHang',
            headerName: 'Trạng thái',

            minWidth: 130,
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '1000px',
                        backgroundColor: '#F1FAFF',
                        color: params.row.trangThai === 0 ? '#b16827' : '#009EF7'
                    }}>
                    {params.value || ''}
                </Box>
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,

            renderCell: (params) => (
                <ActionViewEditDelete handleAction={(action: any) => doActionRow(action, params.row)} />
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        }
    ];

    return (
        <>
            <ModalNhomHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalNhomHang}
                handleSave={saveNhomHang}></ModalNhomHangHoa>
            <ModalHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalProduct}
                handleSave={saveProduct}></ModalHangHoa>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={deleteProduct}
                onCancel={() => setInforDeleteProduct({ ...inforDeleteProduct, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ImportExcel
                tieude={'Nhập file dịch vụ'}
                isOpen={isShowImport}
                onClose={onImportShow}
                downloadImportTemplate={downloadImportTemplate}
                importFile={handleImportData}
            />
            <BangBaoLoiFileImport
                isOpen={lstErrImport.length > 0}
                lstError={lstErrImport}
                onClose={() => setLstErrImport([])}
                clickImport={() => console.log(lstErrImport)}
            />
            <ModalChuyenNhom
                title="Chuyển nhóm dịch vụ"
                icon={<LocalOfferOutlined />}
                isOpen={isShowModalChuyenNhom}
                lstData={treeNhomHangHoa
                    .filter((x) => !utils.checkNull(x.id))
                    .map((item: any) => {
                        return { id: item.id, text: item.tenNhomHang, color: item?.color };
                    })}
                onClose={() => setIsShowModalChuyenNhom(false)}
                agreeChuyenNhom={chuyenNhomHang}
            />
            <Grid container className="dich-vu-page" gap={4} paddingTop={2}>
                <Grid item container alignItems="center" justifyContent="space-between">
                    <Grid container item xs={12} md={6} lg={6} alignItems="center">
                        <Grid container item alignItems="center">
                            <Grid item xs={6} sm={6} lg={4} md={4}>
                                <span className="page-title"> Danh mục dịch vụ</span>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} md={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#fff'
                                    }}
                                    variant="outlined"
                                    placeholder="Tìm kiếm"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton onClick={hanClickIconSearch}>
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                    onChange={(event) =>
                                        setFilterPageProduct((itemOlds: any) => {
                                            return {
                                                ...itemOlds,
                                                textSearch: event.target.value
                                            };
                                        })
                                    }
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
                            onClick={onImportShow}
                            variant="outlined"
                            startIcon={<DownIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<UploadIcon />}
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
                            onClick={() => showModalAddProduct()}>
                            Thêm dịch vụ
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
                                    Nhóm dịch vụ
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
                                    onClick={() => showModalAddNhomHang()}
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
                                        placeholder="Tìm kiếm nhóm"
                                        InputProps={{ startAdornment: <Search /> }}
                                        onChange={(e) => searchNhomHang(e.target.value)}
                                    />
                                    <AccordionNhomHangHoa
                                        dataNhomHang={treeSearchNhomHangHoa}
                                        clickTreeItem={editNhomHangHoa}
                                    />
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={10} md={10} sm={9} xs={13}>
                        {rowSelectionModel.length > 0 && (
                            <ActionRowSelect
                                lstOption={[
                                    {
                                        id: '1',
                                        text: 'Chuyển nhóm'
                                    },
                                    {
                                        id: '2',
                                        text: 'Xóa dịch vụ'
                                    }
                                ]}
                                countRowSelected={rowSelectionModel.length}
                                title="dịch vụ"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setRowSelectionModel([]);
                                }}
                            />
                        )}

                        <Box className="page-box-right" marginTop={rowSelectionModel.length > 0 ? 1 : 0}>
                            <DataGrid
                                className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                                autoHeight={pageDataProduct.items.length === 0}
                                disableRowSelectionOnClick
                                rowHeight={46}
                                rows={pageDataProduct.items}
                                columns={columns}
                                hideFooter
                                checkboxSelection
                                localeText={TextTranslate}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setRowSelectionModel(newRowSelectionModel);
                                }}
                                rowSelectionModel={rowSelectionModel}
                            />

                            <Grid
                                item
                                container
                                style={{
                                    display: pageDataProduct.totalCount > 0 ? 'flex' : 'none',
                                    paddingLeft: '16px',
                                    bottom: '16px'
                                }}>
                                <Grid item xs={4} md={4} lg={4} sm={4}>
                                    <OptionPage
                                        changeNumberOfpage={changeNumberOfpage}
                                        totalRow={pageDataProduct.totalCount}
                                    />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8} sm={8}>
                                    <Stack direction="row" style={{ float: 'right' }}>
                                        <LabelDisplayedRows
                                            currentPage={filterPageProduct.currentPage}
                                            pageSize={filterPageProduct.pageSize}
                                            totalCount={pageDataProduct.totalCount}
                                        />
                                        <Pagination
                                            shape="rounded"
                                            // color="primary"
                                            count={pageDataProduct.totalPage}
                                            page={filterPageProduct.currentPage}
                                            defaultPage={filterPageProduct.currentPage}
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
