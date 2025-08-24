import { Link } from "react-router";
import { Folder, FolderOpen } from "@mui/icons-material";
import { Breadcrumbs as BreadcrumbsList, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { useBackendContext } from "../contexts/BackendProvider";

const LinkStyled = styled(Link)`
    color: inherit;
    display: flex;
    align-items: center;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

export default function Breadcrumbs() {
    const { pathname } = useBackendContext();

    const breadcrumbs = decodeURIComponent(pathname).split('/').filter(Boolean);
    const pathnames = breadcrumbs.map((_, index) => '/' + breadcrumbs.slice(0, index + 1).join('/'));

    return (
        <BreadcrumbsList sx={{ my: 2 }}>
            <LinkStyled to="/root">
                {pathname === "/root" ? <FolderOpen /> : <Folder />}
                <Typography
                    sx={{ color: `text.${pathname === "/root" ? 'primary' : 'secondary'}` }}
                    children="Root"
                />
            </LinkStyled>
            {breadcrumbs.map((breadcrumb, index) => (
                index === 0 ? null :
                    <LinkStyled
                        to={`${pathnames[index]}`}
                        key={index}
                    >
                        {index + 1 === breadcrumbs.length ? <FolderOpen /> : <Folder />}
                        <Typography
                            sx={{ color: `text.${index + 1 === breadcrumbs.length ? "primary" : "secondary"}` }}
                            children={breadcrumb}
                        />
                    </LinkStyled>
            ))}
        </BreadcrumbsList>
    )
}