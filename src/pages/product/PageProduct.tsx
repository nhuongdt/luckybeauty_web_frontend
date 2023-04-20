import * as React from 'react';
import { ReactNode } from 'react';

import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Icon,
    IconButton,
    SvgIcon,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { useState, useEffect, useRef } from 'react';
import { GetDM_NhomHangHoa, Get_DMHangHoa } from '../../services/product/service';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import { ModalNhomHangHoa } from './ModalGroupProduct';
import { ModalHangHoa } from './ModalProduct';
import { array, object } from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface Props {
    children?: ReactNode;
    // any props that come into the component
}

export function NhomHangHoas({ dataNhomHang }: any) {
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <>
            <List className="list-nhomhanghoa">
                {dataNhomHang.map((value: any) => (
                    <ListItem
                        key={value.id}
                        disableGutters
                        secondaryAction={
                            isHovering && (
                                <IconButton aria-label="comment">
                                    <AddIcon />
                                </IconButton>
                            )
                        }>
                        <ListItemAvatar style={{ minWidth: '40px' }}>
                            <LocalOfferIcon />
                        </ListItemAvatar>
                        <ListItemText primary={`${value.tenNhomHang}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export const TableProduct = ({ dataHangHoa }: any) => {
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead className="table-head">
                        <TableRow>
                            <TableCell sx={{ width: 1 / 25 }}>
                                <Checkbox />
                            </TableCell>
                            <TableCell sx={{ width: 1 / 10 }}>Mã dịch vụ</TableCell>
                            <TableCell>Tên dịch vụ</TableCell>
                            <TableCell sx={{ width: 1 / 6 }}>Nhóm dịch vụ</TableCell>
                            <TableCell sx={{ width: 1 / 12 }}>Đơn giá</TableCell>
                            <TableCell sx={{ width: 1 / 10 }}>Thời gian</TableCell>
                            <TableCell sx={{ width: 1 / 6 }}>Trạng thái</TableCell>
                            <TableCell sx={{ width: 1 / 25 }}>#</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {dataHangHoa.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ width: 1 / 25 }}>
                                    <Checkbox />
                                </TableCell>
                                <TableCell sx={{ width: 1 / 10 }}>{row.maHangHoa}</TableCell>
                                <TableCell align="left">{row.tenHangHoa}</TableCell>
                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                    {row.tenNhomHang}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 12 }} align="right">
                                    {row.giaBan}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 10 }} align="center">
                                    0
                                </TableCell>
                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                    {row.txtTrangThaiHang}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 25 }}></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default function PageProduct() {
    const [showModalNhomHang, setShowModalNhomHang] = useState(false);
    const [idNhomHangHoa, setIdNhomHangHoa] = useState(false);
    const [showModalHangHoa, setShowModalHangHoa] = useState(false);
    const [isNewNhomHang, setIsNewNhomHang] = useState(false);
    const [isNewProduct, setIsNewProduct] = useState(false);

    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [lstProduct, setLstProduct] = useState<ModelHangHoaDto[]>([]);

    useEffect(() => {
        GetDM_NhomHangHoa().then((data) => {
            const obj = {
                id: String,
                maNhomHang: '',
                tenNhomHang: 'Tất cả',
                laNhomhangHoa: false
            };
            data.items.unshift(obj);
            setLstProductGroup(data.items);
        });

        const param = {
            idNhomHangHoas: '',
            paramSearch: {
                textSearch: '',
                currentPage: 0,
                pageSize: 10,
                columnSort: '',
                typeSort: ''
            }
        };

        Get_DMHangHoa(param).then((data) => {
            setLstProduct(data.items);
        });
    }, []);

    function showModalAddNhomHang(id?: string) {
        if (id) {
            setIsNewNhomHang(false);
        } else {
            setIsNewNhomHang(true);
        }
        setShowModalNhomHang(true);
    }

    function showModalAddProduct(id?: string) {
        if (id) {
            setIsNewProduct(false);
        } else {
            setIsNewProduct(true);
        }
        setShowModalHangHoa(true);
    }

    function saveNhomHang(objNew: ModelNhomHangHoa) {
        setLstProductGroup((oldArr) => {
            const copy = [...oldArr];
            copy.splice(1, 0, objNew);
            return copy;
        });
    }

    function saveProduct(objNew: ModelHangHoaDto) {
        setLstProduct((oldArr) => {
            const copy = [...oldArr];
            const newRow = { ...objNew };
            const dvChuan = objNew.donViQuiDois.filter((x) => x.laDonViTinhChuan === 1);
            newRow.idDonViQuyDoi = dvChuan[0].id;
            newRow.maHangHoa = dvChuan[0].maHangHoa;
            newRow.giaBan = dvChuan[0].giaBan;
            newRow.tenDonViTinh = dvChuan[0].tenDonViTinh;
            copy.unshift(newRow);
            return copy;
        });
    }

    return (
        <>
            <ModalNhomHangHoa
                dataNhomHang={lstProduct}
                show={showModalNhomHang}
                isNew={isNewNhomHang}
                id={idNhomHangHoa}
                handleClose={() => setShowModalNhomHang(false)}
                handleSave={saveNhomHang}></ModalNhomHangHoa>
            <ModalHangHoa
                dataNhomHang={lstProduct}
                show={showModalHangHoa}
                id={idNhomHangHoa}
                isNew={isNewProduct}
                handleClose={() => setShowModalHangHoa(false)}
                handleSave={saveProduct}></ModalHangHoa>

            <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item xs={12} sm={6} md={8} lg={8} sx={{ height: 60 }} rowSpacing={2}>
                    <Typography variant="h5">Danh mục dịch vụ</Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    pr={2}
                    rowSpacing={2}
                    style={{ height: 60 }}>
                    <Box display="flex" justifyContent="flex-end">
                        <Box component="span" className="btn-only-icon" sx={{ mr: 1 }}>
                            <MenuIcon />
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ bgcolor: '#7C3367' }}
                            startIcon={<AddIcon />}
                            onClick={() => showModalAddProduct()}>
                            Thêm mới
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={0} sm={3} md={3} lg={3}>
                    <Grid container>
                        <Grid item xs={8} sm={8} md={8} lg={8}>
                            <Typography variant="h6">Nhóm dịch vụ</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            lg={4}
                            sx={{ pr: 2 }}
                            display="flex"
                            justifyContent="flex-end">
                            <AddIcon onClick={() => showModalAddNhomHang()} />
                        </Grid>
                    </Grid>
                    <Divider sx={{ mr: 2, mf: 0, p: 0.5, borderColor: '#cccc' }} />
                    <NhomHangHoas dataNhomHang={lstProductGroup} />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9}>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            style={{ paddingLeft: '30px' }}
                            className="page-title-search">
                            <TextField sx={{ width: 7 / 10 }}>tim kiem</TextField>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            pr={2}
                            className="page-title-search">
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                style={{ paddingTop: '3px' }}>
                                <Button
                                    variant="contained"
                                    style={{ marginRight: 8 }}
                                    className="btnSecond"
                                    startIcon={<FileUploadIcon />}>
                                    Nhập
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    className="btnSecond"
                                    startIcon={<FileDownloadIcon />}>
                                    Xuất
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableProduct dataHangHoa={lstProduct} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
