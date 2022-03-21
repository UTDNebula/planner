import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "@fontsource/jost";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const pages = ["Overview", "Features", "Learn More"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function ResponsiveAppBar(): JSX.Element {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="absolute"
        style={{
          backgroundColor: "rgba(70, 89, 167, 0.25)",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    p: 2,
                    my: 2,
                    color: "black",
                    display: "block",
                    textTransform: "none",
                    fontSize: "24px",
                    fontFamily: "Jost",
                    letterSpacing: "-0.25px",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <div className="flex flex-row space-x-5">
              <Button
                sx={{
                  color: "black",
                  fontFamily: "Jost",
                  letterSpacing: "0px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                LOG IN
              </Button>
              <Button
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#4659A7",
                  fontFamily: "Jost",
                  fontSize: "18px",
                }}
              >
                GET STARTED
              </Button>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
