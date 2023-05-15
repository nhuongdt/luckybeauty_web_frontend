import { Card, Col, Divider, Row } from 'antd';
import { Component, ReactNode } from 'react';
// import LineChart from '../Charts/lineChart';
import '../../dashboardCss.css';
import { AiOutlineClockCircle } from 'react-icons/ai';
class Appointment extends Component {
    render(): ReactNode {
        return (
            <div className="container mt-5">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                            style={{ height: '336px' }}
                            title={
                                <div className="card-title" style={{ height: 48 }}>
                                    <div className="appointment-title">
                                        Danh sách cuộc hẹn hôm nay
                                    </div>
                                    <div className="appointment-sub-title">Cuộc hẹn mới nhất</div>
                                </div>
                            }>
                            <div className="appointment-content text-left">
                                <img className="avatar" src="path/to/avatar.png" alt="Avatar" />
                                <div>
                                    <p className="text appointment-customer">Vũ ngọc anh</p>
                                    <p className="text appointment-time">
                                        <AiOutlineClockCircle
                                            style={{
                                                width: '15px',
                                                height: '15px',
                                                marginRight: '5px',
                                                alignContent: 'center'
                                            }}
                                        />
                                        9h30 - 12h30
                                    </p>
                                    <p className="text appointment-service">Uốn nhuộm</p>
                                </div>
                                <div className="right-text">
                                    <p className="appointment-status-wait text-center">Đang chờ</p>
                                    <p className="appointment-price text-center">1000000</p>
                                </div>
                            </div>
                            <Divider />
                            <div className="appointment-content text-left">
                                <img className="avatar" src="path/to/avatar.png" alt="Avatar" />
                                <div>
                                    <p className="text appointment-customer">Vũ ngọc anh</p>
                                    <p className="text appointment-time">
                                        <AiOutlineClockCircle
                                            style={{
                                                width: '15px',
                                                height: '15px',
                                                marginRight: '5px',
                                                alignContent: 'center'
                                            }}
                                        />
                                        9h30 - 12h30
                                    </p>
                                    <p className="text appointment-service">Uốn nhuộm</p>
                                </div>
                                <div className="right-text">
                                    <p className="appointment-status-wait text-center">Đang chờ</p>
                                    <p className="appointment-price text-center">1000000</p>
                                </div>
                            </div>
                            <Divider />
                            <div className="appointment-content text-left">
                                <img className="avatar" src="path/to/avatar.png" alt="Avatar" />
                                <div>
                                    <p className="text appointment-customer">Vũ ngọc anh</p>
                                    <p className="text appointment-time">
                                        <AiOutlineClockCircle
                                            style={{
                                                width: '15px',
                                                height: '15px',
                                                marginRight: '5px',
                                                alignContent: 'center'
                                            }}
                                        />
                                        9h30 - 12h30
                                    </p>
                                    <p className="text appointment-service">Uốn nhuộm</p>
                                </div>
                                <div className="right-text">
                                    <p className="appointment-status-wait text-center">Đang chờ</p>
                                    <p className="appointment-price text-center">1000000</p>
                                </div>
                            </div>
                            <Divider />
                        </Card>
                    </Col>
                    <Col span={12}>{/* <LineChart /> */}</Col>
                </Row>
            </div>
        );
    }
}
export default Appointment;
