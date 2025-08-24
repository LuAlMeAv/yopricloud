import { useEffect, useRef, useState } from "react";
import { Check, Close } from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useBackendContext } from "../contexts/BackendProvider";
import { useFilesContext } from "../contexts/FilesProvider";

export default function RenameInput({ setIsRename, item }) {
    const { pathnameReplaced, renameItem } = useBackendContext();
    const { getFiles, allFiles } = useFilesContext();

    const [newName, setNewName] = useState(item.name);
    const [filesString, setFilesString] = useState([]);
    const [directoriesString, setDirectoriesString] = useState([]);
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    let textError = "";

    const handleCancel = () => setIsRename(false);
    const validateError = () => {
        const newNameLC = newName.trim().toLocaleLowerCase();

        if (newNameLC === item.name.toLocaleLowerCase()) return false;
        if (newNameLC === "") { textError = "Name is empty."; return true }
        if (item.type === "file" && filesString.includes(newNameLC)) { textError = "File name already exist."; return true }
        if (item.type === "directory" && directoriesString.includes(newNameLC)) { textError = "Folder name already exist."; return true }

        return false;
    }
    const handleBlur = (e) => {
        if (buttonRef.current && buttonRef.current.contains(e.relatedTarget)) return;
        handleCancel();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (item.name === newName) {
            return handleCancel();
        }
        if (validateError()) return;
        const oldPath = decodeURI(pathnameReplaced + "/" + item.name);
        const newPath = decodeURI(pathnameReplaced + "/" + newName);

        const response = await renameItem(oldPath, newPath);
        console.log(response)
        if (response.status === "error") return;

        handleCancel();
        getFiles();
    }

    useEffect(() => { inputRef.current.select() }, []);
    useEffect(() => {
        allFiles.files.map((item) => setFilesString((prev) => [...prev, item.name.toLocaleLowerCase()]));
        allFiles.directories.map((item) => setDirectoriesString((prev) => [...prev, item.name.toLocaleLowerCase()]));
    }, [allFiles]);


    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex" }}>
                <TextField
                    fullWidth
                    variant="standard"
                    value={newName}
                    inputRef={inputRef}
                    onChange={(e) => setNewName(e.target.value)}
                    error={validateError()}
                    onBlur={handleBlur}
                />
                <Tooltip title="Save">
                    <IconButton type="submit" ref={buttonRef}>
                        <Check color="success" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                    <IconButton onClick={handleCancel}>
                        <Close color="error" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Typography
                variant="caption"
                component="p"
                sx={{ background: textError === "" ? "transparent" : "#ff00003b", padding: "2px", borderRadius: "5px" }}
                children={textError}
            />
        </form>
    )
}