import { useState } from "react";
import { Box, Button, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, CreateNewFolder, Delete, DriveFileMove, FileUpload, IndeterminateCheckBox } from "@mui/icons-material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import DialogNewFolder from "./DialogNewFolder";
import DialogMoveItem from "./DialogMoveItem";
import UploadForm from "./UploadForm";

export default function ButtonsContainer() {
    const { deleteMultipleFiles, pathnameReplaced, moveMultipleItems } = useBackendContext();
    const { selectedFiles, setSelectedFiles, allFiles, getFiles, lastTreeSelected } = useFilesContext();

    const [newFolderDialog, setNewFolderDialog] = useState(false);
    const [uploadFormDialog, setUploadFormDialog] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

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
        console.log(response);
        if (response.status === "error") return;

        getFiles();
        setIsMoving(false);
    }
    const handleDeleteMultiple = async () => {
        const response = await deleteMultipleFiles(selectedFiles);
        console.log(response)
        if (response.status === "error") return;

        getFiles();
        setSelectedFiles([]);
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    {selectedFiles.length > 0 &&
                        <Tooltip title="Move all">
                            <IconButton onClick={openMoveDialog}>
                                <DriveFileMove color="warning" />
                            </IconButton>
                        </Tooltip>
                    }
                    {selectedFiles.length > 0 &&
                        <Tooltip title="Delete all">
                            <IconButton onClick={handleDeleteMultiple}>
                                <Delete color="error" />
                            </IconButton>
                        </Tooltip>
                    }
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