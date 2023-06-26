import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import { Component, ReactNode } from 'react';
import { CreateOrEditSoQuyDto } from '../../../../services/so_quy/Dto/CreateOrEditSoQuyDto';
interface SoQuyDialogProps {
    visiable: boolean;
    title: string;
    onClose: () => void;
    onOk: () => void;
    createOrEditSoQuyDto: CreateOrEditSoQuyDto;
}
class CreateOrEditSoQuyDialog extends Component<SoQuyDialogProps> {
    render(): ReactNode {
        const { visiable, title, onClose } = this.props;
        const LableForm = (text: string) => {
            return (
                <Typography
                    sx={{ marginTop: 2, marginBottom: 1 }}
                    variant="h3"
                    fontSize="14px"
                    fontWeight="500"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    color="#4C4B4C">
                    {text}
                </Typography>
            );
        };
        return (
            <Dialog open={visiable} fullWidth maxWidth={'md'}>
                <DialogTitle>
                    <div className="row">
                        <Box className="col-8" sx={{ float: 'left' }}>
                            {title}
                        </Box>
                        <Box
                            className="col-4"
                            sx={{
                                float: 'right',
                                '& svg:hover': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon
                                style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                                onClick={onClose}
                            />
                        </Box>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={this.props.createOrEditSoQuyDto}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values));
                        }}>
                        {({ values, handleChange, errors }) => (
                            <Form>
                                <Box>
                                    <div>
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    checked={values.maPhieu === 'Phiếu thu'}
                                                    onChange={handleChange}
                                                    value="Phiếu thu"
                                                    name="maPhieu"
                                                />
                                            }
                                            label="Phiếu thu"
                                        />
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    checked={values.maPhieu === 'Phiếu chi'}
                                                    onChange={handleChange}
                                                    value="Phiếu chi"
                                                    name="maPhieu"
                                                />
                                            }
                                            label="Phiếu chi"
                                        />
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            {LableForm('Mã phiếu')}
                                            <TextField size="small" fullWidth />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {LableForm('Hình thức')}
                                            <TextField size="small" fullWidth />
                                        </Grid>
                                    </Grid>
                                    {LableForm('Thu của')}
                                    <TextField size="small" fullWidth />
                                    {LableForm('Tiền thu')}
                                    <TextField size="small" fullWidth />
                                    {LableForm('Nội dung')}
                                    <TextField
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="ghiChu"
                                        onChange={handleChange}
                                    />
                                    <FormGroup className="mt-3 mb-2">
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Checkbox
                                                    //checked={values.maPhieu === 'Phiếu thu'}
                                                    onChange={handleChange}
                                                    value="Phiếu thu"
                                                    name="acb"
                                                />
                                            }
                                            label="Hạch toán vào kết quả hoạt động kinh doanh"
                                        />
                                    </FormGroup>
                                </Box>
                                <DialogActions>
                                    <ButtonGroup>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',
                                                backgroundColor: '#7C3367',
                                                border: 'none'
                                            }}
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            variant="outlined"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#965C85'
                                            }}
                                            className="btn-outline-hover">
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
export default CreateOrEditSoQuyDialog;
