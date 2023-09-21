import { Box, Button, ButtonGroup, Grid, IconButton, TextField, Typography } from '@mui/material';
import DownloadIcon from '../../../../images/download.svg';
import UploadIcon from '../../../../images/upload.svg';
import AddIcon from '../../../../images/add.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import abpCustom from '../../../../components/abp-custom';
const KhuyenMaiPage: React.FC = () => {
    return (
        <Box paddingTop={2}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                        Voucher
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD',
                                height: '40px',
                                '& .MuiInputBase-root': {
                                    pl: '0'
                                }
                            }}
                            onChange={(e: any) => {
                                console.log(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    console.log('Search');
                                }
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        type="button"
                                        onClick={() => {
                                            console.log('search');
                                        }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Grid>

                <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                    <ButtonGroup
                        variant="contained"
                        sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                        <Button
                            size="small"
                            hidden={!abpCustom.isGrandPermission('Pages.CongTy')}
                            onClick={() => {
                                console.log('mở form tạo mới');
                            }}
                            variant="contained"
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                fontSize: '14px',
                                borderRadius: '4px!important',
                                backgroundColor: 'var(--color-main)!important'
                            }}
                            className="btn-container-hover">
                            Thêm voucher
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Box>
    );
};
export default KhuyenMaiPage;
