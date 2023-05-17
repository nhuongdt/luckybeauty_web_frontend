import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Progress, Row, Select, Space } from 'antd';
import { Component, ReactNode } from 'react';
import { AiOutlineEllipsis } from 'react-icons/ai';
import '../../custom.css';
import OverView from './components/OverView/ovver-view';
import Appointment from './components/Appointment/appointments';
import RevenueColumnChart from './components/Charts/colunmChart';
import Statistical from './components/Statistical/statistical';
class DashboardScreen extends Component {
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
                                                Trang chủ
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <div>
                                    <h3>Tổng quan</h3>
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
                                            console.log('ok');
                                        }}>
                                        Thêm
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-body mt-2">
                    <OverView />
                    <Appointment />
                    <Statistical />
                </div>
            </div>
        );
    }
}
export default DashboardScreen;
