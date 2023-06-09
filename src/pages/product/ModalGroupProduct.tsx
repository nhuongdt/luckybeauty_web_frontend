import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Grid, Box, Autocomplete, InputAdornment, TextField, Typography } from '@mui/material';
import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import Utils from '../../utils/utils';
import AppConsts from '../../lib/appconst';
import '../../App.css';

export const GridColor = ({ handleChoseColor }: any) => {
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
        new ModelNhomHangHoa({ id: AppConsts.guidEmpty, color: 'red', tenNhomHang: '' })
    );
    const [nhomGoc, setNhomGoc] = useState<ModelNhomHangHoa>(new ModelNhomHangHoa({}));

    const showModal = async (id: string) => {
        if (id) {
            setGroupProduct(trigger.item);

            // find nhomhang
            const nhom = dataNhomHang.filter((x: any) => x.id == trigger.item.idParent);
            if (nhom.length > 0) {
                setNhomGoc(nhom[0]);
            } else {
                setNhomGoc(new ModelNhomHangHoa({}));
            }
        } else {
            setGroupProduct(new ModelNhomHangHoa({ color: 'red' }));
            setNhomGoc(new ModelNhomHangHoa({}));
        }
    };

    const handleChangeNhomGoc = (item: any) => {
        setGroupProduct((old: any) => {
            return { ...old, idParent: item.id };
        });
        setNhomGoc(new ModelNhomHangHoa({ id: item.id, tenNhomHang: item.tenNhomHang }));
        // setNhomGoc({ id: '', tenNhomHang: '' });
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
        setGroupProduct((olds: any) => {
            return { ...olds, color: colorNew };
        });
    }

    const saveNhomHangHoa = () => {
        if (wasClickSave) {
            return;
        }
        const objNew = { ...groupProduct };
        if (trigger.isNew) {
            GroupProductService.InsertNhomHangHoa(groupProduct).then((data) => {
                objNew.id = data.id;
                handleSave(objNew);
            });
        } else {
            GroupProductService.UpdateNhomHangHoa(groupProduct).then((data) => {
                objNew.id = data.id;
                handleSave(objNew);
            });
        }
        setIsShow(false);
    };

    return (
        <div>
            <Dialog
                open={isShow}
                onClose={() => setIsShow(false)}
                aria-labelledby="draggable-dialog-title"
                fullWidth>
                <DialogTitle
                    sx={{
                        cursor: 'move',
                        fontSize: '24px!important',
                        color: '#333233',
                        fontWeight: '700!important'
                    }}
                    id="draggable-dialog-title">
                    {isNew ? 'Thêm' : 'Cập nhật'} nhóm dịch vụ
                </DialogTitle>
                <Button
                    sx={{ minWidth: 'unset', position: 'absolute', top: '30px', right: '30px' }}
                    onClick={() => setIsShow(false)}>
                    <CloseIcon />
                </Button>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Tên nhóm dịch vụ</Typography>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={groupProduct.tenNhomHang}
                                onChange={(event) =>
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, tenNhomHang: event.target.value };
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Nhóm gốc</Typography>

                            <Autocomplete
                                size="small"
                                fullWidth
                                disablePortal
                                multiple={false}
                                value={nhomGoc}
                                onChange={(event: any, newValue: any) => {
                                    handleChangeNhomGoc(newValue);
                                }}
                                options={dataNhomHang.filter(
                                    (x: any) => x.id !== null && x.id !== ''
                                )}
                                getOptionLabel={(option: any) =>
                                    option.tenNhomHang ? option.tenNhomHang : ''
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Chọn nhóm" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Màu sắc</Typography>
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
                            <Typography variant="body2">Mô tả</Typography>

                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={groupProduct.moTa || ''}
                                onChange={(event) =>
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, moTa: event.target.value };
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#7C3367!important' }}
                        onClick={saveNhomHangHoa}>
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderColor: '#7C3367!important', color: '#965C85' }}
                        onClick={() => setIsShow(false)}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
