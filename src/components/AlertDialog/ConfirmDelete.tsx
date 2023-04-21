import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { Modal } from "antd";
import CloseIcon from '@mui/icons-material/Close';

const ConfirmDelete = ({isShow,onOk,onCancel}:any)=> {
    return ( 
        <Dialog open={isShow}  fullWidth maxWidth="xs" PaperProps={{
                    sx:{
                        height: "350px",
                        width: '350px'
                    }
                }}
          >
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                >
                <CloseIcon style={{float:'right' , height:'24px'}} onClick={onCancel}/>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack mt={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="h4" component="h6">
                        Are you sure?
                    </Typography>
                    <Typography variant="subtitle1" component="h2" className="text-center">
                        Do you really want to delete these records? This process cannot be undone.
                    </Typography>
                    <Stack mt={5} className="mt-5"
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={4}
                    >
                        <Button variant="contained" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={onOk}>Delete</Button>
                    </Stack>
                </Stack>
                
            </DialogContent>
            
        </Dialog>
        
    )
}

export default ConfirmDelete;