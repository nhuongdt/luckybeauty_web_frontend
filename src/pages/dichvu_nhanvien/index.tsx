import { Component, ReactNode } from 'react';
import { SuggestDonViQuiDoiDto } from '../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestNhanVienDichVuDto } from '../../services/suggests/dto/SuggestNhanVienDichVuDto';
import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import CreateOrEditDichVuNhanVienModal from './components/create-or-edit-dichVu_nhanVien';
import NhanVienDichVuTab from './components/nhanVien_DichVu_Modal';
import DichVuNhanVienTab from './components/dichVu_NhanVien_Modal';
import suggestStore from '../../stores/suggestStore';
import { observer } from 'mobx-react';

class SettingDichVuNhanVien extends Component {
    // state = {
    //     visiableModal: false,
    //     suggestDichVu: [] as SuggestDonViQuiDoiDto[],
    //     suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    // };

    // onModal = () => {
    //     this.setState({ visiableModal: !this.state.visiableModal });
    // };
    // handleCloseModal = () => {
    //     this.setState({ visiableModal: false });
    // };
    state = {
        settingValue: 'Service',
        suggestDichVu: [] as SuggestDonViQuiDoiDto[],
        suggestKyThuatVien: [] as SuggestNhanVienDichVuDto[]
    };
    componentDidMount(): void {
        this.getData();
    }
    async getData() {
        const kyThuatViens = await suggestStore.getSuggestKyThuatVien();
        const dichVus = await suggestStore.getSuggestDichVu();
        await this.setState({
            suggestDichVus: dichVus,
            suggestkyThuatVien: kyThuatViens
        });
    }
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): ReactNode {
        return (
            <div>
                {/* //     <Button onClick={this.onModal}>Show</Button>
            //     <CreateOrEditDichVuNhanVienModal
            //         visiable={this.state.visiableModal}
            //         handleClose={this.handleCloseModal}
            //         handleOk={this.onModal}
            //     /> */}
                <Box display="flex" alignItems="center" padding={'32px'}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography style={{ float: 'left' }}>Cài đặt theo</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <RadioGroup
                                style={{ float: 'right' }}
                                row
                                value={this.state.settingValue}
                                onChange={this.handleSettingChange}>
                                <FormControlLabel
                                    value={'Service'}
                                    control={<Radio />}
                                    label={'Dịch vụ'}
                                />
                                <FormControlLabel
                                    value={'Employee'}
                                    control={<Radio />}
                                    label={'Nhân viên'}
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </Box>
                <Box padding={'32px'}>
                    {this.state.settingValue == 'Employee' ? (
                        <NhanVienDichVuTab
                            suggestDichVu={suggestStore.suggestDichVu}
                            suggestKyThuatVien={suggestStore.suggestKyThuatVien}
                        />
                    ) : (
                        <DichVuNhanVienTab
                            suggestDichVu={suggestStore.suggestDichVu}
                            suggestKyThuatVien={suggestStore.suggestKyThuatVien}
                        />
                    )}
                </Box>
            </div>
        );
    }
}
export default observer(SettingDichVuNhanVien);
