import { createContext, useContext, useState } from "react";
import { useLocation } from "react-router";
import FilesProvider from "./FilesProvider";

const BackendContext = createContext();

const { REACT_APP_API_HOSTNAME } = process.env;

export default function BackendProvider({ children }) {
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const pathname = location.pathname;
    const pathnameReplaced = pathname.replace("/root", "");

    const postFiles = async (formData, folderName) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/files?directory=${folderName ? folderName : pathnameReplaced}`, {
            method: "POST",
            body: formData
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const getAllFiles = async () => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/files/all?directory=${pathnameReplaced}`)
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const deleteSingleFile = async (filename) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/single?path=${pathnameReplaced}/${filename}`, {
            method: "DELETE"
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const deleteMultipleFiles = async (filesName) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/multiple?folderPath=${pathnameReplaced}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filesName })
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const createFolder = async (directoryName) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/folder?folderPath=${pathnameReplaced}/${directoryName}`, {
            method: "POST"
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const deleteFolder = async (directoryName) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/folder?folderPath=${pathnameReplaced}/${directoryName}`, {
            method: "DELETE",
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(() => setLoading(false));
    }
    const getDirectoiesTree = async () => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/directories/all`)
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(setLoading(false));
    }
    const renameItem = async (oldPath, newPath) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/rename`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldPath, newPath })
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(setLoading(false))
    }
    const moveItem = async (oldPath, newPath) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/move`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldPath, newPath })
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(setLoading(false))
    }
    const moveMultipleItems = async (oldPath, newPath, filesName) => {
        setLoading(true)
        return await fetch(`${REACT_APP_API_HOSTNAME}/move/multiple`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldPath, newPath, filesName })
        })
            .then(async (res) => await res.json())
            .catch(error => ({ error }))
            .finally(setLoading(false))
    }

    return (
        <BackendContext.Provider value={{
            loading,
            pathname,
            pathnameReplaced,
            moveItem,
            postFiles,
            renameItem,
            getAllFiles,
            createFolder,
            deleteFolder,
            deleteSingleFile,
            moveMultipleItems,
            getDirectoiesTree,
            deleteMultipleFiles,
        }}>
            <FilesProvider>
                {children}
            </FilesProvider>
        </BackendContext.Provider>
    )
}

export const useBackendContext = () => {
    const context = useContext(BackendContext);
    if (!context) {
        throw new Error('useBackendContext must be used within a BackendProvider.');
    }
    return context;
}