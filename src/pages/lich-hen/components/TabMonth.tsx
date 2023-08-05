import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Modal
} from '@mui/material';
import { startOfMonth, endOfMonth, format, eachWeekOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookingGetAllItemDto } from '../../../services/dat-lich/dto/BookingGetAllItemDto';
import { observer } from 'mobx-react';
import bookingStore from '../../../stores/bookingStore';

const TabMonth: React.FC<{ dateQuery: Date; data: BookingGetAllItemDto[] }> = ({
    data,
    dateQuery
}) => {
    const startDate = startOfMonth(dateQuery);
    const endDate = endOfMonth(dateQuery);
    const weeksInMonth = eachWeekOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    React.useEffect(() => {
        const HTML = document.documentElement;
        HTML.style.overflowY = 'hidden';

        return () => {
            HTML.style.overflowY = 'auto';
        };
    }, []);

    const [windowHeight, setWindowHeight] = React.useState(innerHeight);

    React.useEffect(() => {
        const handleResize = () => {
            setWindowHeight(innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // State để lưu trạng thái hiển thị tất cả các items cho mỗi ngày
    const [showAllItemsForDate, setShowAllItemsForDate] = useState<{ [key: string]: boolean }>({});

    // State để lưu các item hiển thị trong modal
    const [selectedDateItems, setSelectedDateItems] = useState<BookingGetAllItemDto[]>([]);
    // State để lưu vị trí hiển thị của modal
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
    // Hàm xử lý sự kiện khi nhấn vào nút "Hiển thị tất cả" trong mỗi TableCell
    const handleShowMoreClick = (currentDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
        const matchingData = data.filter(
            (item) =>
                format(new Date(item.bookingDate), 'iiii, dd/MM/yyyy', { locale: vi }) ===
                format(currentDate, 'iiii, dd/MM/yyyy', { locale: vi })
        );

        setSelectedDateItems(matchingData);
        // setShowAllItemsForDate((prev) => ({
        //     ...prev,
        //     [currentDate.toISOString()]: true
        // }));

        // // Xác định vị trí của ô được nhấn "Hiển thị tất cả"
        // const target = event.currentTarget as HTMLElement;
        // const targetRect = target.getBoundingClientRect();

        // // Tính toán vị trí dự kiến của modal dựa trên vị trí của ô được nhấn
        // const expectedPosition: { top: number; left: number } = {
        //     top: targetRect.top + window.scrollY + targetRect.height + 10, // 10 là khoảng cách giữa ô và modal
        //     left: targetRect.left + window.scrollX
        // };

        // // Lấy kích thước của modal
        // const modalWidth = 300; // Đặt kích thước modal theo ý muốn
        // const modalHeight = selectedDateItems.length * 50; // Giả sử mỗi item có chiều cao 50px

        // // Kiểm tra xem modal có xuất hiện bên phải hoặc bên trái của ô được nhấn
        // if (expectedPosition.left + modalWidth > window.innerWidth) {
        //     expectedPosition.left = targetRect.left + window.scrollX - modalWidth - 10; // 10 là khoảng cách giữa ô và modal
        // }

        // // Kiểm tra xem modal có xuất hiện bên dưới hoặc bên trên của ô được nhấn
        // if (expectedPosition.top + modalHeight > window.innerHeight) {
        //     expectedPosition.top = targetRect.top + window.scrollY - modalHeight - 10; // 10 là khoảng cách giữa ô và modal
        // }

        // // Đặt vị trí của modal
        // setModalPosition(expectedPosition);
    };

    // Hàm xử lý sự kiện khi đóng modal
    const handleCloseModal = () => {
        setSelectedDateItems([]);
    };

    return (
        <TableContainer
            sx={{
                bgcolor: '#fff',
                //padding: '24px',
                borderRadius: '8px',
                maxHeight: windowHeight > 768 ? '70vh' : '64vh',
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px'
                },
                '&::-webkit-scrollbar-track': {
                    borderRadius: '16px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(124, 51, 103, 0.2)',
                    borderRadius: '8px'
                }
            }}>
            <Table>
                <TableHead
                    sx={{
                        bgcolor: '#F2F2F2',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        zIndex: '5'
                    }}>
                    <TableRow>
                        {weekDays.map((day) => (
                            <TableCell key={day} sx={{ border: '0', textAlign: 'center' }}>
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeksInMonth.map((weekStartDate) => (
                        <TableRow key={weekStartDate.getTime()} sx={{ padding: '4px 12px' }}>
                            {weekDays.map((ngay: string, index: number) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + index + 1);

                                const matchingData = data.filter(
                                    (item) =>
                                        item.dayOfWeek === ngay &&
                                        format(new Date(item.bookingDate), 'iiii, dd/MM/yyyy', {
                                            locale: vi
                                        }) ===
                                            format(currentDate, 'iiii, dd/MM/yyyy', { locale: vi })
                                );

                                // Giới hạn số item hiển thị
                                const limitedMatchingData = showAllItemsForDate[
                                    currentDate.toISOString()
                                ]
                                    ? matchingData
                                    : matchingData.slice(0, 4);

                                return (
                                    <TableCell
                                        key={currentDate.getTime()}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            position: 'relative',
                                            height: '150px',
                                            overflow: 'hidden',
                                            width: 1 / weekDays.length
                                        }}>
                                        <Box
                                            sx={{
                                                fontSize: '14px',
                                                color: '#4C4B4C',
                                                height: '100%',
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'end',
                                                pointerEvents: 'none',
                                                padding: '8px',
                                                bgcolor: '#fff',
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                zIndex: '2'
                                            }}>
                                            {format(currentDate, 'd')}
                                        </Box>
                                        <Box
                                            display={'flex'}
                                            flexDirection={'column'}
                                            justifyContent={'space-between'}
                                            alignItems={'center'}>
                                            {Array.isArray(limitedMatchingData) &&
                                            limitedMatchingData.length > 0 ? (
                                                limitedMatchingData.map(
                                                    (item, itemIndex: number) => (
                                                        <div
                                                            onClick={async () => {
                                                                bookingStore.idBooking = item.id;
                                                                await bookingStore.getBookingInfo(
                                                                    item.id
                                                                );
                                                                await bookingStore.onShowBookingInfo();
                                                            }}>
                                                            <Box
                                                                key={itemIndex}
                                                                sx={{
                                                                    bgcolor: item.color + '4a',
                                                                    padding: '2px 8px',
                                                                    width: '100%',
                                                                    top: `${
                                                                        (itemIndex + 1) * 24
                                                                    }px`,
                                                                    left: '0',
                                                                    borderRadius: '4px',
                                                                    position: 'absolute',
                                                                    zIndex: 4
                                                                }}>
                                                                <Typography
                                                                    variant="body1"
                                                                    fontSize="12px"
                                                                    whiteSpace="nowrap"
                                                                    color={item.color}>
                                                                    <b> {item.startTime} </b>
                                                                    {item.customer + ':'}
                                                                    {item.employee}
                                                                </Typography>
                                                            </Box>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <Typography
                                                    variant="body1"
                                                    fontSize="12px"
                                                    whiteSpace="nowrap"
                                                    color="#000">
                                                    Không có lịch đặt
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{
                                                position: 'absolute',
                                                bottom: '0',
                                                right: '0',
                                                zIndex: '2'
                                            }}
                                            mt={1}>
                                            {/* Hiển thị nút "Hiển thị tất cả" chỉ khi số lượng item vượt quá 4 */}
                                            {matchingData.length > 4 && (
                                                <Button
                                                    size="small"
                                                    onClick={(event) =>
                                                        handleShowMoreClick(currentDate, event)
                                                    }>
                                                    Hiển thị tất cả
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* {modalPosition && ( */}
            <Modal open={selectedDateItems.length > 0} onClose={handleCloseModal}>
                <Box
                    // sx={{
                    //     position: 'fixed',
                    //     top: modalPosition.top,
                    //     left: modalPosition.left,
                    //     maxHeight: '300px',
                    //     overflowY: 'auto',
                    //     overflow: 'auto',
                    //     overflowX: 'hidden',
                    //     bgcolor: '#fff',
                    //     borderRadius: '8px',
                    //     padding: '16px'
                    // }}>
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#fff',
                        borderRadius: '8px',
                        padding: '16px'
                    }}>
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', overfloxX: 'hidden' }}>
                        {selectedDateItems.map((item, index) => (
                            <div
                                onClick={async () => {
                                    bookingStore.idBooking = item.id;
                                    await bookingStore.getBookingInfo(item.id);
                                    await bookingStore.onShowBookingInfo();
                                }}>
                                <Box
                                    key={index}
                                    sx={{
                                        bgcolor: item.color + '4a',
                                        padding: '2px 8px',
                                        width: '100%',
                                        borderRadius: '4px',
                                        marginBottom: '8px'
                                    }}>
                                    <Typography
                                        variant="body1"
                                        fontSize="12px"
                                        whiteSpace="nowrap"
                                        color={item.color}>
                                        <b> {item.startTime} </b>
                                        {item.customer + ':'}
                                        {item.employee}
                                    </Typography>
                                </Box>
                            </div>
                        ))}
                    </Box>
                </Box>
            </Modal>
            {/* )} */}
        </TableContainer>
    );
};

export default observer(TabMonth);
