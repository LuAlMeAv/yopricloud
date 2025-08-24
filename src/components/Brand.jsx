import { Box } from "@mui/material";

const sizes = {
    "large": "300px",
    "medium": "200px",
    "small": "100px",
    "xsmall": "50px"
}

export default function Brand({ size }) {
    return (
        <Box
            sx={{
                width: sizes[size],
                userSelect: "none",
            }}
        >
            <img
                src="/images/yopricloud.png"
                alt="Your Private Cloud"
                width="100%"
                onDragStart={(e) => e.preventDefault()}
            />
        </Box>
    )
}