import { Avatar, Badge, Col, Dropdown, Layout, Menu, Row } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    HomeOutlined
} from '@ant-design/icons';
import './header.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
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
        <Layout.Header className="header">
            <Row className={'header-container'}>
                <Col style={{ textAlign: 'left' }} span={12}>
                    {collapsed ? (
                        <MenuUnfoldOutlined className="trigger" onClick={toggle} />
                    ) : (
                        <MenuFoldOutlined className="trigger" onClick={toggle} />
                    )}
                </Col>
                <Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }} span={12}>
                    <Badge>
                        <HomeOutlined
                            sizes={'36px'}
                            style={{
                                fontSize: '16px',
                                padding: '0px 15px 0px 15px'
                            }}></HomeOutlined>
                    </Badge>
                    <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                        <Badge style={{}} count={3}>
                            <Avatar
                                style={{ height: 36, width: 36 }}
                                shape="circle"
                                alt={'profile'}
                            />
                        </Badge>
                    </Dropdown>
                </Col>
            </Row>
        </Layout.Header>
    );
};
export default Header;
