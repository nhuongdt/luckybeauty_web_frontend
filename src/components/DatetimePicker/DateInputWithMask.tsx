import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, isValid, setYear, getYear } from 'date-fns';
import vi from 'date-fns/locale/vi';
import React from 'react';
import { Grid, Menu, MenuItem, IconButton, InputAdornment, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReactComponent as DateIcon } from '../../images/calendarMenu.svg';
import { viVN } from '@mui/x-date-pickers/locales';
import { TextFieldProps } from '@mui/material'; // Import kiểu nếu cần

export default function DateInputWithFormat({ defaultVal, handleChangeDate, props, maxDate = null }: any) {
    const today = new Date();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [formatType, setFormatType] = useState<'dd/MM/yyyy' | 'dd/MM'>('dd/MM/yyyy');

    const dropdownOpen = Boolean(anchorEl);

    const changeDate = (newVal: any) => {
        if (!newVal || new Date(newVal).toString() === 'Invalid Date') return;

        let newDate = new Date(newVal);

        if (formatType === 'dd/MM') {
            // Set năm là 1900
            newDate = setYear(newDate, 1000);
        }

        handleChangeDate(format(newDate, 'yyyy-MM-dd'));
        setValue(newDate);
    };

    const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const handleFormatChange = (selectedFormat: 'dd/MM/yyyy' | 'dd/MM') => {
        setFormatType(selectedFormat);

        if (selectedFormat === 'dd/MM' && value) {
            // Chuyển định dạng về dd/MM và set năm là 1900
            const newDate = setYear(value, 1000);
            setValue(newDate);
            handleChangeDate(format(newDate, 'yyyy-MM-dd'));
        } else if (selectedFormat === 'dd/MM/yyyy' && value && getYear(value) === 1000) {
            // Nếu đang ở dd/MM với năm 1900 và đổi sang dd/MM/yyyy, set năm hiện tại
            const newDate = setYear(value, new Date().getFullYear());
            setValue(newDate);
            handleChangeDate(format(newDate, 'yyyy-MM-dd'));
        }

        setAnchorEl(null);
    };

    useEffect(() => {
        if (!defaultVal) {
            setValue(new Date());
        } else {
            const parsedDate = parseISO(defaultVal);
            if (isValid(parsedDate)) {
                setValue(parsedDate);
            } else {
                setValue(new Date());
            }
        }
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
                localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                <div style={{ position: 'relative', width: props?.width }}>
                    <DatePicker
                        label={props?.label}
                        maxDate={maxDate}
                        slotProps={{
                            textField: {
                                size: props?.size,
                                error: props?.error,
                                helperText: props?.helperText,
                                InputProps: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateIcon
                                                onClick={() => setOpen(!open)}
                                                style={{
                                                    marginRight: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={handleDropdownClick}>
                                                <ArrowDropDownIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }
                        }}
                        disableOpenPicker={!open}
                        open={open}
                        onClose={() => setOpen(false)}
                        value={value}
                        onChange={(newVal) => changeDate(newVal)}
                        dayOfWeekFormatter={(day: string) => day}
                        sx={{
                            width: props?.width
                        }}
                    />
                    <Menu anchorEl={anchorEl} open={dropdownOpen} onClose={handleDropdownClose}>
                        <MenuItem onClick={() => handleFormatChange('dd/MM/yyyy')}>Ngày/Tháng/Năm</MenuItem>
                        <MenuItem onClick={() => handleFormatChange('dd/MM')}>Ngày/Tháng</MenuItem>
                    </Menu>
                </div>
            </LocalizationProvider>
        </>
    );
}
