import { Col, Row } from 'antd';
import { Component, ReactNode } from 'react';

class OverView extends Component {
    render(): ReactNode {
        return (
            <div className="mt-3 w-100">
                <Row gutter={32} style={{ height: '120px' }}>
                    <Col span={6}>
                        <div>Column</div>
                    </Col>
                    <Col span={6}>
                        <div>Column</div>
                    </Col>
                    <Col span={6}>
                        <div>Column</div>
                    </Col>
                    <Col span={6}>
                        <div>Column</div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default OverView;
