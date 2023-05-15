import React from 'react';
import OverViewNew from './components/OverView/overViewNew';
import addIcon from '../../images/add.svg';
import dotsIcon from '../../images/Color.svg';
import './dashboardNew.css';
import AppoimentsNew from './components/Appointment/AppointmentsNew';
import LineChartNew from './components/Charts/LineChartNew';

const Dashboard: React.FC = () => {
    return (
        <div>
            <div className="page-header-dashboard">
                <div className="page-header_col-1">
                    <div className="breadcrumb">Trang chủ</div>
                    <div className="overview-title">Tổng quan</div>
                </div>
                <div className="page-header_col-2">
                    <button className="btn-dots-add">
                        <img src={dotsIcon} alt="dot" />
                    </button>
                    <button className="btn-add">
                        <span className="btn-add_icon">
                            <img src={addIcon} alt="add" />
                        </span>
                        <span className="btn-add-text">Thêm</span>
                    </button>
                </div>
            </div>
            <div className="page-body">
                <div className="page-body_row-1">
                    <OverViewNew />
                </div>
                <div className="page-body_row-2">
                    <div className="page-body_row-2_col-1">
                        <AppoimentsNew />
                    </div>
                    <div className="page-body_row-2_col-2">
                        <h3>Tổng số cuộc hẹn hàng tuần</h3>
                        <LineChartNew />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
