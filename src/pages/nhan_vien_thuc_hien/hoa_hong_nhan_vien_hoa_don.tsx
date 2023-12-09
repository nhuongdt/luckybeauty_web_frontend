import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    TextField,
    Stack,
    Avatar,
    Box,
    DialogActions,
    Button,
    RadioGroup,
    Radio,
    Link,
    Popover
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import { useContext, useEffect, useState } from 'react';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienThucHienDto from '../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import { Search } from '@mui/icons-material';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';
import utils from '../../utils/utils';
import chietKhauHoaDonService from '../../services/hoa_hong/chiet_khau_hoa_don/chietKhauHoaDonService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export default function HoaHongNhanVienHoaDon({ iShow, onClose }: any) {
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNVThucHien, setLstNhanVienChosed] = useState<NhanVienThucHienDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: txtSearch,
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
        setLstNhanVien([...data.items]);
    };

    useEffect(() => {
        GetListNhanVien();
    }, []);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const ChoseNhanVien = async (item: NhanSuItemDto) => {
        const nvEX = lstNVThucHien.filter((x) => x.idNhanVien === item.id);
        if (nvEX.length > 0) {
            setObjAlert({ ...objAlert, show: true, mes: `Nhân viên ${item.tenNhanVien} đã được chọn` });
            return;
        }

        const newNV = new NhanVienThucHienDto({
            idNhanVien: item.id,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            soDienThoai: item.soDienThoai,
            gioiTinh: item.gioiTinh,
            avatar: item.avatar
        });
        const ckSetup = await chietKhauHoaDonService.GetHoaHongNV_theoLoaiChungTu(idChiNhanh, item.id, '1');
        if (ckSetup != null && ckSetup.length > 0) {
            switch (ckSetup[0].loaiChietKhau) {
                case 1: // % doanhthu
                    {
                        newNV.ptChietKhau = ckSetup[0].giaTriCHietKhau;
                        newNV.tienChietKhau = 0;
                    }
                    break;
                case 2: // % thucthu
                    {
                        newNV.ptChietKhau = ckSetup[0].giaTriCHietKhau;
                        newNV.tienChietKhau = 0;
                    }
                    break;
                case 3: // vnd
                    {
                        newNV.ptChietKhau = 0;
                        newNV.tienChietKhau = ckSetup[0].giaTriCHietKhau;
                    }
                    break;
            }
        }
        setLstNhanVienChosed([newNV, ...lstNVThucHien]);
    };

    const removeNVienChosed = (nv: NhanVienThucHienDto) => {
        setLstNhanVienChosed(lstNVThucHien.filter((x: NhanVienThucHienDto) => x.idNhanVien !== nv.idNhanVien));
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const openDivChietKhau = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        console.log('6666');
    };

    return (
        <>
            <Dialog open={iShow} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography className="modal-title">Hoa hồng theo hóa đơn</Typography>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={8}>
                            <Stack flex={4} fontSize={14}>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'center'}
                                    sx={{
                                        // background: 'antiquewhite',
                                        padding: '10px',
                                        borderRadius: '4px'
                                    }}>
                                    <Stack direction={'row'} spacing={1} flex={1}>
                                        <Stack>Doanh thu</Stack>
                                        <Stack sx={{ fontWeight: '600' }}>20000</Stack>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} flex={1}>
                                        <Stack>Thực thu</Stack>
                                        <Stack sx={{ fontWeight: '600' }}>20000</Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm kiếm"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                <Stack>
                                    {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            key={index}
                                            sx={{ borderBottom: '1px dashed #cccc', padding: '8px' }}
                                            onClick={() => ChoseNhanVien(nvien)}>
                                            <Stack>
                                                {/* {utils.checkNull(nvien?.avatar) ? (
                                                    <BadgeFistCharOfName
                                                        firstChar={utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                    />
                                                ) : (
                                                    <Avatar sx={{ width: 40, height: 40 }} src={nvien?.avatar} />
                                                )} */}
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: 'var(--color-bg)',
                                                        color: 'var(--color-main)',
                                                        fontSize: '14px'
                                                    }}>
                                                    {utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                </Avatar>
                                            </Stack>
                                            <Stack justifyContent={'center'} spacing={1}>
                                                <Stack sx={{ fontSize: '14px' }}>{nvien?.tenNhanVien}</Stack>
                                                <Stack sx={{ fontSize: '13px' }}>{nvien?.tenChucVu}</Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={8} sx={{ fontSize: '14px' }}>
                            <Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    sx={{
                                        fontWeight: '600',
                                        padding: '10px',
                                        background: 'var(--color-header-table)'
                                    }}>
                                    <Stack flex={1}>STT</Stack>
                                    <Stack flex={5}>Nhân viên</Stack>
                                    <Stack flex={3}>Chiết khấu</Stack>
                                    <Stack flex={3}>Tiền được nhận</Stack>
                                    <Stack flex={1} alignItems={'end'}>
                                        <ClearOutlinedIcon sx={{ color: 'red' }} />
                                    </Stack>
                                </Stack>
                                {lstNVThucHien?.map((nv: NhanVienThucHienDto, index: number) => (
                                    <Stack direction={'row'} spacing={1} padding={'10px'} key={index}>
                                        <Stack flex={1} alignItems={'center'}>
                                            {index + 1}
                                        </Stack>
                                        <Stack flex={5}>{nv.tenNhanVien}</Stack>
                                        <Stack flex={3} alignItems={'center'} sx={{ cursor: 'pointer' }}>
                                            <Stack sx={{ color: 'var(--color-main)' }}>
                                                <Link onClick={handleClick} href="#">
                                                    {nv.ptChietKhau}
                                                </Link>
                                            </Stack>

                                            <Popover
                                                sx={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left'
                                                }}
                                                open={openDivChietKhau}
                                                anchorEl={anchorEl}
                                                onClose={() => setAnchorEl(null)}>
                                                {/* <Stack alignItems={'center'}>
                                                    <ArrowDropUpIcon sx={{ marginTop: '-14px' }} />
                                                </Stack> */}
                                                <Stack direction={'row'} padding={'8px'} alignItems={'center'}>
                                                    <Typography flex={4} fontSize={'13px'} fontWeight={600}>
                                                        Chiết khấu
                                                    </Typography>
                                                    <Stack flex={6}>
                                                        <TextField size="small" fullWidth variant="standard" />
                                                    </Stack>
                                                </Stack>
                                                <Stack direction={'row'} spacing={1} fontSize={'13px'}>
                                                    <Stack direction={'row'} alignItems={'center'}>
                                                        <Radio size="small" name="rdoLoaiChietKhau" />
                                                        <Typography fontSize={'13px'} fontWeight={600}>
                                                            % Doanh thu
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction={'row'} alignItems={'center'}>
                                                        <Radio size="small" name="rdoLoaiChietKhau" />
                                                        <Typography fontSize={'13px'} fontWeight={600}>
                                                            % Thực thu
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction={'row'} alignItems={'center'}>
                                                        <Radio size="small" name="rdoLoaiChietKhau" />
                                                        <Typography fontSize={'13px'} fontWeight={600}>
                                                            {' '}
                                                            VND
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Popover>
                                        </Stack>
                                        <Stack flex={3} alignItems={'end'}>
                                            <TextField
                                                size="small"
                                                variant="standard"
                                                fullWidth
                                                InputProps={{
                                                    // disableUnderline: true,
                                                    inputProps: {
                                                        style: { textAlign: 'right' }
                                                    }
                                                }}
                                            />
                                        </Stack>
                                        <Stack flex={1} alignItems={'end'}>
                                            <ClearOutlinedIcon
                                                sx={{ color: 'red' }}
                                                onClick={() => removeNVienChosed(nv)}
                                            />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '20px' }}>
                    <Button variant="outlined"> Bỏ qua</Button>
                    <Button variant="contained"> Đồng ý</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
