import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ISelect } from '../../lib/appconst';
import { useEffect, useState } from 'react';
import { IPropsListCheckFilter } from '../../services/dto/IPropsComponent';

export default function ListCheckbox(props: IPropsListCheckFilter) {
    const { lstOption, arrValueDefault, onChange } = props;
    const [arrIdChosed, setArrIdChosed] = useState<number[]>([]);
    useEffect(() => {
        if (arrValueDefault !== undefined) {
            setArrIdChosed([...arrValueDefault]);
        }
    }, []);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const isCheck = event.target.checked;
        let arrID: number[] = [];
        if (isCheck) {
            arrID = [...arrIdChosed, id];
        } else {
            arrID = arrIdChosed.filter((x) => x !== id);
        }
        setArrIdChosed([...arrID]);
        onChange(arrID);
    };
    return (
        <FormGroup>
            {lstOption?.map((x: ISelect) => (
                <FormControlLabel
                    key={x.value}
                    value={x.value}
                    label={x.text}
                    control={
                        <Checkbox
                            checked={arrIdChosed?.includes(x.value as number) ?? false}
                            onChange={(event) => handleChange(event, x.value as number)}
                        />
                    }
                />
            ))}
        </FormGroup>
    );
}
