import Head from "next/head";
import Footer from "../components/common/Footer";
import React, { useEffect, useState } from "react";
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
import Reveal, {
  AttentionSeeker,
  Fade,
  Hinge,
  JackInTheBox,
  Slide,
} from "react-awesome-reveal";
import { useInView } from "react-intersection-observer";
import Scrollbars from "react-custom-scrollbars-2";
import { useRef } from "react";
import "animate.css";

/**
 * The primary landing page for the application.
 *
 * This is mostly for marketing.
 *
 * TODO: Make landing page more exciting!
 * TODO: also show some lightweight interactive demos since why not.
 */

export default function LandingPage(): JSX.Element {
  const { ref: appBarRef, inView: appBarVisible } = useInView({
    triggerOnce: true,
  });
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // ref={dragAndDropRef}
  // className={`${dragAndDropVisible ? "animate__animated animate__flipInX animate_slower": ""}`}
  // ref={learnMoreRef} className={`${learnMoreVisible ? "flex animate__animated animate_fadeIn animate_slower": "flex"}`}
  // ref={featRef} className={`${featVisible ? "animate__animated animate__backInRight animate_slower": ""}`}
  return (
    <div>
      <Scrollbars style={{ height: "100vh" }}>
        <div
          ref={appBarRef}
          className={`${
            appBarVisible && "animate__animated animate__bounce animate_slower"
          }`}
        >
          <AppBar />
        </div>
        <div>
          <DisplayLogoSection />
        </div>
        <div>
          <FeatureSection />
        </div>
        <div>
          <DragAndDropSection />
        </div>
        <div>
          <GetStartedSection />
        </div>
        <div>
          <LearnMoreSection />
        </div>
      </Scrollbars>
    </div>
  );
}
