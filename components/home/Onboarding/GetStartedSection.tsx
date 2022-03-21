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

export default function NebFeatureDisplay(): JSX.Element {
  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(rgba(98, 226, 168, 0.2), rgba(135, 143, 214, 0.8))",
        transform: "translateY(-29%)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "20vh",
          borderTopRightRadius: "0",
          borderTopLeftRadius: "0",
          borderBottomRightRadius: "100%",
          borderBottomLeftRadius: "5%",
          background: "white",
        }}
      ></div>
      <Grid
        sx={{ height: "70vh" }}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sx={{ pb: 3, mt: -6 }}>
          <Typography
            color="black"
            fontSize="55px"
            fontWeight="bold"
            fontFamily="Jost"
            letterSpacing="1px"
          >
            Make your plans come true
          </Typography>
        </Grid>
        <Grid item sx={{ width: "900px" }}>
          <Typography
            textAlign="center"
            color="black"
            fontSize="30px"
            fontFamily="Jost"
            letterSpacing="-0.5px"
          >
            Try Planner out and explore how our tools create your degree plan in
            minutes with minimal effort.
          </Typography>
        </Grid>
        <Grid item sx={{ pt: 2 }}>
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
        </Grid>
      </Grid>

      <div
        style={{
          width: "100%",
          height: "10vh",
          borderTopRightRadius: "10%",
          borderTopLeftRadius: "100%",
          borderBottomRightRadius: "0%",
          borderBottomLeftRadius: "0%",
          background: "white",
        }}
      ></div>
    </div>
  );
}
