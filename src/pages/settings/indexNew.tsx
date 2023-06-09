import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StoreDetail from './cua-hang/index';
import ChiNhanhScreen from './chi-nhanh/index';
import CaiDatHoaHongScreen from './hoa-hong-nhan-vien';
const SettingsNew: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);
    const handleTabChange = (event: any, newValue: number) => {
        setActiveTab(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };
    const HoaHong = () => <div>Mẫu hóa đơn</div>;
    const ThanhToan = () => <div>Thanh toasn</div>;
    const Booking = () => <div>Booking</div>;
    const [selectedTab, setSelectedTab] = useState('Chi tiết cửa hàng');

    const handleTabClick = (tab: string) => {
        setSelectedTab(tab);
    };
    return (
        <>
            <Box padding="22px 2.2222222222222223vw">
                <Typography variant="h1" fontWeight="700" fontSize="16px" sx={{ marginTop: '4px' }}>
                    {selectedTab}
                </Typography>
                <Grid container spacing={3} mt={0}>
                    <Grid item xs={3}>
                        <Box
                            sx={{
                                width: '100%',

                                bgcolor: '#fff',
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                padding: '24px 15px',
                                borderRadius: '8px'
                            }}>
                            <Typography
                                variant="h3"
                                fontWeight="700"
                                color="#333233"
                                fontSize="16px">
                                Cài đặt chung
                            </Typography>

                            <Box
                                sx={{
                                    width: '100%'
                                }}>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    aria-label="Vertical tabs "
                                    sx={{
                                        '& button': {
                                            textTransform: 'unset!important',
                                            textAlign: 'left!important',
                                            padding: '8px 8px!important',
                                            minHeight: '36px',
                                            alignItems: 'start',
                                            color: '#4C4B4C!important',
                                            fontWeight: '400',
                                            borderRadius: '4px'
                                        },
                                        '& button.Mui-selected': {
                                            backgroundColor: '#F2EBF0'
                                        },
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: '#7C3367',
                                            display: 'none'
                                        }
                                    }}>
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color="#333233"
                                        fontSize="16px"
                                        marginTop="21px"
                                        mb="6px">
                                        Cài đặt cửa hàng
                                    </Typography>
                                    <Tab
                                        label="Chi tiết cửa hàng"
                                        onClick={() => handleTabClick('Chi tiết cửa hàng')}
                                    />

                                    <Tab
                                        label="Quản lý chi nhánh"
                                        onClick={() => handleTabClick('Quản lý chi nhánh')}
                                    />
                                    <Tab
                                        label="Cài đặt booking"
                                        onClick={() => handleTabClick('Cài đặt booking')}
                                    />
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color="#333233"
                                        fontSize="16px"
                                        marginTop="21px"
                                        mb="6px">
                                        Cài đặt nhân viên
                                    </Typography>
                                    <Tab
                                        label="Hoa hồng nhân viên"
                                        onClick={() => handleTabClick('Hoa hồng nhân viên')}
                                    />
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color="#333233"
                                        fontSize="16px"
                                        marginTop="21px"
                                        mb="6px">
                                        Bán hàng
                                    </Typography>
                                    <Tab
                                        label="Phương thức thanh toán"
                                        onClick={() => handleTabClick('Phương thức thanh toán')}
                                    />
                                    <Tab
                                        label="Mẫu hóa đơn"
                                        onClick={() => handleTabClick('Mẫu hóa đơn')}
                                    />
                                </Tabs>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={9}
                        sx={{
                            '& [role="tabpanel"] > .MuiBox-root': {
                                padding: 0
                            }
                        }}>
                        <TabPanel value={activeTab} index={1}>
                            <StoreDetail />
                        </TabPanel>
                        <TabPanel value={activeTab} index={2}>
                            <ChiNhanhScreen />
                        </TabPanel>
                        <TabPanel value={activeTab} index={3}>
                            <Booking />
                        </TabPanel>
                        <TabPanel value={activeTab} index={5}>
                            <CaiDatHoaHongScreen />
                        </TabPanel>
                        <TabPanel value={activeTab} index={7}>
                            <ThanhToan />
                        </TabPanel>
                        <TabPanel value={activeTab} index={8}>
                            <HoaHong />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default SettingsNew;
