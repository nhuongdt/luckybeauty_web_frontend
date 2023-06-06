import React from 'react';
import { useState, forwardRef, createContext } from 'react';
import { PropToChildMauIn } from '../../utils/PropParentToChild';
const PrintContext = createContext(null);

// export const ComponentToPrint = forwardRef(function ComponentToPrint({ props, ref }: any) {
//     return <div ref={ref} dangerouslySetInnerHTML={{ __html: ref }}></div>;
// });

export const ContenPrint = ({ child }: any) => {
    return <>{child}</>;
};

export const ComponentToPrint = ({ props }: any) => {
    const [isShow, setIsShow] = useState(false);
    const [propMauIn, setPropMauIn] = useState(null);
    const [contentData, setContentData] = React.useState();

    React.useEffect(() => {
        if (props.contentHtml) {
            let contentHtml = props.contentHtml;
            // contentHtml = ReplaceHoaDon(contentHtml);
            // contentHtml = ReplaceKhachHang(contentHtml);
            contentHtml = ReplaceHoaDonChiTiet(contentHtml);
            setContentData(contentHtml);
            setIsShow(true);
        }
    }, [props.contentHtml]);
    // const [propMauIn, setPropMauIn] = useState<PropToChildMauIn>(
    //     new PropToChildMauIn({ contentHtml: '' })
    // );

    // const [contentData, setContentData] = React.useState();
    const ReplaceHoaDonChiTiet = (str: string) => {
        // str = str.replace('{TenHangHoa}', `${props.hoadonChiTiet[0].tenHangHoa}`);
        // str = str.replace('{SoLuong}', `${props.hoadonChiTiet[0].soLuong}`);
        // str = str.replace('{GiaBan}', `${utils.formatNumber(props.hoadonChiTiet[0].giaBan)}`);
        // str = str.replace(
        //     '{ThanhTien}',
        //     `${utils.formatNumber(props.hoadonChiTiet[0].thanhTienSauCK)}`
        // );
        // return str;
        str = str.replace('{TenHangHoa}', '{ct.tenHangHoa}');
        str = str.replace('{SoLuong}', '{ct.soLuong}');
        str = str.replace('{GiaBan}', '{ct.giaBan}');
        str = str.replace('{ThanhTien}', '{ct.thanhTien}');
        return str;
    };

    return (
        <>
            <PrintContext.Provider value={propMauIn}>
                <div className={isShow ? 'show overlay' : 'overlay'}></div>
                <ContenPrint />
            </PrintContext.Provider>
        </>
    );
};
