import { Button, Col, Progress, Row, Select } from 'antd';
import { Component, ReactNode } from 'react';
import RevenueColumnChart from '../Charts/colunmChart';
import { AiOutlineEllipsis } from 'react-icons/ai';
import HotServices from './hot_service';

class Statistical extends Component {
    render(): ReactNode {
        return (
            <Row>
                <Col span={18}>
                    <div style={{ margin: '24px 12px 12px 12px', height: '360px' }}>
                        <div className="row" style={{ height: '60px' }}>
                            <div className="col" style={{ alignContent: 'center' }}>
                                <div className="appointment-title">Doanh thu</div>
                                <div className="appointment-sub-title">Doanh thu của hàng</div>
                            </div>
                            <div className="col" style={{ alignContent: 'center' }}>
                                <Select
                                    showSearch
                                    style={{
                                        width: 108,
                                        float: 'right',
                                        background: '#F2F2F2',
                                        borderRadius: 4,
                                        border: '1px solid #7C3367'
                                    }}
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').includes(input)
                                    }
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '1',
                                            label: 'Tháng này'
                                        },
                                        {
                                            value: '2',
                                            label: 'Tháng trước'
                                        }
                                    ]}
                                />
                            </div>
                        </div>

                        <RevenueColumnChart />
                    </div>
                </Col>
                <Col span={6}>
                    <HotServices />
                </Col>
            </Row>
        );
    }
}
export default Statistical;
