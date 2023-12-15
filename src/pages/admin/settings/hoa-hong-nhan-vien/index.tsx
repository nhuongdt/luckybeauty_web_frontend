import { Component, ReactNode, useState, useEffect } from 'react';
import ChietKhauDichVuScreen from '../hoa-hong-nhan-vien/chiet-khau-dich-vu/index';
import { Box, Grid } from '@mui/material';
import ChietKhauHoaDonScreen from '../hoa-hong-nhan-vien/chiet-khau-hoa-don/index';
import chietKhauDichVuStore from '../../../../stores/chietKhauDichVuStore';
import { observer } from 'mobx-react';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import PageSetupHoaHongDichVu from './chiet-khau-dich-vu/page_setup_hoa_hong_dich_vu';

export default function CaiDatHoaHongScreen() {
    return <PageSetupHoaHongDichVu />;
}
// export default observer(CaiDatHoaHongScreen);
