import { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import FolderItem from "../components/FolderItem";

export default function FolderContainer() {
    const { pathname } = useBackendContext();
    const { allFiles, getFiles } = useFilesContext();

    // eslint-disable-next-line
    useEffect(() => { getFiles() }, [pathname]);

    return (
        <>
            {(allFiles.directories.length === 0 && allFiles.files.length === 0) ?
                <Typography
                    variant="h3"
                    component="p"
                    sx={{ textAlign: "center", my: 5, opacity: ".3", userSelect: "none" }}
                    children="There aren't files yet."
                />
                :
                <Grid container spacing={2} my={3}>
                    {allFiles.directories.map((item, index) => <FolderItem item={item} key={index} />)}
                    {allFiles.files.map((item, index) => <FolderItem item={item} key={index} />)}
                </Grid>
            }
        </>
    )
}