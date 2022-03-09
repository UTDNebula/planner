import Head from "next/head";
import Footer from "../components/common/Footer";
import React from "react";
import Link from "next/link";
import ServiceName from "../components/common/ServiceName";
import { useDispatch } from "react-redux";
import UserWelcome from "../components/home/UserWelcome";
import AppBar from "../components/home/Onboarding/AppBar";
import IntroPage from "../components/home/Onboarding/Overview/IntroductionPage";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

/**
 * The primary landing page for the application.
 *
 * This is mostly for marketing.
 *
 * TODO: Make landing page more exciting!
 * TODO: also show some lightweight interactive demos since why not.
 */
export default function LandingPage(): JSX.Element {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url("../logo.png")`,
          width: "55vw",
          float: "right",
          height: "100vh",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <Button
          key={"Log In"}
          onClick={handleCloseNavMenu}
          style={{ backgroundColor: "transparent" }}
          sx={{
            p: 2,
            my: 2,
            color: "white",
            textTransform: "none",
            border: "1px solid white",
            top: 0,
            right: 0,
            position: "absolute",
          }}
        >
          Log In
        </Button>
      </Box>
      <AppBar />
      <IntroPage />
    </div>
  );
}
