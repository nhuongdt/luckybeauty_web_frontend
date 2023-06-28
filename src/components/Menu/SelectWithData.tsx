import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect } from 'react';
export default function SelectWithData({ itemChosed, textVal, data, handleChange }: any) {
    const changeItem = (item: any) => {
        handleChange(item);
    };
    return (
        <>
            <FormControl fullWidth size="small">
                <InputLabel>{textVal}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={itemChosed}
                    label="Age"
                    onChange={handleChange}>
                    {data.map((item: any, index: number) => (
                        <MenuItem value={item.id}>{item.text}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
