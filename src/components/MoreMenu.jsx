import { useState } from "react";
import { Delete, Download, DriveFileMove, Edit, MoreVert } from "@mui/icons-material";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import DialogAlert from "./DialogAlert";
import { enqueueSnackbar } from "notistack";

const { REACT_APP_API_HOSTNAME } = process.env;
const ITEM_HEIGHT = 50;

export default function MoreMenu({ item, setIsRename, setIsMoving }) {
    const { deleteSingleFile, deleteFolder, pathnameReplaced } = useBackendContext();
    const { getFiles } = useFilesContext();

    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogContent, setDialogContent] = useState({ open: false, title: "", content: "", itemName: "", buttonTitle: "", action: () => { } });

    const { type, name } = item;
    const open = Boolean(anchorEl);

    const handleDelete = async () => {
        let response;

        if (type === "file") {
            response = await deleteSingleFile(name);
        }
        if (type === "directory") {
            response = await deleteFolder(name);
        }
        enqueueSnackbar(response.message, { variant: response.status })
        if (response.status === "error") return;

        getFiles();
    }
    const handleOpenDialog = () => setDialogContent({
        open: true,
        title: "Delete file",
        content: `Are you sure you want to delete the ${item.type === "file" ? "file" : "folder"}:`,
        itemName: item.name,
        buttonTitle: "Delete",
        action: handleDelete
    });
    const handleDownload = () => window.open(`${REACT_APP_API_HOSTNAME}/download?filePath=${pathnameReplaced}&filename=${name}`);
    const handleRename = () => setIsRename(true);
    const handleMove = () => setIsMoving(true);

    const options = [
        type === "file" && { title: "Download", icon: <Download />, action: handleDownload },
        { title: "Rename", icon: <Edit />, action: handleRename },
        { title: "Move", icon: <DriveFileMove />, action: handleMove },
        { title: "Delete", icon: <Delete />, action: handleOpenDialog },
    ];

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVert />
            </IconButton>

            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                anchorEl={anchorEl}
                open={open}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch'
                        }
                    }
                }}
            >
                {options.map((option) => option && (
                    <ListItem
                        key={option.title}
                        disablePadding
                    >
                        <ListItemButton onClick={option.action}>
                            <ListItemIcon>{option.icon}</ListItemIcon>
                            <ListItemText>{option.title}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </Menu>
            {dialogContent.open && <DialogAlert dialogContent={dialogContent} setDialogContent={setDialogContent} />}
        </>
    )
}