import { Audiotrack, Cancel, InsertDriveFile, Movie } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";

export default function PreviewElement({ file, index }) {
    const { type, name } = file;
    const isImage = type.startsWith('image/');
    const isAudio = type.startsWith('audio/');
    const isVideo = type.startsWith('video/');
    const mimetype = name.split(".").reverse()[0];

    const imageBlob = isImage && URL.createObjectURL(file);

    return (
        <Card sx={{ position: "relative" }}>
            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    background: "transparent",
                    transition: "ease all .3s",
                    borderRadius: "50%",
                    ":hover": {
                        background: "#fff",
                        opacity: ".9"
                    }
                }}
            >
                <DeletePreviewButton isImage={isImage} imageBlob={imageBlob} index={index} />
            </Box>
            {isImage ?
                <CardMedia
                    component="img"
                    image={imageBlob}
                    sx={{ maxHeight: "150px", objectFit: "contain" }}
                /> :
                <Box>
                    {isVideo ?
                        <Movie sx={{ fontSize: 90, width: "100%" }} /> :
                        isAudio ?
                            <Audiotrack sx={{ fontSize: 90, width: "100%" }} />
                            :
                            <InsertDriveFile sx={{ fontSize: 90, width: "100%" }} />
                    }
                    <Typography textAlign="center" fontSize={30}>{mimetype.toUpperCase()}</Typography>
                </Box>
            }
            <CardContent>
                <Typography variant="body2">{name}</Typography>
            </CardContent>
        </Card>
    )
}

function DeletePreviewButton({ index, isImage, imageBlob }) {
    const { setFilesOnForm } = useFilesContext();

    const handleClickDelete = (index) => {
        setFilesOnForm((prev) => prev.filter((_, i) => i !== index))
        isImage && URL.revokeObjectURL(imageBlob)
    }

    return (
        <IconButton color="error" onClick={() => handleClickDelete(index)}>
            <Cancel />
        </IconButton>
    )
}