import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
export default function DialogButtonClose({ onClose }: any) {
    return (
        <>
            <CloseOutlinedIcon
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: '16px',
                    top: '16px',
                    minWidth: 20,
                    '&:hover': {
                        filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                    }
                }}
            />
        </>
    );
}
