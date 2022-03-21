import Head from "next/head";
import Footer from "../components/common/Footer";
import React from "react";
import Link from "next/link";
import ServiceName from "../components/common/ServiceName";
import { useDispatch } from "react-redux";
import UserWelcome from "../components/home/UserWelcome";
import AppBar from "../components/home/Onboarding/AppBar";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import DisplayLogoSection from "../components/home/Onboarding/DisplayLogoSection";
import FeatureSection from "../components/home/Onboarding/FeatureSection";
import DragAndDropSection from "../components/home/Onboarding/DragAndDropSection";
import GetStartedSection from "../components/home/Onboarding/GetStartedSection";
import LearnMoreSection from "../components/home/Onboarding/LearnMoreSection";

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
    <div className="scrollbar-hide">
      <AppBar />
      <DisplayLogoSection />
      <FeatureSection />
      <DragAndDropSection />
      <GetStartedSection />
      <LearnMoreSection />
    </div>
  );
}
