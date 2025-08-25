import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { CreateNewFolder, FileUpload } from "@mui/icons-material";
import { BrowserView, isMobile } from "react-device-detect";
import { useBackendContext } from "../contexts/BackendProvider";
import { useFilesContext } from "../contexts/FilesProvider";
import DragAndDropContainer from "./DragAndDropContainer";
import DialogNewFolder from "./DialogNewFolder";
import PreviewElement from "./PreviewElement";
import { enqueueSnackbar } from "notistack";

const DragAndDrop = styled.div`
    border: dashed;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ease all .3s; 
`;

export default function UploadForm({ closeModal }) {
    const { postFiles, loading, pathnameReplaced } = useBackendContext();
    const { getFiles, filesOnForm, setFilesOnForm } = useFilesContext();

    const [openDialog, setOpenDialog] = useState(false);
    const [folder, setFolder] = useState("default");
    const formFile = useRef();

    const handleChangeFile = (e) => {
        const files = Array.from(e.target.files)
        setFilesOnForm(files)
    }
    const handleSubmit = async (evnt) => {
        evnt.preventDefault()
        const foldername = folder === "default" ? "" : "/" + folder;

        if (filesOnForm.length < 1) return;

        const formData = new FormData();
        for (let i = 0; i < filesOnForm.length; i++) {
            formData.append('files', filesOnForm[i])
        }

        const response = await postFiles(formData, pathnameReplaced + foldername)
        enqueueSnackbar(response.message, { variant: response.status })
        if (response.status === "error") return;

        formFile.current.reset()
        setFilesOnForm([])

        if (closeModal) {
            closeModal()
            getFiles()
        }
    }

    return (
        <Container>
            <DragAndDropContainer>
                <Box sx={{
                    width: "95%",
                    maxWidth: "600px",
                    margin: "20px auto",
                }}>
                    <form onSubmit={handleSubmit} ref={formFile}>
                        <Grid container spacing={2}>
                            {filesOnForm.length < 1 &&
                                <Grid size={12}>
                                    <Typography variant="h5" textAlign="center">{isMobile ? "S" : "Or s"}elect your files</Typography>
                                    <TextField
                                        type="file"
                                        fullWidth
                                        slotProps={{ htmlInput: { multiple: true } }}
                                        onChange={handleChangeFile}
                                    />
                                </Grid>
                            }
                            <Grid size={{ xs: 12, md: 6 }} display="flex">
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading ? true : false}
                                >
                                    Upload <FileUpload />
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                <SelectFolder folder={folder} setFolder={setFolder} />
                                <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                                    <CreateNewFolder />
                                </Button>
                            </Grid>
                            <Typography
                                variant="caption"
                                children={`* Default is the ${pathnameReplaced === "/" ? "root" : "current"} folder`}
                            />
                        </Grid>
                    </form>
                </Box>
                {filesOnForm.length < 1 &&
                    <BrowserView style={{ paddingTop: "20px" }}>
                        <DragAndDrop>
                            <Typography variant="h4" component="p" textAlign="center" >Drop your files here</Typography>
                        </DragAndDrop>
                    </BrowserView>
                }
                {filesOnForm.length > 0 &&
                    <Grid container my={5} spacing={2} size={12}>
                        {filesOnForm.map((file, index) => {
                            return <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                                <PreviewElement file={file} index={index} setFilesOnForm={setFilesOnForm} />
                            </Grid>
                        })}
                    </Grid>
                }
            </DragAndDropContainer>
            {openDialog && <DialogNewFolder open={openDialog} setOpen={setOpenDialog} />}
        </Container >
    )
}

function SelectFolder({ folder, setFolder }) {
    const { allFiles, getFiles } = useFilesContext();
    const handleChange = (event) => setFolder(event.target.value);

    // eslint-disable-next-line
    useEffect(() => { getFiles() }, []);

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel>Folder</InputLabel>
                <Select
                    value={folder}
                    label="Folder"
                    onChange={handleChange}
                >
                    <MenuItem value="default">* Default</MenuItem>
                    {allFiles.directories.length > 0 &&
                        allFiles.directories?.map(directory => <MenuItem value={directory.name}>{directory.name}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Box>
    )
}