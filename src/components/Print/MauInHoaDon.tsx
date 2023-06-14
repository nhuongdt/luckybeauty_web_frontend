import { useEffect, useState } from 'react';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';

export default function MauInHoaDon({ props }: any) {
    const [cthdPrint, setcthdPrint] = useState<PageHoaDonChiTietDto[]>([]);
    useEffect(() => {
        setcthdPrint((old) => {
            return {
                ...old
            };
        });
    }, [props]);
    return <></>;
}
