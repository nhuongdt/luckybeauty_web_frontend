import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import AppConsts, { ISelect } from '../../../../lib/appconst';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import MauInServices from '../../../../services/mau_in/MauInServices';
import DataMauIn from './DataMauIn';

export default function ModalAddMauIn({ isShowModal, tenLoaiChungTu, handleSave, onClose }: any) {
    const firstLoad = useRef(true);
    const [idChosed, setIdChosed] = useState(1);
    const [html, setHtml] = useState('');
    const [dataPrint, setDataPrint] = useState('');
    const [tenMauIn, setTenMauIn] = useState('');

    const GetContentMauInMacDinh = async (loai = 1) => {
        //Loai (1.k80,2.a4)
        const data = await MauInServices.GetContentMauInMacDinh(loai, tenLoaiChungTu);
        setHtml(data);

        BindDataMauIn(data);
    };

    useEffect(() => {
        if (isShowModal) {
            GetContentMauInMacDinh();
        }
    }, [isShowModal]);

    const BindDataMauIn = (html: string) => {
        let dataAfter = DataMauIn.replaceChiTietHoaDon(html);
        dataAfter = DataMauIn.replaceHoaDon(dataAfter);
        setDataPrint(() => dataAfter);
    };

    const changeMauIn = (item: ISelect) => {
        setIdChosed(item.value);
        GetContentMauInMacDinh(item.value);
    };

    const onChangeCkeditor = (shtmlNew: string) => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        console.log('onChangeCkeditor ', isShowModal);
        BindDataMauIn(shtmlNew);
    };

    const saveMauIn = () => {
        const data = {
            tenMauIn: tenMauIn,
            noiDungMauIn: html
        };
        handleSave(data);
    };
    return (
        <>
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
                        <Grid item md={6} lg={6}>
                            <Grid container>
                                <Grid item xs={2}>
                                    <span className="modal-lable">Tên mẫu in</span>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={tenMauIn}
                                        onChange={(e) => setTenMauIn(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <span className="modal-lable">Mẫu gợi ý</span>
                                </Grid>
                                <Grid item xs={8}>
                                    <SelectWithData
                                        data={AppConsts.lstMauInMacDinh}
                                        idChosed={idChosed}
                                        handleChange={changeMauIn}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" onClick={saveMauIn}>
                                        Lưu
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={6} lg={6}>
                            <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                        </Grid>
                        <Grid item md={6} lg={6}>
                            <div
                                className="ck-content"
                                dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
