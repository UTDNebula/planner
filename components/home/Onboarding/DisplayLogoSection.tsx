import Head from "next/head";
import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import "animate.css";

export default function NebPlannerDisplay(): JSX.Element {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: "750px" }}
      sx={{ backgroundColor: "white" }}
    >
      <div className="flex flex-col-2 gap-x-5">
        <div>
          <Grid item>
            <img
              src="/Nebula_Planner_Logo.png"
              alt="Nebula Planner Logo"
              style={{ width: "200px", height: "200px" }}
            />
          </Grid>
        </div>
        <div className="animate__animated animate__fadeInRight animate__slow">
          <Grid item>
            <Typography
              variant="h1"
              color="#4659A7"
              fontSize="40px"
              fontWeight="bold"
              fontFamily="Jost"
              letterSpacing="1px"
              paddingTop="15px"
            >
              Nebula Planner
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              color="black"
              fontWeight="bold"
              fontFamily="Jost"
              letterSpacing="0.5px"
              paddingTop="10px"
            >
              A degree planning tool
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              color="black"
              fontWeight="bold"
              fontFamily="Jost"
              letterSpacing="0.5px"
              paddingBottom="5px"
            >
              and so much more.
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{
                borderRadius: "10px",
                backgroundColor: "#4659A7",
                fontFamily: "Jost",
                fontSize: "15px",
              }}
              href="/app/auth/signup"
            >
              GET STARTED
            </Button>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
