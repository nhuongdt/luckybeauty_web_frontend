import { Component } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Formik } from 'formik';
import CreateTenantInput from '../../../services/tenant/dto/createTenantInput';
import tenantService from '../../../services/tenant/tenantService';
import rules from './createOrUpdateTenant.validation';
export interface ICreateOrEditTenantProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    tenantId: number;
    onOk: () => void;
    formRef: CreateTenantInput;
}
class CreateOrEditTenantModal extends Component<ICreateOrEditTenantProps> {
    state = {
        isHostDatabase: false
    };
    handleSubmit = async (values: CreateTenantInput) => {
        try {
            if (this.props.tenantId === 0) {
                await tenantService.create(values);
            } else {
                await tenantService.update({
                    id: this.props.tenantId,
                    isActive: values.isActive,
                    name: values.name,
                    tenancyName: values.tenancyName
                });
            }
            this.props.onOk();
        } catch (error) {
            console.log(error);
        }
    };
    render(): React.ReactNode {
        const { visible, onCancel, modalType, tenantId, onOk, formRef } = this.props;
        const { isHostDatabase } = this.state;
        const initialValues = {
            name: formRef.name,
            tenancyName: formRef.tenancyName,
            adminEmailAddress: formRef.adminEmailAddress,
            connectionString: formRef.connectionString,
            isActive: formRef.isActive
        };
        return (
            <>
                <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
                    <DialogTitle>
                        <Typography
                            variant="h3"
                            fontSize="24px"
                            color="rgb(51, 50, 51)"
                            fontWeight="700">
                            {modalType}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8
                            }}>
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={rules}
                                onSubmit={(e) => {
                                    console.log(e);
                                }}>
                                {({ handleChange, values, errors, touched }) => (
                                    <Form>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            gap="16px"
                                            marginTop="16px"
                                            sx={{
                                                '& label': {
                                                    fontSize: '14px'
                                                }
                                            }}>
                                            <FormGroup>
                                                <label>
                                                    Id Tenant
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginLeft: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    type="text"
                                                    size="small"
                                                    name="tenancyName"
                                                    value={values.tenancyName}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                                {touched.tenancyName && errors.tenancyName && (
                                                    <div>{errors.tenancyName}</div>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label htmlFor="name2">
                                                    Tên cửa hàng
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginLeft: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    type="text"
                                                    size="small"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                                {touched.name && errors.name && (
                                                    <div>{errors.name}</div>
                                                )}
                                            </FormGroup>
                                            {tenantId !== 0 ? null : (
                                                <>
                                                    <FormGroup>
                                                        <label htmlFor="email">
                                                            Email quản trị
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '3px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                        <TextField
                                                            type="email"
                                                            size="small"
                                                            name="adminEmailAddress"
                                                            value={values.adminEmailAddress}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        />
                                                        {touched.adminEmailAddress &&
                                                            errors.adminEmailAddress && (
                                                                <div>
                                                                    {errors.adminEmailAddress}
                                                                </div>
                                                            )}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            sx={{
                                                                '& .MuiTypography-root': {
                                                                    fontSize: '14px'
                                                                }
                                                            }}
                                                            value={isHostDatabase}
                                                            checked={isHostDatabase}
                                                            onChange={async (e) => {
                                                                await this.setState({
                                                                    isHostDatabase:
                                                                        !this.state.isHostDatabase
                                                                });
                                                            }}
                                                            control={<Checkbox />}
                                                            label="Dùng chung cơ sở dữ liệu với Host"
                                                        />
                                                    </FormGroup>
                                                </>
                                            )}
                                            {isHostDatabase || tenantId !== 0 ? null : (
                                                <FormGroup>
                                                    <label htmlFor="chuoi-ket-noi">
                                                        Chuỗi kết nối
                                                    </label>
                                                    <TextField
                                                        id="chuoi-ket-noi"
                                                        type="text"
                                                        size="small"
                                                        name="connectionString"
                                                        value={values.connectionString}
                                                        onChange={handleChange}
                                                        fullWidth
                                                    />
                                                    {touched.connectionString &&
                                                        errors.connectionString && (
                                                            <div>{errors.connectionString}</div>
                                                        )}
                                                </FormGroup>
                                            )}
                                            {tenantId !== 0 ? null : (
                                                <Typography
                                                    variant="body1"
                                                    fontSize="14px"
                                                    textAlign="center">
                                                    Mật khẩu mặc định là : 123qwe
                                                </Typography>
                                            )}
                                            <FormGroup>
                                                <FormControlLabel
                                                    sx={{
                                                        '& .MuiTypography-root': {
                                                            fontSize: '14px'
                                                        }
                                                    }}
                                                    name="isActive"
                                                    value={values.isActive}
                                                    onChange={handleChange}
                                                    checked={values.isActive}
                                                    control={<Checkbox />}
                                                    label="IsActive"
                                                />
                                            </FormGroup>
                                        </Box>
                                        <DialogActions>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderColor: '#7C3367!important',
                                                    color: '#7C3367'
                                                }}
                                                onClick={onCancel}>
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    this.handleSubmit(values);
                                                }}
                                                sx={{ backgroundColor: '#7C3367!important' }}>
                                                Lưu
                                            </Button>
                                        </DialogActions>
                                    </Form>
                                )}
                            </Formik>
                        </DialogContent>
                    </DialogTitle>
                </Dialog>
            </>
        );
    }
}
export default CreateOrEditTenantModal;
