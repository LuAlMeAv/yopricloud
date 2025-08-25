import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import { enqueueSnackbar } from "notistack";

export default function DialogNewFolder({ open, setOpen }) {
    const { createFolder, pathnameReplaced } = useBackendContext();
    const { getFiles, allFiles } = useFilesContext();

    const [folderName, setFolderName] = useState("");
    const [foldersArray, setFoldersArray] = useState([]);

    let message = "";

    const handleClose = () => setOpen(false);
    const handleChange = (e) => setFolderName(e.target.value);
    const validateError = () => {
        const nameTrimLC = folderName.trim().toLocaleLowerCase();

        if (pathnameReplaced === "/" && nameTrimLC === "root") {
            message = "You can't use root as folder name here.";
            return true;
        }
        if (foldersArray.includes(nameTrimLC)) {
            message = "Folder name already exist.";
            return true;
        }
        return false;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await createFolder(folderName);
        enqueueSnackbar(response.message, { variant: response.status })
        if (response.status === "error") return;

        handleClose();
        getFiles();
    }

    useEffect(() => {
        allFiles.directories.map(dir => setFoldersArray((prev) => [...prev, dir.name.toLocaleLowerCase()]))
        // eslint-disable-next-line
    }, [allFiles])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle textAlign="center" children="Create new folder" />
            <DialogContent>
                <form id="foldder-name" onSubmit={handleSubmit} style={{ margin: "5px auto" }}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Folder name"
                        value={folderName}
                        onChange={handleChange}
                        error={validateError()}
                    />
                </form>
                <Typography
                    variant="caption"
                    component="p"
                    sx={{ background: message === "" ? "transparent" : "#ff00003b", padding: "2px", borderRadius: "5px" }}
                    children={message}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    form="foldder-name"
                    variant="contained"
                    children="Create folder"
                    disabled={validateError()}
                />
            </DialogActions>
        </Dialog>
    )
}