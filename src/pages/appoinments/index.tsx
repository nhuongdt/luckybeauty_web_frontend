import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Typography, Button, SelectChangeEvent, Avatar } from '@mui/material';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import bookingStore from '../../stores/bookingStore';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
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
import ToolbarHeader from './components/Toolbarheader';
import { CustomContentGenerator, DateSelectArg, DayHeaderContentArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { format as formatDateFns, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import './appointment.css';
import { QueryBuilder } from '@mui/icons-material';
import { ResourceLabelContentArg } from '@fullcalendar/resource';
const LichHen: React.FC = () => {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [modalVisible, setModalVisible] = useState(false);
    const [initialView, setInitialView] = useState<string>('dayGridMonth');
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const calendarRef = useRef<FullCalendar>(null);
    const [idBooking, setIdBooking] = useState<string>('');
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [notificationConnectionHub, setNotificationConnectionHub] = useState<signalR.HubConnection>();
    const getData = async () => {
        let calendarView = 'week';
        const lichHenView = Cookies.get('lich-hen-view') ?? 'timeGridWeek';
        setInitialView(lichHenView);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            calendarComponent.getApi().changeView(lichHenView);
        }
        if (lichHenView == 'dayGridMonth') {
            calendarView = 'month';
        } else if (lichHenView == 'timeGridWeek') {
            calendarView = 'week';
        } else {
            calendarView = 'day';
        }
        bookingStore.selectedDate = formatDateFns(new Date(), 'yyyy-MM-dd');
        bookingStore.typeView = calendarView;
        await bookingStore.getData();
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

    const handleChangeViewType = async (event: SelectChangeEvent<string>) => {
        setInitialView(event.target.value);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            calendarComponent.getApi().changeView(event.target.value);
        }
        let newValue = event.target.value as string;
        if (newValue == 'dayGridMonth') {
            newValue = 'month';
        } else if (newValue == 'timeGridWeek') {
            newValue = 'week';
        } else {
            newValue = 'day';
        }
        Cookies.set('lich-hen-view', event.target.value);
        await bookingStore.onChangeTypeView(newValue);
    };
    const toDayClick = async () => {
        const newDate = new Date();
        setInitialDate(newDate);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            calendarComponent.getApi().today();
            const time = calendarComponent.getApi().getDate();
            setInitialDate(time);
            await bookingStore.onChangeDate(formatDateFns(time, 'yyyy-MM-dd'));
        }
    };
    const handlePrevious = async () => {
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            calendarComponent.getApi().prev();
            const time = calendarComponent.getApi().getDate();
            setInitialDate(time);
            await bookingStore.onChangeDate(formatDateFns(time, 'yyyy-MM-dd'));
            console.log(time);
            bookingStore.selectedDate = formatDateFns(time, 'yyyy-MM-dd');
        }
    };
    const handleNext = async () => {
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            calendarComponent.getApi().next();
            const time = calendarComponent.getApi().getDate();

            setInitialDate(time);
            await bookingStore.onChangeDate(formatDateFns(time, 'yyyy-MM-dd'));
            bookingStore.selectedDate = formatDateFns(time, 'yyyy-MM-dd');
        }
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
    return (
        <Box
            sx={{
                padding: '16px 8px',
                height: '100%'
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
                    <Button variant="outlined" className="btn-outline-hover" sx={{ bgcolor: '#fff!important', paddingX: '8px' }}>
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
                        onClick={async () => {
                            bookingStore.createNewBookingDto();
                            handleCreateUpdateShow('');
                        }}
                        className="btn-container-hover"
                        sx={{ bgcolor: 'var(--color-main)', fontSize: '14px', fontWeight: '400' }}>
                        Thêm cuộc hẹn
                    </Button>
                </Box>
            </Box>
            <Box>
                <ToolbarHeader
                    initialView={initialView}
                    initialDate={initialDate}
                    handleChangeViewType={handleChangeViewType}
                    toDayClick={toDayClick}
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                />
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, resourceTimelinePlugin, resourceTimeGridPlugin]}
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                    resources={
                        bookingStore.idNhanVien !== undefined && bookingStore.idNhanVien !== ''
                            ? suggestStore.suggestKyThuatVien
                                  ?.filter((nhanVien) => nhanVien.id === bookingStore.idNhanVien)
                                  .map((item) => {
                                      return {
                                          id: item.id,
                                          title: `${JSON.stringify(item)}`
                                      };
                                  }) ?? []
                            : suggestStore.suggestKyThuatVien?.map((nhanVien) => ({
                                  title: `${JSON.stringify(nhanVien)}`,
                                  id: nhanVien.id
                              })) ?? []
                    }
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
            <Box marginLeft={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'start'}>
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
            <Box fontSize={initialView === 'timeGridWeek' ? '12px' : '14px'}>{formatDateFns(args.date, 'EEEE', { locale: vi })}</Box>
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
                <Typography variant="body1" fontSize="12px" whiteSpace="nowrap" width={'100%'} color={eventContent.event.textColor}>
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
