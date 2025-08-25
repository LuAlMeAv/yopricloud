import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function DialogAlert({ dialogContent, setDialogContent }) {
    const handleClose = () => setDialogContent((prev) => ({ ...prev, open: false }))

    return (
        <Dialog open={dialogContent.open} onClose={handleClose}>
            <DialogTitle>
                {dialogContent.title}
            </DialogTitle>
            <DialogContent>
                {dialogContent.content}
                <br />
                <strong>{dialogContent.itemName}</strong>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => { dialogContent.action(); handleClose() }}>
                    {dialogContent.buttonTitle}
                </Button>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}