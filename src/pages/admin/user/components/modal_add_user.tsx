import {
    Dialog,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
    Grid,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    FormGroup,
    DialogActions,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { useEffect, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import AutocompleteChiNhanh from '../../../../components/Autocomplete/ChiNhanh';
import { CreateOrUpdateUserInput } from '../../../../services/user/dto/createOrUpdateUserInput';
import userService from '../../../../services/user/userService';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { Box } from '@mui/system';
import CircleImageUpload from '../../../../components/ImportComponent/CircleImageUpload';
import utils from '../../../../utils/utils';
import uploadFileService from '../../../../services/uploadFileService';
import * as Yup from 'yup';
import AppConsts from '../../../../lib/appconst';
import { Formik, Form, FormikHelpers } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ModalAddUser({
    isShowModal,
    dataNhanVien,
    userId,
    dataChiNhanh,
    onCancel
}: any) {
    const [tabIndex, setTabIndex] = useState('1');
    const [avatar, setAvatar] = useState('');
    const [googleDrive_fileId, setGoogleDrive_fileId] = useState('');
    const [fileImage, setFileImage] = useState<File>({} as File); // file image
    const [showPassword, setShowPassword] = useState<File>({} as File); // file image

    const [user, setUser] = useState<CreateOrUpdateUserInput | null>();
    const [roles, setRoles] = useState<CreateOrUpdateUserInput | null>();
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    };

    const GetInforUser = async () => {
        const userEdit = await userService.get(userId);
        setUser(userEdit);
    };

    const GetAllRole_ofUser = async () => {
        const roles = await userService.getRoles();
        setRoles(roles);
    };

    useEffect(() => {
        if (isShowModal) {
            if (userId === 0) {
                const idChiNhanh = dataChiNhanh?.length === 1 ? dataChiNhanh[0].id : '';
                setUser({ idChiNhanhMacDinh: idChiNhanh } as CreateOrUpdateUserInput);
            } else {
                GetInforUser();
                GetAllRole_ofUser();
            }
        }
    }, [isShowModal]);

    const changeNhanVien = async (item: any) => {
        setUser({ ...user, nhanSuId: item?.id } as CreateOrUpdateUserInput);
        setAvatar(item?.avatar);
        initialValues.nhanSuId = item?.id;
    };
    const changeChiNhanh = async (item: any) => {
        setUser({ ...user, idChiNhanhMacDinh: item?.id } as CreateOrUpdateUserInput);
    };
    const choseImage = async (pathFile: string, file: File) => {
        if (!utils.checkNull(googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(googleDrive_fileId);
        }
        setAvatar(pathFile);
        setFileImage(file);
    };
    const closeImage = () => {
        setAvatar('');
        setGoogleDrive_fileId('');
    };
    const saveUser = async () => {
        const obj = { ...user };
        // obj.av
    };

    const initialValues = {
        nhanSuId: user?.nhanSuId,
        emailAddress: user?.emailAddress,
        userName: user?.userName,
        password: user?.password,
        passwordNew: user?.password,
        confirmPassword: user?.password
    };

    const rules = Yup.object().shape({
        nhanSuId: Yup.string().required('Vui lòng chọn nhân viên'),
        emailAddress: Yup.string()
            .matches(AppConsts.emailRegex, 'Email không hợp lệ')
            .required('Vui lòng nhập email'),
        userName: Yup.string().required('Vui lòng nhập tên truy cập'),
        password: Yup.string().matches(
            AppConsts.passwordRegex,
            'Mật khẩu tối thiểu 6 ký tự, phải có ít nhất 1 ký tự in hoa, 1 ký tự thường và 1 ký tự đặc biệt'
        ),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password'), ''],
            'Mật khẩu xác nhận phải trùng khớp'
        )
    });
    return (
        <>
            <Dialog open={isShowModal} maxWidth={'sm'} fullWidth onClose={onCancel}>
                <DialogTitle>
                    <Box className="modal-title">
                        {userId === 0 ? 'Thêm mới' : 'Cập nhật'} người dùng
                    </Box>

                    <DialogButtonClose />
                </DialogTitle>
                <DialogContent sx={{ '& .MuiTabPanel-root': { padding: 0 } }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={saveUser}>
                        {({ handleChange, values, errors, touched, setFieldValue }) => (
                            <Form>
                                <TabContext value={tabIndex}>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Người dùng" value={'1'}></Tab>
                                        <Tab label="Vai trò" value={'2'}></Tab>
                                    </TabList>
                                    <TabPanel value="1">
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <CircleImageUpload
                                                    pathImg={avatar}
                                                    handeChoseImage={choseImage}
                                                    handleCloseImage={closeImage}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Stack spacing={2}>
                                                    <AutocompleteNhanVien
                                                        label="Chọn nhân sự đã có"
                                                        helperText={
                                                            touched.nhanSuId &&
                                                            errors.nhanSuId && (
                                                                <span>{errors.nhanSuId}</span>
                                                            )
                                                        }
                                                        dataNhanVien={dataNhanVien}
                                                        idChosed={user?.nhanSuId}
                                                        handleChoseItem={(item: any) => {
                                                            changeNhanVien(item);
                                                            setFieldValue('nhanSuId', item?.id);
                                                        }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="userName"
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Tên truy cập
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.userName &&
                                                            errors.userName && (
                                                                <span>{errors.userName}</span>
                                                            )
                                                        }
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="emailAddress"
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Email
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.emailAddress &&
                                                            errors.emailAddress && (
                                                                <span>{errors.emailAddress}</span>
                                                            )
                                                        }
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} paddingTop={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    type="password"
                                                    onChange={handleChange}
                                                    label={
                                                        <label style={{ fontSize: '13px' }}>
                                                            Mật khẩu {userId === 0 ? '' : 'cũ'}
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '2px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                    }
                                                    helperText={
                                                        touched.password &&
                                                        errors.password && (
                                                            <span>{errors.password}</span>
                                                        )
                                                    }
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    //   onClick={handleClickShowPassword}
                                                                    //   onMouseDown={handleMouseDownPassword}
                                                                    edge="end">
                                                                    {showPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{ display: userId !== 0 ? '' : 'none' }}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    name="password"
                                                    type="password"
                                                    label={
                                                        <label style={{ fontSize: '13px' }}>
                                                            Mật khẩu mới
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '2px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    type="password"
                                                    name="confirmPassword"
                                                    onChange={handleChange}
                                                    label={
                                                        <label style={{ fontSize: '13px' }}>
                                                            Nhập lại mật khẩu
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '2px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                    }
                                                    helperText={
                                                        touched.confirmPassword &&
                                                        errors.confirmPassword && (
                                                            <span>{errors.confirmPassword}</span>
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AutocompleteChiNhanh
                                                    label="Chi nhánh mặc định"
                                                    dataChiNhanh={dataChiNhanh}
                                                    idChosed={user?.idChiNhanhMacDinh}
                                                    handleChoseItem={changeChiNhanh}
                                                />
                                            </Grid>
                                            <Grid item xs={12} paddingTop={0}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" />}
                                                        label="Là quản trị viên"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox defaultChecked size="small" />
                                                        }
                                                        label="Kích hoạt"
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2">Item Three</TabPanel>
                                </TabContext>
                                <Grid container justifyContent={'end'}>
                                    <Stack
                                        spacing={1}
                                        justifyContent={'flex-end'}
                                        direction={'row'}>
                                        <Button variant="outlined">Hủy</Button>
                                        <Button variant="contained" type="submit">
                                            Lưu
                                        </Button>
                                    </Stack>
                                </Grid>
                                <DialogActions></DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
}
