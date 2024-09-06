import React, { useEffect, useState } from 'react';
import { Stack, Typography, Grid, TextField } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import { Guid } from 'guid-typescript';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
import AutocompleteAccountBank from '../../../components/Autocomplete/AccountBank';
interface ChildComponent {
    customerId?: string;
    tongPhaiTra: number;
    onClose: () => void;
}
const PaymentsForm: React.FC<ChildComponent> = ({ customerId, tongPhaiTra = 0, onClose }) => {
    const [allBankAccount, setAllBankAccount] = useState<TaiKhoanNganHangDto[]>([]);
    const [lstQuyCT, setLstQuyCT] = useState<QuyChiTietDto[]>([]);

    const [idTaiKhoanChuyenKhoan, setidTaiKhoanChuyenKhoan] = useState('');
    const [idTaiKhoanPOS, setidTaiKhoanPOS] = useState('');
    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        setAllBankAccount(data);
        console.log('bankAcc ', data);
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, []);

    const changeTaiKhoanNganHang = (item: TaiKhoanNganHangDto) => {
        //
    };

    const shareMoney_QuyHD = (
        phaiTT: number,
        tienDiem: number,
        tienmat: number,
        tienPOS: number,
        chuyenkhoan: number,
        thegiatri: number,
        tiencoc: number
    ) => {
        // thutu uutien: 1.coc, 2.diem, 3.thegiatri, 4.mat, 5.pos, 6.chuyenkhoan
        if (tiencoc >= phaiTT) {
            return {
                TienCoc: phaiTT,
                TTBangDiem: 0,
                TienMat: 0,
                TienPOS: 0,
                TienChuyenKhoan: 0,
                TienTheGiaTri: 0
            };
        } else {
            phaiTT = phaiTT - tiencoc;
            if (tienDiem >= phaiTT) {
                return {
                    TienCoc: tiencoc,
                    TTBangDiem: phaiTT,
                    TienMat: 0,
                    TienPOS: 0,
                    TienChuyenKhoan: 0,
                    TienTheGiaTri: 0
                };
            } else {
                phaiTT = phaiTT - tienDiem;
                if (thegiatri >= phaiTT) {
                    return {
                        TienCoc: tiencoc,
                        TTBangDiem: tienDiem,
                        TienMat: 0,
                        TienPOS: 0,
                        TienChuyenKhoan: 0,
                        TienTheGiaTri: Math.abs(phaiTT)
                    };
                } else {
                    phaiTT = phaiTT - thegiatri;
                    if (tienmat >= phaiTT) {
                        return {
                            TienCoc: tiencoc,
                            TTBangDiem: tienDiem,
                            TienMat: Math.abs(phaiTT),
                            TienPOS: 0,
                            TienChuyenKhoan: 0,
                            TienTheGiaTri: thegiatri
                        };
                    } else {
                        phaiTT = phaiTT - tienmat;
                        if (tienPOS >= phaiTT) {
                            return {
                                TienCoc: tiencoc,
                                TTBangDiem: tienDiem,
                                TienMat: tienmat,
                                TienPOS: Math.abs(phaiTT),
                                TienChuyenKhoan: 0,
                                TienTheGiaTri: thegiatri
                            };
                        } else {
                            phaiTT = phaiTT - tienPOS;
                            if (chuyenkhoan >= phaiTT) {
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: Math.abs(phaiTT),
                                    TienTheGiaTri: thegiatri
                                };
                            } else {
                                phaiTT = phaiTT - chuyenkhoan;
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: chuyenkhoan,
                                    TienTheGiaTri: thegiatri
                                };
                            }
                        }
                    }
                }
            }
        }
    };

    return (
        <Stack
            sx={{
                boxShadow: '1px 5px 10px 4px #00000026',
                borderRadius: '12px',
                bgcolor: '#fff'
            }}>
            <Stack padding={3}>
                <Stack paddingBottom={3} position="relative">
                    <Typography fontSize="24px" fontWeight="700">
                        Thông tin thanh toán
                    </Typography>

                    <CloseOutlinedIcon
                        sx={{ position: 'absolute', right: 0, top: 0, width: 36, height: 36 }}
                        onClick={onClose}
                    />
                </Stack>
                <Stack spacing={2}>
                    <Grid container>
                        <Grid item lg={4}>
                            <Typography fontSize={20} fontWeight={500}>
                                Tổng thanh toán
                            </Typography>
                        </Grid>
                        <Grid item lg={4}></Grid>
                        <Grid item lg={4}>
                            <Typography textAlign={'right'} fontSize={20} fontWeight={500}>
                                {Intl.NumberFormat('vn-VN').format(tongPhaiTra)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Stack
                        sx={{ backgroundColor: 'rgb(245 241 241)', borderRadius: '8px', paddingTop: '16px' }}
                        className="payment-form-hinhthucTT">
                        <Stack padding={2}>
                            <Stack spacing={1}>
                                <Grid container sx={{ display: 'none' }}>
                                    <Grid item lg={4}>
                                        <Typography>Thanh toán bằng điểm</Typography>
                                    </Grid>
                                    <Grid item lg={8}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={7}>
                                                <Typography
                                                    sx={{ fontSize: '14px!important', fontWeight: '400!important' }}>
                                                    Tổng điểm: 333
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={5}>
                                                <Stack spacing={2} direction={'row'}>
                                                    <TextField size="small" />
                                                    <TextField size="small" />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ display: 'none' }}>
                                    <Grid item lg={4}>
                                        <Typography>Thu từ thẻ</Typography>
                                    </Grid>
                                    <Grid item lg={8}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={7}>
                                                <Typography
                                                    sx={{ fontSize: '14px!important', fontWeight: '400!important' }}>
                                                    Số dư: 12.0000
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={5}>
                                                <TextField size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={4}>
                                        <Typography>Tiền mặt</Typography>
                                    </Grid>
                                    <Grid item lg={8}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={7}></Grid>
                                            <Grid item lg={5}>
                                                <TextField size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item lg={4}>
                                        <Typography>Chuyển khoản</Typography>
                                    </Grid>
                                    <Grid item lg={8}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={7}>
                                                <AutocompleteAccountBank
                                                    handleChoseItem={changeTaiKhoanNganHang}
                                                    idChosed={idTaiKhoanChuyenKhoan}
                                                    listOption={allBankAccount}
                                                />
                                            </Grid>
                                            <Grid item lg={5}>
                                                <TextField size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item lg={4}>
                                        <Typography>Quyẹt thẻ</Typography>
                                    </Grid>
                                    <Grid item lg={8}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={7}>
                                                <AutocompleteAccountBank
                                                    handleChoseItem={changeTaiKhoanNganHang}
                                                    idChosed={idTaiKhoanChuyenKhoan}
                                                    listOption={allBankAccount}
                                                />
                                            </Grid>
                                            <Grid item lg={5}>
                                                <TextField size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Grid container>
                        <Grid item lg={4}></Grid>
                        <Grid item lg={4}>
                            <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                Tổng khách trả
                            </Typography>
                        </Grid>
                        <Grid item lg={4}>
                            <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                560.000
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item lg={4}></Grid>
                        <Grid item lg={4}>
                            <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                Tiền thiếu
                            </Typography>
                        </Grid>
                        <Grid item lg={4}>
                            <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                560.000
                            </Typography>
                        </Grid>
                    </Grid>
                </Stack>
                <Stack paddingTop={3}>
                    <Grid container>
                        <Grid item lg={4}></Grid>
                        <Grid item lg={4}>
                            <Stack
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                                direction={'row'}
                                spacing={1}>
                                <CheckOutlinedIcon />
                                <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                    THANH TOÁN
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item lg={4}></Grid>
                    </Grid>
                </Stack>
            </Stack>
        </Stack>
    );
};
export default PaymentsForm;
