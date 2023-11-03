import {
    Box,
    Button,
    Grid,
    Stack,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
    Typography,
    createTheme,
    SelectChangeEvent
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TextTranslate } from '../../components/TableLanguage';
import CreateOrEditTinNhanModal from './components/createOrEditTinNhanModal';
import { useState, useEffect, ReactComponentElement } from 'react';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { BrandnameDto } from '../../services/sms/brandname/BrandnameDto';
import { CreateOrEditSMSDto, PagedResultSMSDto } from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import Cookies from 'js-cookie';
import { PagedRequestDto } from '../../services/dto/pagedRequestDto';
import BrandnameService from '../../services/sms/brandname/BrandnameService';
import HeThongSMServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import ModalGuiTinNhan from './gui_tin_nhan/modal_gui_tin_nhan';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { SvgIconComponent } from '@mui/icons-material';
import AppConsts, { ISelect, TrangThaiSMS } from '../../lib/appconst';

const styleListItem = createTheme({
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: '14px'
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 0,
                    marginRight: '8px'
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    height: '20px'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    // paddingLeft: 0
                }
            }
        }
    }
});

interface IListItemButtonCustomer {
    index: number;
    text: string;
    icon?: ReactComponentElement<SvgIconComponent>;
}

export function ListItemButtonCustomer({ listItem, handleListItemClick, tabActive = 0 }: any) {
    return (
        <>
            {listItem?.map((item: IListItemButtonCustomer) => (
                <ListItemButton
                    key={item.index}
                    selected={tabActive === item.index}
                    onClick={(event) => handleListItemClick(event, item.index)}
                    sx={{ backgroundColor: tabActive == item.index ? 'var(--color-bg)' : '' }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            ))}
        </>
    );
}
const TinNhanPage = () => {
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [tabActive, setTabActive] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [dataGrid_typeAction, setDataGrid_typeAction] = useState(0);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [lstBrandname, setLstBrandname] = useState<BrandnameDto[]>([]);
    const [pageSMS, setPageSMS] = useState<PagedResultSMSDto>(new PagedResultSMSDto({ items: [] }));
    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        textSearch: '',
        fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    } as RequestFromToDto);

    const GetListBrandname = async () => {
        let tenantId = parseInt(Cookies.get('Abp.TenantId') ?? '1') ?? 1;
        tenantId = isNaN(tenantId) ? 1 : tenantId;
        const param = {
            keyword: ''
        } as PagedRequestDto;
        const data = await BrandnameService.GetListBandname(param, tenantId);
        if (data !== null) {
            setLstBrandname(data.items);
        }
    };

    const GetListSMS = async () => {
        const data = await HeThongSMServices.GetListSMS(paramSearch);
        if (data !== null) {
            setPageSMS({ items: data.items, totalCount: data.totalCount, totalPage: 1 });
        }
    };

    useEffect(() => {
        GetListBrandname();
    }, []);

    useEffect(() => {
        GetListSMS();
    }, [paramSearch]);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.currentPage !== 1) {
            setParamSearch({
                ...paramSearch,
                currentPage: 1
            });
        } else {
            //
        }
    };
    const choseRow = (item: any) => {
        // setBrandChosed(item?.row);
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    title: 'Thông báo xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} brandname này không?`
                });
                break;
            case 2:
                {
                    setInforDelete({
                        ...inforDelete,
                        show: true,
                        title: 'Kích hoạt',
                        mes: `Bạn có chắc chắn muốn kích hoạt ${rowSelectionModel.length} brandname này không?`
                    });
                }
                break;
        }
        setDataGrid_typeAction(parseInt(item.id));
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.currentPage = 1;
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
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };
    const doActionRow = (action: number, item: any) => {
        switch (action) {
            case 1:
                {
                    setIsShowModalAdd(true);
                }
                break;
            case 2:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa brandname ${item.brandname} này không?`
                });
                break;
        }
    };

    const saveSMSOK = (type: number) => {
        setIsShowModalAdd(false);
        GetListSMS();
    };
    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setTabActive(index);
        switch (index) {
            case 1: // tin nhap
                setParamSearch({
                    ...paramSearch,
                    trangThais: [TrangThaiSMS.DRAFT]
                });
                break;
            case 2: // thất bại
                setParamSearch({
                    ...paramSearch,
                    trangThais: AppConsts.ListTrangThaiGuiTin.filter(
                        (x: ISelect) => x.value !== TrangThaiSMS.SUCCESS && x.value !== TrangThaiSMS.DRAFT
                    ).map((x: ISelect) => {
                        return x.value as number;
                    })
                });
                break;
            case 0: // gui thanh cong
                setParamSearch({
                    ...paramSearch,
                    trangThais: [TrangThaiSMS.SUCCESS]
                });
                break;
            default:
                break;
        }
    };
    const columns: GridColDef[] = [
        {
            field: 'thoiGianGui',
            headerName: 'Thời gian',
            headerAlign: 'center',
            align: 'center',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Khách hàng',
            minWidth: 118,
            flex: 1.2,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'Số điện thoại',
            headerAlign: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'loaiTin',
            headerName: 'Loại tin',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'noiDungTin',
            headerName: 'Nội dung',
            minWidth: 350,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ];
    return (
        <>
            <ModalGuiTinNhan
                lstBrandname={lstBrandname.map((x: BrandnameDto) => {
                    return { value: x.id, text: x.brandname };
                })}
                isShow={isShowModalAdd}
                idTinNhan={''}
                onClose={() => setIsShowModalAdd(false)}
                onSaveOK={saveSMSOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Box paddingTop={2}>
                <Box paddingRight={2} pb={2}>
                    <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                        Tin nhắn
                    </Typography>
                </Box>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={4} md={2.5}>
                            <Box padding={2} bgcolor={'#FFF'} borderRadius={'8px'}>
                                <Button
                                    fullWidth
                                    size="small"
                                    sx={{ height: '40px' }}
                                    variant="contained"
                                    onClick={() => {
                                        setIsShowModalAdd(true);
                                    }}>
                                    Tin nhắn mới
                                </Button>
                                <ThemeProvider theme={styleListItem}>
                                    <List>
                                        <ListItemButtonCustomer
                                            listItem={
                                                [
                                                    {
                                                        index: 0,
                                                        text: 'Đã gửi',
                                                        icon: <SendIcon />
                                                    },
                                                    {
                                                        index: 1,
                                                        text: 'Nháp',
                                                        icon: <ArticleOutlinedIcon />
                                                    },
                                                    {
                                                        index: 2,
                                                        text: 'Thất bại',
                                                        icon: <DeleteSweepOutlinedIcon />
                                                    }
                                                ] as IListItemButtonCustomer[]
                                            }
                                            tabActive={tabActive}
                                            handleListItemClick={handleListItemClick}
                                        />
                                    </List>
                                </ThemeProvider>

                                <ThemeProvider theme={styleListItem}>
                                    <List
                                        subheader={
                                            <Typography fontSize={'16px'} color={'#3D475C'} fontWeight={500}>
                                                Danh sách
                                            </Typography>
                                        }>
                                        <ListItemButtonCustomer
                                            listItem={
                                                [
                                                    {
                                                        index: 3,
                                                        text: 'Giao dịch',
                                                        icon: <AssignmentOutlinedIcon />
                                                    },
                                                    {
                                                        index: 4,
                                                        text: 'Lịch hẹn',
                                                        icon: <EventNoteOutlinedIcon />
                                                    },
                                                    {
                                                        index: 5,
                                                        text: 'Khách sinh nhật',
                                                        icon: <CakeOutlinedIcon />
                                                    }
                                                ] as IListItemButtonCustomer[]
                                            }
                                            tabActive={tabActive}
                                            handleListItemClick={handleListItemClick}
                                        />
                                    </List>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                        <Grid item xs={8} sm={8} md={9.5}>
                            <Box bgcolor={'#FFF'} height={'100%'} borderRadius={'8px'}>
                                <DataGrid
                                    disableRowSelectionOnClick
                                    className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                                    rowHeight={46}
                                    autoHeight={pageSMS.items.length === 0}
                                    columns={columns}
                                    rows={pageSMS.items}
                                    hideFooter
                                    checkboxSelection
                                    onRowClick={(item) => choseRow(item)}
                                    localeText={TextTranslate}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setRowSelectionModel(newRowSelectionModel);
                                    }}
                                    rowSelectionModel={rowSelectionModel}
                                />
                                <CustomTablePagination
                                    currentPage={paramSearch.currentPage ?? 1}
                                    rowPerPage={paramSearch.pageSize ?? 10}
                                    totalRecord={pageSMS.totalCount}
                                    totalPage={pageSMS.totalPage}
                                    handlePerPageChange={handlePerPageChange}
                                    handlePageChange={handleChangePage}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                {/* <CreateOrEditTinNhanModal
                    visiable={visiable}
                    onCancel={() => {
                        setVisiable(!visiable);
                    }}
                /> */}
            </Box>
        </>
    );
};
export default TinNhanPage;
