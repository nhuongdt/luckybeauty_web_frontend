import { useState, useEffect } from 'react';
import { Grid, Box, Stack, Typography } from '@mui/material';
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import TreeViewGroupProduct from '../../components/Treeview/ProductGroup';
import CustomersChecking from '../check_in/customer_checking';
import PageBanHang from './page_ban_hang';

import { ModelNhomHangHoa } from '../../services/product/dto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import GroupProductService from '../../services/product/GroupProductService';
import './style.css';
import { Guid } from 'guid-typescript';

export default function MainPageBanHang() {
    const [activeTabProduct, setActiveTabProduc] = useState(false);
    const [nhomDichVu, setNhomDichVu] = useState<ModelNhomHangHoa[]>([]);
    const [nhomHangHoa, setNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [idNhomHang, setIdNhomHang] = useState('');

    const [cusChosing, setCusChosing] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY })
    );

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const lstAll = [...list.items];
        setNhomDichVu(lstAll.filter((x) => !x.laNhomHangHoa));
        setNhomHangHoa(lstAll.filter((x) => x.laNhomHangHoa));
    };

    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };
    useEffect(() => {
        PageLoad();
    }, []);
    const choseNhomDichVu = (isEdit: boolean, item: any) => {
        setIdNhomHang(item.id);
    };
    const choseCustomer = (cus: any) => {
        setCusChosing((old: any) => {
            return {
                ...old,
                idKhachHang: cus.idKhachHang,
                maKhachHang: cus.maKhachHang,
                tenKhachHang: cus.tenKhachHang,
                soDienThoai: cus.soDienThoai,
                tongTichDiem: cus.tongTichDiem
            };
        });
        setActiveTabProduc(true);
    };

    return (
        <>
            <Grid container padding={2} columnSpacing={2} rowSpacing={2}>
                <Grid item xs={3} sm={3} md={3} lg={2}>
                    <Stack display="column" spacing={3}>
                        <Stack direction="row">
                            <SkipPrevious
                                className="btnToggleLeft"
                                onClick={() => setActiveTabProduc(false)}
                            />
                            <SkipNext
                                className="btnToggleRight"
                                onClick={() => setActiveTabProduc(true)}
                            />
                        </Stack>
                        {activeTabProduct && (
                            <>
                                <Box>
                                    <Typography
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            paddingBottom: '12px'
                                        }}>
                                        Nhóm dịch vụ
                                    </Typography>
                                    <TreeViewGroupProduct
                                        dataNhomHang={nhomDichVu}
                                        clickTreeItem={choseNhomDichVu}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            paddingBottom: '12px'
                                        }}>
                                        Nhóm hàng hóa
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Grid>
                {!activeTabProduct && <CustomersChecking hanleChoseCustomer={choseCustomer} />}
                {activeTabProduct && (
                    <PageBanHang customerChosed={cusChosing} idNhomHang={idNhomHang} />
                )}
            </Grid>
        </>
    );
}
