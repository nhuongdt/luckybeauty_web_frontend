import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTheme } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

const ColorThemeContext = createContext({
    toggleColorMode: () => {
        console.log('toggleColorMode');
    },
    mode: 'light'
});
export const useColorMode = () => useContext(ColorThemeContext);
export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prev) => {
                    const newMode = prev === 'light' ? 'dark' : 'light';
                    localStorage.setItem('mode', newMode);
                    return newMode;
                });
            },
            mode
        }),
        [mode]
    );
    const theme = useMemo(() => getTheme(mode), [mode]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-bg:', theme.palette.background.default);
        // root.style.setProperty('--text-primary', theme.palette.text.primary);
        root.style.setProperty('--color-main', theme.palette.primary.main);
    }, [theme]);

    return (
        <ColorThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorThemeContext.Provider>
    );
};
