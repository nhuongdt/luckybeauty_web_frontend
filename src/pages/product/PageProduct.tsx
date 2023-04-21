import * as React from 'react';
import { ReactNode } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    colors
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoIcon from '@mui/icons-material/Info';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { isJSDocNullableType } from 'typescript';
import Utils from '../../utils/utils';

interface Props {
    children?: ReactNode;
    // any props that come into the component
}
const themeListItemText = createTheme({
    components: {
        // Name of the component
        MuiListItemText: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    '& span': {
                        fontSize: '12px',
                        color: 'blue'
                    },
                    ':not(eq(2)': {
                        fontSize: '12px',
                        color: 'blue'
                    }
                }
            }
        }
    }
});

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

export const TableProduct = ({ dataHangHoa, handleClickActionRow }: any) => {
    const [showAction, setShowAction] = useState({ index: 0, value: false });
    const [showListAction, setshowListAction] = useState(true);
    const [idQuyDoi, setIdQuyDoi] = useState('');
    const [isHover, setIsHover] = useState(false);

    const doActionRow = (action: number) => {
        handleClickActionRow(action, idQuyDoi);
    };

    const hoverRow = (event: any, idQuyDoi: string, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setShowAction({ index: index, value: true });
                break;
            case 'mouseleave': //leave
                setShowAction({ index: index, value: false });
                break;
        }
        setshowListAction(false);
        setIdQuyDoi(idQuyDoi);
        setIsHover(event.type === 'mouseenter');
    };
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead className="table-head">
                        <TableRow>
                            <TableCell sx={{ width: 1 / 25 }}>
                                <Checkbox />
                            </TableCell>
                            <TableCell sx={{ width: 1 / 8 }}>Mã dịch vụ</TableCell>
                            <TableCell>Tên dịch vụ</TableCell>
                            <TableCell sx={{ width: 1 / 6 }}>Nhóm dịch vụ</TableCell>
                            <TableCell sx={{ width: 1 / 12 }}>Đơn giá</TableCell>
                            <TableCell sx={{ width: 1 / 10 }}>Thời gian</TableCell>
                            <TableCell sx={{ width: 1 / 6 }}>Trạng thái</TableCell>
                            <TableCell sx={{ width: 1 / 25 }}>#</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {dataHangHoa.map((row: any, index: any) => (
                            <TableRow
                                // sx={{ backgroundColor: isHover ? 'red' : 'none' }}
                                key={row.idDonViQuyDoi}
                                onMouseLeave={(event) => {
                                    hoverRow(event, row.idDonViQuyDoi, index);
                                }}
                                onMouseEnter={(event) => {
                                    hoverRow(event, row.idDonViQuyDoi, index);
                                }}
                                sx={{
                                    backgroundColor:
                                        isHover && idQuyDoi == row.idDonViQuyDoi ? '#cccc' : 'none',
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}>
                                <TableCell sx={{ width: 1 / 25 }}>
                                    <Checkbox />
                                </TableCell>
                                <TableCell sx={{ width: 1 / 10 }}>{row.maHangHoa}</TableCell>
                                <TableCell align="left">{row.tenHangHoa}</TableCell>
                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                    {row.tenNhomHang}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 12 }} align="right">
                                    {Utils.formatNumber(row.giaBan)}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 10 }} align="center">
                                    0
                                </TableCell>
                                <TableCell sx={{ width: 1 / 6 }} align="left">
                                    {row.txtTrangThaiHang}
                                </TableCell>
                                <TableCell sx={{ width: 1 / 25 }}>
                                    <MoreHorizIcon
                                        fontSize="small"
                                        onClick={() => {
                                            setshowListAction(true);
                                            setIdQuyDoi(row.idDonViQuyDoi);
                                        }}
                                        sx={{
                                            display:
                                                showAction.index == index && showAction.value
                                                    ? 'block'
                                                    : 'none'
                                        }}
                                    />
                                    <ListAction
                                        showAction={
                                            showAction.index == index &&
                                            showAction.value &&
                                            showListAction
                                        }
                                        handleClickAction={doActionRow}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export const ListAction = ({ showAction, handleClickAction }: any) => {
    return (
        <Box sx={{ display: showAction ? 'block' : 'none' }} className="list-icon-action">
            <List>
                <ListItem
                    onClick={(event) => handleClickAction(0)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="add">
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    }>
                    <ThemeProvider theme={themeListItemText}>
                        <ListItemText primary="Xem" />
                    </ThemeProvider>
                </ListItem>
                <ListItem
                    onClick={(event) => handleClickAction(1)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="edit">
                            <ModeEditOutlineIcon className="icon" />
                        </IconButton>
                    }>
                    <ThemeProvider theme={themeListItemText}>
                        <ListItemText primary="Sửa" />
                    </ThemeProvider>
                </ListItem>
                <ListItem
                    onClick={(event) => handleClickAction(2)}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <DeleteOutlineIcon className="icon" />
                        </IconButton>
                    }>
                    <ThemeProvider theme={themeListItemText}>
                        <ListItemText primary="Xóa" />
                    </ThemeProvider>
                </ListItem>
            </List>
        </Box>
    );
};

export default function PageProduct() {
    const [showModalNhomHang, setShowModalNhomHang] = useState(false);
    const [idNhomHangHoa, setIdNhomHangHoa] = useState(false);
    const [isNewNhomHang, setIsNewNhomHang] = useState(false);

    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [lstProduct, setLstProduct] = useState<ModelHangHoaDto[]>([]);

    const [triggerModalProduct, setTriggerModalProduct] = useState({
        showModal: false,
        isNew: false,
        idQuiDoi: ''
    });

    const PageLoad = async () => {
        GetListHangHoa();
        GetListNhomHangHoa();
        console.log('into');
    };

    const GetListHangHoa = async () => {
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
        const list = await Get_DMHangHoa(param);
        setLstProduct(list.items);
    };

    const GetListNhomHangHoa = async () => {
        const list = await GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    useEffect(() => {
        PageLoad();
    }, []);

    function showModalAddNhomHang(id?: string) {
        if (id) {
            setIsNewNhomHang(false);
        } else {
            setIsNewNhomHang(true);
        }
        setShowModalNhomHang(true);
    }

    function showModalAddProduct(action?: number, id = '') {
        // todo action
        setTriggerModalProduct({
            showModal: true,
            isNew: Utils.checkNull(id),
            idQuiDoi: id
        });
    }

    function saveNhomHang(objNew: ModelNhomHangHoa) {
        setLstProductGroup((oldArr) => {
            const copy = [...oldArr];
            copy.splice(1, 0, objNew);
            return copy;
        });
    }

    function saveProduct(objNew: ModelHangHoaDto) {
        if (triggerModalProduct.isNew) {
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
        } else {
            GetListHangHoa();
        }
    }

    return (
        <>
            <ModalNhomHangHoa
                dataNhomHang={lstProductGroup}
                show={showModalNhomHang}
                isNew={isNewNhomHang}
                id={idNhomHangHoa}
                handleClose={() => setShowModalNhomHang(false)}
                handleSave={saveNhomHang}></ModalNhomHangHoa>
            <ModalHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalProduct}
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
                            <TextField size="small" sx={{ width: 7 / 10 }}>
                                tim kiem
                            </TextField>
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
                            <TableProduct
                                dataHangHoa={lstProduct}
                                handleClickActionRow={showModalAddProduct}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
