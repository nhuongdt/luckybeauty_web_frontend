import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import { List, ListItem, IconButton, ListItemAvatar, ListItemText, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function TreeViewGroupProduct({ dataNhomHang }: any) {
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <>
            <List className="list-nhomhanghoa">
                {dataNhomHang.map((value: any) => (
                    <ListItem
                        key={value.id}
                        disableGutters
                        secondaryAction={
                            isHovering && (
                                <IconButton aria-label="comment">
                                    <AddIcon />
                                </IconButton>
                            )
                        }>
                        <ListItemAvatar style={{ minWidth: '40px' }}>
                            <LocalOfferIcon />
                        </ListItemAvatar>
                        <ListItemText primary={`${value.tenNhomHang}`} />
                        <Box></Box>
                        <List>
                            {value.children.map((child2: any) => (
                                <ListItem
                                    key={child2.id}
                                    disableGutters
                                    secondaryAction={
                                        isHovering && (
                                            <IconButton aria-label="comment">
                                                <AddIcon />
                                            </IconButton>
                                        )
                                    }>
                                    <ListItemText primary={`${child2.tenNhomHang}`} />
                                </ListItem>
                            ))}
                        </List>
                    </ListItem>
                ))}
            </List>
        </>
    );
}
