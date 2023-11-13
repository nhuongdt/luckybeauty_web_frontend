import { Button, Grid, Icon, Stack, Typography } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CakeIcon from '@mui/icons-material/Cake';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IOSSwitch } from '../../../../components/Switch/IOSSwitch';
import { ReactComponentElement, useState } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';

interface ICaiDatNhacNho {
    icon: ReactComponentElement<SvgIconComponent>;
    title?: string;
    text: string;
    trangThai: number;
    listButton?: ICaiDatNhacNho[];
}

export default function PageCaiDatNhacTuDong({ aa }: any) {
    const [arrSetup, setArrSetup] = useState<ICaiDatNhacNho[]>([
        {
            icon: <NotificationsNoneOutlinedIcon sx={{ color: '#FF7DA1', width: 30, height: 30 }} />,
            title: 'Nhắc nhở cuộc hẹn',
            text: 'Gửi để nhắc nhở khách hàng về cuộc hẹn sắp tới',
            trangThai: 0,
            listButton: [
                {
                    icon: <DeleteOutlinedIcon sx={{ color: '#cccc' }} />,
                    text: '',
                    trangThai: 0
                },
                {
                    icon: <CheckOutlinedIcon sx={{ color: '#50CD89' }} />,
                    text: 'Sms',
                    trangThai: 0
                },
                {
                    icon: <CloseOutlinedIcon sx={{ color: 'red' }} />,
                    text: 'Sms',
                    trangThai: 0
                }
            ]
        },
        {
            icon: <CakeOutlinedIcon sx={{ color: '#800AC7' }} />,
            title: 'Sinh nhật',
            text: 'Gửi lời chúc mừng sinh nhật khách hàng tạo sự bất ngờ',
            trangThai: 0,
            listButton: [
                {
                    icon: <DeleteOutlinedIcon sx={{ color: '#cccc' }} />,
                    text: '',
                    trangThai: 0
                },
                {
                    icon: <CheckOutlinedIcon sx={{ color: 'blue' }} />,
                    text: 'Sms',
                    trangThai: 0
                },
                {
                    icon: <CloseOutlinedIcon sx={{ color: 'red' }} />,
                    text: 'Sms',
                    trangThai: 0
                }
            ]
        },
        {
            icon: <ReceiptOutlinedIcon sx={{ color: '#50CD89' }} />,
            title: 'Giao dịch',
            text: 'Gửi thông báo cho khách hàng các giao dịch thực hiện',
            trangThai: 0,
            listButton: [
                {
                    icon: <DeleteOutlinedIcon sx={{ color: '#cccc' }} />,
                    text: '',
                    trangThai: 0
                },
                {
                    icon: <CheckOutlinedIcon sx={{ color: 'blue' }} />,
                    text: 'Sms',
                    trangThai: 0
                },
                {
                    icon: <CloseOutlinedIcon sx={{ color: 'red' }} />,
                    text: 'Sms',
                    trangThai: 0
                }
            ]
        }
    ]);
    return (
        <>
            <Grid container spacing={3} paddingTop={2}>
                {arrSetup?.map((item: ICaiDatNhacNho, index) => (
                    <Grid item xs={4} key={index}>
                        <Stack
                            spacing={4}
                            padding={'20px 24px'}
                            sx={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
                            <Stack spacing={1.5}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                        {item.icon}

                                        <Typography fontWeight={600} fontSize={16}>
                                            {item?.title}
                                        </Typography>
                                    </Stack>
                                    <IOSSwitch
                                        sx={{ m: 1 }}
                                        value={item?.trangThai}
                                        checked={item?.trangThai == 1 ? true : false}
                                        // onChange={() => {
                                        //     const newVal = values.trangThai == 1 ? 0 : 1;
                                        //     setFieldValue('trangThai', newVal);
                                        // }}
                                    />
                                </Stack>
                                <Typography fontSize={14}> {item?.text}</Typography>
                            </Stack>

                            <Stack direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                                {item.listButton?.map((itemButton: ICaiDatNhacNho, indexButton) => (
                                    <div key={indexButton}>
                                        {itemButton?.text == '' ? (
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    border: '1px solid #ccc',
                                                    bgcolor: '#fff',
                                                    minWidth: 'unset',
                                                    width: '36.5px',
                                                    height: '36.5px',
                                                    borderRadius: '4px'
                                                }}>
                                                {itemButton.icon}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                startIcon={itemButton.icon}
                                                sx={{ color: 'black', borderColor: '#ccc' }}>
                                                {itemButton.text}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
