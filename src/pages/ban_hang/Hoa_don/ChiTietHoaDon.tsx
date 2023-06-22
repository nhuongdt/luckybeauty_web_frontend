import { Grid, Box, Typography, Button } from '@mui/material';
import avatar from '../../../images/avatar.png';
const CustomRowDetails = ({ row }: any) => {
    // Giao diện tùy chỉnh dưới hàng được chọn
    return (
        <Box>
            <Grid container>
                <Grid item xs={2}>
                    <Box
                        sx={{
                            '& img': {
                                width: '100px',
                                height: '100px',
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px'
                            }
                        }}>
                        <img src={avatar} alt="avatar of client" />
                    </Box>
                </Grid>
                <Grid item xs={10}>
                    <Grid container>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Typography variant="h3" color="#3B4758" fontSize="24px">
                                Đinh Tuấn Tài
                            </Typography>
                            <Box
                                sx={{
                                    bgcolor: '#CAFBEC',
                                    fontSize: '12px',
                                    color: '#0DA678',
                                    borderRadius: '9px'
                                }}>
                                Hoàn thành
                            </Box>
                        </Grid>
                        <Grid item>
                            <Button>In</Button>
                            <Button>Xuất</Button>
                            <Button>Sao chép</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <h4>Thông tin chi tiết</h4>
            <p>ID: </p>
            <p>Name: </p>
            {/* Các trường thông tin khác */}
        </Box>
    );
};
export default CustomRowDetails;
