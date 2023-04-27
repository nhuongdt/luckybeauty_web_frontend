import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Grid, Box, Autocomplete, InputAdornment } from '@mui/material';
import { TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../App.css';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Utils from '../../utils/utils';
import AppConsts from '../../lib/appconst';

import { func } from 'prop-types';
import { useFetcher } from 'react-router-dom';
import {
    CreateOrEditProduct,
    Get_DMHangHoa,
    InsertNhomHangHoa
} from '../../services/product/service';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import { faListSquares } from '@fortawesome/free-solid-svg-icons';
import { color } from '@mui/system';

export const GridColor = ({ handleChoseColor, trigger }: any) => {
    const [itemColor, setItemColor] = useState({});

    const arrColor = [
        '#D2691E',
        '#DC143C',
        '#00008B',
        '#8B008B',
        '#696969',
        '#B22222',
        '#2F4F4F',
        '#00FF7F',
        '#FFFF00',
        '#B22222',
        '#2F4F4F',
        '#00FF7F',
        '#FFFF00',
        '#B22222',
        '#2F4F4F',
        '#00FF7F',
        '#2F4F4F',
        '#00FF7F'
    ];
    function choseColor(color: string) {
        setItemColor(color);
        handleChoseColor(color);
    }
    return (
        <>
            <Box
                style={{
                    width: 280,
                    height: 150,
                    position: 'absolute',
                    zIndex: 1,
                    backgroundColor: '#FFFFF0',
                    borderRadius: 4
                }}
                sx={{ ml: 0, p: 1.5, border: '1px solid grey' }}>
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 6, sm: 6, md: 6 }}>
                    {arrColor.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={1}
                            sm={1}
                            md={1}
                            onClick={() => choseColor(item)}>
                            <Box className="grid-color" sx={{ bgcolor: item }}></Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export function ModalNhomHangHoa({ dataNhomHang, handleSave, trigger }: any) {
    const [colorToggle, setColorToggle] = useState(false);

    const [isShow, setIsShow] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [wasClickSave, setWasClickSave] = useState(false);
    const [groupProduct, setGroupProduct] = useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({ id: AppConsts.guidEmpty, color: 'red' })
    );

    const showModal = async (id: string) => {
        if (id) {
            // const obj = await GetDetailProduct(id);
            // setProduct(obj);
            console.log(22);
        } else {
            setGroupProduct(new ModelNhomHangHoa({ color: 'red' }));
        }
    };

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            showModal(trigger.id);
        }
        setIsNew(trigger.isNew);
        setWasClickSave(false);
    }, [trigger]);

    function changeColor(colorNew: string) {
        setColorToggle(false);
        setGroupProduct({ ...groupProduct, color: colorNew });
    }

    const saveNhomHangHoa = () => {
        if (wasClickSave) {
            return;
        }
        const objNew = { ...groupProduct };
        objNew.maNhomHang = Utils.getFirstLetter(objNew.tenNhomHang) ?? '';
        objNew.tenNhomHang_KhongDau = Utils.strToEnglish(objNew.tenNhomHang ?? '');
        console.log('objNew ', objNew);

        InsertNhomHangHoa(objNew).then((data) => {
            setIsShow(false);
            handleSave(data);
        });
    };

    return (
        <div>
            <Dialog open={isShow} aria-labelledby="draggable-dialog-title" fullWidth>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {isNew ? 'Thêm' : 'Cập nhật'} nhóm dịch vụ
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Box sx={{ height: 30 }}>
                                <span>Tên nhóm dịch vụ</span>
                                &nbsp;&nbsp;<span className="red">*</span>
                            </Box>

                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={groupProduct.tenNhomHang}
                                onChange={(event) =>
                                    setGroupProduct({
                                        ...groupProduct,
                                        tenNhomHang: event.target.value
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Box sx={{ height: 30 }}>
                                <span>Nhóm gốc</span>
                            </Box>

                            <Autocomplete
                                size="small"
                                fullWidth
                                disablePortal
                                multiple={false}
                                onChange={(event: any, newValue: any) => {
                                    setGroupProduct({
                                        ...groupProduct,
                                        idParent: newValue.id
                                    });
                                }}
                                options={dataNhomHang.filter(
                                    (x: ModelNhomHangHoa) => x.id !== null && x.id !== ''
                                )}
                                getOptionLabel={(option: ModelNhomHangHoa) =>
                                    option.tenNhomHang ? option.tenNhomHang : ''
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Chọn nhóm" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Box sx={{ height: 30 }}>
                                <span>Màu sắc</span>
                            </Box>
                            <TextField
                                size="small"
                                onClick={() => setColorToggle(!colorToggle)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box
                                                className="grid-color"
                                                sx={{ bgcolor: groupProduct.color }}></Box>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            {colorToggle && <GridColor handleChoseColor={changeColor} />}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Box sx={{ height: 30 }}>
                                <span>Mô tả</span>
                            </Box>

                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={groupProduct.moTa}
                                onChange={(event) =>
                                    setGroupProduct({
                                        ...groupProduct,
                                        moTa: event.target.value
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#7C3367' }}
                        onClick={saveNhomHangHoa}>
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderColor: '#7C3367' }}
                        onClick={() => setIsShow(false)}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
