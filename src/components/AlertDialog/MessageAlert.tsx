import * as React from 'react';
import { Alert, Stack } from '@mui/material';

export default function MessageAlert({ showAlert = false, type = 1, title = '' }: any) {
    return (
        <>
            {showAlert && (
                <Alert
                    style={{ float: 'right', width: '350px', fontSize: '14px' }}
                    severity={type == 1 ? 'success' : 'error'}>
                    {title}
                </Alert>
            )}
        </>
    );
}
