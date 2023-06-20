import * as React from 'react';
import { useState, useEffect } from 'react';
import './modelNhanVienThucHien.css';
import {
    Button,
    ButtonGroup,
    Stack,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Avatar
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import utils from '../../utils/utils';

import { PagedResultDto } from '../../services/dto/pagedResultDto';

import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';

import NhanVienService from '../../services/nhan-vien/nhanVienService';
import { dbDexie } from '../../lib/dexie/dexieDB';
import NhanVienThucHienDto from '../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import HoaHongDichVuServices from '../../services/nhan_vien_thuc_hien/HoaHongDichVuServices';
import { ReactComponent as CheckIcon } from '../../images/checkIcon.svg';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
const ModelNhanVienThucHien = ({ triggerModal, handleSave }: any) => {
    const [isShow, setIsShow] = useState(false);
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNVThucHien, setLstNhanVienChosed] = useState<NhanVienThucHienDto[]>([]);

    useEffect(() => {
        if (triggerModal.isShow) {
            setIsShow(true);
            if (triggerModal.isNew) {
                // get from cthd cache
                setLstNhanVienChosed([...triggerModal.item.nhanVienThucHien]);
            } else {
                // get from db
                GetListNVThucHien_DichVu();
            }
        }
    }, [triggerModal]);

    const GetListNVThucHien_DichVu = () => {
        console.log(33);
    };

    const GetListNhanVien = async () => {
        const data = await NhanVienService.search(txtSearch, { skipCount: 0, maxResultCount: 100 });
        const arrNV = [...data.items];
        arrNV.map((x: any) => {
            x['isChosed'] = false;
        });
        setAllNhanVien([...arrNV]);
        setLstNhanVien([...arrNV]);
    };

    React.useEffect(() => {
        GetListNhanVien();
    }, []);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x) =>
                    (x.maNhanVien !== null &&
                        x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null &&
                        x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null &&
                        x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null &&
                        utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null &&
                        utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null &&
                        utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    React.useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const ChoseNhanVien = async (item: NhanSuItemDto) => {
        const hoahongDV = await HoaHongDichVuServices.GetHoaHongNV_theoDichVu(
            item.id,
            triggerModal.item.idDonViQuyDoi
        );
        console.log('hoahongDV', hoahongDV);

        const newNV = new NhanVienThucHienDto({
            idNhanVien: item.id,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            soDienThoai: item.soDienThoai,
            gioiTinh: item.gioiTinh,
            avatar: item.avatar
        });
        if (hoahongDV.length > 0) {
            newNV.ptChietKhau = hoahongDV[0].laPhanTram ? hoahongDV[0].giaTri : 0;
            newNV.chietKhauMacDinh = hoahongDV[0].giaTri;
            if (newNV.ptChietKhau > 0) {
                newNV.tienChietKhau = (newNV.ptChietKhau * triggerModal.item.thanhTienSauCK) / 100;
            } else {
                newNV.tienChietKhau = newNV.ptChietKhau * triggerModal.item.soLuong;
            }
        }
        // check exists
        const nvEX = lstNVThucHien.filter((x) => x.idNhanVien === newNV.idNhanVien);
        if (nvEX.length > 0) {
            // remove if chose again
            setLstNhanVienChosed(lstNVThucHien.filter((x) => x.idNhanVien !== newNV.idNhanVien));
        } else {
            setLstNhanVienChosed([newNV, ...lstNVThucHien]);
        }
    };

    const UpdateStatus = () => {
        const arrNV = lstNVThucHien.map((x) => {
            return x.idNhanVien;
        });
        setLstNhanVien(
            lstNhanVien.map((x) => {
                if (arrNV.includes(x.id)) {
                    return { ...x, isChosed: true };
                } else {
                    return { ...x, isChosed: false };
                }
            })
        );
    };

    useEffect(() => {
        UpdateStatus();
    }, [lstNVThucHien]);

    const onSave = () => {
        setIsShow(false);
        handleSave(lstNVThucHien);
    };

    return (
        <>
            <div className={isShow ? 'show overlay' : 'overlay'}></div>

            <div id="poppup-nhanVienThucHien" className={isShow ? 'show ' : ''}>
                <Typography variant="h5" color="333233" fontWeight="700" marginBottom="28px">
                    Chọn kỹ thuật viên
                </Typography>
                <TextField
                    size="small"
                    sx={{
                        borderColor: '#CDC9CD',
                        width: '375px'
                    }}
                    className="search-field"
                    variant="outlined"
                    type="search"
                    placeholder="Tìm kiếm"
                    value={txtSearch}
                    onChange={(event) => {
                        setTxtSearch(event.target.value);
                    }}
                    InputProps={{
                        startAdornment: (
                            <IconButton type="submit">
                                <SearchIcon />
                            </IconButton>
                        )
                    }}
                />
                <Typography variant="subtitle1" fontWeight="700" color="#999699" marginTop="28px">
                    Danh sách kỹ thuật viên
                </Typography>
                <Grid container className="list-persons" spacing={2} marginTop="24px">
                    {lstNhanVien?.map((person: any, index: any) => (
                        <Grid
                            className="person-item"
                            item
                            xs={6}
                            md={3}
                            lg={3}
                            key={index}
                            onClick={() => ChoseNhanVien(person)}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    position: 'relative',
                                    padding: ' 24px 24px 20px 24px',
                                    borderRadius: '8px',
                                    transition: '.4s',
                                    cursor: 'pointer',
                                    border: '1px solid #CDC9CD',
                                    borderColor: person.isChosed ? '#7C3367' : '',

                                    '&:hover': {
                                        borderColor: '#7C3367'
                                    },
                                    '& .Check-icon': {
                                        position: 'absolute',
                                        right: '-10px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        top: '5px',
                                        zIndex: '2',
                                        transition: '.4s',
                                        opacity: person.isChosed ? '1' : '0'
                                    }
                                }}>
                                <Box
                                    bgcolor="#fff"
                                    className="Check-icon"
                                    sx={{
                                        '& svg': {
                                            verticalAlign: 'unset'
                                        }
                                    }}>
                                    <CheckIcon />
                                </Box>
                                <div className="person-avatar">
                                    <Avatar
                                        src={person.avatar}
                                        alt={person.name}
                                        sx={{ width: '44px', height: '44px' }}
                                    />
                                </div>
                                <div>
                                    <Typography
                                        variant="subtitle1"
                                        color="#333233"
                                        className="person-name">
                                        {person.tenNhanVien}
                                    </Typography>
                                    <Typography variant="caption" className="person-position">
                                        {person.tenChucVu}
                                    </Typography>
                                </div>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Stack
                    direction="row"
                    spacing={1}
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff'
                    }}>
                    <Button
                        variant="contained"
                        className="button-container btn-container-hover"
                        onClick={onSave}>
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        className="button-outline btn-outline-hover"
                        onClick={() => setIsShow(false)}>
                        Hủy
                    </Button>
                </Stack>

                <Close
                    sx={{
                        position: 'absolute',
                        top: '35px',
                        right: '31px',
                        fontSize: '30px',
                        cursor: 'pointer',
                        '&:hover': {
                            filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                        }
                    }}
                    onClick={() => setIsShow(false)}
                />
            </div>
        </>
    );
};
export default ModelNhanVienThucHien;
