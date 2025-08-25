import { useEffect } from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";

export default function DialogMoveItem({ open, setOpen, handleMove }) {
    const { getTreeOfDirectories, directoriesTree, lastTreeSelected, setLastTreeSelected } = useFilesContext();

    const handleClose = () => setOpen(false);

    // eslint-disable-next-line
    useEffect(() => { getTreeOfDirectories(); setLastTreeSelected(null) }, [])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle textAlign="center" children={`Move to: ${lastTreeSelected ? lastTreeSelected : ""}`} noWrap />
            <DialogContent>
                <Box sx={{ minHeight: 352, minWidth: 300 }}>
                    <FolderTree data={directoriesTree} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleMove} variant="contained">
                    Move
                </Button>
                <Button onClick={handleClose} variant="outlined" color="error">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}


function FolderTree({ data }) {
    const { setLastTreeSelected } = useFilesContext();

    const handleItemSelectionToggle = (event, itemId, isSelected) => {
        if (isSelected) {
            setLastTreeSelected(itemId);
        }
    }

    const renderTree = (node) => (
        node.subDirectories.map((child) => (
            <TreeItem
                key={child.path}
                itemId={child.path}
                label={child.name}
            >
                {child.subDirectories && child.subDirectories.length > 0 && renderTree(child)}
            </TreeItem>
        ))
    );

    return (
        <SimpleTreeView
            defaultExpandedItems={["root"]}
            onItemSelectionToggle={handleItemSelectionToggle}
        >
            <TreeItem
                itemId={"root"}
                label={"Root"}
            >
                {data.subDirectories && data.subDirectories.length > 0 && renderTree(data)}
            </TreeItem>
        </SimpleTreeView>
    )
}