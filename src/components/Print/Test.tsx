import React from 'react';
import { useState, useRef, forwardRef, ReactNode, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

export default class Resume extends React.PureComponent {
    render() {
        return <h1>My cool content here!</h1>;
    }
}

export const Resume2 = forwardRef(function Resume2({ content, hoadon }: any, ref: any) {
    const [contentData, setContentData] = useState('');
    const [hdPrint, setHDPrint] = useState();

    useEffect(() => {
        if (content) {
            let html = content;
            html = ReplaceHoaDon(html);
            setContentData(html);
            setHDPrint(hoadon);
        }
    }, [content]);

    const ReplaceHoaDon = (str: string) => {
        str = str.replace('{MaHoaDon}', '{hdPrint.MaHoaDon}');

        return str;
    };
    const ReplaceHoaDonChiTiet = (str: string) => {
        str = str.replace('{TenHangHoa}', 'ct.TenHangHoa');
        return str;
    };

    return (
        <div ref={ref}>
            <div dangerouslySetInnerHTML={{ __html: contentData }} />
        </div>
    );
});
