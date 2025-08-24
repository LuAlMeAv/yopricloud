import { useState } from "react";
import { Box } from "@mui/material";
import { useFilesContext } from "../contexts/FilesProvider";

export default function DragAndDropContainer({ children }) {
    const { setFilesOnForm } = useFilesContext();
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const newFiles = Array.from(e.dataTransfer.files);
        setFilesOnForm((prev) => [...prev, ...newFiles])
    }

    return (
        <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{ opacity: isDragging ? ".5" : "1", minHeight: "90vh" }}
            children={children}
        />
    )
}