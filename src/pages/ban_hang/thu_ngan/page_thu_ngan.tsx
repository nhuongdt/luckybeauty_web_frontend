import { AppBar, Box, Stack, Button, IconButton, Toolbar, Typography, Avatar, Drawer, Grid } from '@mui/material';
import { ReactComponent as Logo } from '../../../images/Logo_Lucky_Beauty.svg';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { LocalOffer } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useEffect, useState } from 'react';
import TreeViewGroupProduct from '../../../components/Treeview/ProductGroup';
import GroupProductService from '../../../services/product/GroupProductService';
import { IHangHoaGroupTheoNhomDto, ModelNhomHangHoa } from '../../../services/product/dto';
import { IList } from '../../../services/dto/IList';
import AccordionWithData from '../../../components/Accordion/AccordionWithData';
import ProductService from '../../../services/product/ProductService';

const lstOption: IList[] = [
    { id: '1', text: 'Trang chủ', icon: <HomeOutlinedIcon /> },
    { id: '2', text: 'Danh sách hóa đơn', icon: <FormatListBulletedOutlinedIcon /> },
    { id: '3', text: 'Lịch hẹn', icon: <CalendarMonthOutlinedIcon /> }
];

export default function PageThuNgan() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);

    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);

    const toogleDrawer = (newVal: boolean) => () => {
        setOpenDrawer(newVal);
    };
    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const getListHangHoa_groupbyNhom = async () => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: '',
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        };
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };
    const PageLoad = () => {
        GetTreeNhomHangHoa();
        getListHangHoa_groupbyNhom();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const clickAction = (item: IList) => {
        //
    };
    return (
        <>
            {/* <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
                <Stack direction={'row'} justifyContent={'space-between'} sx={{ padding: '8px 18px' }}>
                    <Stack onClick={toogleDrawer(true)}>
                        <Logo />
                    </Stack>
                    <IconButton>
                        <AccountCircleOutlinedIcon />
                    </IconButton>
                </Stack>
            </AppBar> */}
            <Drawer open={openDrawer} onClose={toogleDrawer(false)}>
                <Stack spacing={1} padding={1} marginTop={2}>
                    <Stack spacing={1}>
                        <Typography sx={{ fontSize: '18px' }} fontWeight={500}>
                            Nhóm dịch vụ/ hàng hóa
                        </Typography>
                        <Stack paddingTop={1}>
                            <AccordionWithData
                                roleEdit={false}
                                lstData={allNhomHangHoa?.map((x) => {
                                    return {
                                        id: x.id,
                                        text: x.tenNhomHang,
                                        text2: x?.tenNhomHang_KhongDau,
                                        color: x.color,
                                        icon: <LocalOffer sx={{ width: 16 }} />,
                                        children: x?.children?.map((o) => {
                                            return {
                                                id: o.id,
                                                text: o.tenNhomHang,
                                                text2: o?.tenNhomHang_KhongDau
                                            };
                                        })
                                    } as IList;
                                })}
                                clickTreeItem={(isEdit, itemChosed) => setIdNhomHang(itemChosed?.id as string)}
                            />
                        </Stack>
                        <Stack direction={'row'} justifyContent={'end'} spacing={2}>
                            <Button variant="outlined" color="error">
                                Bỏ qua
                            </Button>
                            <Button variant="outlined" color="info">
                                Áp dụng
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Drawer>
            <Grid container minHeight={'86vh'} maxHeight={'86vh'}>
                <Grid item xs={6}>
                    <Stack spacing={2} overflow={'auto'} maxHeight={'80vh'}>
                        {listProduct.map((nhom: IHangHoaGroupTheoNhomDto, index: number) => (
                            <Stack key={index}>
                                <Typography fontSize={16} fontWeight={500} marginBottom={0.5}>
                                    {nhom?.tenNhomHang}
                                </Typography>
                                <Grid container spacing={2}>
                                    {nhom.hangHoas.map((item, index2) => (
                                        <Grid key={index2} item xs={4}>
                                            <Stack padding={2} sx={{ backgroundColor: 'var(--color-bg)' }}>
                                                <Stack spacing={2}>
                                                    <Typography fontWeight={500} variant="body2">
                                                        {item?.tenHangHoa}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {Intl.NumberFormat('vi-VN').format(item?.giaBan as number)}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack marginLeft={4}>
                        <Stack spacing={2}>
                            <Stack direction={'row'}>
                                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                    <Avatar />
                                    <Stack spacing={1}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Ten khach hang
                                        </Typography>
                                        <Typography color={'#ccc'} variant="caption">
                                            09853666
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
