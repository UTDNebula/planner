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
    <div
      className="h-screen"
      style={{
        background: "linear-gradient(#f5a75e, #ffffff)",
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
      <div className="flex flex-col-2">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: "70vh" }}
        >
          <Box>
            <Grid item>
              <Typography
                textAlign="left"
                variant="h1"
                color="black"
                fontSize="55px"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="1px"
                paddingBottom="20px"
              >
                Features
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                textAlign="left"
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingTop="10px"
              >
                Add your existing and
              </Typography>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingBottom="20px"
              >
                transfer credits.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
              >
                Build personalized degree
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingBottom="20px"
              >
                plans.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
              >
                Pin your favorite plan.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingTop="20px"
              >
                See your progress.
              </Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid
          sx={{ mt: 2, ml: -20 }}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: "540px" }}
        >
          <ClassCard />
        </Grid>
      </div>
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
