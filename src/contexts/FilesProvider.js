import { createContext, useContext, useEffect, useState } from "react";
import { useBackendContext } from "./BackendProvider";
import { enqueueSnackbar } from "notistack";

const FilesContext = createContext();

export default function FilesProvider({ children }) {
    const { getAllFiles, pathname, getDirectoiesTree } = useBackendContext();

    // Holds all files in a directory, separated into folders and files
    const [allFiles, setAllFiles] = useState({ directories: [], files: [] });
    // Stores files pending upload in the form
    const [filesOnForm, setFilesOnForm] = useState([]);
    // Contains files selected in a container for deletion or movement
    const [selectedFiles, setSelectedFiles] = useState([]);
    // Stores the path of the last selected item in the directory tree
    const [lastTreeSelected, setLastTreeSelected] = useState(null);
    // Represents the directory structure of the project, with root and subdirectories
    const [directoriesTree, setDirectoriesTree] = useState({ name: "Root", subDirectories: [] });

    const getFiles = async () => {
        const response = await getAllFiles();
        console.log(response)
        if (!response.status) return enqueueSnackbar("No connection!", { variant: "error", autoHideDuration: 10000 })
        if (response.status !== "success") {
            return enqueueSnackbar(response.message, { variant: response.status })
        }

        setAllFiles(response.files)
    }
    const getTreeOfDirectories = async () => {
        const response = await getDirectoiesTree();
        console.log(response)
        if (response.status === "error") return;

        setDirectoriesTree(response.tree)
    }

    useEffect(() => { setSelectedFiles([]) }, [pathname]);

    return (
        <FilesContext.Provider value={{
            getFiles,
            getTreeOfDirectories,
            directoriesTree,
            allFiles, setAllFiles,
            filesOnForm, setFilesOnForm,
            selectedFiles, setSelectedFiles,
            lastTreeSelected, setLastTreeSelected,
        }}>
            {children}
        </FilesContext.Provider>
    )
}

export const useFilesContext = () => {
    const context = useContext(FilesContext);

    if (!context) {
        throw new Error('useBackendContext must be used within a FilesProvider.');
    }
    return context;
}