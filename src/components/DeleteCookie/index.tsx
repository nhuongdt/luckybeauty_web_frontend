import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const DeleteExpiredCookie: React.FC = () => {
    useEffect(() => {
        const intervalId = setInterval(() => {
            const cookies = Cookies.get(); // Lấy danh sách các cookie hiện có
            const currentTime = new Date().getTime();

            for (const cookie in cookies) {
                const cookieValue = cookies[cookie];
                const expires = parseInt(cookieValue.split(';')[1]?.trim()?.split('=')[1]);

                if ((expires && expires < currentTime) || cookieValue == undefined) {
                    Cookies.remove(cookie); // Xóa cookie khi nó hết hạn
                }
            }
        }, 1000); // Kiểm tra mỗi giây

        return () => clearInterval(intervalId); // Xóa interval khi component unmount
    }, []);

    return null; // Component này không render gì
};

export default DeleteExpiredCookie;
