import * as React from 'react';
import { Alert, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function MessageAlert({ showAlert = false, type = 1, title = '' }: any) {
    const getIcon = () => {
        if (type === 1) {
            return <CheckCircleIcon />;
        } else if (type === 2) {
            return <DeleteIcon />;
        }
        return null;
    };
    return (
        <>
            {showAlert && (
                <Alert
                    style={{ float: 'right', width: '350px', fontSize: '14px' }}
                    severity={type == 1 ? 'success' : 'error'}
                    icon={getIcon()}>
                    {title}
                </Alert>
            )}
        </>
    );
}
