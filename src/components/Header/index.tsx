import { Avatar, Badge, Col, Dropdown, Layout, Menu, Row, Space, Typography } from 'antd';
import avatar from '../../images/user.png';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    HomeOutlined,
    DownOutlined,
    BellOutlined,
    MessageOutlined
} from '@ant-design/icons';
import './header.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MessageIcon from '../../images/message-question.svg';
import NotificationIcon from '../../images/notification.svg';
const userDropdownMenu = (
    <Menu>
        <Menu.Item key="2">
            <Link to="/logout">
                <LogoutOutlined />
                <span> Logout </span>
            </Link>
        </Menu.Item>
    </Menu>
);
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
}
const Header: React.FC<HeaderProps> = ({ collapsed, toggle }) => {
    return (
        <Layout.Header
            className="header"
            // style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        >
            {' '}
            <Row className={'header-container'}>
                <Col style={{ textAlign: 'left' }} span={12}></Col>
                <Col style={{ textAlign: 'right' }} span={6} offset={6}>
                    <Space>
                        <Badge size="small" style={{ margin: '0px 8px 0px 8px' }}>
                            <button>
                                <img src={MessageIcon} alt="Message" />
                            </button>
                        </Badge>
                        <Badge style={{ margin: '0px 8px 0px 8px' }} color="error">
                            <button>
                                <img src={NotificationIcon} alt="notification" />
                            </button>
                        </Badge>
                        <div style={{ marginLeft: '32px', marginRight: 8 }}>
                            <div className="store-name">Nail Spa</div>
                            <div className="branch-name">Hà nội</div>
                        </div>
                        <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                            <Avatar
                                style={{ height: 36, width: 36 }}
                                shape="circle"
                                alt={'profile'}
                                src={avatar}>
                                <DownOutlined style={{ color: '#666466' }} />
                            </Avatar>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </Layout.Header>
    );
};
export default Header;
