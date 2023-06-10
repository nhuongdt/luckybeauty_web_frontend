import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SnackbarAlert({ showAlert, type = 1, title }: any) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (showAlert) setOpen(true);
    }, [title, showAlert, type]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={handleClose}
                    severity={type == 1 ? 'success' : 'error'}
                    sx={{ width: '100%' }}>
                    {title}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
