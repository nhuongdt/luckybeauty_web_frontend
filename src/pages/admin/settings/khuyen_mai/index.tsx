import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '../../../../images/add.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import abpCustom from '../../../../components/abp-custom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TextTranslate } from '../../../../components/TableLanguage';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { useEffect, useState } from 'react';
import CreateOrEditVoucher from './components/create-or-edit-voucher';
import suggestStore from '../../../../stores/suggestStore';
const KhuyenMaiPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [isShowCreate, setIsShowCreate] = useState(false);
    useEffect(() => {
        getAll();
    }, []);
    const getAll = async () => {
        await suggestStore.getSuggestKyThuatVien();
        await suggestStore.getSuggestDichVu();
    };
    const handlePageChange = async (event: any, value: number) => {
        setCurrentPage(value);
        getAll();
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        getAll();
    };
    const Modal = () => {
        setIsShowCreate(!isShowCreate);
    };
    const onCreateOrEditVoucherModal = () => {
        Modal();
    };
    const columns = [
        {
            field: 'checkBox',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            width: 65,
            renderHeader: (params) => {
                return (
                    <Checkbox
                    //onClick={this.handleSelectAllGridRowClick}
                    //checked={this.state.checkAllRow}
                    />
                );
            },
            renderCell: (params) => (
                <Checkbox
                //onClick={() => this.handleCheckboxGridRowClick(params)}
                //checked={this.state.listItemSelectedModel.includes(params.row.id)}
                />
            )
        },
        {
            field: 'maKhuyenMai',
            headerName: 'Mã',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tenKhuyenMai',
            headerName: 'Code mã khuyến mại',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'soLanGiamGia',
            headerName: 'Giới hạn sử dụng',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'soLanSuDung',
            headerName: 'Số lần sử dụng',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'thoiGianApDung',
            headerName: 'Ngày bắt đầu',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'thoiGianKetThuc',
            headerName: 'Ngày hết hạn',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        }
    ] as GridColDef[];
    return (
        <Box paddingTop={2}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                        Voucher
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD',
                                height: '40px',
                                '& .MuiInputBase-root': {
                                    pl: '0'
                                }
                            }}
                            onChange={(e) => {
                                console.log(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    console.log('Search');
                                }
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        type="button"
                                        onClick={() => {
                                            console.log('search');
                                        }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md="auto" display="flex" gap="8px" justifyContent="end">
                    <ButtonGroup
                        variant="contained"
                        sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                        <Button
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.CongTy')}
                            onClick={onCreateOrEditVoucherModal}
                            variant="contained"
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                fontSize: '14px',
                                borderRadius: '4px!important',
                                backgroundColor: 'var(--color-main)!important'
                            }}
                            className="btn-container-hover">
                            Thêm voucher
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Box padding={'16px 0px'}>
                <DataGrid
                    columns={columns}
                    rows={[]}
                    rowHeight={46}
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                    hideFooterPagination
                    hideFooter
                    localeText={TextTranslate}
                />
            </Box>
            <CustomTablePagination
                currentPage={currentPage}
                rowPerPage={maxResultCount}
                totalPage={1}
                totalRecord={10}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
            <CreateOrEditVoucher visiable={isShowCreate} handleClose={Modal} />
        </Box>
    );
};
export default KhuyenMaiPage;
