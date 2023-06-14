import React from 'react';
import { useState, forwardRef, useEffect } from 'react';
import parse, {
    domToReact,
    attributesToProps,
    htmlToDOM,
    HTMLReactParserOptions,
    Element
} from 'html-react-parser';
import { CommentSharp } from '@mui/icons-material';

export const ComponentToPrint = forwardRef(function ComponentToPrint({ props }: any, ref: any) {
    const [contentHtml, setContentHtml] = useState('');
    // const [hdPrint, setHdPrint] = useState('');
    // const [cthdPrint, setCthdPrint] = useState('');

    const [arrPropCTHD, setArrPropCTHD] = useState<string[]>([]);

    useEffect(() => {
        if (props?.hoadonChiTiet.length > 0) {
            // get all properties of hoadonchitiet
            setArrPropCTHD(Object.getOwnPropertyNames(props?.hoadonChiTiet[0]));
        }
        let html = props?.contentHtml;
        html = ReplaceHoaDon(html);
        html = ReplaceHoaDonChiTiet(html);
        setContentHtml(html);
        console.log('parserA2 ', props?.hoadonChiTiet);
    }, [props?.contentHtml]);

    const parserA = (input: string) =>
        parse(input, {
            replace: (domNode) => {
                if (domNode instanceof Element && domNode.attribs.id === 'tblHangHoa') {
                    return (
                        <tbody>
                            {props?.hoadonChiTiet.map((ct: any, index: any) => (
                                <>
                                    <tr></tr>
                                </>
                            ))}
                        </tbody>
                    );
                }
            }
        });

    const options = {
        replace: ({ attribs, children }: any) => {
            if (!attribs) {
                return;
            }

            if (attribs.id === 'tblHangHoa') {
                console.log('options ', document.getElementById('tblHangHoa')?.innerHTML);
                return (
                    <tbody>
                        {props?.hoadonChiTiet.map((ct: any, index: any) => {
                            document
                                .getElementById('tblHangHoa')
                                ?.innerHTML?.replace('{TenHangHoa}', `${ct.tenHangHoa}`)
                                .replace('{GiaBan}', `${ct.giaBan}`) ?? '';
                        })}
                    </tbody>
                );
            }
        }
    };

    const ReplaceHoaDon = (str: string) => {
        str = str.replace('{MaHoaDon}', `${props?.hoadon.tongTienHang}`);
        str = str.replace('{TenKhachHang}', `${props?.khachhang?.tenKhachHang}`);
        return str;
    };
    const ReplaceHoaDonChiTiet = (str: string) => {
        str = str.replace('{TenHangHoa}', '{ct.tenHangHoa}');
        // for (let i = 0; i < props?.hoadonChiTiet.length; i++) {
        //     const ct = props?.hoadonChiTiet[i];
        //     if (i > 0) {
        //         str = str.concat(`${ct.tenHangHoa}`);
        //     } else {
        //         str = str.replace('{TenHangHoa}', `${ct.tenHangHoa}`);
        //     }
        //  }

        return str;
    };

    return (
        <>
            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
            {/* <div ref={ref}>{parse(`${contentHtml}`)}</div> */}
            {/* <div ref={ref}>{parse(contentHtml, options)}</div> */}
            <div ref={ref}>{parserA(contentHtml)}</div>
        </>
    );
});
