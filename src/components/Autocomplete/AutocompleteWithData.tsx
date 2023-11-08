import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';

export default function AutocompleteWithData({ handleChoseItem, idChosed, lstData, label, helperText }: any) {
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
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={lstData}
                getOptionLabel={(option: IDataAutocomplete) => (option.text1 ? option.text1 : '')}
                renderInput={(params) => <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} />}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>{option.text1}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option.text1}
                                    </Box>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
