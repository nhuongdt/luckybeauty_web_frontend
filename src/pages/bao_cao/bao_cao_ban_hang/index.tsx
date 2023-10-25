import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import BaoCaoBanHangChiTietPage from './bao_cao_ban_hang_chi_tiet/index';
import BaoCaoBanHangTongHopPage from './bao_cao_ban_hang_tong_hop/index';
import { useState } from 'react';

const BAN_HANG_CHI_TIET = 2;
const BAN_HANG_TONG_HOP = 1;
const BaoCaoBanHangPage = () => {
    const [tabIndex, setTabIndex] = useState<number>(BAN_HANG_TONG_HOP);
    const handleChangeTab = (tabIndex: number) => {
        setTabIndex(tabIndex);
    };
    return (
        <Box>
            {tabIndex === BAN_HANG_CHI_TIET ? (
                <BaoCaoBanHangChiTietPage handleChangeTab={handleChangeTab} />
            ) : (
                <BaoCaoBanHangTongHopPage handleChangeTab={handleChangeTab} />
            )}
        </Box>
    );
};
export default observer(BaoCaoBanHangPage);
