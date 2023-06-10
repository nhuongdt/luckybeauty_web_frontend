import { Menu, MenuItem, Typography } from '@mui/material';
import { Component, ReactNode } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
interface MenuProps {
    selectedRowId: any;
    anchorEl: any;
    closeMenu: () => void;
    handleView: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
}

class ActionMenuTable extends Component<MenuProps> {
    render(): ReactNode {
        const { selectedRowId, anchorEl, closeMenu, handleView, handleDelete, handleEdit } =
            this.props;
        return (
            <Menu
                id={`actions-menu-${selectedRowId}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                sx={{ minWidth: '120px' }}>
                <MenuItem onClick={handleView}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        View
                    </Typography>
                    <InfoIcon sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Edit
                    </Typography>
                    <EditIcon sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <Typography
                        color="#F1416C"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Delete
                    </Typography>
                    <DeleteForeverIcon sx={{ color: '#F1416C' }} />
                </MenuItem>
            </Menu>
        );
    }
}
export default ActionMenuTable;
