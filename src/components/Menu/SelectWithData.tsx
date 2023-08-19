import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
export default function SelectWithData({ idChosed, data, handleChange }: any) {
    const changeItem = (item: any) => {
        handleChange(item);
    };
    return (
        <>
            <FormControl fullWidth size="small" sx={{ '& fieldset': { inset: 0 } }}>
                <Select value={idChosed} label="Age">
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
