import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
export default function SelectWithData({ idChosed, data, handleChange, label }: any) {
    const changeItem = (item: any) => {
        handleChange(item);
    };
    return (
        <>
            <FormControl fullWidth size="small">
                <InputLabel
                    sx={{
                        fontSize: '15px'
                    }}>
                    {label}
                </InputLabel>
                <Select value={idChosed} label={label}>
                    {data.map((item: any, index: number) => (
                        <MenuItem key={index} value={item.value} onClick={() => changeItem(item)}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
