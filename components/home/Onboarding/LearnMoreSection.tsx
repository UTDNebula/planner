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
import ClassCard from "./ClassCard";

export default function NebFeatureDisplay(): JSX.Element {
  return (
    <Grid
      sx={{ mt: -10, height: "400px", transform: "translateY(-29%)" }}
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Typography
          textAlign="center"
          variant="h1"
          color="black"
          fontSize="55px"
          fontWeight="bold"
          fontFamily="Jost"
          letterSpacing="1px"
          paddingBottom="5px"
        >
          Learn More
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          textAlign="center"
          variant="h5"
          color="black"
          fontFamily="Jost"
          letterSpacing="-0.5px"
          paddingBottom="50px"
        >
          Check out the other Project Nebula tools!
        </Typography>
      </Grid>
      <div className="flex">
        <div>
          <Grid item sx={{ pr: 5, mb: 3 }}>
            <Button
              variant="contained"
              sx={{ textTransform: "none", width: "18vw" }}
              style={{
                background:
                  "linear-gradient(to right, rgba(150, 236, 197, 1), rgba(150, 236, 197, 0.3))",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                fontWeight="bold"
                fontFamily="Jost"
                color="black"
              >
                UTD Grades Upgrade
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ textTransform: "none", width: "18vw" }}
              style={{
                background:
                  "linear-gradient(to right, rgba(71, 87, 155, 0.7), rgba(69, 85, 153, 0.3))",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                fontWeight="bold"
                fontFamily="Jost"
                color="black"
              >
                Nebula API
              </Typography>
            </Button>
          </Grid>
        </div>
        <div>
          <Grid item sx={{ mb: 3 }}>
            <Button
              variant="contained"
              sx={{ textTransform: "none", width: "18vw" }}
              style={{
                background:
                  "linear-gradient(to right, #FBBB78, rgba(252, 210, 166, 0.3))",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                fontWeight="bold"
                fontFamily="Jost"
                color="black"
              >
                UTD Survival Guide
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ textTransform: "none", width: "18vw" }}
              style={{
                background:
                  "linear-gradient(to right, rgba(209, 218, 254, 1), rgba(209, 218, 254, 0.3))",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                fontWeight="bold"
                fontFamily="Jost"
                color="black"
              >
                Course Heatmap
              </Typography>
            </Button>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
