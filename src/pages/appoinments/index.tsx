import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    TextField,
    IconButton
} from '@mui/material';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Search } from '@mui/icons-material';
import bookingStore from '../../stores/bookingStore';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import CreateOrEditLichHenModal from './components/create-or-edit-lich-hen';
import abpCustom from '../../components/abp-custom';
import LichhenDetail from './components/lich-hen-detail';
import { inject, observer } from 'mobx-react';
import '../customer/customerPage.css';
import suggestStore from '../../stores/suggestStore';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import datLichService from '../../services/dat-lich/datLichService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../lib/appconst';
import * as signalR from '@microsoft/signalr';
import { DateSelectArg, DayHeaderContentArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { addDays, endOfMonth, endOfWeek, format as formatDateFns, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import './appointment.css';
import { QueryBuilder } from '@mui/icons-material';
import NotificationStore from '../../stores/notificationStore';
import Stores from '../../stores/storeIdentifier';
import { FullCalendar_TypeView } from '../../enum/FullCalendar_TypeView';
import { SuggestNhanSuDto } from '../../services/suggests/dto/SuggestNhanSuDto';
import ToolbarHeader from './components/Toolbarheader';
import { IHeaderTable } from '../../components/Table/MyHeaderTable';

enum KieuHienThi {
    DANG_LUOI = 0,
    DANG_BANG = 1
}
interface ILichHenProps {
    notificationStore: NotificationStore;
}
const LichHen: React.FC<ILichHenProps> = (props) => {
    const { notificationStore } = props;
    const toDay = new Date();
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [kieuHienThi, setKieuHienThi] = useState(KieuHienThi.DANG_LUOI);
    const [txtSearch, setTxtSearch] = useState('');
    const [fromDate, setFromDate] = useState(addDays(startOfWeek(toDay), 1));
    const [toDate, setToDate] = useState(addDays(endOfWeek(toDay), 1));
    const [modalVisible, setModalVisible] = useState(false);
    const [initialView, setInitialView] = useState<string>(FullCalendar_TypeView.WEEK);
    const [initialDate, setInitialDate] = useState<Date>(toDay);
    const calendarRef = useRef<FullCalendar>(null);
    const [idBooking, setIdBooking] = useState<string>('');
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [notificationConnectionHub, setNotificationConnectionHub] = useState<signalR.HubConnection>();

    const getData = async () => {
        const lichHenView = Cookies.get('lich-hen-view') ?? FullCalendar_TypeView.WEEK;
        setInitialView(lichHenView);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            const calendarApi = calendarComponent.getApi();
            calendarApi.changeView(lichHenView);

            let from: Date = new Date(),
                to: Date = new Date();
            switch (lichHenView) {
                case FullCalendar_TypeView.MONTH:
                    {
                        from = startOfMonth(toDay);
                        to = endOfMonth(toDay);
                    }
                    break;
                case FullCalendar_TypeView.WEEK:
                    {
                        from = addDays(startOfWeek(toDay), 1);
                        to = addDays(endOfWeek(toDay), 1);
                    }
                    break;
                default:
                    {
                        from = to = toDay;
                    }
                    break;
            }
            setFromDate(from);
            setToDate(to);

            bookingStore.fromDate = formatDateFns(from, 'yyyy-MM-dd');
            bookingStore.toDate = formatDateFns(to, 'yyyy-MM-dd');
            await bookingStore.getData();
        }
    };

    const suggestData = async () => {
        await suggestStore.getSuggestKhachHang();
        await suggestStore.getSuggestKyThuatVien();
        await suggestStore.getSuggestDichVu(bookingStore.idNhanVien);
    };
    useEffect(() => {
        getData();
        suggestData();
    }, [chinhanh.id]);

    const handleSubmit = async () => {
        await getData();
        setModalVisible(!modalVisible);
        await sendNotification();
        await notificationStore.GetUserNotification();
        // Nếu đang mở xem thông tin lịch hẹn: không đóng form mà thực hiện gọi lại
        await bookingStore.getBookingInfo(bookingStore.bookingInfoDto?.id);
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
    const sendNotification = async () => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'notifications') // Điều chỉnh URL hub tại đây
            .build();
        setNotificationConnectionHub(newConnection);
        if (newConnection) {
            // Khởi động kết nối nếu chưa kết nối hoặc đang trong trạng thái khác "Connected"
            if (newConnection.state !== 'Connected') {
                await newConnection.start();
            }
            newConnection
                .invoke('SendNotification')
                .then(() => {
                    console.log('Bắt đầu gửi thông báo');
                })
                .catch((error) => {
                    console.error('Error invoking SendNotification:', error);
                });
        }
    };
    const Modal = () => {
        setModalVisible(!modalVisible);
        bookingStore.isShowCreateOrEdit = !bookingStore.isShowCreateOrEdit;
    };
    const handleCreateUpdateShow = (idLichHen: string) => {
        setIdBooking(idLichHen);
        Modal();
    };

    const changeKieuHienThi = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);
        setKieuHienThi(newVal);
    };

    const handleKeyDownTextSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            hanClickIconSearch();
        }
    };
    const hanClickIconSearch = async () => {
        bookingStore.textSearch = txtSearch;
        await bookingStore.getData();
    };

    const handleChangeDate = async (fromDate: Date, toDate: Date) => {
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            const calendarApi = calendarComponent.getApi();
            calendarApi.gotoDate(fromDate);
            calendarApi.gotoDate(toDate);
            setFromDate(fromDate);
            setToDate(toDate);
            bookingStore.fromDate = formatDateFns(fromDate, 'yyyy-MM-dd');
            bookingStore.toDate = formatDateFns(toDate, 'yyyy-MM-dd');
            await bookingStore.getData();
        }
    };

    const handleChangeViewType = async (type: FullCalendar_TypeView) => {
        setInitialView(type);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            const calendarApi = calendarComponent.getApi();
            calendarApi.changeView(type);
        }
        Cookies.set('lich-hen-view', type);
    };

    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        const calendarApi = selectInfo.view.calendar;
        const isoStartDate = selectInfo.startStr;
        const parsedDate = parseISO(isoStartDate);
        const startHours = formatDateFns(parsedDate, 'HH:mm');
        const startTime = formatDateFns(parsedDate, 'yyyy-MM-dd');
        calendarApi.unselect(); // clear date selection
        //bookingStore.createNewBookingDto();
        bookingStore.createOrEditBookingDto.startHours = startHours;
        bookingStore.createOrEditBookingDto.startTime = startTime;
        if (selectInfo.view.type === 'resourceTimeGridDay') {
            bookingStore.createOrEditBookingDto.idNhanVien = selectInfo.resource?.id ?? AppConsts.guidEmpty;
        }
        bookingStore.isShowCreateOrEdit = true;
    };

    const handleEventClick = async (clickInfo: EventClickArg) => {
        bookingStore.idBooking = clickInfo.event.id;
        if (clickInfo.event.id != null || clickInfo.event.id != '' || clickInfo.event.id !== undefined) {
            const modal = document.getElementsByClassName('fc-popover')[0] as HTMLElement | null;
            if (modal) {
                modal.style.display = 'none';
            }
            await bookingStore.getBookingInfo(clickInfo.event.id);
            await bookingStore.onShowBookingInfo();
        }
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'tenKhachHang', columnText: 'Tên khách' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'tongTienHang', columnText: 'Tổng tiền nạp', align: 'right' },
        { columnId: 'tongGiamGiaHD', columnText: 'Giảm giá', align: 'right' },
        { columnId: 'tongThanhToan', columnText: 'Phải thanh toán', align: 'right' },
        { columnId: 'khachDaTra', columnText: 'Đã thanh toán', align: 'right' },
        { columnId: 'conNo', columnText: 'Còn nợ', align: 'right' },
        { columnId: 'ghiChuHD', columnText: 'Ghi chú' }
    ];

    return (
        <Box
            sx={{
                height: '100%',
                backgroundColor: 'white'
            }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{
                    paddingBottom: '1.5277777777777777vw'
                }}>
                <Typography fontSize="16px" fontWeight="700">
                    Lịch hẹn
                </Typography>
                <RadioGroup row value={kieuHienThi} onChange={changeKieuHienThi}>
                    <FormControlLabel
                        value={KieuHienThi.DANG_LUOI}
                        label="Dạng lưới"
                        control={<Radio size="small" />}
                    />
                    <FormControlLabel
                        value={KieuHienThi.DANG_BANG}
                        label="Dạng bảng"
                        control={<Radio size="small" />}
                    />
                </RadioGroup>
            </Stack>
            <Grid container sx={{ borderBottom: '1px solid #ccc', paddingBottom: 2 }}>
                <Grid item lg={6}></Grid>
                <Grid item lg={6}>
                    <Stack direction={'row'} spacing={1}>
                        <Stack direction={'row'} spacing={1} flex={1}>
                            <Button
                                size="small"
                                fullWidth
                                hidden={!abpCustom.isGrandPermission('Pages.Booking.Create')}
                                startIcon={window.screen.width > 768 ? <AddIcon /> : null}
                                variant="contained"
                                title="Thêm cuộc hẹn"
                                onClick={async () => {
                                    bookingStore.createNewBookingDto();
                                    handleCreateUpdateShow('');
                                }}
                                className="btn-container-hover"
                                sx={{ bgcolor: 'var(--color-main)', fontSize: '14px', fontWeight: '400' }}>
                                {window.screen.width > 767 ? 'Thêm cuộc hẹn' : <AddIcon />}
                            </Button>
                            {/* <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={{ backgroundColor: 'white', color: 'black' }}
                                //onClick={ExportToExcel}
                                startIcon={<FileUploadIcon />}>
                                Xuất file
                            </Button> */}
                        </Stack>
                        <Stack flex={3}>
                            <TextField
                                size="small"
                                placeholder="Tìm kiếm dịch vụ, nhân viên, khách hàng"
                                fullWidth
                                sx={{ backgroundColor: 'white' }}
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" onClick={hanClickIconSearch}>
                                            <Search />
                                        </IconButton>
                                    )
                                }}
                                onChange={(event) => {
                                    setTxtSearch(event.target.value);
                                }}
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>

            <Box sx={{ marginTop: 3 }}>
                <ToolbarHeader
                    defaultFromDate={fromDate}
                    defaultToDate={toDate}
                    onChangeDate={handleChangeDate}
                    onChangeView={handleChangeViewType}
                />
                <FullCalendar
                    ref={calendarRef}
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                        resourceTimelinePlugin,
                        resourceTimeGridPlugin
                    ]}
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                    // chỉ get nhân viên được booking
                    resources={bookingStore?.listNhanVien?.map((item) => ({
                        title: `${JSON.stringify(item)}`,
                        id: item.id
                    }))}
                    resourceLabelContent={renderResourceLabelContent}
                    headerToolbar={false}
                    locale={'vi'}
                    initialView={initialView}
                    firstDay={1}
                    editable={true}
                    selectable={true}
                    titleFormat={{
                        weekday: 'long'
                    }}
                    height={748}
                    initialDate={initialDate}
                    selectMirror={false}
                    dayMaxEvents={true}
                    dayMaxEventRows={4}
                    slotMinTime={'07:00:00'}
                    slotMaxTime={'23:00:00'}
                    allDaySlot={false}
                    dayHeaderFormat={{
                        weekday: 'long',
                        day: initialView === 'timeGridWeek' ? 'numeric' : '2-digit'
                    }}
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        omitZeroMinute: false // Set this to true if you want to omit ":00" for minutes
                    }}
                    nowIndicator={true}
                    events={bookingStore.fullCalendarEvents !== undefined ? bookingStore.fullCalendarEvents : []}
                    weekends={true}
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    dayHeaderContent={renderDayHeaderContent}
                />
            </Box>
            <CreateOrEditLichHenModal
                visible={bookingStore.isShowCreateOrEdit}
                onCancel={() => {
                    setModalVisible(!modalVisible);
                    bookingStore.isShowCreateOrEdit = false;
                }}
                onOk={handleSubmit}
                idLichHen={idBooking}></CreateOrEditLichHenModal>
            <LichhenDetail />
            <ConfirmDelete
                isShow={bookingStore.isShowConfirmDelete}
                mes="Bạn có chắc chắn muốn hủy lịch hẹn không?"
                title="Xác nhận hủy"
                onOk={async () => {
                    const deleteReult = await datLichService.HuyLichHen(bookingStore.idBooking);
                    deleteReult === true
                        ? enqueueSnackbar('Hủy lịch hẹn thành công', {
                              variant: 'success',
                              autoHideDuration: 3000
                          })
                        : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
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
export default inject(Stores.NotificationStore)(observer(LichHen));

//lable header theo ngày của từng nhân viên
function renderResourceLabelContent(args: any) {
    const lable = JSON.parse(args.resource.title);

    return (
        <Box
            display={'flex'}
            padding={'6px 4px'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{
                minHeight: '65px'
            }}>
            <Box>
                <Box>
                    <Avatar src={lable.avatar} alt={lable.tenNhanVien} />
                </Box>
            </Box>
            <Box
                marginLeft={'5px'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                alignItems={'start'}>
                <Typography
                    fontSize="12px"
                    fontWeight="700"
                    sx={{
                        overflow: 'hidden'
                    }}>
                    {lable.tenNhanVien}
                </Typography>
                <Typography fontSize="12px">{lable.chucVu}</Typography>
            </Box>
        </Box>
    );
}

// render header của lịch theo tuần
function renderDayHeaderContent(args: DayHeaderContentArg) {
    const initialView = args.view.type;
    return (
        <Box
            display={'flex'}
            padding={'6px 4px'}
            // justifyContent={initialView === 'timeGridWeek' ? 'start' : 'center'}
            // flexDirection={initialView === 'timeGridWeek' ? 'column' : 'row'}
            // alignItems={initialView === 'timeGridWeek' ? 'start' : 'center'}
            justifyContent={'center'}
            flexDirection={initialView === 'timeGridWeek' ? 'column' : 'row'}
            alignItems={'center'}
            minHeight={'65px'}>
            <Box fontSize={initialView === 'timeGridWeek' ? '12px' : '14px'}>
                {formatDateFns(args.date, 'EEEE', { locale: vi })}
            </Box>
            {initialView === 'timeGridWeek' ? (
                <Box fontSize={'18px'} mt={1}>
                    {formatDateFns(args.date, 'd', { locale: vi })}
                </Box>
            ) : null}
        </Box>
    );
}
function renderEventContent(eventContent: EventContentArg) {
    const formattedStartTime = formatDateFns(eventContent.event.start ?? new Date(), 'HH:mm');
    const formattedEndTime = formatDateFns(eventContent.event.end ?? new Date(), 'HH:mm');
    return (
        <Box
            sx={{
                bgcolor: eventContent.event.backgroundColor,
                padding: '2px 8px',
                borderLeft: `4px solid ${eventContent.event.textColor}`,
                borderRadius: '4px',
                height: '100%',
                overflow: 'hidden'
            }}>
            {eventContent.view.type === 'dayGridMonth' ? (
                <Typography
                    variant="body1"
                    fontSize="12px"
                    whiteSpace="nowrap"
                    width={'100%'}
                    color={eventContent.event.textColor}>
                    {formattedStartTime} {eventContent.event.title + ':'}
                    {eventContent.event.display}
                </Typography>
            ) : (
                <Typography variant="body1" fontSize="12px" whiteSpace="normal" color={eventContent.event.textColor}>
                    <Box display={'flex'} alignItems={'center'} sx={{ overflow: 'hidden' }}>
                        {formattedStartTime} - {formattedEndTime}{' '}
                        <QueryBuilder
                            style={{
                                fontSize: '14px',
                                marginLeft: '5px'
                            }}
                        />
                    </Box>
                    <Box>{eventContent.event.title}</Box>
                    <Box>{eventContent.event.display}</Box>
                </Typography>
            )}
        </Box>
    );
}
