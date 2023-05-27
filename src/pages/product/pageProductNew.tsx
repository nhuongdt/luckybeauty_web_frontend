import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Stack,
    Button,
    Container,
    Link,
    Avatar,
    IconButton,
    TextareaAutosize,
    ButtonGroup,
    Breadcrumbs,
    Dialog,
    Pagination
} from '@mui/material';
import './style.css';
import avatar from '../../images/avatar.png';
import EditIcon from '@mui/icons-material/Edit';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import tagIcon1 from '../../images/tagAll.svg';
import tagIcon2 from '../../images/tag2.svg';
import tagIcon3 from '../../images/tag3.svg';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// prop for send data from parent to child
import { PropModal, PropConfirmOKCancel } from '../../utils/PropParentToChild';

/* custom component */

import TreeViewGroupProduct from '../../components/Treeview/ProductGroup';
import { ModalNhomHangHoa } from './ModalGroupProduct';
import { ModalHangHoa } from './ModalProduct';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import {
    ModelNhomHangHoa,
    ModelHangHoaDto,
    PagedProductSearchDto
} from '../../services/product/dto';
import Utils from '../../utils/utils'; // func common

import BreadcrumbsPageTitle from '../../components/Breadcrumbs/PageTitle';
import AccordionNhomHangHoa from '../../components/Accordion/NhomHangHoa';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import MessageAlert from '../../components/AlertDialog/MessageAlert';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import ActionViewEditDelete from '../../components/Menu/ActionViewEditDelete';

import {
    Add,
    DeleteOutline,
    FileDownload,
    FileUpload,
    Info,
    LocalOffer,
    Menu,
    ModeEditOutline,
    MoreHoriz,
    Search
} from '@mui/icons-material';

import '../../App.css';
export const DataGridNoData = () => {
    return (
        <>
            <p>no data</p>
        </>
    );
};
export default function PageProductNew() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalProduct, setTriggerModalProduct] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [treeNhomHangHoa, setTreeNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);

    const [pageDataProduct, setPageDataProduct] = useState<PagedResultDto<ModelHangHoaDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const [filterPageProduct, setFilterPageProduct] = useState<PagedProductSearchDto>({
        idNhomHangHoas: '',
        textSearch: '',
        currentPage: 1,
        pageSize: Utils.pageOption[0].value,
        columnSort: '',
        typeSort: ''
    });

    /* state in row table */
    const [showAction, setShowAction] = useState({ index: 0, value: false });
    const [showListAction, setshowListAction] = useState(true);
    const [isHover, setIsHover] = useState(false);
    const [rowHover, setRowHover] = useState<ModelHangHoaDto>();
    const [anchorEl, setAnchorEl] = useState(null);
    /* end state in row table */

    const GetListHangHoa = async () => {
        const list = await ProductService.Get_DMHangHoa(filterPageProduct);
        setPageDataProduct({
            totalCount: list.totalCount,
            totalPage: Utils.getTotalPage(list.totalCount, filterPageProduct.pageSize),
            items: list.items
        });
        console.log('list ', list);
    };

    const GetListNhomHangHoa = async () => {
        const list = await GroupProductService.GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: '#7C3367'
        });
        setTreeNhomHangHoa([obj, ...list.items]);
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
    }, [
        filterPageProduct.currentPage,
        filterPageProduct.pageSize,
        filterPageProduct.idNhomHangHoas
    ]);

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
                    item: { ...old.item, idNhomHangHoa: item.id }
                };
            });
        }
    };

    function saveNhomHang(objNew: ModelNhomHangHoa) {
        if (triggerModalNhomHang.isNew) {
            const newTree = [
                // Items before the insertion point:
                ...treeNhomHangHoa.slice(0, 1),
                // New item:
                objNew,
                // Items after the insertion point:
                ...treeNhomHangHoa.slice(1)
            ];
            setTreeNhomHangHoa(newTree);
            setObjAlert({ show: true, type: 1, mes: 'Thêm nhóm dịch vụ thành công' });
        } else {
            GetTreeNhomHangHoa();
            setObjAlert({ show: true, type: 1, mes: 'Cập nhật nhóm dịch vụ thành công' });
        }
        hiddenAlert();
    }

    function saveProduct(objNew: ModelHangHoaDto) {
        if (triggerModalProduct.isNew) {
            objNew.maHangHoa = objNew.donViQuiDois.filter(
                (x) => x.laDonViTinhChuan === 1
            )[0]?.maHangHoa;

            setPageDataProduct((olds) => {
                return {
                    ...olds,
                    totalCount: olds.totalCount + 1,
                    totalPage: Utils.getTotalPage(olds.totalCount + 1, filterPageProduct.pageSize),
                    items: [objNew, ...olds.items]
                };
            });
            setObjAlert({ show: true, type: 1, mes: 'Thêm dịch vụ thành công' });
        } else {
            GetListHangHoa();
            setObjAlert({ show: true, type: 1, mes: 'Sửa dịch vụ thành công' });
        }
        hiddenAlert();
    }

    const hiddenAlert = () => {
        setTimeout(() => {
            setObjAlert({ show: false, mes: '', type: 1 });
        }, 3000);
    };

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
            if (filterPageProduct.currentPage !== 1) {
                setFilterPageProduct({
                    ...filterPageProduct,
                    currentPage: 1
                });
            } else {
                GetListHangHoa();
            }
        }
    };

    const doActionRow = (action: number) => {
        if (action < 2) {
            showModalAddProduct(action, rowHover?.idDonViQuyDoi);
        } else {
            setInforDeleteProduct(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa dịch vụ  ${rowHover?.maHangHoa ?? ' '} không?`
                })
            );
        }
    };
    console.log('page');

    const showMenuAction = (elm: any, rowItem: any) => {
        console.log('row');
        setRowHover(rowItem);
        setAnchorEl(elm.currentTarget);
    };

    const deleteProduct = async () => {
        if (!Utils.checkNull(rowHover?.idDonViQuyDoi)) {
            await ProductService.DeleteProduct_byIDHangHoa(rowHover?.id ?? '');
            setObjAlert({ show: true, type: 1, mes: 'Xóa dịch vụ thành công' });
            hiddenAlert();
            setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        }
    };

    const hoverRow = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setShowAction({ index: index, value: true });
                break;
            case 'mouseleave': //leave
                setShowAction({ index: index, value: false });
                break;
        }
        setshowListAction(false);
        setRowHover(rowData);
        setIsHover(event.type === 'mouseenter');
    };

    const columns: GridColDef[] = [
        {
            field: 'maHangHoa',
            headerName: 'Mã dịch vụ',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" color="#333233">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            width: 250,
            renderCell: (params) => (
                <Box display="flex">
                    <Typography variant="body2" color="#333233" title={params.value}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'tenNhomHang',
            headerName: 'Nhóm dịch vụ',
            width: 176
        },
        {
            field: 'giaBan',
            headerName: 'Giá bán',
            width: 100,
            renderCell: (params) => (
                <Box display="flex">
                    <Typography variant="body2" color="#333233">
                        {Utils.formatNumber(params.value)}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'soPhutThucHien',
            headerName: 'Thời gian',
            width: 128,
            renderCell: (params) => (
                <Box display="flex">
                    <ClockIcon />
                    <Typography variant="body2" color="#333233" marginLeft="9px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'txtTrangThaiHang',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        padding: '4px 8px',
                        borderRadius: '1000px',
                        backgroundColor: '#F1FAFF',
                        color: '#009EF7'
                    }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            width: 60,
            disableColumnMenu: true,

            renderCell: (params) => (
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event) => showMenuAction(event, params.row)}>
                    <MoreHoriz />
                </IconButton>
            )
        }
    ];

    const breadcrumbsLink = [
        { text: 'Dịch vụ', color: '#999699' },
        { text: 'Danh mục dịch vụ', color: '#333233' }
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
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <Grid container className="dich-vu-page" padding={2} gap={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto">
                        <BreadcrumbsPageTitle listLink={breadcrumbsLink} />
                        <Typography color="#0C050A" variant="h5" fontWeight="700">
                            Danh mục dịch vụ
                        </Typography>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box>
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#FFFAFF'
                                }}
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: <Search />
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
                        </Box>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileUpload />}
                            className="btnNhapXuat">
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileDownload />}
                            className="btnNhapXuat">
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            className="button-container"
                            sx={{ minWidth: '143px' }}
                            startIcon={<Add />}
                            onClick={() => showModalAddProduct()}>
                            Thêm dịch vụ
                        </Button>
                    </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                    <Grid item lg={3} md={3} sm={4} xs={12}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%'
                            }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="16px 24px">
                                <Typography fontSize="18px" fontWeight="700">
                                    Nhóm dịch vụ
                                </Typography>
                                <Add
                                    className="button-container"
                                    sx={{
                                        height: '30px',
                                        width: '30px',
                                        borderRadius: '4px',
                                        padding: '4px'
                                    }}
                                    onClick={() => showModalAddNhomHang()}
                                />
                            </Box>
                            <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
                                <AccordionNhomHangHoa
                                    dataNhomHang={treeNhomHangHoa}
                                    clickTreeItem={editNhomHangHoa}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={9} md={9} sm={8} xs={12}>
                        <Box height="504px" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                            <DataGrid
                                rows={pageDataProduct.items}
                                columns={columns}
                                hideFooter
                                checkboxSelection
                                sx={{ border: 'none!important' }}
                            />
                            <ActionViewEditDelete
                                elmHTML={anchorEl}
                                handleClickAction={doActionRow}
                            />
                        </Box>

                        <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={2}
                            style={{
                                display: pageDataProduct.totalCount > 1 ? 'flex' : 'none'
                            }}>
                            <Grid item xs={4} md={4} lg={4} sm={4}>
                                <OptionPage
                                    changeNumberOfpage={changeNumberOfpage}
                                    totalRow={pageDataProduct.totalCount}
                                />
                            </Grid>
                            <Grid item xs={8} md={8} lg={8} sm={8} style={{ paddingRight: '16px' }}>
                                <Stack direction="row" spacing={2} style={{ float: 'right' }}>
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
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
