import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
    Checkbox,
    Box,
    createTheme,
    ThemeProvider
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import MauInServices from '../../../../services/mau_in/MauInServices';
import DataMauIn from './DataMauIn';
import utils from '../../../../utils/utils';
import SelectMauIn from '../../../../components/Menu/SelectMauIn';
import { MauInDto } from '../../../../services/mau_in/MauInDto';

const zIndexDialog = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    zIndex: 20 // !important: (default 1300), use to show tableToolbar of CKEditor
                }
            }
        }
    }
});

export default function ModalAddMauIn({
    lstMauIn,
    isShowModal,
    idUpdate = '',
    tenLoaiChungTu,
    handleSave,
    onClose
}: any) {
    const firstLoad = useRef(true);
    const [idChosed, setIdChosed] = useState('');
    const [html, setHtml] = useState('');
    const [dataPrint, setDataPrint] = useState('');
    const [tenMauIn, setTenMauIn] = useState('');
    const [isCheckMauMacDinh, setIsCheckMauMacDinh] = useState(false);
    const [isClickSave, setIsClickSave] = useState(false);

    // const errtenMauIn = isClickSave && utils.checkNull(tenMauIn) ? 'Vui lòng nhập tên mẫu in' : '';
    const errtenMauIn = '';
    console.log('modelmauin');

    const BindDataPrint = (html: string) => {
        let dataAfter = DataMauIn.replaceChiTietHoaDon(html);
        dataAfter = DataMauIn.replaceHoaDon(dataAfter);
        setDataPrint(() => dataAfter);
    };

    const GetContentMauInMacDinh = async (loai = 1) => {
        //Loai (1.k80,2.a4)
        const data = await MauInServices.GetContentMauInMacDinh(loai, tenLoaiChungTu);
        setHtml(data);
        BindDataPrint(data);
    };

    useEffect(() => {
        if (isShowModal) {
            console.log('idUpdate');
            if (utils.checkNull(idUpdate)) {
                // insert
                setIdChosed('1');
                GetContentMauInMacDinh(1);

                setTenMauIn('');
                setIsCheckMauMacDinh(false);
            } else {
                setIdChosed(idUpdate);
                // update
                const itEx = lstMauIn.filter((x: MauInDto) => x.id === idUpdate);
                if (itEx.length > 0) {
                    setHtml(itEx[0].noiDungMauIn);
                    BindDataPrint(itEx[0].noiDungMauIn);

                    setTenMauIn(itEx[0].tenMauIn);
                    setIsCheckMauMacDinh(itEx[0].laMacDinh);
                } else {
                    setHtml('');
                }
            }
            setIsClickSave(false);
        }
    }, [isShowModal]);

    const changeMauIn = (item: MauInDto) => {
        setIdChosed(item.id);
        if (item.id.length < 36) {
            GetContentMauInMacDinh(parseInt(item.id));
        } else {
            const itEx = lstMauIn.filter((x: MauInDto) => x.id === item.id);
            if (itEx.length > 0) {
                setHtml(itEx[0].noiDungMauIn);
                BindDataPrint(itEx[0].noiDungMauIn);
            }
        }
    };

    const onChangeCkeditor = (shtmlNew: string) => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        BindDataPrint(shtmlNew);
    };

    const saveMauIn = () => {
        setIsClickSave(true);
        if (utils.checkNull(tenMauIn)) {
            return;
        }
        const data = {
            laMacDinh: isCheckMauMacDinh,
            tenMauIn: tenMauIn,
            noiDungMauIn: html
        };
        handleSave(data);
    };
    return (
        <>
            <ThemeProvider theme={zIndexDialog}>
                <Dialog
                    disableEnforceFocus
                    open={isShowModal}
                    onClose={onClose}
                    fullWidth
                    maxWidth="xl">
                    <DialogTitle>
                        Thêm mẫu in <i></i>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container>
                                    <Grid item xs={12} sm={2} md={2} lg={2}>
                                        <span className="modal-lable">Tên mẫu in</span>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={tenMauIn}
                                            onChange={(e) => {
                                                setTenMauIn(e.target.value);
                                            }}
                                            helperText={errtenMauIn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Box sx={{ float: 'right' }}>
                                            <Checkbox
                                                checked={isCheckMauMacDinh}
                                                onChange={(e) =>
                                                    setIsCheckMauMacDinh(e.target.checked)
                                                }
                                            />
                                            <span
                                                className="modal-lable"
                                                style={{ fontSize: '14px' }}>
                                                Là mẫu in mặc định
                                            </span>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2} md={2} lg={2}>
                                        <span className="modal-lable">Mẫu gợi ý</span>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={8} lg={8}>
                                        <SelectMauIn
                                            data={lstMauIn}
                                            idChosed={idChosed}
                                            handleChange={changeMauIn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Button variant="contained" onClick={saveMauIn} fullWidth>
                                            Lưu
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} md={6} lg={6}>
                                <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                            </Grid>
                            <Grid item sm={12} md={6} lg={6}>
                                <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </>
    );
}
