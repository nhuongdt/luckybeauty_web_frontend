import {
    Box,
    Drawer,
    Grid,
    TextField,
    Typography,
    Popover,
    Checkbox,
    FormControlLabel,
    Button,
    Autocomplete
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import suggestStore from '../../../stores/suggestStore';
import DatePickerRequireCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import { format as formatDate } from 'date-fns';
import { SuggestNhomKhachDto } from '../../../services/suggests/dto/SuggestNhomKhachDto';
import SuggestService from '../../../services/suggests/SuggestService';
// const CustomerFilterDrawer = ({ visiable, handleClose, handleOpen, handleOk }: any) => {
//     return (
//         // <Drawer anchor="right" open={visiable} onClose={handleClose}>
//         //     <Box
//         //         role="presentation"
//         //         sx={{
//         //             height: 'fit-content',
//         //             borderRadius: 2,
//         //             padding: 2,
//         //             position: 'fixed',
//         //             top: 20,
//         //             right: 20,
//         //             bottom: 20,
//         //             background: 'white'
//         //         }}>
//         //         <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
//         //             <Typography>Bộ lọc</Typography>
//         //             <Box display={'inline'}>
//         //                 <CachedIcon />
//         //                 <CloseIcon />
//         //             </Box>
//         //         </Box>
//         //         <Grid container spacing={2} mt={2}>
//         //             <Grid item xs={12}>
//         //                 <TextField fullWidth size="medium" />{' '}
//         //             </Grid>
//         //             <Grid container item xs={12} spacing={2}>
//         //                 <Grid item xs={6}>
//         //                     <TextField fullWidth size="medium" />
//         //                 </Grid>
//         //                 <Grid item xs={6}>
//         //                     <TextField fullWidth size="medium" />
//         //                 </Grid>
//         //             </Grid>
//         //         </Grid>
//         //     </Box>
//         // </Drawer>

//     );
// };

const CustomerFilterDrawer = ({ id, anchorEl, handleClose, handleOk, handleChangeNhomKhach }: any) => {
    const [idNhomKhach, setIdNhomKhach] = useState('');
    // const [suggestNhomKhach, setSuggestNhomKhach] = useState([] as SuggestNhomKhachDto[]);
    // const getSuggest = async () => {
    //     const nhomKhachs = await SuggestService.SuggestNhomKhach();
    //     setSuggestNhomKhach(nhomKhachs);
    // };
    // useEffect(() => {
    //     getSuggest();
    // }, []);

    return (
        <Popover
            id={id}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            sx={{ marginTop: 1 }}>
            <Box
                padding={2}
                sx={{
                    maxWidth: 400
                }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography sx={{ fontSize: '1rem', color: '3D475C', fontFamily: 'Roboto', fontWeight: 700 }}>
                        Bộ lọc
                    </Typography>
                    <Box display={'inline'}>
                        <CachedIcon sx={{ color: '#525F7A' }} />
                        <CloseIcon sx={{ marginLeft: 2, color: '#525F7A' }} onClick={handleClose} />
                    </Box>
                </Box>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            fullWidth
                            options={[{ id: '', tenNhomKhach: 'Tất cả' }, ...(suggestStore?.suggestNhomKhach ?? [])]}
                            defaultValue={{ id: '', tenNhomKhach: 'Tất cả' }}
                            getOptionLabel={(option) => option.tenNhomKhach}
                            onChange={(event, option) => {
                                setIdNhomKhach(option?.id ?? '');
                                handleChangeNhomKhach(option?.id);
                            }}
                            size="small"
                            renderInput={(params) => <TextField {...params} label="Nhóm khách" />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DatePickerRequireCustom
                            props={{
                                width: '100%',
                                size: 'small'
                            }}
                            defaultVal={formatDate(new Date(), 'yyyy-MM-dd')}
                            handleChangeDate={(dt: string) => {
                                console.log(dt);
                            }}
                        />
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{ fontSize: '0.875rem', color: '3D475C', fontFamily: 'Roboto', fontWeight: 500 }}>
                                Tổng chi tiêu
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" label="Từ" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" label="Đến" />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Typography
                            sx={{ fontSize: '0.875rem', color: '3D475C', fontFamily: 'Roboto', fontWeight: 500 }}>
                            Giới tính
                        </Typography>
                        <Grid xs={12}>
                            <FormControlLabel control={<Checkbox title={'Nam'} />} label="Nam" />
                        </Grid>
                        <Grid xs={12}>
                            <FormControlLabel control={<Checkbox title={'Nữ'} />} label="Nữ" />
                        </Grid>
                        <Grid xs={12}>
                            <FormControlLabel control={<Checkbox title={'Khác'} />} label="Khác" />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                        <Grid item xs={6}>
                            <Button fullWidth variant="outlined" className="border-color btn-outline-hover">
                                Đặt lại
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={async () => {
                                    if (idNhomKhach === '') {
                                        handleChangeNhomKhach('');
                                    }
                                    await setIdNhomKhach('');
                                    await handleOk();
                                }}>
                                Áp dụng
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Popover>
    );
};
export default CustomerFilterDrawer;
