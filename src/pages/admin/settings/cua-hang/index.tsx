import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Box, Typography, Grid, TextField, Button, Stack } from '@mui/material';
import AddLogoIcon from '../../../../images/add-logo.svg';
import cuaHangService from '../../../../services/cua_hang/cuaHangService';
import Cookies from 'js-cookie';
import { EditCuaHangDto } from '../../../../services/cua_hang/Dto/EditCuaHangDto';
import { enqueueSnackbar } from 'notistack';
import utils from '../../../../utils/utils';
import uploadFileService from '../../../../services/uploadFileService';
import abpCustom from '../../../../components/abp-custom';
class StoreDetail extends Component {
    state = {
        fileSelect: {} as File,
        googleDrive_fileId: '',
        isSaving: false,
        editCuaHang: {
            id: '',
            diaChi: '',
            facebook: '',
            ghiChu: '',
            instagram: '',
            logo: '',
            maSoThue: '',
            soDienThoai: '',
            tenCongTy: '',
            twitter: '',
            website: '',
            fileLogo: ''
        } as EditCuaHangDto
    };
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
        const cuaHang = await cuaHangService.getCongTyEdit(idChiNhanh);
        this.setState({
            editCuaHang: cuaHang,
            googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(cuaHang?.logo ?? '')
        });
        this.setState((old: any) => {
            return {
                ...old,
                editCuaHang: {
                    ...old.editCuaHang,
                    fileLogo: cuaHang.logo
                }
            };
        });
    }
    async componentDidMount() {
        await this.getData();
    }
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({
            editCuaHang: {
                ...this.state.editCuaHang,
                [name]: value
            }
        });
    };

    handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.closeImage();
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileLogo = URL.createObjectURL(file);

            this.setState({
                editCuaHang: {
                    ...this.state.editCuaHang,
                    fileLogo: fileLogo
                },
                fileSelect: file
            });
        }
    };
    closeImage = async () => {
        if (!utils.checkNull(this.state.googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(this.state.googleDrive_fileId);
        }
        this.setState((prev) => {
            return {
                ...prev,
                googleDrive_fileId: '',
                fileLogo: ''
            };
        });
    };
    handSubmit = async () => {
        let fileId = this.state.googleDrive_fileId;
        const fileSelect = this.state.fileSelect;
        if (!utils.checkNull(this.state.editCuaHang.fileLogo)) {
            // nếu cập nhật: chỉ upload nếu chọn lại ảnh
            if (
                utils.checkNull(this.state.editCuaHang.id) ||
                (!utils.checkNull(this.state.editCuaHang.id) &&
                    !utils.checkNull(this.state.editCuaHang.logo) &&
                    utils.checkNull(this.state.googleDrive_fileId)) ||
                utils.checkNull(this.state.editCuaHang.logo)
            ) {
                // awlay insert: because image was delete before save
                fileId = await uploadFileService.GoogleApi_UploaFileToDrive(fileSelect, 'Logo');
            }
        }
        this.setState({ isSaving: true });
        console.log(333, this.state.isSaving);
        if (this.state.isSaving) return;
        // gán lại image theo id mới
        const dataSave = this.state.editCuaHang;
        dataSave.logo = fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
        const result = await cuaHangService.Update(dataSave);
        result != null
            ? enqueueSnackbar('Cập nhật thông tin thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.setState({ isSaving: false });
    };

    render(): ReactNode {
        const { editCuaHang } = this.state;

        return (
            <Box gap={4} paddingTop={2} borderRadius="8px" sx={{ backgroundColor: '#fff' }}>
                <Box className="page-full">
                    <Grid container>
                        <Grid item xs={12} md={12} sm={12}>
                            <Stack
                                marginBottom={'16px'}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Typography variant="h2" fontSize="24px" fontWeight="700" mb="32px">
                                    Chi tiết cửa hàng
                                </Typography>
                                <Stack>
                                    {abpCustom.isGrandPermission('Pages.ChietKhauHoaDon.Create') ? (
                                        this.state.isSaving ? (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: 'fit-content',
                                                    minWidth: 'unset',
                                                    textTransform: 'unset',
                                                    fontSize: '14px',
                                                    height: '40px',
                                                    fontWeight: '400',
                                                    ml: 'auto'
                                                }}
                                                className="btn-container-hover">
                                                Đang lưu
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={this.handSubmit}
                                                sx={{
                                                    width: 'fit-content',
                                                    minWidth: 'unset',
                                                    textTransform: 'unset',
                                                    fontSize: '14px',
                                                    height: '40px',
                                                    fontWeight: '400',
                                                    ml: 'auto'
                                                }}
                                                className="btn-container-hover">
                                                Cập nhật
                                            </Button>
                                        )
                                    ) : null}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Box padding="20px" border="1px solid #E6E1E6" borderRadius="8px">
                                <Typography variant="body1" fontSize="14px" fontWeight="500">
                                    Logo cửa hàng
                                </Typography>
                                <Box position="relative" sx={{ textAlign: 'center', mt: '20px' }}>
                                    {editCuaHang.fileLogo ? (
                                        <img
                                            src={editCuaHang.fileLogo}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'contain'
                                            }}
                                            alt="logo"
                                        />
                                    ) : (
                                        <img
                                            style={{
                                                width: '6.944444444444445vw',
                                                height: '6.944444444444445vw'
                                            }}
                                            src={AddLogoIcon}
                                            alt="default logo"
                                        />
                                    )}
                                    <input
                                        onChange={this.handleLogoChange}
                                        type="file"
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%',
                                            opacity: '0',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight="400"
                                    fontSize="12px"
                                    textAlign="center"
                                    mt="24px"
                                    maxWidth="152px"
                                    marginX="auto">
                                    Kích thước tối thiểu 3.1 mb
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& label': {
                                    fontWeight: '500',
                                    color: '#4C4B4C',
                                    fontSize: '14px',
                                    mb: '8px'
                                },
                                '& input': {
                                    fontSize: '14px'
                                }
                            }}>
                            <Typography variant="h3" fontWeight="700" fontSize="16px">
                                Thông tin cửa hàng
                            </Typography>
                            <Grid container spacing={1} mt="5px" rowSpacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Tên cửa hàng</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="tenCongTy"
                                            placeholder="Nhập tên"
                                            onChange={this.handleChange}
                                            value={editCuaHang.tenCongTy}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Địa chỉ</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="diaChi"
                                            onChange={this.handleChange}
                                            value={editCuaHang.diaChi}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Số điện thoại</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="soDienThoai"
                                            onChange={this.handleChange}
                                            value={editCuaHang.soDienThoai}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Mã số thuế</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="maSoThue"
                                            onChange={this.handleChange}
                                            value={editCuaHang.maSoThue}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        borderTop: '1px solid #E3E6EB',
                                        paddingTop: '24px',
                                        mt: '24px'
                                    }}>
                                    <Typography variant="h3" fontWeight="700" fontSize="16px">
                                        Liên kết trực tuyến
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Website</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="website"
                                            onChange={this.handleChange}
                                            value={editCuaHang.website}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Facebook</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="facebook"
                                            onChange={this.handleChange}
                                            value={editCuaHang.facebook}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Instagram</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="instagram"
                                            onChange={this.handleChange}
                                            value={editCuaHang.instagram ?? ''}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Twitter</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="twitter"
                                            onChange={this.handleChange}
                                            value={editCuaHang.twitter ?? ''}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default StoreDetail;
