import { Box, Modal, Typography } from "@mui/material";
import { useBackendContext } from "../contexts/BackendProvider";

const { REACT_APP_FILE_HOSTNAME } = process.env;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    maxWidth: "950px",
    height: "90vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: "auto",
}

export default function ModalPreview({ open, setOpen, item }) {
    const { pathnameReplaced } = useBackendContext();

    const { name, mimeType } = item;

    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="p" textAlign="center" mb={1}>
                    {name}
                </Typography>
                <embed
                    src={`${REACT_APP_FILE_HOSTNAME}/file?path=${pathnameReplaced}/${name}`}
                    type={mimeType === "application/mp4" ? "video/mp4" : mimeType}
                    style={{
                        width: "99%",
                        display: "block",
                        margin: "auto",
                        height: "90%",
                        objectFit: "contain",
                        background: mimeType === "text/plain" && "#c6c6c6",
                    }}
                />
            </Box>
        </Modal>
    )
}