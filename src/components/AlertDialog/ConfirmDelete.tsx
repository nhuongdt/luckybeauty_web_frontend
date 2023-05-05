import { CloseOutlined } from '@ant-design/icons';
import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

const ConfirmDelete = ({ isShow, onOk, onCancel, title = '', mes = '' }: any) => {
    return (
        <Dialog
            open={isShow}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    height: '178px',
                    width: '450px'
                }
            }}>
            <DialogTitle>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h6" component="h6" style={{ color: 'blue' }}>
                        {title != '' ? title : 'Thông báo xóa'}
                    </Typography>
                    <CloseOutlined style={{ height: '24px' }} onClick={onCancel} />
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">
                    <Typography variant="subtitle1" component="h2">
                        {mes != '' ? mes : 'Bạn có chắc chắn muốn xóa bản ghi này không?'}
                    </Typography>
                    <Stack
                        mt={3}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={2}>
                        <Button variant="contained" color="error" onClick={onCancel}>
                            Bỏ qua
                        </Button>
                        <Button variant="contained" onClick={onOk}>
                            Đồng ý
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;
