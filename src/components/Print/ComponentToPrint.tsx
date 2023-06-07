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

    const ReplaceHoaDonChiTiet = (str: string) => {
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
                <div className={isShow ? 'show ' : ''}>
                    <ContenPrint child={contentData} />
                </div>
            </PrintContext.Provider>
        </>
    );
};
