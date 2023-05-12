import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, FormInstance, Row, Select, Space, Tooltip } from 'antd';
import React, { Component, ReactNode, RefObject } from 'react';
import {
    AiOutlineBars,
    AiOutlineCalendar,
    AiOutlineEllipsis,
    AiOutlineLeft,
    AiOutlineRight
} from 'react-icons/ai';
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
        const appointments = await bookingServices.getAllBooking();
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
    handleChangeViewCalendar = (value: { value: string; label: React.ReactNode }) => {
        const calendarApi = this.calendarRef.current?.getApi();
        calendarApi?.changeView(value.value);
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
        this.formRef.current?.validateFields().then(async (values: any) => {
            if (this.state.idBooking === '') {
                await bookingServices.CreateBooking(values);
            } else {
                await bookingServices.CreateBooking({
                    id: this.state.idBooking,
                    ...values
                });
            }

            await this.getData();
            this.setState({ modalVisible: false });
            this.formRef.current?.resetFields();
        });
    };
    render(): ReactNode {
        return (
            <div className="container-fluid h-100 bg-white" style={{ height: '100%' }}>
                <div className="page-header">
                    <Row align={'middle'} justify={'space-between'}>
                        <Col span={12}>
                            <div>
                                <div className="pt-2">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page">
                                                Lịch hẹn
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Lịch hẹn</h3>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Space align="center" size="small">
                                    <Button
                                        icon={<AiOutlineEllipsis size={24} />}
                                        size="large"
                                        className="btn btn-more-horizontal"
                                        onClick={() => {
                                            console.log('ok');
                                        }}></Button>
                                    <Button
                                        icon={<PlusOutlined />}
                                        size="large"
                                        className="btn btn-add-item"
                                        onClick={() => {
                                            this.setState({
                                                modalVisible: !this.state.modalVisible
                                            });
                                        }}>
                                        Thêm
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-body mt-2">
                    <div className="align-content-around row" style={{ height: '54px' }}>
                        <div className="col-3 text-center" style={{ height: '32px' }}>
                            <Select
                                labelInValue
                                defaultValue={{ value: 'all', label: 'Tất cả' }}
                                style={{ width: 85, float: 'left' }}
                                options={[
                                    {
                                        value: 'all',
                                        label: 'Tất cả'
                                    }
                                ]}
                            />
                        </div>
                        <div className="col-6 text-center" style={{ height: '32px' }}>
                            <Space size={'middle'}>
                                <Button
                                    icon={<AiOutlineLeft />}
                                    onClick={() => {
                                        this.changeHeaderToolbar('prev');
                                    }}
                                />
                                <Button
                                    className="btn-today"
                                    onClick={() => {
                                        this.changeHeaderToolbar('today');
                                    }}>
                                    Hôm nay
                                </Button>
                                <div className="date-time-selected">{this.state.viewDate}</div>
                                <Button
                                    icon={<AiOutlineRight />}
                                    onClick={() => {
                                        this.changeHeaderToolbar('next');
                                    }}
                                />
                            </Space>
                        </div>
                        <div className="col-3" style={{ height: '32px', paddingBottom: 40 }}>
                            <div style={{ float: 'right' }}>
                                <Space.Compact block>
                                    <Tooltip title="Like">
                                        <Button icon={<AiOutlineCalendar />} />
                                    </Tooltip>
                                    <Tooltip title="Like">
                                        <Button icon={<AiOutlineBars />} />
                                    </Tooltip>
                                    <Select
                                        labelInValue
                                        defaultValue={{ value: 'timeGridWeek', label: 'Tuần' }}
                                        onChange={this.handleChangeViewCalendar}
                                        style={{
                                            width: 92,
                                            paddingRight: 5,
                                            paddingLeft: 5,
                                            float: 'left',
                                            color: '#FFFAFF'
                                        }}
                                        options={[
                                            {
                                                value: 'dayGridMonth',
                                                label: 'Tháng'
                                            },
                                            {
                                                value: 'timeGridWeek',
                                                label: 'Tuần'
                                            },
                                            {
                                                value: 'timeGridDay',
                                                label: 'Ngày'
                                            },
                                            {
                                                value: 'listWeek',
                                                lable: 'Danh sách'
                                            }
                                        ]}
                                    />
                                    <Select
                                        labelInValue
                                        defaultValue={{ value: 'service', label: 'Dịch vụ' }}
                                        style={{ width: 92, float: 'left' }}
                                        options={[
                                            {
                                                value: 'service',
                                                label: 'Dịch vụ'
                                            }
                                        ]}
                                    />
                                </Space.Compact>
                            </div>
                        </div>
                    </div>
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
                </div>
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
            </div>
        );
    }
}
export default LichHenScreen;
