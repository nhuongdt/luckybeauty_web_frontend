import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Select,
    SelectChangeEvent,
    MenuItem,
    ButtonGroup,
    TextField,
    InputAdornment,
    Autocomplete
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import ListIcon from '@mui/icons-material/List';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TabDay from './components/TabDay';
import TabWeek from './components/TabWeek';
import TabMonth from './components/TabMonth';
import { BookingGetAllItemDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import bookingStore from '../../stores/bookingStore';
import { ChiNhanhContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import CreateOrEditLichHenModal from './components/create-or-edit-lich-hen';
import abpCustom from '../../components/abp-custom';
import LichhenDetail from './components/lich-hen-detail';
import { observer } from 'mobx-react';
import '../customer/customerPage.css';
import suggestStore from '../../stores/suggestStore';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import datLichService from '../../services/dat-lich/datLichService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../lib/appconst';
import * as signalR from '@microsoft/signalr';
import notificationStore from '../../stores/notificationStore';
const LichHen: React.FC = () => {
    const chinhanh = useContext(ChiNhanhContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [idBooking, setIdBooking] = useState<string>('');
    const [dateView, setDateView] = useState('');
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const getData = async () => {
        bookingStore.selectedDate = new Date();
        bookingStore.typeView = Cookies.get('Tab-lich-hen') ?? 'week';
        await bookingStore.getData();
    };
    const suggestData = async () => {
        await suggestStore.getSuggestKhachHang();
        await suggestStore.getSuggestKyThuatVien();
        await suggestStore.getSuggestDichVu();
    };
    const handlePreviousWeek = async () => {
        const datePreviousWeek = new Date(bookingStore.selectedDate);
        if (bookingStore.typeView === 'week') {
            datePreviousWeek.setDate(datePreviousWeek.getDate() - 7);
        } else if (bookingStore.typeView === 'month') {
            datePreviousWeek.setMonth(datePreviousWeek.getMonth() - 1);
        } else {
            datePreviousWeek.setDate(datePreviousWeek.getDate() - 1);
        }
        await bookingStore.onChangeDate(datePreviousWeek);
        bookingStore.selectedDate = datePreviousWeek;
        getCurrentDateInVietnamese(datePreviousWeek);
    };

    const handleNextWeek = async () => {
        const dateNextWeek = new Date(bookingStore.selectedDate);
        if (bookingStore.typeView === 'week') {
            dateNextWeek.setDate(dateNextWeek.getDate() + 7);
        } else if (bookingStore.typeView === 'month') {
            dateNextWeek.setMonth(dateNextWeek.getMonth() + 1);
        } else {
            dateNextWeek.setDate(dateNextWeek.getDate() + 1);
        }
        await bookingStore.onChangeDate(dateNextWeek);
        bookingStore.selectedDate = dateNextWeek;
        getCurrentDateInVietnamese(dateNextWeek);
    };
    const toDayClick = async () => {
        const newDate = new Date();
        await bookingStore.onChangeDate(newDate);
        bookingStore.selectedDate = newDate;
        getCurrentDateInVietnamese(newDate);
    };
    useEffect(() => {
        getCurrentDateInVietnamese(new Date());
        getData();
        suggestData();
    }, [chinhanh.id]);
    const handleSubmit = async () => {
        await getData();
        setModalVisible(!modalVisible);
        await notificationStore.GetUserNotification();
    };
    useEffect(() => {
        createHubConnection();
    }, []);

    const createHubConnection = async () => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'bookingHub') // Điều chỉnh URL hub tại đây
            .build();
        try {
            await newConnection.start();
            console.log('SignalR connected');
            setConnection(newConnection);
            newConnection.on('RecieiveAppointment', () => {
                getData();
            });
        } catch (e) {
            console.error('SignalR connection error: ', e);
        }
    };

    const getCurrentDateInVietnamese = (date: Date) => {
        const daysOfWeek = [
            'Chủ nhật',
            'Thứ hai',
            'Thứ ba',
            'Thứ tư',
            'Thứ năm',
            'Thứ sáu',
            'Thứ bảy'
        ];
        const monthsOfYear = [
            'tháng 1',
            'tháng 2',
            'tháng 3',
            'tháng 4',
            'tháng 5',
            'tháng 6',
            'tháng 7',
            'tháng 8',
            'tháng 9',
            'tháng 10',
            'tháng 11',
            'tháng 12'
        ];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();

        const formattedDate = `${dayOfWeek},  ${dayOfMonth} ${month}, năm ${year}`;
        setDateView(formattedDate);
    };

    const [TabLichHen, setTabLichHen] = useState('week');

    const handleChangeTab = async (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value as string;
        setTabLichHen(newValue);
        await bookingStore.onChangeTypeView(event.target.value as string);
        if (newValue === 'week') {
            Cookies.set('Tab-lich-hen', 'week', { expires: 7 });
        } else if (newValue === 'day') {
            Cookies.set('Tab-lich-hen', 'day');
        } else if (newValue === 'month') {
            Cookies.set('Tab-lich-hen', 'month');
        }
    };
    const Modal = () => {
        setModalVisible(!modalVisible);
    };
    const handleCreateUpdateShow = (idLichHen: string) => {
        setIdBooking(idLichHen);
        Modal();
    };
    useEffect(() => {
        const CheckTab = Cookies.get('Tab-lich-hen');
        if (CheckTab === 'week') {
            setTabLichHen('week');
        } else if (CheckTab === 'day') {
            setTabLichHen('day');
        } else if (CheckTab === 'month') {
            setTabLichHen('month');
        } else {
            undefined;
        }
        bookingStore.typeView = CheckTab ?? 'week';
    }, []);
    return (
        <Box
            sx={{
                padding: '16px'
            }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #E6E1E6',
                    paddingBottom: '1.5277777777777777vw'
                }}>
                <Typography
                    marginTop="4px"
                    //color="#0C050A"
                    fontSize="16px"
                    fontWeight="700">
                    Lịch hẹn
                </Typography>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset'
                        },
                        display: 'flex',
                        gap: '8px'
                    }}>
                    <Button
                        onClick={createHubConnection}
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{ bgcolor: '#fff!important', paddingX: '8px' }}>
                        <SettingIcon />
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{
                            bgcolor: '#fff!important',
                            fontSize: '14px',
                            fontWeight: '400',
                            color: '#666466',
                            '& svg': {
                                filter: ' brightness(0) saturate(100%) invert(39%) sepia(6%) saturate(131%) hue-rotate(251deg) brightness(95%) contrast(85%)'
                            }
                        }}>
                        Thêm thời gian chặn
                    </Button>
                    <Button
                        hidden={!abpCustom.isGrandPermission('Pages.Booking.Create')}
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => {
                            handleCreateUpdateShow('');
                        }}
                        className="btn-container-hover"
                        sx={{ bgcolor: 'var(--color-main)', fontSize: '14px', fontWeight: '400' }}>
                        Thêm cuộc hẹn
                    </Button>
                </Box>
            </Box>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ paddingTop: '1.5277777777777777vw', marginBottom: '10px' }}>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        options={suggestStore.suggestKyThuatVien}
                        getOptionLabel={(option) => `${option.tenNhanVien}`}
                        size="small"
                        sx={{ width: window.screen.width <= 650 ? '100%' : '45%' }}
                        fullWidth
                        disablePortal
                        onChange={async (event, value) => {
                            await bookingStore.onChangeEmployee(value?.id ?? ''); // Cập nhật giá trị id trong Formik
                        }}
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                placeholder="Tìm tên"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box
                        display="flex"
                        sx={{
                            '& button:not(.btn-to-day)': {
                                minWidth: 'unset',
                                borderColor: '#E6E1E6',
                                bgcolor: '#fff!important',
                                px: '7px!important'
                            },
                            '& svg': {
                                color: '#666466!important'
                            },
                            alignItems: 'center'
                        }}>
                        <Button
                            onClick={handlePreviousWeek}
                            variant="outlined"
                            sx={{ mr: '16px' }}
                            className="btn-outline-hover">
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            className="btn-to-day"
                            onClick={toDayClick}
                            variant="text"
                            sx={{
                                color: 'var(--color-main)!important',
                                fontSize: '16px!important',
                                textTransform: 'unset!important',
                                bgcolor: 'transparent!important',
                                fontWeight: '400',
                                paddingX: '0',
                                pb: '10px',
                                mr: '20px'
                            }}>
                            Hôm nay
                        </Button>
                        <Typography fontSize="16px" fontWeight="700">
                            {dateView}
                        </Typography>
                        <Button
                            onClick={handleNextWeek}
                            variant="outlined"
                            sx={{ ml: '16px' }}
                            //</Box>className="btn-outline-hover"
                        >
                            <ChevronRightIcon />
                        </Button>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        gap: '8px'
                    }}>
                    <ButtonGroup variant="outlined">
                        <Button
                            //className="btn-outline-hover"
                            sx={{ marginRight: '1px' }}>
                            <DateRangeIcon />
                        </Button>
                        <Button
                        //className="btn-outline-hover"
                        >
                            <ListIcon />
                        </Button>
                    </ButtonGroup>

                    <Select
                        size="small"
                        value={TabLichHen}
                        onChange={(e) => {
                            handleChangeTab(e);
                        }}
                        sx={{
                            bgcolor: '#fff',
                            // '& .MuiSelect-select': { paddingY: '5.5px' },
                            fontSize: '14px'
                        }}>
                        <MenuItem value="week">Tuần</MenuItem>
                        <MenuItem value="day">Ngày</MenuItem>
                        <MenuItem value="month">Tháng</MenuItem>
                    </Select>
                    <Autocomplete
                        options={suggestStore.suggestDichVu}
                        getOptionLabel={(option) => `${option.tenDichVu}`}
                        sx={{ width: '40%' }}
                        size="small"
                        fullWidth
                        disablePortal
                        onChange={async (event, value) => {
                            await bookingStore.onChangeService(value?.id ?? ''); // Cập nhật giá trị id trong Formik
                        }}
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                placeholder="Tìm tên"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            {TabLichHen === 'week' ? (
                <TabWeek
                    dateQuery={bookingStore.selectedDate}
                    data={bookingStore.listBooking ?? []}
                />
            ) : TabLichHen === 'day' ? (
                <TabDay data={bookingStore.listBooking ?? []} />
            ) : TabLichHen === 'month' ? (
                <TabMonth
                    dateQuery={bookingStore.selectedDate}
                    data={bookingStore.listBooking ?? []}
                />
            ) : undefined}
            <CreateOrEditLichHenModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(!modalVisible);
                }}
                onOk={handleSubmit}
                idLichHen={idBooking}></CreateOrEditLichHenModal>
            <LichhenDetail />
            <ConfirmDelete
                isShow={bookingStore.isShowConfirmDelete}
                onOk={async () => {
                    const deleteReult = await datLichService.DeleteBooking(bookingStore.idBooking);
                    deleteReult === true
                        ? enqueueSnackbar('Xóa bản ghi thành công', {
                              variant: 'success',
                              autoHideDuration: 3000
                          })
                        : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau!', {
                              variant: 'error',
                              autoHideDuration: 3000
                          });
                    bookingStore.isShowConfirmDelete = false;
                    await bookingStore.onShowBookingInfo();
                    bookingStore.idBooking = AppConsts.guidEmpty;
                    getData();
                }}
                onCancel={() => {
                    bookingStore.isShowConfirmDelete = false;
                }}></ConfirmDelete>
        </Box>
    );
};
export default observer(LichHen);
