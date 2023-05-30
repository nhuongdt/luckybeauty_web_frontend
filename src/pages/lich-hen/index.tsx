import { PlusOutlined } from '@ant-design/icons';

import { Col, FormInstance, Row, Space, Tooltip } from 'antd';
import { Box, Button, Grid, Typography, Select } from '@mui/material';
import React, { Component, ReactNode, RefObject } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddIcon from '../../images/add.svg';
import {
    AiOutlineBars,
    AiOutlineCalendar,
    AiOutlineEllipsis,
    AiOutlineLeft,
    AiOutlineRight
} from 'react-icons/ai';
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import BreadcrumbsPageTitle from '../../components/Breadcrumbs/PageTitle';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import bookingServices from '../../services/dat-lich/datLichService';
import '../../custom.css';
import '../lich-hen/calendar.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CreateOrUpdateAppointment from './components/create-or-update-lich-hen';
import { CreateOrEditBookingDto } from '../../services/dat-lich/dto/CreateOrEditBookingDto';
import { SuggestNhanSuDto } from '../../services/suggests/dto/SuggestNhanSuDto';
import { SuggestKhachHangDto } from '../../services/suggests/dto/SuggestKhachHangDto';
import { SuggestDonViQuiDoiDto } from '../../services/suggests/dto/SuggestDonViQuiDoi';
import SuggestService from '../../services/suggests/SuggestService';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';
import { padding } from '@mui/system';
class LichHenScreen extends Component {
    formRef = React.createRef<FormInstance>();
    calendarRef: RefObject<FullCalendar> = React.createRef();
    state = {
        initialView: 'timeGridWeek',
        viewDate: format(new Date(), 'EEEE, dd MMMM ,yyyy', { locale: vi }),
        modalVisible: false,
        events: [],
        idBooking: '',
        createOrEditBooking: {} as CreateOrEditBookingDto,
        suggestNhanVien: [] as SuggestNhanSuDto[],
        suggestKhachHang: [] as SuggestKhachHangDto[],
        suggestDonViQuiDoi: [] as SuggestDonViQuiDoiDto[]
    };
    async componentDidMount() {
        this.getData();
        const suggestNhanViens = await SuggestService.SuggestNhanSu();
        const suggestKhachHangs = await SuggestService.SuggestKhachHang();
        const suggestDichVus = await SuggestService.SuggestDonViQuiDoi();
        this.setState({
            suggestNhanVien: suggestNhanViens,
            suggestDonViQuiDoi: suggestDichVus,
            suggestKhachHang: suggestKhachHangs
        });
    }
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh');
        const appointments = await bookingServices.getAllBooking({ idChiNhanh: idChiNhanh ?? '' });
        const lstEvent: any[] = [];
        console.log(appointments);
        appointments.map((event) => {
            lstEvent.push({
                title: event.noiDung,
                start: event.startTime,
                end: event.endTime,
                color: '#F1FAFF',
                textColor: event.color !== '' && event.color != null ? event.color : '#009EF7',
                borderColor: event.color !== '' && event.color != null ? event.color : '#009EF7'
            });
        });
        this.setState({
            events: lstEvent
        });
    }
    // handleChangeViewCalendar = (value: { value: string; label: React.ReactNode }) => {
    //     const calendarApi = this.calendarRef.current?.getApi();
    //     calendarApi?.changeView(value.value);
    // };
    handleChangeViewCalendar = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        const calendarApi = this.calendarRef.current?.getApi();
        calendarApi?.changeView(selectedValue);
        // calendarApi?.updateSize();
    };

    changeHeaderToolbar = (value: string) => {
        const calendarApi = this.calendarRef.current?.getApi();
        if (calendarApi) {
            if (value === 'prev') {
                calendarApi.prev();
                if (calendarApi.view.type === 'timeGridDay') {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'EEEE, dd MMMM ,yyyy', {
                            locale: vi
                        })
                    });
                } else {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'MMMM ,yyyy', { locale: vi })
                    });
                }
            } else if (value === 'next') {
                calendarApi.next();
                if (calendarApi.view.type === 'timeGridDay') {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'EEEE, dd MMMM ,yyyy', {
                            locale: vi
                        })
                    });
                } else {
                    this.setState({
                        viewDate: format(calendarApi.getDate(), 'MMMM ,yyyy', { locale: vi })
                    });
                }
            } else if (value === 'today') {
                calendarApi.today();
                this.setState({
                    viewDate: format(new Date(), 'EEEE, dd MMMM ,yyyy', { locale: vi })
                });
            }
        }
        this.getData();
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(entityDto: string) {
        if (entityDto === '') {
            this.formRef.current?.resetFields();
            this.setState({
                createOrEditBooking: {
                    id: '',
                    startTime: '',
                    startHours: '',
                    trangThai: 1,
                    ghiChu: '',
                    idKhachHang: '',
                    idNhanVien: '',
                    idDonViQuiDoi: ''
                }
            });
        } else {
            // const booking = await nhanVienService.getNhanSu(entityDto);
            // this.setState({
            //     createOrEditNhanSu: employee
            // });
            // setTimeout(() => {
            //     this.formRef.current?.setFieldsValue({ ...this.state.createOrEditNhanSu });
            // }, 100);
        }

        this.setState({ idBooking: entityDto });
        this.Modal();
    }
    handleSubmit = async () => {
        const idChiNhanh = Cookies.get('IdChiNhanh');
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.idBooking === '') {
                const result = await bookingServices.CreateBooking({
                    ...values,
                    idChiNhanh: idChiNhanh
                });
                result
                    ? enqueueSnackbar('Thêm mới lịch hẹn thàn công', { variant: 'success' })
                    : enqueueSnackbar('Thêm mới lịch hẹn thất bại! vui lòng thử lại sau', {
                          variant: 'error'
                      });
            } else {
                const result = await bookingServices.CreateBooking({
                    id: this.state.idBooking,
                    idChiNhanh: idChiNhanh,
                    ...values
                });
                result
                    ? enqueueSnackbar('Cập nhật lịch hẹn thành công', {
                          variant: 'success',
                          anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'center'
                          }
                      })
                    : enqueueSnackbar('Cập nhật lịch hẹn thất bại! vui lòng thử lại sau', {
                          variant: 'error',
                          anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'center'
                          }
                      });
            }

            await this.getData();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
        });
    };

    render(): ReactNode {
        const breadcrumbsLink = [
            { text: 'Lịch hẹn ', color: '#999699' },
            { text: 'Danh sách lịch hẹn', color: '#333233' }
        ];

        return (
            <Box sx={{ height: '100%', padding: '0 2.2222222222222223vw' }}>
                <Box sx={{ borderBottom: '1px solid #E6E1E6', paddingBottom: '24px' }}>
                    <Grid container justifyContent="space-between" sx={{ paddingTop: '22px' }}>
                        <Grid item xs={6}>
                            <BreadcrumbsPageTitle listLink={breadcrumbsLink} />
                            <Typography
                                marginTop="4px"
                                color="#0C050A"
                                variant="h5"
                                fontWeight="700">
                                Lịch hẹn
                            </Typography>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            console.log('ok');
                                        }}
                                        sx={{
                                            borderColor: '#E6E1E6!important',
                                            minWidth: '40px',
                                            height: '40px',
                                            width: '40px',
                                            marginRight: '8px',
                                            padding: '0'
                                        }}>
                                        <AiOutlineEllipsis color="#231F20" />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        sx={{
                                            textTransform: 'unset!important',
                                            backgroundColor: '#7C3367!important',
                                            height: '40px'
                                        }}
                                        onClick={() => {
                                            this.setState({
                                                modalVisible: !this.state.modalVisible
                                            });
                                        }}>
                                        Thêm
                                    </Button>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box marginTop="16px">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                        <Box>
                            <Select
                                defaultValue="all"
                                sx={{
                                    borderWidth: '0!important',
                                    backgroundColor: '#fff',
                                    width: 'auto',
                                    fontSize: '14px',
                                    padding: '8px 16px!important',
                                    ' & .MuiSelect-select': {
                                        padding: '0'
                                    }
                                }}>
                                <MenuItem value="all">Tất cả</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            <Box display="flex" alignItems="center">
                                <Button
                                    sx={{
                                        border: '1px solid #E6E1E6',
                                        minWidth: '32px',
                                        height: '32px',
                                        marginRight: '16px',
                                        backgroundColor: '#fff',
                                        width: '32px'
                                    }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('prev');
                                    }}>
                                    <KeyboardArrowLeftIcon sx={{ color: '#666466' }} />
                                </Button>
                                <Button
                                    sx={{ padding: '0', marginRight: '16px' }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('today');
                                    }}>
                                    Hôm nay
                                </Button>
                                <div className="date-time-selected">{this.state.viewDate}</div>
                                <Button
                                    sx={{
                                        border: '1px solid #E6E1E6',
                                        minWidth: '32px',
                                        height: '32px',
                                        marginLeft: '16px',
                                        backgroundColor: '#fff',
                                        width: '32px'
                                    }}
                                    onClick={() => {
                                        this.changeHeaderToolbar('next');
                                    }}>
                                    <KeyboardArrowRightIcon sx={{ color: '#666466' }} />
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            <div>
                                <Box display="flex">
                                    <Tooltip title="Like">
                                        <Button sx={{ minWidth: 'unset' }}>
                                            <AiOutlineCalendar color="#231F20" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Like">
                                        <Button sx={{ minWidth: 'unset' }}>
                                            <AiOutlineBars color="#231F20" />
                                        </Button>
                                    </Tooltip>
                                    <Select
                                        defaultValue="timeGridDay"
                                        onChange={this.handleChangeViewCalendar}
                                        sx={{
                                            width: 'auto',
                                            fontSize: '14px',
                                            padding: '8px 16px!important',
                                            marginRight: '8px',
                                            float: 'left',
                                            color: '#4C4B4C',
                                            '& .MuiSelect-select': {
                                                padding: '0'
                                            }
                                        }}>
                                        <MenuItem value="dayGridMonth">Tháng</MenuItem>
                                        <MenuItem value="timeGridWeek">Tuần</MenuItem>
                                        <MenuItem value="timeGridDay">Ngày</MenuItem>
                                        <MenuItem value="listWeek">Danh sách</MenuItem>
                                    </Select>
                                    <Select
                                        defaultValue="service"
                                        sx={{
                                            width: 'auto',
                                            fontSize: '14px',
                                            padding: '8px 16px!important',
                                            float: 'left',
                                            '& .MuiSelect-select': {
                                                padding: '0'
                                            }
                                        }}>
                                        <MenuItem value="service">Dịch vụ</MenuItem>
                                    </Select>
                                </Box>
                            </div>
                        </Box>
                    </Box>
                    <Box
                        bgcolor="#fff"
                        sx={{
                            '& table': {
                                width: '100%!important'
                            },
                            '& .fc-timegrid-body': {
                                width: '100%!important'
                            }
                        }}>
                        <FullCalendar
                            ref={this.calendarRef}
                            viewHeight={650}
                            height={650}
                            firstDay={1}
                            headerToolbar={false}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                            allDaySlot={false}
                            slotMinTime={'06:00:00'}
                            slotMaxTime={'23:00:00'}
                            locale={'vi'}
                            initialView={this.state.initialView}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            themeSystem="boostrap"
                            events={this.state.events}
                        />
                    </Box>
                </Box>
                <CreateOrUpdateAppointment
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }}
                    onOk={this.handleSubmit}
                    modalType="Thêm cuộc hẹn"
                    suggestNhanVien={this.state.suggestNhanVien}
                    suggestDichVu={this.state.suggestDonViQuiDoi}
                    suggestKhachHang={this.state.suggestKhachHang}
                    formRef={this.formRef}
                />
            </Box>
        );
    }
}
export default LichHenScreen;
