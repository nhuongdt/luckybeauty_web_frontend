import * as React from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Stack,
    Button,
    Container
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TreeViewGroupProduct from '../../components/Treeview/ProductGroup';
import { SkipNext, SkipPrevious, Search, DeleteOutline } from '@mui/icons-material';

import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import {
    ModelNhomHangHoa,
    ModelHangHoaDto,
    PagedProductSearchDto
} from '../../services/product/dto';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AiOutlineDelete } from 'react-icons/ai';
import { Clear } from '@mui/icons-material';

import './style.css';
import { Link } from 'react-router-dom';

const shortNameCus = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    borderRadius: '35px',
                    width: '37px',
                    height: '35px',
                    border: 'none',
                    backgroundColor: '#e4cdde',
                    color: '#7C3367'
                }
            }
        }
    }
});

export default function PageBanHang() {
    const history = useNavigate();
    const [treeNhomHangHoa, setTreeNhomHangHoa] = React.useState<ModelNhomHangHoa[]>([]);
    const [nhomDichVu, setNhomDichVu] = React.useState<ModelNhomHangHoa[]>([]);
    const [nhomHangHoa, setNhomHangHoa] = React.useState<ModelNhomHangHoa[]>([]);
    const [activeTabProduct, setActiveTabProduc] = useState(false);

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const lstAll = [...list.items];
        // const obj = new ModelNhomHangHoa({
        //     id: '',
        //     maNhomHang: '',
        //     tenNhomHang: 'Tất cả',
        //     color: '#7C3367'
        // });
        // lstAll.unshift(obj);
        setNhomDichVu(lstAll.filter((x) => !x.laNhomHangHoa));
        setNhomHangHoa(lstAll.filter((x) => x.laNhomHangHoa));
        setTreeNhomHangHoa(lstAll);
    };

    const PageLoad = () => {
        GetTreeNhomHangHoa();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const choseNhomDichVu = () => {
        console.log(11);
    };
    const gotoPage = (type: number) => {
        switch (type) {
            case 1:
                setActiveTabProduc(true);
                history('/check-in');
                break;
        }
    };

    return (
        <>
            <Grid container padding={2} className="page-ban-hang" columnSpacing={2}>
                <Grid item xs={3} sm={3} lg={2} md={3}>
                    <Stack display="column" spacing={3}>
                        <Box>
                            <SkipPrevious className="btnToggleLeft" onClick={(e) => gotoPage(1)} />
                            <SkipNext className="btnToggleRight" />
                        </Box>

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
                    </Stack>
                </Grid>
                <Grid item xs={5} sm={5} lg={6} md={5}>
                    <Grid item xs={12} sm={12} md={12} lg={12} className="nhom-dich-vu">
                        <Box className="page-title-search">
                            <TextField
                                placeholder="Tìm dịch vụ"
                                size="small"
                                fullWidth
                                style={{ padding: '5px 16px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}></TextField>
                        </Box>
                    </Grid>

                    {/* list sp nhom */}
                    <Grid container className="center" columnSpacing={2} rowSpacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Typography className="nhom-dich-vu"> Chăm sóc tóc</Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <Stack display="column" padding={1} className="infor-dich-vu">
                                <Typography className="ten-dich-vu">Cắt tóc</Typography>
                                <Typography>50,000</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <Stack display="column" padding={1} className="infor-dich-vu">
                                <Typography className="ten-dich-vu">Cắt tóc</Typography>
                                <Typography>50,000</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <Stack display="column" padding={1} className="infor-dich-vu">
                                <Typography className="ten-dich-vu">
                                    Hấp phục hồi chuyên sâu
                                </Typography>
                                <Typography>1,500,000</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <Stack display="column" padding={1} className="infor-dich-vu">
                                <Typography className="ten-dich-vu">Cắt tóc</Typography>
                                <Typography>50,000</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <Stack display="column" padding={1} className="infor-dich-vu">
                                <Typography className="ten-dich-vu">
                                    Hấp phục hồi chuyên sâu
                                </Typography>
                                <Typography>1,500,000</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                {/* end list sp nhom */}
                <Grid item xs={12} sm={4} lg={4} md={4}>
                    <Stack display="column" spacing={2}>
                        <Stack sx={{ flexDirection: 'row' }}>
                            <ThemeProvider theme={shortNameCus}>
                                <Button>TM</Button>
                            </ThemeProvider>
                            <Box sx={{ paddingLeft: '8px' }}>
                                <Typography className="cusname">Nguyễn Nguyên Quang</Typography>
                                <Typography className="cusphone" sx={{ color: '#acaca5' }}>
                                    0978555698
                                </Typography>
                            </Box>
                        </Stack>

                        {/* 1 chi tiet hoadon */}
                        <Box>
                            <Stack sx={{ flexDirection: 'row' }}>
                                <Grid container>
                                    <Grid item xs={12} sm={7} md={7} lg={7}>
                                        <Typography color="#7c3367">Combo cat uon</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Stack
                                            sx={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}>
                                            <Typography
                                                style={{ textAlign: 'center', fontWeight: 500 }}>
                                                1
                                            </Typography>
                                            <Typography
                                                width={25}
                                                style={{ textAlign: 'center', fontWeight: 500 }}>
                                                x
                                            </Typography>
                                            <Typography style={{ fontWeight: 500 }}>
                                                12,000,000
                                            </Typography>
                                            <Box width={35}>
                                                <AiOutlineDelete
                                                    style={{
                                                        float: 'right',
                                                        fontSize: '18px',
                                                        color: '#b25656'
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                            <Stack>
                                <Grid container>
                                    <Grid item xs={4} sm={4} md={2} lg={2}>
                                        <Typography
                                            style={{
                                                fontSize: '12px'
                                            }}>
                                            Nhân viên:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8} sm={8} md={10} lg={10}>
                                        <Stack sx={{ flexDirection: 'row' }}>
                                            {/* 1 nhan vien */}
                                            <Stack
                                                sx={{ flexDirection: 'row' }}
                                                className="nvthuchien">
                                                <Box className="cuspoint">Nguyễn Lê Hải Phong</Box>
                                                <Box style={{ paddingLeft: '5px' }}>
                                                    <Clear
                                                        style={{
                                                            fontSize: '12px'
                                                        }}
                                                    />
                                                </Box>
                                            </Stack>
                                            {/* end 1 nhan vien */}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Box>
                        {/* end 1 chi tiet hoadon */}

                        <Stack
                            spacing={2}
                            style={{ position: 'absolute', bottom: 16, right: 0 }}
                            width={28 / 100}>
                            <Grid container sx={{ paddingRight: '16px' }}>
                                <Grid item xs={12} sm={4} lg={4} md={4}>
                                    Tổng tiền hàng
                                </Grid>
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                    <Typography className="tongtien">1,200,000</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ paddingRight: '16px' }}>
                                <Grid item xs={12} sm={4} lg={4} md={4}>
                                    Giảm giá
                                </Grid>
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                    <Typography className="tongtien">1,200,000</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ paddingRight: '16px' }}>
                                <Grid item xs={12} sm={4} lg={4} md={4}>
                                    Tổng giảm giá
                                </Grid>
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                    <Typography className="tongtien">1,200,000</Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                sx={{ paddingRight: '16px' }}
                                style={{ fontSize: '16px', fontWeight: 500 }}>
                                <Grid item xs={12} sm={4} lg={4} md={4}>
                                    Tổng thanh toán
                                </Grid>
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                    <Typography style={{ float: 'right' }}>1,200,000</Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
