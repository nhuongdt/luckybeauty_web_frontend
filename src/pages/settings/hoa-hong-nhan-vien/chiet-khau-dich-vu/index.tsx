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
    FormControl
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import chietKhauDichVuStore from '../../../../stores/chietKhauDichVuStore';
import SuggestService from '../../../../services/suggests/SuggestService';
import { SuggestNhanSuDto } from '../../../../services/suggests/dto/SuggestNhanSuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../lib/appconst';
import CreateOrEditChietKhauDichVuModal from './components/create-or-edit-hoa-hong';
import { CreateOrEditChietKhauDichVuDto } from '../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { height } from '@mui/system';
class ChietKhauDichVuScreen extends Component {
    state = {
        visited: false,
        idChiNhanh: '',
        idNhanVien: AppConsts.guidEmpty,
        keyword: '',
        skipCount: 0,
        maxResultCount: 10,
        createOrEditDto: {} as CreateOrEditChietKhauDichVuDto,
        suggestNhanSu: [] as SuggestNhanSuDto[]
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
    render(): ReactNode {
        const { listChietKhauDichVu, createOrEditDto, getAccordingByNhanVien } =
            chietKhauDichVuStore;
        return (
            <div>
                <div className="row mt-2 mb-4">
                    <div className="col offset-6"></div>
                </div>
                <div
                    style={{ height: '48px', background: '#F2EBF0' }}
                    className="row d-flex align-content-center">
                    <div className="col-4 pl-2">
                        <FormControl size="small">
                            <Select
                                value={
                                    this.state.suggestNhanSu.length > 1
                                        ? this.state.suggestNhanSu[0].id
                                        : AppConsts.guidEmpty
                                }
                                defaultValue={AppConsts.guidEmpty}
                                onChange={async (e) => {
                                    await this.setState({ idNhanVien: e.target.value });
                                    await this.getDataAccordingByNhanVien(e.target.value);
                                }}>
                                {this.state.suggestNhanSu.map((item) => {
                                    return <MenuItem value={item.id}>{item.tenNhanVien}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4 d-flex align-content-center">
                        <Button
                            onClick={() => {
                                this.setState({ visited: true });
                            }}
                            style={{ float: 'right', background: '#7C3367', height: '32px' }}
                            startIcon={<AddOutlinedIcon />}>
                            <span style={{ color: '#FFFAFF', fontSize: 14 }}>Thêm mới</span>
                        </Button>
                    </div>
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table" size="small">
                            <TableHead className="bg-table">
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
                    </TableContainer>
                </div>
                <CreateOrEditChietKhauDichVuModal
                    formRef={this.state.createOrEditDto}
                    onClose={() => {
                        this.setState({ visited: false });
                    }}
                    onSave={() => {
                        this.setState({ visited: false });
                    }}
                    visited={this.state.visited}
                    title="Thêm mới"
                />
            </div>
        );
    }
}
export default observer(ChietKhauDichVuScreen);
