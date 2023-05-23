import * as React from 'react';

export const InHoaDon = ({ content, hoadon, ctHoaDon }: any) => {
    React.useEffect(() => {
        let contentHtml = content;
        contentHtml = ReplaceHoaDon(contentHtml);
        Print(contentHtml);
    }, [content]);

    const ReplaceHoaDon = (str: string) => {
        str = str.replace('{MaHoaDon}', `${hoadon.maHoaDon}`);
        return str;
    };

    const Print = (contentHtml: string) => {
        const newIframe = document.createElement('iframe');
        newIframe.height = '0';
        newIframe.src = 'about:blank';
        document.body.appendChild(newIframe);
        newIframe.src = 'javascript:window["contents"]';
        newIframe.focus();
        const pri = newIframe.contentWindow;
        pri?.document.open();
        pri?.document.write(contentHtml);
        pri?.document.close();

        pri?.focus();
        pri?.print();
    };

    return <></>;
};
