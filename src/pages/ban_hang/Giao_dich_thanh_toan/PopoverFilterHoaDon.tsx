import { Popover, Stack, Typography, Button, Grid } from '@mui/material';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import { IList } from '../../../services/dto/IList';
import ClearIcon from '@mui/icons-material/Clear';
import { ISelect } from '../../../lib/appconst';
import ListRadio from '../../../components/Radio/ListRadio';
import ListCheckbox from '../../../components/Checkbox/ListCheckbox';
import { useState, useContext, useEffect } from 'react';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import { TrangThaiNo, TrangThaiHoaDon } from '../../../services/ban_hang/HoaDonConst';
import { ChiNhanhContextbyUser } from '../../../services/chi_nhanh/ChiNhanhContext';
import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';

export default function PopoverFilterHoaDon(props: IPropsPopoverFilter<HoaDonRequestDto>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const allChiNhanh_byUser = useContext(ChiNhanhContextbyUser);
    const [paramFilterThis, setParamFilterThis] = useState<HoaDonRequestDto>({} as HoaDonRequestDto);

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            trangThaiNos: paramFilter?.trangThaiNos,
            trangThais: paramFilter?.trangThais ?? [TrangThaiHoaDon.HOAN_THANH]
        });
    }, []);
    const choseChiNhanh = (lstChosed: IList[]) => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: lstChosed?.map((x) => {
                return x.id;
            })
        });
    };

    const onClickApDung = () => {
        handleApply(paramFilterThis);
    };
    return (
        <>
            <Popover
                id={id ?? 'popover-filter'}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}>
                <Grid padding={2} container minWidth={300} position={'relative'}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Typography fontWeight={600}>Bộ lọc</Typography>
                            <Stack spacing={2}>
                                <MultipleAutocompleteWithData
                                    labelInput="Chi nhánh"
                                    arrIdDefault={paramFilterThis?.idChiNhanhs}
                                    lstOption={allChiNhanh_byUser?.map((x) => {
                                        return {
                                            id: x.id,
                                            text: x.tenChiNhanh
                                        };
                                    })}
                                    handleChosedItem={choseChiNhanh}
                                />
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Trạng thái
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListRadio
                                            lstOption={
                                                [
                                                    { value: TrangThaiHoaDon.HOAN_THANH, text: 'Hoàn thành' },
                                                    { value: TrangThaiHoaDon.HUY, text: 'Hủy' }
                                                ] as ISelect[]
                                            }
                                            defaultValue={
                                                paramFilterThis?.trangThais
                                                    ? paramFilterThis.trangThais[0]
                                                    : TrangThaiHoaDon.HOAN_THANH
                                            }
                                            onChange={(valNew: any) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    trangThais: [valNew]
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Trạng thái nợ
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListCheckbox
                                            arrValueDefault={paramFilterThis.trangThaiNos as unknown as number[]}
                                            lstOption={
                                                [
                                                    { value: TrangThaiNo.CON_NO, text: 'Còn nợ' },
                                                    { value: TrangThaiNo.HET_NO, text: 'Hết nợ' }
                                                ] as ISelect[]
                                            }
                                            onChange={(arrChosed: number[]) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    trangThaiNos: arrChosed
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                                    <Button variant="outlined" fullWidth onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="contained" fullWidth onClick={onClickApDung}>
                                        Áp dụng
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <ClearIcon sx={{ position: 'absolute', top: 10, right: 5 }} onClick={handleClose} />
                </Grid>
            </Popover>
        </>
    );
}
