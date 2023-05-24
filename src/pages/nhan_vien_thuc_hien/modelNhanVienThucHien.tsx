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

const modelNhanVienThucHien = ({ triggerModal, handleSave }: any) => {
    const [isShow, setIsShow] = useState(false);
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNhanVienChosed, setLstNhanVienChosed] = useState<NhanSuItemDto[]>([]);

    useEffect(() => {
        if (triggerModal.isShow) {
            setIsShow(true);
        }
    }, [triggerModal]);

    const GetListNhanVien = async () => {
        const data = await NhanVienService.search(txtSearch, { skipCount: 0, maxResultCount: 100 });
        setAllNhanVien(data.items);
        setLstNhanVien(data.items);
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

    const ChoseNhanVien = (item: any) => {
        // check exists
        const nvEX = lstNhanVienChosed.filter((x) => x.id === item.id);
        if (nvEX.length > 0) {
            console.log('has');
        } else {
            setLstNhanVienChosed((lstOld) => {
                return {
                    item,
                    ...lstOld
                };
            });
        }
    };

    const onSave = () => {
        setIsShow(false);
        handleSave();
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
                                <Search />
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
                                    padding: ' 24px 24px 20px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                                border="1px solid #CDC9CD">
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
                    <Button variant="contained" className="button-container" onClick={onSave}>
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        className="button-outline"
                        onClick={() => setIsShow(false)}>
                        Hủy
                    </Button>
                </Stack>

                <Close
                    sx={{ position: 'absolute', top: '35px', right: '31px', fontSize: '30px' }}
                    onClick={() => setIsShow(false)}
                />
            </div>
        </>
    );
};
export default modelNhanVienThucHien;
