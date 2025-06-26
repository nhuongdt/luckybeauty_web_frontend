import { createTheme } from '@mui/material';
import { lightPalette, darkPalette } from './palette';

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette
    });
