import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListIcon from '@mui/icons-material/List';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SearchIcon from '@mui/icons-material/Search';
import { format as formatDate } from 'date-fns';
import { vi } from 'date-fns/locale';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import bookingStore from '../../../stores/bookingStore';
const ToolbarHeader: React.FC<{
    initialView: string;
    initialDate: Date;
    handleChangeViewType: (e: SelectChangeEvent<string>) => void;
    toDayClick: () => void;
    handlePrevious: () => void;
    handleNext: () => void;
}> = ({
    initialView,
    initialDate,
    handleChangeViewType,
    toDayClick,
    handleNext,
    handlePrevious
}: any) => {
    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ paddingTop: '1.5277777777777777vw', marginBottom: '10px' }}>
            <Grid item xs={12} sm={2}>
                <Autocomplete
                    options={suggestStore.suggestKyThuatVien || []}
                    getOptionLabel={(option) => `${option.tenNhanVien}`}
                    size="small"
                    //sx={{ width: window.screen.width <= 650 ? "100%" : "85%" }}
                    fullWidth
                    disablePortal
                    onChange={async (event, value) => {
                        await bookingStore.onChangeEmployee(value?.id ?? ''); // Cập nhật giá trị id trong Formik
                    }}
                    renderInput={(params) => (
                        <TextField
                            sx={{ bgcolor: '#fff' }}
                            {...params}
                            placeholder="Tìm tên"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        {params.InputProps.startAdornment}
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={7}>
                <Box
                    display="flex"
                    sx={{
                        '& button:not(.btn-to-day)': {
                            minWidth: 'unset',
                            borderColor: '#E6E1E6',
                            bgcolor: '#fff!important',
                            px: '7px!important'
                        },
                        '& svg': {
                            color: '#666466!important'
                        },
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Button
                        variant="outlined"
                        sx={{ mr: '16px' }}
                        className="btn-outline-hover"
                        onClick={handlePrevious}>
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        className="btn-to-day"
                        variant="text"
                        sx={{
                            color: 'var(--color-main)!important',
                            fontSize: '16px!important',
                            textTransform: 'unset!important',
                            bgcolor: 'transparent!important',
                            fontWeight: '400',
                            paddingX: '0',
                            mr: '20px'
                        }}
                        onClick={toDayClick}>
                        Hôm nay
                    </Button>
                    <Typography fontSize="16px" fontWeight="700">
                        {formatDate(initialDate, "cccc, dd 'tháng' MM, 'năm' yyyy", {
                            locale: vi
                        })}
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ ml: '16px' }}
                        onClick={handleNext}
                        //</Box>className="btn-outline-hover"
                    >
                        <ChevronRightIcon />
                    </Button>
                </Box>
            </Grid>
            <Grid
                item
                xs={12}
                sm={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    gap: '8px'
                }}>
                {/* <ButtonGroup variant="outlined">
            <Button
              className="btn-outline-hover"
              sx={{ marginRight: "1px" }}
            >
              <DateRangeIcon />
            </Button>
            <Button
            className="btn-outline-hover"
            >
              <ListIcon />
            </Button>
          </ButtonGroup> */}

                <Select
                    size="small"
                    value={initialView}
                    onChange={handleChangeViewType}
                    sx={{
                        bgcolor: '#fff',
                        // '& .MuiSelect-select': { paddingY: '5.5px' },
                        fontSize: '14px'
                    }}>
                    {/* <MenuItem value="timeGridDay">Ngày</MenuItem> */}
                    <MenuItem value="resourceTimeGridDay">Ngày</MenuItem>
                    <MenuItem value="timeGridWeek">Tuần</MenuItem>
                    <MenuItem value="dayGridMonth">Tháng</MenuItem>
                    {/* <MenuItem value="listWeek">Danh sách</MenuItem> */}
                </Select>
                <Autocomplete
                    options={suggestStore.suggestDichVu || []}
                    getOptionLabel={(option) => `${option.tenDichVu}`}
                    size="small"
                    fullWidth
                    disablePortal
                    onChange={async (event, value) => {
                        await bookingStore.onChangeService(value?.id ?? ''); // Cập nhật giá trị id trong Formik
                    }}
                    renderInput={(params) => (
                        <TextField
                            sx={{ bgcolor: '#fff' }}
                            {...params}
                            placeholder="Tìm dịch vụ"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        {params.InputProps.startAdornment}
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};
export default observer(ToolbarHeader);
