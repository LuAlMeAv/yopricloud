import { Container, Divider, Typography } from "@mui/material";
import { useBackendContext } from "../contexts/BackendProvider";
import Breadcrumbs from "../components/Breadcrumbs";
import FolderContainer from "../components/FolderContainer";
import ButtonsContainer from "../components/ButtonsContainer";

export default function Cloud() {
    const { pathnameReplaced } = useBackendContext();

    const directory = pathnameReplaced ? decodeURIComponent(pathnameReplaced).split("/").reverse()[0] : "Root";

    return (
        <Container>
            <Breadcrumbs />
            <Typography variant="h4" component="p" textAlign="center" my={3} children={directory} />
            <Divider />
            <ButtonsContainer />
            <FolderContainer />
        </Container>
    )
}