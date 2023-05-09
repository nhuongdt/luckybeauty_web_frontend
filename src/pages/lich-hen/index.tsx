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
import interactionPlugin from '@fullcalendar/interaction';
import '../../custom.css';
import '../lich-hen/calendar.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CreateOrUpdateAppointment from './components/create-or-update-lich-hen';
class LichHenScreen extends Component {
    formRef = React.createRef<FormInstance>();
    calendarRef: RefObject<FullCalendar> = React.createRef();
    state = {
        initialView: 'timeGridWeek',
        viewDate: format(new Date(), 'EEEE, dd MMMM ,yyyy', { locale: vi }),
        modalVisible: false
    };
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
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                        events={[
                            {
                                title: 'event2',
                                start: '2023-05-08 08:00:00',
                                end: '2023-05-08 10:30:00',
                                color: '#F1FAFF',
                                textColor: '#009EF7',
                                borderColor: '#009EF7'
                            },
                            {
                                title: 'event3',
                                start: '2023-05-07 12:00:00',
                                end: '2023-05-07 14:30:00',
                                color: '#F1FAFF',
                                textColor: '#FFC700',
                                borderColor: '#FFC700'
                            },
                            {
                                title: 'event4',
                                start: '2023-05-07 12:00:00',
                                end: '2023-05-07 14:30:00',
                                color: '#F1FAFF',
                                textColor: '#F1416C',
                                borderColor: '#F1416C'
                            },
                            {
                                title: 'event4',
                                start: '2023-05-07 10:00:00',
                                end: '2023-05-07 12:30:00',
                                color: '#F1FAFF',
                                textColor: '#F1416C',
                                borderColor: '#F1416C'
                            },
                            {
                                title: 'event4',
                                start: '2023-05-07 10:00:00',
                                end: '2023-05-07 12:30:00',
                                color: '#F1FAFF',
                                textColor: '#F1416C',
                                borderColor: '#F1416C'
                            }
                        ]}
                    />
                </div>
                <CreateOrUpdateAppointment
                    visible={this.state.modalVisible}
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }}
                    onOk={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }}
                    modalType="Thêm cuộc hẹn"
                    formRef={this.formRef}
                />
            </div>
        );
    }
}
export default LichHenScreen;
