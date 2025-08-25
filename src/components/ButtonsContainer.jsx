import { useState } from "react";
import { Box, Button, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, CreateNewFolder, Delete, DriveFileMove, FileUpload, IndeterminateCheckBox } from "@mui/icons-material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import DialogNewFolder from "./DialogNewFolder";
import DialogMoveItem from "./DialogMoveItem";
import UploadForm from "./UploadForm";
import DialogAlert from "./DialogAlert";
import { enqueueSnackbar } from "notistack";

export default function ButtonsContainer() {
    const { deleteMultipleFiles, pathnameReplaced, moveMultipleItems } = useBackendContext();
    const { selectedFiles, setSelectedFiles, allFiles, getFiles, lastTreeSelected } = useFilesContext();

    const [newFolderDialog, setNewFolderDialog] = useState(false);
    const [uploadFormDialog, setUploadFormDialog] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [dialogContent, setDialogContent] = useState({ open: false, title: "", content: "", itemName: "", buttonTitle: "", action: () => { } });

    const handleAddFolder = () => setNewFolderDialog(true);
    const handleAddFiles = () => setUploadFormDialog(true);
    const openMoveDialog = () => setIsMoving(true);
    const handleAllCheckBox = () => {
        if (selectedFiles.length === 0) {
            setSelectedFiles(allFiles.files.map(file => file.name))
        } else {
            setSelectedFiles([])
        }
    }
    const handleMove = async () => {
        const oldPath = decodeURIComponent(pathnameReplaced);
        const newPath = decodeURIComponent(lastTreeSelected.replace("root", ""));

        const response = await moveMultipleItems(oldPath, newPath, selectedFiles)
        enqueueSnackbar(response.message, { variant: response.status });
        if (response.status === "error") return;

        getFiles();
        setIsMoving(false);
    }
    const handleDeleteMultiple = async () => {
        const response = await deleteMultipleFiles(selectedFiles);
        enqueueSnackbar(response.message, { variant: response.status })
        if (response.status === "error") return;

        getFiles();
        setSelectedFiles([]);
    }
    const handleOpenDialog = () => setDialogContent({
        open: true,
        title: "Delete files",
        content: `Are you sure to delete ${selectedFiles.length} files?`,
        buttonTitle: "Delete files",
        action: handleDeleteMultiple
    })

    return (
        <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-between", my: 2, gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                {allFiles.files.length > 0 && <>
                    <IconButton onClick={handleAllCheckBox}>
                        {selectedFiles.length === 0 ?
                            <CheckBoxOutlineBlank /> :
                            selectedFiles.length === allFiles.files.length ?
                                <CheckBox /> :
                                <IndeterminateCheckBox />
                        }
                    </IconButton>
                    <Typography
                        mx={1}
                        children={selectedFiles.length === 0 ?
                            "Select all" :
                            `${selectedFiles.length} ${selectedFiles.length > 1 ? "files" : "file"} selected`
                        }
                    />
                    {selectedFiles.length > 0 && <>
                        <Tooltip title="Move all">
                            <IconButton onClick={openMoveDialog}>
                                <DriveFileMove color="warning" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete all">
                            <IconButton onClick={handleOpenDialog}>
                                <Delete color="error" />
                            </IconButton>
                        </Tooltip>
                    </>}
                </>}
            </Box>
            <Box>
                <Button onClick={handleAddFolder}>
                    <CreateNewFolder sx={{ mx: 1 }} />
                    add folder
                </Button>
                <Button onClick={handleAddFiles}>
                    <FileUpload sx={{ mx: 1 }} />
                    add files
                </Button>
            </Box>
            {newFolderDialog && <DialogNewFolder open={newFolderDialog} setOpen={setNewFolderDialog} />}
            {uploadFormDialog && <UploadFormModal open={uploadFormDialog} setOpen={setUploadFormDialog} />}
            {isMoving && <DialogMoveItem open={isMoving} setOpen={setIsMoving} handleMove={handleMove} />}
            {dialogContent.open && <DialogAlert setDialogContent={setDialogContent} dialogContent={dialogContent} />}
        </Box>
    )
}


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "90vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: "auto",
}
function UploadFormModal({ open, setOpen }) {
    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <UploadForm closeModal={handleClose} />
            </Box>
        </Modal>
    )
}