import { Dialog, Button, Typography, Box, SelectChangeEvent, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import { ReactComponent as DeleteIcon } from '../../../images/trash.svg';
import AddIcon from '@mui/icons-material/Add';

interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
}
const Edit: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper ': {
                    maxWidth: 'unset!important'
                }
            }}>
            <Box sx={{ padding: '28px 24px', width: '100vw', maxWidth: '680px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
                    <Typography fontSize="24px" color="#4C4B4C" fontWeight="700" variant="h2">
                        Hà Đinh
                    </Typography>
                    <Button sx={{ minWidth: 'unset' }} onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={5.5}>
                        <Typography
                            variant="h3"
                            fontSize="14px"
                            fontWeight="500"
                            color="#4C4B4C"
                            mb="8px">
                            Thời gian bắt đầu
                        </Typography>
                        <TextField id="startTime" defaultValue="9:00" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={5.5}>
                        <Typography
                            variant="h3"
                            fontSize="14px"
                            fontWeight="500"
                            color="#4C4B4C"
                            mb="8px">
                            Thời gian kết thúc
                        </Typography>
                        <TextField id="endTime" defaultValue="20:00" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={1} sx={{ p: '0!important', display: 'flex' }}>
                        <Button sx={{ mt: 'auto', minWidth: 'unset!important' }}>
                            <DeleteIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Box sx={{ '& button': { minWidth: 'unset' }, marginTop: '16px' }}>
                    <Button
                        variant="outlined"
                        sx={{ paddingX: '5px', borderColor: '#965C85!important' }}>
                        <AddIcon sx={{ color: '#4C4B4C' }} />
                    </Button>
                    <Button
                        variant="text"
                        sx={{
                            color: '#7C3367',
                            fontSize: '14px',
                            fontWeight: '500',
                            textTransform: 'unset'
                        }}>
                        Thêm ca làm việc
                    </Button>
                </Box>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset!important',
                            textTransform: 'unset',
                            fontWeight: '400'
                        },
                        justifyContent: 'end',
                        gap: '8px',
                        display: 'flex'
                    }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{ bgcolor: '#7C3367!important' }}>
                        Lưu
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ borderColor: '#965C85!important', color: '#965C85!important' }}>
                        Hủy{' '}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Edit;
