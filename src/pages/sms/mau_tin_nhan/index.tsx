import { Box, Button, Chip, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import AddIcon from '../../../images/add.svg';
import CreateOrEditMauTinNhanModal from './components/modal_sms_template';
import { useState } from 'react';
const MauTinNhan = () => {
    const [visiable, setVisiable] = useState(false);
    return (
        <Box paddingTop={2}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingRight={2} pb={2}>
                <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                    Bản mẫu tin nhắn
                </Typography>
                <Button
                    size="small"
                    sx={{ height: '40px' }}
                    variant="contained"
                    startIcon={<img src={AddIcon} />}
                    onClick={() => {
                        setVisiable(true);
                    }}>
                    Thêm mới
                </Button>
            </Box>
            <Box bgcolor={'#FFF'}>
                <List sx={{ padding: '4px 16px 16px 16px' }}>
                    {[1, 2, 3].map((item, key) => (
                        <ListItemButton key={key} divider>
                            <ListItemText
                                primary={
                                    <Typography fontSize={'16px'} color={'#525F7A'} fontWeight={500}>
                                        Nhắc nhở cuộc hẹn
                                    </Typography>
                                }
                                secondary={
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                        <Chip
                                            label={
                                                <Typography fontSize={'12px'} color={'#525F7A'} fontWeight={400}>
                                                    Lịch hẹn
                                                </Typography>
                                            }
                                            sx={{ marginRight: '10px' }}
                                        />
                                        <Typography fontSize={'14px'} color={'#525F7A'} fontWeight={400}>
                                            {' '}
                                            Xin chào {'{Tenkhachhang}'} Bạn có một cuộc hẹn tại {'{Tencuahang}'} vào{' '}
                                            {'{Ngayhen}'} lúc {'{Thoigianhen}'}. Trả lời bằng mã {'{Maxacnhan}'} để xác
                                            nhận.
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            <CreateOrEditMauTinNhanModal
                visiable={visiable}
                onCancel={() => {
                    setVisiable(!visiable);
                }}
            />
        </Box>
    );
};
export default MauTinNhan;
