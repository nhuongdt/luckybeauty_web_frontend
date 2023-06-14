import {
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Box,
    TextField,
    Typography
} from '@mui/material';
import { TextTranslate } from '../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '../../../../images/download.svg';
import UploadIcon from '../../../../images/upload.svg';
import AddIcon from '../../../../images/add.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import { Component, ReactNode } from 'react';
import chietKhauDichVuStore from '../../../../stores/chietKhauDichVuStore';
import SuggestService from '../../../../services/suggests/SuggestService';
import { SuggestNhanSuDto } from '../../../../services/suggests/dto/SuggestNhanSuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../lib/appconst';
import CreateOrEditChietKhauDichVuModal from './components/create-or-edit-hoa-hong';
import { CreateOrEditChietKhauDichVuDto } from '../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../services/suggests/dto/SuggestDonViQuiDoi';
import Cookies from 'js-cookie';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
class ChietKhauDichVuScreen extends Component {
    state = {
        visited: false,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idNhanVien: AppConsts.guidEmpty,
        keyword: '',
        skipCount: 1,
        maxResultCount: 10,
        totalPage: 0,
        totalCount: 0,
        createOrEditDto: {} as CreateOrEditChietKhauDichVuDto,
        suggestNhanSu: [] as SuggestNhanSuDto[],
        suggestDonViQuiDoi: [] as SuggestDonViQuiDoiDto[]
    };
    componentDidMount(): void {
        this.InitData();
    }
    async InitData() {
        const suggestNhanVien = await SuggestService.SuggestNhanSu();
        await this.setState({ suggestNhanSu: suggestNhanVien });
        if (suggestNhanVien.length > 0) {
            await this.setState({ idNhanVien: suggestNhanVien[0].id });
        }
        const suggestDonViQuiDoi = await SuggestService.SuggestDonViQuiDoi();
        console.log(suggestDonViQuiDoi);
        await this.setState({ suggestDonViQuiDoi: suggestDonViQuiDoi });
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
    }
    getDataAccordingByNhanVien = async (idNhanVien: any) => {
        await chietKhauDichVuStore.getAccordingByNhanVien(
            {
                keyword: this.state.keyword,
                maxResultCount: this.state.maxResultCount,
                skipCount: this.state.skipCount
            },
            idNhanVien
        );
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value
        });
        this.InitData();
    };
    handleSubmit = async () => {
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
        this.onModal();
    };
    onModal = () => {
        this.setState({ visited: !this.state.visited });
    };
    onCloseModal = () => {
        this.setState({ visited: false });
    };
    render(): ReactNode {
        const { listChietKhauDichVu } = chietKhauDichVuStore;

        const columns: GridColDef[] = [
            {
                field: 'id',
                headerName: 'ID',
                minWidth: 70,
                flex: 0.8,
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                        {params.value}
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },

            {
                field: 'tenDichVu',
                headerName: 'Tên dịch vụ ',
                minWidth: 140,
                flex: 1,
                renderCell: (params: any) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            width: '100%'
                        }}
                        title={params.value}>
                        <Typography
                            fontSize="14px"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenNhomDichVu',
                headerName: 'Nhóm dịch vụ',
                minWidth: 114,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'hoaHongThucHien',
                headerName: 'Hoa hồng thực hiện',
                minWidth: 150,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: 'calc(100% - 20px)',
                            border: '1px solid #E6E1E6',
                            borderRadius: '8px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'hoaHongYeuCauThucHien',
                headerName: 'Hoa hồng theo yêu cầu',
                minWidth: 170,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: 'calc(100% - 40px)',
                            border: '1px solid #E6E1E6',
                            borderRadius: '8px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'hoaHongTuVan',
                headerName: 'Hoa hồng tư vấn',
                minWidth: 130,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                            border: '1px solid #E6E1E6',
                            borderRadius: '8px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'giaDichVu',
                headerName: 'Giá bán',
                minWidth: 85,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                maxWidth: 48,
                flex: 1,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true">
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <div>
                <Grid
                    container
                    sx={{
                        height: '48px',
                        background: '#F2EBF0',
                        alignItems: 'center',
                        paddingX: '8px'
                    }}>
                    <Grid item xs={4}>
                        <FormControl size="small">
                            <Select
                                defaultValue={
                                    this.state.suggestNhanSu.length > 1
                                        ? this.state.suggestNhanSu[0].id
                                        : AppConsts.guidEmpty
                                }
                                sx={{ height: 40, bgcolor: '#fff' }}
                                value={this.state.idNhanVien}
                                onChange={async (e) => {
                                    await this.setState({ idNhanVien: e.target.value });
                                    await this.getDataAccordingByNhanVien(e.target.value);
                                }}>
                                {this.state.suggestNhanSu.map((item) => {
                                    return <MenuItem value={item.id}>{item.tenNhanVien}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="text"
                            size="small"
                            sx={{
                                '& input': { bgcolor: '#fff' },
                                '& .MuiInputBase-root': { pl: '0', bgcolor: '#fff' }
                            }}
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="button" sx={{ bgcolor: '#fff' }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Box
                            display="flex"
                            gap="8px"
                            justifyContent="end"
                            sx={{
                                '& button': {
                                    color: '#666466!important',
                                    bgcolor: '#fff!important',
                                    boxShadow: 'none!important',
                                    borderColor: '#ede4ea!important',
                                    textTransform: 'unset!important',
                                    fontWeight: '400'
                                }
                            }}>
                            <Button startIcon={<img src={DownloadIcon} />} variant="outlined">
                                Nhập
                            </Button>
                            <Button startIcon={<img src={UploadIcon} />} variant="outlined">
                                Xuất
                            </Button>
                            <Button
                                startIcon={<img src={AddIcon} />}
                                variant="outlined"
                                onClick={() => {
                                    this.onModal();
                                }}>
                                Thêm mới
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="8px">
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={listChietKhauDichVu === undefined ? [] : listChietKhauDichVu.items}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 5, pageSize: 10 }
                            }
                        }}
                        checkboxSelection={false}
                        pageSizeOptions={[10, 20]}
                        sx={{
                            '& p': {
                                mb: 0
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #CDC9CD',
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& + .MuiTablePagination-root': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                outline: 'none!important'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none '
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                color: '#7C3367'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                fill: '#7C3367'
                            },
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(2)':
                                {
                                    fill: '#000'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(1)':
                                {
                                    fill: '#000'
                                },
                            '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                color: '#7C3367!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: '#f2ebf0'
                                }
                        }}
                        localeText={TextTranslate}
                        hideFooter
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={
                            listChietKhauDichVu === undefined ? 0 : listChietKhauDichVu.totalCount
                        }
                        totalPage={
                            listChietKhauDichVu === undefined
                                ? 0
                                : Math.ceil(
                                      listChietKhauDichVu.totalCount / this.state.maxResultCount
                                  )
                        }
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <CreateOrEditChietKhauDichVuModal
                    formRef={this.state.createOrEditDto}
                    onClose={this.onCloseModal}
                    onSave={this.handleSubmit}
                    idNhanVien={this.state.idNhanVien}
                    suggestDonViQuiDoi={this.state.suggestDonViQuiDoi}
                    visited={this.state.visited}
                    title="Thêm mới"
                />
            </div>
        );
    }
}
export default observer(ChietKhauDichVuScreen);
