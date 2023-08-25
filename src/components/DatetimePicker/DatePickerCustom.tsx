import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import utils from '../../utils/utils';

export default function DatePickerCustom({ defaultVal, handleChangeDate, props }: any) {
    const today = new Date();
    const [value, setValue] = useState<Date | null>(new Date(format(today, 'yyyy-MM-01')));
    const changeDate = (newVal: any) => {
        handleChangeDate(format(new Date(newVal), 'yyyy-MM-dd'));
        setValue(newVal);
    };
    useEffect(() => {
        if (utils.checkNull(defaultVal)) {
            setValue(null);
        } else {
            setValue(new Date(defaultVal));
        }
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                    label={props?.label}
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{
                        width: props?.width,
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
