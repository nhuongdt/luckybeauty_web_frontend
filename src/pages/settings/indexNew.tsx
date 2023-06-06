import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StoreDetail from './cua-hang/indexNew';
import ChiNhanhScreen from './chi-nhanh/indexNew';
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

    return (
        <>
            <Box padding="22px 2.2222222222222223vw">
                <Box display="flex" alignItems="center">
                    <Typography variant="body1" fontSize="14px" color="#999699">
                        Cài đặt
                    </Typography>
                    <ArrowForwardIosIcon
                        fontSize="small"
                        sx={{
                            width: '12px',
                            height: '12px'
                        }}
                    />
                    <Typography
                        variant="body1"
                        fontSize="14px"
                        color="#333233"
                        sx={{ marginTop: '4px' }}>
                        Cài đặt cửa hàng
                    </Typography>
                </Box>
                <Typography variant="h1" fontWeight="700" fontSize="24px" sx={{ marginTop: '4px' }}>
                    Chi tiết cửa hàng
                </Typography>
                <Grid container spacing={3}>
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
                                            backgroundColor: '#7C3367'
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
                                    <Tab label="Chi tiết cửa hàng" />

                                    <Tab label="Quản lý chi nhánh" />
                                    <Tab label="Cài đặt booking" />
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color="#333233"
                                        fontSize="16px"
                                        marginTop="21px"
                                        mb="6px">
                                        Cài đặt nhân viên
                                    </Typography>
                                    <Tab label="Hoa hồng nhân viên" />
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color="#333233"
                                        fontSize="16px"
                                        marginTop="21px"
                                        mb="6px">
                                        Bán hàng
                                    </Typography>
                                    <Tab label="Phương thức thanh toán" />
                                    <Tab label="Mẫu hóa đơn" />
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
