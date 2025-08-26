
# **yopricloud**

This project provides the frontend for **yopricloud Backend**.

## Configuration

Create a `.env` file in the root directory and add the following variables:

```
REACT_APP_API_HOSTNAME=<<hostname>>/api
REACT_APP_FILE_HOSTNAME=<<hostname>>/api
```

- **REACT_APP_API_HOSTNAME**: The hostname of your server's.
- **REACT_APP_FILE_HOSTNAME**: If you're using reverse proxy, configure your hostname. If you don't, use the same as the API.

> Replace `<<hostname>>` with your server's URL.
