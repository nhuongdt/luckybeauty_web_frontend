import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AvatarDemo from '../../../images/xinh.png';
import CreateOeEditLichLamViecModal from '../../employee/lich-lam-viec/create-or-edit-lich-lam-viec-modal';
import Edit from '../../employee/lich-lam-viec/editNhanVien';
import { ReactComponent as ClockBlue } from '../../../images/clock-blue.svg';
import { ReactComponent as ClockPink } from '../../../images/clock-pink.svg';
import { ReactComponent as ClockGreen } from '../../../images/clock-green.svg';
import { ReactComponent as ClockOrange } from '../../../images/clock-orange.svg';
import { ReactComponent as ClockViolet } from '../../../images/clock-violet.svg';

const TabDay: React.FC = () => {
    const NhanViens = [
        {
            name: 'Tài Đinh',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Trang nè',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Đẹp trai',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Tài Đinh',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Đây là một cái tên rất dài dài dài dài dài dàis',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Anh Mạnh',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Chị Nhì',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang nè',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        }
    ];

    const color = [
        {
            color: '#009EF7',
            background: '#F1FAFF', //Đang phục vụ
            icon: <ClockBlue />
        },
        {
            color: '#F1416C',
            background: '#FFF5F8', // Huỷ
            icon: <ClockPink />
        },
        {
            color: '#FF9900',
            background: '#FFF8DD', //Chưa xác nhận
            icon: <ClockOrange />
        },
        {
            color: '#50CD89',
            background: '#E8FFF3', //Hoàn thành
            icon: <ClockGreen />
        },
        {
            color: '#7C3367',
            background: '#E5D6E1', // Đã xác nhận
            icon: <ClockViolet />
        }
    ];

    const Clients = [
        {
            startTime: '10:00',
            endTime: '15:00',
            name: 'Đào Mai Chang',
            nameEmployee: 'Trang Nguyễn',
            service: 'Cắt móng',
            color: color[0].color,
            background: color[0].background,
            icon: color[0].icon
        },
        {
            startTime: '8:00',
            endTime: '13:00',
            name: 'Bùi Thị Duyên',
            nameEmployee: 'Đẹp trai',
            service: 'Cắt móng',
            color: color[1].color,
            background: color[1].background,
            icon: color[1].icon
        },
        {
            startTime: '7:20',
            endTime: '20:00',
            name: 'Nguyễn Hà Vy',
            nameEmployee: 'Trang nè',
            service: 'Cắt móng',
            color: color[2].color,
            background: color[2].background,
            icon: color[2].icon
        },
        {
            startTime: '9:00',
            endTime: '17:00',
            name: 'Đinh Thị Huyền',
            nameEmployee: 'Anh Mạnh',
            service: 'Anh yêu em',
            color: color[3].color,
            background: color[3].background,
            icon: color[3].icon
        },
        {
            startTime: '7:55',
            endTime: '8:33',
            name: 'Nguyễn Hoàng Giang',
            nameEmployee: 'Chị Nhì',
            service: 'Abc',
            color: color[4].color,
            background: color[4].background,
            icon: color[4].icon
        },
        {
            startTime: '7:50',
            endTime: '8:33',
            nameEmployee: 'Tài Đinh',
            service: 'Anh yêu em',
            color: color[1].color,
            background: color[1].background,
            icon: color[1].icon
        },
        {
            startTime: '7:50',
            endTime: '8:33',
            nameEmployee: 'Tài Đinh',
            service: 'Anh yêu em',
            color: color[4].color,
            background: color[4].background,
            icon: color[4].icon
        },
        {
            startTime: '7:55',
            name: 'Phan Thị Quỳnh',
            endTime: '8:33',
            nameEmployee: 'Tài Đinh',
            service: 'Anh yêu em',
            color: color[3].color,
            background: color[3].background,
            icon: color[3].icon
        },
        {
            startTime: '7:25',
            name: 'Phạm Thùy Anh',
            endTime: '8:33',
            nameEmployee: 'Tài Đinh',
            service: 'Anh yêu em',
            color: color[0].color,
            background: color[0].background,
            icon: color[0].icon
        }
    ];
    const NhanViens2 = NhanViens;
    const Mang2Chieu: any[][] = Array(7)
        .fill([])
        .map(() => []);
    Clients.map((item) => {
        const dateIndex = NhanViens2.findIndex((item) => item.name === item.name);
        if (dateIndex !== -1) {
            Mang2Chieu[dateIndex] = [...Mang2Chieu[dateIndex], item];
        }
    });
    useEffect(() => {
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
            htmlElement.style.overflowY = 'hidden';
        }
        return () => {
            if (htmlElement) {
                htmlElement.style.overflowY = 'unset';
            }
        };
    }, []);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Phần tử neo dấu cho Menu
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Chỉ mục item được chọn

    const handleItemClick = (
        index: number,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };
    const [openEdit, setModal] = useState(false);
    const handleOpenEdit = () => {
        setModal(true);
    };
    const handleCloseEdit = () => {
        setModal(false);
    };
    const [OpenEditLich, setOpenEditLich] = useState(false);
    const handleOpenEditLich = () => {
        setOpenEditLich(true);
    };
    const handleCloseEditLich = () => {
        setOpenEditLich(false);
    };

    return (
        <Box>
            <Edit open={openEdit} onClose={handleCloseEdit} openEditLich={handleOpenEditLich} />
            <CreateOeEditLichLamViecModal
                open={OpenEditLich}
                onClose={handleCloseEditLich}
                idNhanVien="demo"
            />
            <TableContainer
                sx={{
                    bgcolor: '#fff',
                    maxHeight: 'calc(95vh - 200px)',
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
                <Table sx={{ width: '100%', overflow: 'auto' }}>
                    <TableHead sx={{ position: 'sticky', top: '0', zIndex: 5, bgcolor: '#fff' }}>
                        <TableRow
                            sx={{ whiteSpace: 'nowrap', overflow: 'auto', overflowY: 'hidden' }}>
                            <TableCell sx={{ opacity: '0', pointerEvent: 'none' }}>
                                <Box>n</Box>
                            </TableCell>
                            {NhanViens.map((item, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        minWidth: '147px',
                                        maxWidth: '147px',
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'
                                    }}>
                                    <Box
                                        onClick={(event) => handleItemClick(index, event)}
                                        aria-controls="menu"
                                        aria-haspopup="true"
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            '&:hover .arrowDown': {
                                                opacity: '1',
                                                transform: 'rotate(0)'
                                            },
                                            cursor: 'pointer'
                                        }}>
                                        <Box>
                                            <Box>
                                                <Avatar src={item.avatar} alt={item.name} />
                                            </Box>
                                            <ExpandMoreIcon
                                                className="arrowDown"
                                                sx={{
                                                    color: '#666466',
                                                    position: 'absolute',
                                                    right: '0',
                                                    bottom: '0',
                                                    transform:
                                                        selectedIndex === index
                                                            ? 'rotate(0deg)'
                                                            : 'rotate(180deg)',
                                                    opacity: selectedIndex === index ? '1' : '0',
                                                    transition: '.4s'
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                fontSize="12px"
                                                color="#333F48"
                                                fontWeight="700"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="#70797F"
                                                fontSize="12px">
                                                {item.position}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& .MuiTableCell-root:not(:first-child)': {
                                borderLeft: '1px solid  rgba(224, 224, 224, 1)'
                            }
                        }}>
                        {Array.from({ length: 14 }, (_, index) => {
                            const hour = index + 7; // Giờ bắt đầu từ 7h sáng (7 -> 20)
                            const timeLabel = hour.toString().padStart(2, '0') + ':00'; // Định dạng nhãn thời gian

                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            color: '#999699',
                                            fontSize: '12px',
                                            verticalAlign: 'top',
                                            paddingTop: '8px',
                                            paddingBottom: '50px',
                                            textAlign: 'right',
                                            border: '0'
                                        }}>
                                        {timeLabel}
                                    </TableCell>
                                    {NhanViens2.map((item1, index) => {
                                        const matchingData = Clients.filter(
                                            (item) =>
                                                item.nameEmployee === item1.name &&
                                                parseInt(item.startTime.split(':')[0], 10) === hour
                                        );

                                        return (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    padding: '4px',
                                                    position: 'relative'
                                                }}>
                                                <Box
                                                    sx={{
                                                        '&::after': {
                                                            content: "''",
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '0',
                                                            transform: 'translateY(-50%)',
                                                            width: '100%',
                                                            pointerEvent: 'none',
                                                            zIndex: '0',
                                                            borderTop: '1px dashed #CDC9CD'
                                                        }
                                                    }}>
                                                    {matchingData.map((item, itemIndex: number) => {
                                                        const startTimeHours = parseInt(
                                                            item.startTime.split(':')[0],
                                                            10
                                                        );
                                                        const startTimeMinutes = parseInt(
                                                            item.startTime.split(':')[1],
                                                            10
                                                        );
                                                        const endTimeHours = parseInt(
                                                            item.endTime.split(':')[0],
                                                            10
                                                        );
                                                        const endTimeMinutes = parseInt(
                                                            item.endTime.split(':')[1],
                                                            10
                                                        );

                                                        const durationHours =
                                                            endTimeHours - startTimeHours;
                                                        const durationMinutes =
                                                            endTimeMinutes - startTimeMinutes;

                                                        const duration =
                                                            durationHours * 60 + durationMinutes;
                                                        const cellHeight = `${duration * 1.25}px`;

                                                        const topPosition = `${
                                                            (startTimeMinutes / 60) * 75.16
                                                        }px`;

                                                        return (
                                                            <Box
                                                                key={itemIndex}
                                                                bgcolor={item.background}
                                                                position="absolute"
                                                                height={cellHeight}
                                                                whiteSpace="nowrap"
                                                                overflow="hidden"
                                                                zIndex="1"
                                                                padding="8px 8px 16px 8px"
                                                                borderRadius="4px"
                                                                borderLeft={`6px solid ${item.color}`}
                                                                width={`${
                                                                    100 / matchingData.length
                                                                }%`}
                                                                top={topPosition}
                                                                left={`${
                                                                    (itemIndex /
                                                                        matchingData.length) *
                                                                    100
                                                                }%`}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: '6px'
                                                                    }}>
                                                                    <Typography
                                                                        variant="body1"
                                                                        color={item.color}
                                                                        fontSize="12px">
                                                                        {item.startTime +
                                                                            ' - ' +
                                                                            item.endTime}
                                                                    </Typography>
                                                                    {item.icon}
                                                                </Box>
                                                                <Typography
                                                                    variant="body1"
                                                                    color={item.color}
                                                                    fontWeight="700"
                                                                    fontSize="12px">
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography
                                                                    color={item.color}
                                                                    variant="body1"
                                                                    fontSize="12px">
                                                                    {item.service}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={() => undefined}>Thêm thời gian bị chặn</MenuItem>
                <MenuItem onClick={() => undefined}>Chỉnh sửa thời gian nghỉ</MenuItem>
                <MenuItem onClick={() => undefined}>Thêm thời gian nghỉ</MenuItem>
                <MenuItem onClick={handleOpenEdit}>Chỉnh sửa</MenuItem>
            </Menu>
        </Box>
    );
};
export default TabDay;
