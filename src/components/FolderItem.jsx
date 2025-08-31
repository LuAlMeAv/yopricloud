import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "@emotion/styled";
import { Folder, InsertDriveFile, Movie } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Checkbox, Grid, Typography } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";
import { useBackendContext } from "../contexts/BackendProvider";
import MoreMenu from "./MoreMenu";
import RenameInput from "./RenameInput";
import ModalPreview from "./ModalPreview";
import DialogMoveItem from "./DialogMoveItem";
import { enqueueSnackbar } from "notistack";

const { REACT_APP_API_HOSTNAME } = process.env;

const CardStyled = styled(Card)(({ theme, isChecked }) => ({
    transition: "ease all .3s",
    cursor: "pointer",
    borderRadius: "4px",
    border: `solid ${isChecked ? "#90caf9" : "transparent"}`,
    opacity: `${isChecked ? ".8" : "1"}`,
    "&:hover": {
        transform: "scale(1.01)"
    }
}));

const filesPreview = ["PNG", "MP3", "MP4", "PDF", "JPG", "TXT"];

export default function FolderItem({ item }) {
    const { pathname, pathnameReplaced, moveItem } = useBackendContext();
    const { lastTreeSelected, selectedFiles, setSelectedFiles, allfiles, getFiles } = useFilesContext();

    const [openModalPreview, setOpenModalPreview] = useState(false);
    const [isRename, setIsRename] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const navigate = useNavigate();

    const { mimeType, name, type } = item;
    const isImage = type === "file" && mimeType && mimeType.startsWith("image/");
    const isAudio = type === "file" && mimeType && mimeType.startsWith("audio/");
    const isVideo = type === "file" && mimeType && (mimeType.startsWith("video/") || mimeType === "application/mp4");
    const ext = name.split(".").reverse()[0].toUpperCase();
    const imagePath = `${REACT_APP_API_HOSTNAME}/${isAudio ? "cover" : "file"}?path=${pathnameReplaced}/${name}`;

    const handleClick = () => {
        if (type === "directory") {
            return navigate(pathname + "/" + name)
        }
        if (type === "file" && filesPreview.includes(ext)) {
            return setOpenModalPreview(true)
        }
    }
    const handleChangeCheckbox = () => {
        setSelectedFiles((prev) => prev.includes(item.name) ? prev.filter(name => name !== item.name) : [...prev, item.name])
    }
    const handleMove = async () => {
        if (!lastTreeSelected) return setIsMoving(false);

        const newPath = decodeURIComponent(lastTreeSelected + "/" + item.name).replace("root", "");
        const oldPath = decodeURIComponent(pathnameReplaced + "/" + item.name);

        const response = await moveItem(oldPath, newPath);
        enqueueSnackbar(response.message, { variant: response.status });
        setIsMoving(false);
        if (response.status === "error") return;
        getFiles();
    }

    // eslint-disable-next-line
    useEffect(() => { setSelectedFiles([]) }, [allfiles]);

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <CardStyled isChecked={selectedFiles.includes(item.name)}>
                <Box
                    sx={{ display: "flex", justifyContent: item.type === "directory" ? "end" : "space-between", padding: "2px" }}
                >
                    {item.type === "file" &&
                        <Checkbox
                            onChange={handleChangeCheckbox}
                            checked={selectedFiles.includes(item.name)}
                        />
                    }

                    <MoreMenu item={item} setIsRename={setIsRename} setIsMoving={setIsMoving} />
                </Box>

                <Box onClick={isRename ? null : handleClick}>
                    {type === "directory" ?
                        <Folder sx={{ fontSize: 90, width: "100%" }} color="primary" />
                        :
                        (isImage || isAudio) ?
                            <CardMedia
                                component="img"
                                image={imagePath}
                                sx={{ maxHeight: "150px", objectFit: "contain" }}
                            />
                            : isVideo ?
                                <Movie sx={{ fontSize: 90, width: "100%" }} />
                                :
                                <>
                                    <InsertDriveFile sx={{ fontSize: 90, width: "100%" }} />
                                    <Typography variant="h5" component="p" textAlign="center" children={ext} />
                                </>
                    }
                    <CardContent>
                        {isRename ?
                            <RenameInput setIsRename={setIsRename} item={item} />
                            :
                            <Typography
                                component="p"
                                variant={type === "directory" ? "body1" : "body2"}
                                textAlign={type === "directory" ? "center" : "start"}
                                children={name}
                            />
                        }
                    </CardContent>
                </Box>
            </CardStyled>
            {openModalPreview && <ModalPreview open={openModalPreview} setOpen={setOpenModalPreview} item={item} />}
            {isMoving && <DialogMoveItem open={isMoving} setOpen={setIsMoving} item={item} handleMove={handleMove} />}
        </Grid>
    )
}