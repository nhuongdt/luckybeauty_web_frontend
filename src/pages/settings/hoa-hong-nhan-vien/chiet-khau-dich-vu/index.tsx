import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
    Button,
    Checkbox,
    IconButton,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    MenuItem,
    TableRow,
    FormControl,
    Grid,
    Box,
    TextField,
    Avatar,
    Typography
} from '@mui/material';
import { TextTranslate } from '../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '../../../../images/download.svg';
import UploadIcon from '../../../../images/upload.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import { Component, ReactNode } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import chietKhauDichVuStore from '../../../../stores/chietKhauDichVuStore';
import SuggestService from '../../../../services/suggests/SuggestService';
import { SuggestNhanSuDto } from '../../../../services/suggests/dto/SuggestNhanSuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../lib/appconst';
import CreateOrEditChietKhauDichVuModal from './components/create-or-edit-hoa-hong';
import { CreateOrEditChietKhauDichVuDto } from '../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../services/suggests/dto/SuggestDonViQuiDoi';
import Cookies from 'js-cookie';
class ChietKhauDichVuScreen extends Component {
    state = {
        visited: false,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idNhanVien: AppConsts.guidEmpty,
        keyword: '',
        skipCount: 0,
        maxResultCount: 10,
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
    handleChange = (event: any): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditDto: {
                ...this.state.createOrEditDto,
                idNhanVien: this.state.idNhanVien,
                idChiNhanh: this.state.idChiNhanh,
                [name]: value
            }
        });
    };
    handleSubmit = async () => {
        await chietKhauDichVuStore.createOrEdit(this.state.createOrEditDto);
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
        console.log(this.state.createOrEditDto);
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
                field: 'nhomDichVu',
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
                field: 'hoaHongTheoYeuCau',
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
                field: 'giaBan',
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
        const rows = [
            {
                id: '0980898mkjkhs8x0',
                tenDichVu: 'Tình sầu thiên thu muôn lối',
                nhomDichVu: 'ABC ADYOGMC KUYJ VHBV VBV',
                hoaHongThucHien: '66%',
                hoaHongTheoYeuCau: '88%',
                hoaHongTuVan: '4009% ',
                giaBan: '425.000đ'
            },
            {
                id: '09808908mkjkhs8x0',
                tenDichVu: 'Tình sầu thiên thu muôn lối',
                nhomDichVu: 'ABC ADYOGMC KUYJ VHBV VBV',
                hoaHongThucHien: '80%',
                hoaHongTheoYeuCau: '99%',
                hoaHongTuVan: '150% ',
                giaBan: '600.000đ'
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
                        {/* <Button
                            onClick={() => {
                                this.setState({ visited: true });
                            }}
                            size="small"
                            style={{ float: 'right', background: '#7C3367', height: 32 }}
                            startIcon={<AddOutlinedIcon sx={{ color: '#FFFAFF' }} />}>
                            <span
                                style={{
                                    color: '#FFFAFF',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                    fontFamily: 'roboto',
                                    textAlign: 'center'
                                }}>
                                Thêm mới
                            </span>
                        </Button> */}
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
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="8px">
                    {/* <TableContainer component={Paper} sx={{ display: 'none' }}>
                        <Table aria-label="customized table" size="small">
                            <TableHead>
                                <TableRow style={{ height: '48px' }}>
                                    <TableCell
                                        padding="checkbox"
                                        align="center"
                                        className="text-td-table">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        STT
                                    </TableCell>
                                    <TableCell className="text-td-table" align="left">
                                        Tên dịch vụ
                                    </TableCell>
                                    <TableCell className="text-td-table" align="left">
                                        Nhóm dịch vụ
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        Hoa hồng thực hiện
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        Hoa hồng theo yêu cầu
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        Hoa hồng tư vấn
                                    </TableCell>
                                    <TableCell className="text-td-table" align="center">
                                        Giá
                                    </TableCell>
                                    <TableCell style={{ width: '50px' }} align="center">
                                        #
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listChietKhauDichVu === undefined
                                    ? null
                                    : listChietKhauDichVu.items.map((item, length) => {
                                          return (
                                              <TableRow style={{ height: '48px' }}>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="center"
                                                      padding="checkbox"
                                                      className="text-th-table">
                                                      <Checkbox />
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      component="th"
                                                      scope="row"
                                                      align="center"
                                                      className="text-th-table">
                                                      {length + 1}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      className="text-th-table">
                                                      {item.tenDichVu}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="left"
                                                      className="text-th-table">
                                                      {item.tenNhomDichVu}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="left"
                                                      className="text-th-table">
                                                      {item.hoaHongThucHien}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="center"
                                                      className="text-th-table">
                                                      {item.hoaHongYeuCauThucHien}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="center"
                                                      className="text-th-table">
                                                      {item.hoaHongTuVan}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px' }}
                                                      align="center"
                                                      className="text-th-table">
                                                      {item.giaDichVu}
                                                  </TableCell>
                                                  <TableCell
                                                      style={{ height: '48px', width: '50px' }}
                                                      align="right">
                                                      <IconButton>
                                                          <BsThreeDotsVertical />
                                                      </IconButton>
                                                  </TableCell>
                                              </TableRow>
                                          );
                                      })}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={rows}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 5, pageSize: 10 }
                            }
                        }}
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
                            }
                        }}
                        localeText={TextTranslate}
                        checkboxSelection
                    />
                </Box>
                <CreateOrEditChietKhauDichVuModal
                    formRef={this.state.createOrEditDto}
                    onClose={this.onCloseModal}
                    onSave={this.handleSubmit}
                    onChange={this.handleChange}
                    suggestDonViQuiDoi={this.state.suggestDonViQuiDoi}
                    visited={this.state.visited}
                    title="Thêm mới"
                />
            </div>
        );
    }
}
export default observer(ChietKhauDichVuScreen);
