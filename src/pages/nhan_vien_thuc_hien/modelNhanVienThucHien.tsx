import * as React from 'react';
import SearchIcon from '../../images/search-normal.svg';
import './modelNhanVienThucHien.css';
import {
    Button,
    ButtonGroup,
    Breadcrumbs,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Avatar
} from '@mui/material';
import closeIcon from '../../images/close-square.svg';
import avatar from '../../images/avatar.png';
interface PoppupComponentProps {
    className?: string;
}
interface PoppupComponentProps {
    onClick?: () => void;
}
const modelNhanVienThucHien: React.FC<PoppupComponentProps> = ({ className, onClick }) => {
    const persons = [
        {
            name: 'Hà Nguyễn1',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Tài Đinh',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Tài em',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn2',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễ',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn22',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn20',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn29',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn23',
            position: 'Kĩ thuật viên',
            avatar: avatar
        },
        {
            name: 'Hà Nguyễn26',
            position: 'Kĩ thuật viên',
            avatar: avatar
        }
    ];
    return (
        <div id="poppup-nhanVienThucHien" className={`poppup ${className}`}>
            <Typography variant="h5" color="333233" fontWeight="700" marginBottom="28px">
                Chọn kỹ thuật viên
            </Typography>
            <TextField
                size="small"
                sx={{
                    borderColor: '#CDC9CD',
                    width: '375px'
                }}
                className="search-field"
                variant="outlined"
                type="search"
                placeholder="Tìm kiếm"
                InputProps={{
                    startAdornment: (
                        <IconButton type="submit">
                            <img src={SearchIcon} />
                        </IconButton>
                    )
                }}
            />
            <Typography variant="subtitle1" fontWeight="700" color="#999699" marginTop="28px">
                Danh sách kỹ thuật viên
            </Typography>
            <Grid container className="list-persons" spacing={2} marginTop="24px">
                {persons.map((person) => (
                    <Grid
                        className="person-item"
                        item
                        xs={4}
                        md={3}
                        key={person.name.replace(/\s/g, '-')}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: ' 24px 24px 20px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            border="1px solid #CDC9CD">
                            <div className="person-avatar">
                                <Avatar
                                    src={person.avatar}
                                    alt={person.name}
                                    sx={{ width: '44px', height: '44px' }}
                                />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle1"
                                    color="#333233"
                                    className="person-name">
                                    {person.name}
                                </Typography>
                                <Typography variant="caption" className="person-position">
                                    {person.position}
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <ButtonGroup
                sx={{
                    gap: '8px',
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}>
                <Button
                    variant="contained"
                    sx={{ background: '#7C3367', color: '#fff', borderRadius: '4px!important' }}>
                    Lưu
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        color: '#4c4b4c',
                        borderColor: '#7C3367',
                        borderRadius: '4px!important'
                    }}>
                    Hủy
                </Button>
            </ButtonGroup>
            <Button onClick={onClick} sx={{ position: 'absolute', top: '35px', right: '31px' }}>
                <img src={closeIcon} />
            </Button>
        </div>
    );
};
export default modelNhanVienThucHien;
