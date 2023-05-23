import { useState } from 'react';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';

export default function PrintDocument({ content }: any) {
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ maKhachHang: '' }));
    const [hoadonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);

    // replace content
    content = content.replace('{MaHoaDon}', '{hoadon.MaHoaDon}');

    return <>{content}</>;
}
