import React, { useState, useEffect } from 'react';
import { TextField, Menu, MenuItem, InputAdornment, IconButton } from '@mui/material';
import MaskedInput from 'react-text-mask';
import { format, parse, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface DateInputWithMaskProps {
    label: string;
    formatType: 'dd/MM/yyyy' | 'dd/MM';
    value: string;
    onChange: (date: string) => void;
    width?: string; // Tuỳ chỉnh chiều rộng
    height?: string; // Tuỳ chỉnh chiều cao
}

const DateInputWithMask: React.FC<DateInputWithMaskProps> = ({
    label,
    formatType,
    value,
    onChange,
    width = '100%',
    height = '40px' // Giá trị mặc định
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [currentFormat, setCurrentFormat] = useState(formatType);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        // Đồng bộ `value` từ props vào state `inputValue`
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;
        const parsedDate = parse(rawValue, currentFormat, new Date(), { locale: vi });

        if (isValid(parsedDate)) {
            // Nếu định dạng là 'dd/MM', thay đổi năm thành 1000
            if (currentFormat === 'dd/MM') {
                const newDateWithYear1000 = new Date(parsedDate);
                newDateWithYear1000.setFullYear(1000);
                onChange(format(newDateWithYear1000, 'yyyy-MM-dd'));
            } else {
                onChange(format(parsedDate, 'yyyy-MM-dd'));
            }
            setInputValue(rawValue);
        } else {
            setInputValue(rawValue);
        }
    };

    const mask =
        currentFormat === 'dd/MM/yyyy'
            ? [/[0-3]/, /[0-9]/, '/', /[0-1]/, /[0-9]/, '/', /[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
            : [/[0-3]/, /[0-9]/, '/', /[0-1]/, /[0-9]/];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFormatChange = (format: 'dd/MM/yyyy' | 'dd/MM') => {
        setCurrentFormat(format);
        handleClose();
    };

    return (
        <div style={{ position: 'relative', width }}>
            <TextField
                label={label}
                value={inputValue}
                onChange={handleInputChange}
                InputLabelProps={{
                    shrink: true, // Đảm bảo nhãn luôn hiển thị
                    style: {
                        color: '#1976d2', // Màu xanh dương
                        fontSize: '14px'
                    }
                }}
                InputProps={{
                    inputComponent: MaskedInput as any,
                    inputProps: {
                        mask: mask,
                        placeholder: currentFormat === 'dd/MM/yyyy' ? 'dd/mm/yyyy' : 'dd/mm',
                        style: {
                            fontSize: '16px',
                            height: height
                        }
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClick}>
                                <ArrowDropDownIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                sx={{
                    width: width,
                    height: height,
                    '& .MuiInputBase-root': {
                        height: height // Điều chỉnh chiều cao tổng thể
                    }
                }}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <MenuItem onClick={() => handleFormatChange('dd/MM/yyyy')}>Ngày/Tháng/Năm</MenuItem>
                <MenuItem onClick={() => handleFormatChange('dd/MM')}>Ngày/Tháng</MenuItem>
            </Menu>
        </div>
    );
};

export default DateInputWithMask;
