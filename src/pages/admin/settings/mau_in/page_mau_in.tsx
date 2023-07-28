import React, { useContext } from 'react';

import { Box, Grid, Tabs, Tab, Stack, Button, Select } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import TabPanel from '../../../../components/TabPanel/TabPanel';

import MauInServices from '../../../../services/mau_in/MauInServices';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../../services/ban_hang/PageHoaDonChiTietDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangItemDto } from '../../../../services/khach-hang/dto/KhachHangItemDto';
import logoChiNhanh from '../../../../images/Lucky_beauty.jpg';

import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { MauInDto } from '../../../../services/mau_in/MauInDto';
import { ISelect } from '../../../../lib/appconst';
import ModalAddMauIn from './modal_add_mau_in';
import utils from '../../../../utils/utils';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import DataMauIn from './DataMauIn';

export default function PageMauIn({ xx }: any) {
    const [html, setHtml] = useState('');
    const [dataPrint, setdataPrint] = useState('');
    const firstLoad = useRef(true);
    const chinhanhCurrent = useContext(ChiNhanhContext);

    const [lstMauIn, setListMauIn] = useState<ISelect[]>([]);
    const [idMauInChosed, setIdMauInChosed] = useState('');
    const [isShowModalAddMauIn, setIsShowModalAddMauIn] = useState(false);
    const [idLoaiChungTu, setIdLoaiChungTu] = useState(1);

    useEffect(() => {
        GetContentHtml();
    }, []);

    const GetContentHtml = async () => {
        const data = await MauInServices.GetFileMauIn('HoaDonBan.txt');
        setHtml(data);

        BindDataPrint(data);
    };

    const BindDataPrint = (shtml: string) => {
        let dataAfter = DataMauIn.replaceHoaDon(shtml);
        dataAfter = DataMauIn.replaceChiTietHoaDon(dataAfter);
        setdataPrint(dataAfter);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIdLoaiChungTu(newValue);
    };

    const GetListMauIn_byLoaiChungTu = () => {
        const data = [{ id: '1', laMacDinh: false, tenMauIn: 'Mau01' } as MauInDto];
        const lst = data.map((item) => {
            return { value: item.id, text: item.tenMauIn } as unknown as ISelect;
        });
        setListMauIn(lst);
    };

    const [newMauIn, setNewMauIn] = useState<MauInDto>({} as MauInDto);

    const showModalAddMauIn = () => {
        setIsShowModalAddMauIn(true);
        setNewMauIn({ ...newMauIn, id: '', tenMauIn: '' });
    };

    const changeMauIn = (item: any) => {
        setIdMauInChosed(item.value);
    };
    const saveMauIn = async (dataMauIn: any) => {
        setIsShowModalAddMauIn(false);

        setNewMauIn({
            ...newMauIn,
            loaiChungTu: idLoaiChungTu,
            tenMauIn: dataMauIn,
            noiDungMauIn: dataMauIn.noiDungMauIn
        });

        const dataNew = {
            ...dataMauIn
        };
        if (utils.checkNull(newMauIn.id)) {
            // insert
            dataNew.idLoaiChungTu = idLoaiChungTu;
            dataNew.idChiNhanh = chinhanhCurrent.id;

            await MauInServices.InsertMauIn(dataNew);
        } else {
            await MauInServices.UpdatetMauIn(dataNew);
        }
        // map/push to list mauin
    };

    const tenLoaiChungTu = () => {
        let sLoai = '';
        switch (idLoaiChungTu) {
            case 1:
                sLoai = 'HD';
                break;
        }
        return sLoai;
    };

    const onChangeCkeditor = (shtmlNew: string) => {
        console.log('onchange');
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        BindDataPrint(shtmlNew);
    };

    return (
        <>
            <ModalAddMauIn
                isShowModal={isShowModalAddMauIn}
                tenLoaiChungTu={tenLoaiChungTu().toString()}
                handleSave={saveMauIn}
                onClose={() => setIsShowModalAddMauIn(false)}
            />
            <Grid container gap={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={idLoaiChungTu}
                            onChange={handleChange}
                            aria-label="basic tabs example">
                            <Tab label="Hóa đơn" value={1} />
                            <Tab label="Phiếu thu" value={11} />
                            <Tab label="Phiếu chi" value={11} />
                        </Tabs>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={12}>
                    <Grid container gap={2}>
                        <Grid item xs={2}>
                            <Button variant="contained" fullWidth onClick={showModalAddMauIn}>
                                Thêm mới
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <SelectWithData
                                data={lstMauIn}
                                idChosed={idMauInChosed}
                                handleChange={changeMauIn}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={saveMauIn}>
                                Cập nhật
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={12}>
                    <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                </Grid>

                <Grid item xs={12} sm={6} md={12} lg={12}>
                    <div dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                </Grid>
            </Grid>
        </>
    );
}
