import {
    ButtonGroup,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../services/suggests/dto/SuggestDonViQuiDoi';
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import chietKhauDichVuService from '../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import AppConsts from '../../../../../lib/appconst';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    idNhanVien: string;
    formRef: CreateOrEditChietKhauDichVuDto;
    suggestDonViQuiDoi: SuggestDonViQuiDoiDto[];
}
class CreateOrEditChietKhauDichVuModal extends Component<DialogProps> {
    render(): ReactNode {
        const { title, onClose, onSave, visited, formRef, suggestDonViQuiDoi, idNhanVien } =
            this.props;
        const initialValues: CreateOrEditChietKhauDichVuDto = formRef;
        const rules = Yup.object().shape({
            idDonViQuiDoi: Yup.string()
                .min(3, 'Dịch vụ là bắt buộc')
                .required('Dịch vụ là bắt buộc')
        });
        return (
            <Dialog open={visited} fullWidth maxWidth="md">
                <DialogTitle>
                    {title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            values.id = values.id ?? AppConsts.guidEmpty;
                            values.idNhanVien = idNhanVien;
                            values.idChiNhanh = Cookies.get('IdChiNhanh') ?? '';
                            values.idDonViQuiDoi = values.idDonViQuiDoi ?? suggestDonViQuiDoi[0].id;
                            await chietKhauDichVuService.CreateOrEdit(values);
                            await onSave();
                        }}>
                        {({ values, handleChange, errors, touched }) => (
                            <Form>
                                <Grid container spacing={4} rowSpacing={2}>
                                    <TextField
                                        hidden
                                        name="idNhanVien"
                                        value={idNhanVien}></TextField>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Dịch vụ
                                        </Typography>
                                        <Select
                                            size="small"
                                            name="idDonViQuiDoi"
                                            value={values.idDonViQuiDoi}
                                            defaultValue={suggestDonViQuiDoi[0].id}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}>
                                            {suggestDonViQuiDoi.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.tenDonVi}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.idDonViQuiDoi && (
                                            <small className="text-danger">
                                                {errors.idDonViQuiDoi}
                                            </small>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Loại chiết khấu
                                        </Typography>
                                        <RadioGroup
                                            value={values.loaiChietKhau}
                                            defaultValue={values.loaiChietKhau}
                                            name="loaiChietKhau"
                                            onChange={handleChange}
                                            sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                value={1}
                                                control={<Radio />}
                                                label="Thực hiện"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={<Radio />}
                                                label="Yêu cầu"
                                            />
                                            <FormControlLabel
                                                value={3}
                                                control={<Radio />}
                                                label="Tư vấn"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="#4C4B4C" variant="subtitle2">
                                            Giá trị
                                        </Typography>
                                        <TextField
                                            size="small"
                                            name="giaTri"
                                            value={values.giaTri}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            label={'Là phần trăm'}
                                            checked={values.laPhanTram ? true : false}
                                            value={values.laPhanTram}
                                            onChange={handleChange}
                                            name="laPhanTram"
                                            control={
                                                <Checkbox
                                                    checked={values.laPhanTram ? true : false}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <ButtonGroup
                                        sx={{
                                            height: '32px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#B085A4',
                                                border: 'none'
                                            }}>
                                            Lưu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85',
                                                borderColor: '#965C85'
                                            }}>
                                            Hủy
                                        </Button>
                                    </ButtonGroup>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default CreateOrEditChietKhauDichVuModal;
