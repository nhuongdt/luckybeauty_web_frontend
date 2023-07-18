import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    Avatar,
    IconButton
} from '@mui/material';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import avatar from '../../images/avatar.png';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import useWindowWidth from '../../components/StateWidth';
import {
    BookingDetailDto,
    BookingDetail_ofCustomerDto
} from '../../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../../services/dat-lich/datLichService';
import { BookingRequestDto } from '../../services/dat-lich/dto/PagedBookingResultRequestDto';
import { format } from 'date-fns';
const TabCuocHen = ({ handleChoseCusBooking }: any) => {
    const [tabFilter, setTabFilter] = React.useState(0);
    const handleChangeFilter = (value: number) => {
        setTabFilter(value);
    };
    const titleTab = ['Tất cả', 'Chưa xác nhận', 'Đã xác nhận'];

    const arrTrangThaiBook = [
        {
            id: 0,
            text: 'Tất cả'
        },
        {
            id: 1,
            text: 'Chưa xác nhận'
        },
        {
            id: 2,
            text: 'Đã xác nhận'
        }
    ];

    const [paramSearch, setParamSearch] = useState<BookingRequestDto>({
        currentPage: 0
    } as BookingRequestDto);

    const [listCusBooking, setListCusBooking] = useState<BookingDetail_ofCustomerDto[]>([]);

    const GetListCustomer_wasBooking = async () => {
        const data = await datLichService.GetList_Booking_byCustomer(paramSearch);
        console.log(data);
        setListCusBooking(data);
    };

    useEffect(() => {
        GetListCustomer_wasBooking();
    }, []);

    const choseBooking = (itemBook: any) => {
        const dataCus = { ...itemBook };
        dataCus.id = itemBook.idKhachHang;
        handleChoseCusBooking(dataCus);
    };

    const windowWidth = useWindowWidth();
    return (
        <Box>
            <Grid container rowSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ maxWidth: '375px' }}
                        placeholder="Tìm kiếm"
                        value={paramSearch.textSearch}
                        onChange={(e) =>
                            setParamSearch({ ...paramSearch, textSearch: e.target.value })
                        }
                        InputProps={{
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'var(--color-main)',
                            marginLeft: windowWidth > 600 ? 'auto' : '0',
                            height: 'fit-content'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover">
                        Thêm cuộc hẹn mới
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: '24px', marginY: '16px' }}>
                {titleTab.map((item, index) => (
                    <Button
                        onClick={() => handleChangeFilter(index)}
                        key={index}
                        variant="outlined"
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            transition: '.4s',
                            minWidth: 'unset',
                            color: '#666466',
                            fontSize: '12px',
                            border: `1px solid ${
                                tabFilter === index ? 'transparent' : '#E6E1E6'
                            }!important`,
                            bgcolor:
                                tabFilter === index ? 'var(--color-bg)!important' : '#fff!important'
                        }}>
                        {item}
                    </Button>
                ))}
            </Box>
            <Grid container spacing={2}>
                {listCusBooking.map((item, index) => (
                    <Grid item key={index} sm={6} md={4} xs={12}>
                        <Box
                            sx={{
                                padding: '18px',
                                border: '1px solid #E6E1E6',
                                borderRadius: '8px',
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                },
                                '& p': {
                                    mb: '0'
                                }
                            }}
                            onClick={() => choseBooking(item)}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{ display: 'flex', gap: '8px', width: '100%' }}
                                    title={item.tenKhachHang}>
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        src=""
                                        alt={item.maKhachHang}
                                    />
                                    <Box sx={{ width: '100%' }}>
                                        <Typography
                                            variant="body1"
                                            fontSize="16px"
                                            color="#333233"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                maxWidth: '80%'
                                            }}>
                                            {item.tenKhachHang}
                                        </Typography>
                                        <Typography fontSize="12px" variant="body1" color="#999699">
                                            {item.soDienThoai}
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* <Box>
                                    <IconButton sx={{ padding: '0' }}>
                                        <MoreHorizIcon sx={{ color: '#231F20', width: '15px' }} />
                                    </IconButton>
                                </Box> */}
                            </Box>
                            {item.details.map((ct: BookingDetailDto) => (
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '42px',
                                            justifyContent: 'space-between',
                                            mt: '4px',
                                            '& p': {
                                                fontSize: '14px',

                                                color: '#4C4B4C'
                                            }
                                        }}>
                                        <Box
                                            title={ct.tenHangHoa}
                                            component="p"
                                            sx={{
                                                fontWeight: '500',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2'
                                            }}>
                                            {ct.tenHangHoa}
                                        </Box>
                                        <Box component="p" sx={{ fontWeight: '700' }}>
                                            {new Intl.NumberFormat('vi-VN').format(ct.giaBan)}
                                        </Box>
                                    </Box>
                                </>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#666466'
                                    }}>
                                    <Box marginRight="4px">
                                        <ClockIcon />
                                    </Box>
                                    <Box mr="3px">{format(new Date(item.startTime), 'HH:mm')}</Box>{' '}
                                    - <Box ml="3px">{format(new Date(item.endTime), 'HH:mm')}</Box>
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '12px',
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        color: 'var(--color-main)',
                                        bgcolor: 'var(--color-bg)'
                                    }}>
                                    {item.txtTrangThaiBook}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default TabCuocHen;
