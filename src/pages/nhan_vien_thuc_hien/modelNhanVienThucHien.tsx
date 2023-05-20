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
    FormControl
} from '@mui/material';
const modelNhanVienThucHien: React.FC = () => {
    return (
        <div id="poppup-nhanVienThucHien">
            <h2>Chọn kỹ thuật viên</h2>
            <TextField
                size="small"
                sx={{
                    backgroundColor: '#fff',
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
        </div>
    );
};
export default modelNhanVienThucHien;
