import {
    Dialog,
    DialogContent,
    Grid,
    Stack,
    Avatar,
    TextField,
    Checkbox,
    DialogTitle,
    Button,
    DialogActions,
    Link
} from '@mui/material';
import { Search } from '@mui/icons-material';
import utils from '../../../../../utils/utils';
import NhanSuItemDto from '../../../../../services/nhan-vien/dto/nhanSuItemDto';
import { useState, useEffect, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { ParamSearchDto } from '../../../../../services/dto/ParamSearchDto';
import { debounce } from '@mui/material/utils';
import ProductService from '../../../../../services/product/ProductService';
import { ModelHangHoaDto, PagedProductSearchDto } from '../../../../../services/product/dto';
import DialogButtonClose from '../../../../../components/Dialog/ButtonClose';

export default function ModalSetupHoaHongDichVu({ isShow, allNhanVien, onClose }: any) {
    const [txtSearch, setTxtSearch] = useState('');
    const [txtSearchProduct, setTxtSearchProduct] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [listProduct, setListProduct] = useState<ModelHangHoaDto[]>([]);
    const [listProductChosed, setListProductChosed] = useState<ModelHangHoaDto[]>([]);
    const [lstNhanVienChosed, setLstNhanVienChosed] = useState<NhanSuItemDto[]>([]);

    const [checkAllNVien, setCheckAllNVien] = useState(false);
    const [checkAllProdcuct, setCheckAllProdcuct] = useState(false);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x: NhanSuItemDto) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tenChucVu !== null && utils.strToEnglish(x.tenChucVu).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const debounceProduct = useRef(
        debounce(async (input: string) => {
            const param = new PagedProductSearchDto({ textSearch: input, columnSort: 'tenNhomHang' });
            const data = await ProductService.Get_DMHangHoa(param);
            setListProduct(data.items);
        }, 500)
    ).current;

    useEffect(() => {
        if (isShow) {
            debounceProduct(txtSearchProduct);
        }
    }, [txtSearchProduct]);

    const NVien_changeCheckAll = () => {
        const gtriNew = !checkAllNVien;
        setCheckAllNVien(gtriNew);
        if (gtriNew) {
            //
            setLstNhanVienChosed([...lstNhanVien]);
        }
    };
    const Product_changeCheckAll = () => {
        const gtriNew = !checkAllProdcuct;
        setCheckAllProdcuct(!checkAllProdcuct);
        if (gtriNew) {
            //
            setListProductChosed([...listProduct]);
        }
    };

    return (
        <>
            <Dialog open={isShow} maxWidth="lg" fullWidth onClose={onClose}>
                <DialogTitle className="modal-title">
                    Cài đặt hoa hồng dịch vụ
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent sx={{ paddingTop: '16px!important' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <Stack>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm nhân viên"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                <Stack
                                    justifyContent={'space-between'}
                                    direction={'row'}
                                    fontSize={'13px'}
                                    alignItems={'center'}
                                    paddingRight={1}
                                    sx={{ backgroundColor: 'var(--color-bg)' }}>
                                    <Stack direction={'row'} alignItems={'center'} onClick={NVien_changeCheckAll}>
                                        <Checkbox />
                                        <span style={{ cursor: 'pointer' }}> Chọn tất cả</span>
                                    </Stack>
                                    <Stack style={{ cursor: 'pointer' }}>Bỏ chọn</Stack>
                                </Stack>
                                <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                    {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                        <Stack
                                            direction={'row'}
                                            key={index}
                                            sx={{ borderBottom: '1px dashed #cccc', padding: '6px' }}
                                            // onClick={() => ChoseNhanVien(nvien)}
                                        >
                                            <Checkbox />
                                            <Stack direction={'row'} spacing={1}>
                                                {/* <Stack>
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
                                                </Stack> */}
                                                <Stack justifyContent={'center'} spacing={1}>
                                                    <Stack sx={{ fontSize: '14px' }}>{nvien?.tenNhanVien}</Stack>
                                                    <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                        {nvien?.tenChucVu}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Stack>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm dịch vụ"
                                    value={txtSearchProduct}
                                    onChange={(event) => {
                                        setTxtSearchProduct(event.currentTarget.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                {/* <Stack>
                                    <Button variant="outlined" size="small" fullWidth>
                                        Thêm theo nhóm
                                    </Button>
                                </Stack> */}
                                <Stack
                                    justifyContent={'space-between'}
                                    direction={'row'}
                                    fontSize={'13px'}
                                    alignItems={'center'}
                                    paddingRight={1}
                                    sx={{ backgroundColor: 'var(--color-bg)' }}>
                                    <Stack direction={'row'} alignItems={'center'} onClick={Product_changeCheckAll}>
                                        <Checkbox />
                                        <span style={{ cursor: 'pointer' }}> Chọn tất cả</span>
                                    </Stack>
                                    <Stack style={{ cursor: 'pointer' }}>Bỏ chọn</Stack>
                                </Stack>
                            </Stack>

                            <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                {listProduct?.map((item: ModelHangHoaDto, index: number) => (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}
                                        key={index}
                                        padding={'8px 16px'}
                                        borderBottom={'1px dashed #cccc'}
                                        alignItems={'center'}>
                                        <Stack direction={'row'}>
                                            <Checkbox />
                                            <Stack spacing={1}>
                                                <Stack sx={{ fontSize: '14px' }}>{item?.tenHangHoa}</Stack>
                                                <Stack sx={{ fontStyle: 'italic', fontSize: '12px' }}>
                                                    {item?.tenNhomHang}
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                        <Stack sx={{ fontSize: '14px' }}>
                                            {new Intl.NumberFormat('vi-VN').format(item?.giaBan as number)}
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3} lg={3} marginTop={'10%'} fontSize={'14px'}>
                            <Grid container spacing={2} alignItems={'end'}>
                                <Grid item xs={4}>
                                    Thực hiện
                                </Grid>
                                <Grid item xs={8}>
                                    <Stack direction={'row'} spacing={2}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            customInput={TextField}
                                            InputProps={{
                                                inputProps: {
                                                    style: { textAlign: 'right' }
                                                }
                                            }}
                                        />
                                        <Avatar
                                            style={{
                                                width: 25,
                                                height: 25,
                                                fontSize: '12px',
                                                backgroundColor: 'var(--color-main)'
                                            }}>
                                            %
                                        </Avatar>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4}>
                                    Tư vấn
                                </Grid>
                                <Grid item xs={8}>
                                    <Stack direction={'row'} spacing={1}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            customInput={TextField}
                                            autoComplete="off"
                                            InputProps={{
                                                inputProps: {
                                                    style: { textAlign: 'right' }
                                                }
                                            }}
                                        />
                                        <Avatar
                                            style={{
                                                width: 25,
                                                height: 25,
                                                fontSize: '12px',
                                                backgroundColor: 'var(--color-main)'
                                            }}>
                                            %
                                        </Avatar>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '16px!important' }}>
                    <Button variant="outlined"> Bỏ qua</Button>
                    <Button variant="contained"> Áp dụng</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
