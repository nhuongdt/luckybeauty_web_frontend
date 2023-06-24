import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

export default function DateTimePickerCustom({ defaultVal, handleChangeDate }: any) {
    const [value, setValue] = useState(new Date());
    const changeDate = (newVal: any) => {
        handleChangeDate(format(new Date(newVal), 'yyyy-MM-dd HH:mm'));
        setValue(newVal);
    };

    useEffect(() => {
        setValue(new Date(defaultVal));
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateTimePicker
                    maxDate={new Date()}
                    sx={{
                        '& .MuiOutlinedInput-input': {
                            padding: '8.5px 8px'
                        },
                        '& .MuiOutlinedInput-root': {
                            fontSize: 14
                        },
                        '& .MuiSvgIcon-root': {
                            width: 14,
                            height: 14
                        }
                    }}
                    value={value}
                    onChange={(newVal) => changeDate(newVal)}
                />
            </LocalizationProvider>
        </>
    );
}
