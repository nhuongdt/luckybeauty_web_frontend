import { Button, Divider, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import DatePickerCustom from '../../components/DatetimePicker/DatePickerCustom';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FC, useEffect, useState } from 'react';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import TabChiTietHoaDon from './tab_chi_tiet_hoa_don';
import TabThongTinHoaDon from './tab_thong_tin_hoa_don';

enum DetailGDV_tabList {
    CHI_TIET_HOA_DON = 1,
    NHAT_KY_THANH_TOAN = 2,
    NHAT_KY_SU_DUNG = 3
}

const PageDetailGDV: FC<{ itemHD: PageHoaDonDto | null; gotoBack: () => void }> = ({ itemHD, gotoBack }) => {
    const [tabActive, setTabActive] = useState(DetailGDV_tabList.CHI_TIET_HOA_DON);
    return (
        <Grid container paddingTop={2}>
            <Grid item lg={12} xs={12}>
                <Grid container spacing={2}>
                    <Grid item lg={4} md={5} sm={6} xs={12}>
                        <TabThongTinHoaDon itemHD={itemHD} />
                    </Grid>
                    <Grid item lg={8} md={7} sm={6} xs={12}>
                        <Stack
                            className="page-full"
                            border={'1px solid #ccc'}
                            borderRadius={'4px'}
                            zIndex={5}
                            overflow={'auto'}>
                            <Stack direction={'row'} justifyContent={'space-between'} padding={1}>
                                <Tabs value={tabActive}>
                                    <Tab label="Chi tiết hóa đơn" value={DetailGDV_tabList.CHI_TIET_HOA_DON}></Tab>
                                    <Tab label="Nhật ký thanh toán" value={DetailGDV_tabList.NHAT_KY_THANH_TOAN}></Tab>
                                    <Tab label="Nhật ký sử dụng" value={DetailGDV_tabList.NHAT_KY_SU_DUNG}></Tab>
                                </Tabs>
                                <Stack>
                                    <Button
                                        variant="outlined"
                                        startIcon={<KeyboardDoubleArrowLeftIcon />}
                                        onClick={gotoBack}>
                                        Quay trở lại
                                    </Button>
                                </Stack>
                            </Stack>

                            <TabPanel
                                value={DetailGDV_tabList.CHI_TIET_HOA_DON}
                                index={tabActive}
                                style={{ paddingLeft: '8px', paddingRight: '8px', marginTop: '8px' }}>
                                <TabChiTietHoaDon idHoaDon={itemHD?.id ?? ''} />
                            </TabPanel>
                        </Stack>

                        {/* <TabPanel value={DetailGDV_tabList.NHAT_KY_THANH_TOAN} index={tabActive}>
                            nhat kys thanh toan
                        </TabPanel> */}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default PageDetailGDV;
