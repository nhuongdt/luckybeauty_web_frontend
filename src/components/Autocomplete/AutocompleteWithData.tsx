import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography, Box, Stack } from '@mui/material';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';

export default function AutocompleteWithData({
    handleChoseItem,
    idChosed,
    lstData,
    label,
    helperText,
    optionLabel = { label1: '', label2: '' }
}: any) {
    const [itemChosed, setItemChosed] = useState<IDataAutocomplete | null>(null);
    React.useEffect(() => {
        const item = lstData?.filter((x: IDataAutocomplete) => x.id == idChosed);
        if (item.length > 0) {
            setItemChosed(item[0]);
        } else {
            setItemChosed(null);
        }
    }, [idChosed]);

    const choseItem = (item: IDataAutocomplete) => {
        handleChoseItem(item);
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                value={itemChosed}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={lstData}
                getOptionLabel={(option: IDataAutocomplete) => (option.text1 ? option.text1 : '')}
                renderInput={(params) => <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} />}
                renderOption={(props, option) => {
                    return (
                        <li {...props} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                            <Grid container alignItems="center">
                                <Grid item xs={12}>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}
                                        paddingLeft={0}
                                        marginLeft={0}>
                                        <Stack direction={'row'} spacing={1}>
                                            <Typography style={{ fontSize: '13px' }} color={'#acaca5'}>
                                                {optionLabel?.label1}
                                            </Typography>
                                            <Typography style={{ fontSize: '13px', fontWeight: 500 }}>
                                                {option.text1}
                                            </Typography>
                                        </Stack>
                                        {/* chỉ hiển thị nếu text2!='' */}
                                        {option.text2 && (
                                            <Stack
                                                direction={'row'}
                                                spacing={1}
                                                style={{
                                                    fontSize: '13px'
                                                }}>
                                                <span style={{ color: '#acaca5' }}>{optionLabel?.label2}</span>
                                                <span> {option.text2}</span>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
