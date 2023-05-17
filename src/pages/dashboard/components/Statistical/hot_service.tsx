import { Button, Progress } from 'antd';
import { Component, ReactNode } from 'react';
import { AiOutlineEllipsis } from 'react-icons/ai';

class HotServices extends Component {
    render(): ReactNode {
        return (
            <div style={{ margin: '24px 12px 12px 0px', height: '360px' }}>
                <div className="row" style={{ height: '60px' }}>
                    <div className="col-10">
                        <span style={{ float: 'left' }} className="appointment-title">
                            Top 5 dịch vụ hot
                        </span>
                    </div>
                    <div className="col-2">
                        <Button
                            icon={<AiOutlineEllipsis />}
                            size="small"
                            className="btn btn-more-horizontal"
                            onClick={() => {
                                console.log('ok');
                            }}></Button>
                    </div>
                </div>
                <div>
                    <div style={{ height: 60 }}>
                        <div className="row">
                            <div className="col appointment-sub-title">Dịch vụ 1</div>
                            <div className="col appointment-sub-title">
                                <span style={{ float: 'right', color: '#FFC700' }}>65000000</span>
                            </div>
                        </div>
                        <Progress percent={70} strokeColor="#FFC700" showInfo={false} />
                    </div>
                    <div style={{ height: 60 }}>
                        <div className="row">
                            <div className="col appointment-sub-title">Dịch vụ 2</div>
                            <div className="col appointment-sub-title">
                                <span style={{ float: 'right', color: '#7C3367' }}>12000000</span>
                            </div>
                        </div>
                        <Progress percent={53} strokeColor="#7C3367" showInfo={false} />
                    </div>
                    <div style={{ height: 60 }}>
                        <div className="row">
                            <div className="col appointment-sub-title">Dịch vụ 3</div>
                            <div className="col">
                                <span
                                    style={{ float: 'right', color: '#009EF7' }}
                                    className="appointment-sub-title">
                                    12000000
                                </span>
                            </div>
                        </div>
                        <Progress percent={80} strokeColor="#009EF7" showInfo={false} />
                    </div>
                    <div style={{ height: 60 }}>
                        <div className="row">
                            <div className="col appointment-sub-title">Dịch vụ 4</div>
                            <div className="col">
                                <span
                                    style={{ float: 'right', color: '#F1416C' }}
                                    className="appointment-sub-title">
                                    1200000
                                </span>
                            </div>
                        </div>
                        <Progress percent={18} strokeColor="#F1416C" showInfo={false} />
                    </div>
                    <div style={{ height: 60 }}>
                        <div className="row">
                            <div className="col appointment-sub-title">Dịch vụ 5</div>
                            <div className="col">
                                <span
                                    style={{ float: 'right', color: '#50CD89' }}
                                    className="appointment-sub-title">
                                    100000
                                </span>
                            </div>
                        </div>
                        <Progress percent={15} strokeColor="#50CD89" showInfo={false} />
                    </div>
                </div>
            </div>
        );
    }
}
export default HotServices;
