import { AppBar, Box, Stack, Button, IconButton, Toolbar, Typography, Avatar, Drawer } from '@mui/material';
import { ReactComponent as Logo } from '../../../images/Logo_Lucky_Beauty.svg';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { LocalOffer } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useEffect, useState } from 'react';
import TreeViewGroupProduct from '../../../components/Treeview/ProductGroup';
import GroupProductService from '../../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../../services/product/dto';
import { IList } from '../../../services/dto/IList';
import AccordionWithData from '../../../components/Accordion/AccordionWithData';

const lstOption: IList[] = [
    { id: '1', text: 'Trang chủ', icon: <HomeOutlinedIcon /> },
    { id: '2', text: 'Danh sách hóa đơn', icon: <FormatListBulletedOutlinedIcon /> },
    { id: '3', text: 'Lịch hẹn', icon: <CalendarMonthOutlinedIcon /> }
];

export default function PageThuNgan() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [idNhomHang, setIdNhomHang] = useState('');

    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);

    const toogleDrawer = (newVal: boolean) => () => {
        setOpenDrawer(newVal);
    };
    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const clickAction = (item: IList) => {
        //
    };
    return (
        <>
            <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
                <Stack direction={'row'} justifyContent={'space-between'} sx={{ padding: '8px 18px' }}>
                    <Stack onClick={toogleDrawer(true)}>
                        {/* <Avatar src={LogoApp} sx={{ width: '100%' }} /> */}
                        <Logo />
                    </Stack>
                    <IconButton>
                        <AccountCircleOutlinedIcon />
                    </IconButton>
                </Stack>
            </AppBar>
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
        </>
    );
}
