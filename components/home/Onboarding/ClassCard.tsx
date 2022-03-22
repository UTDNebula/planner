import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions, Divider } from "@mui/material";
import { Box } from "@material-ui/core";
import "animate.css";
import { useInView } from "react-intersection-observer";

export default function ClassCard() {
  const { ref: featRef, inView: featVisible } = useInView({
    triggerOnce: true,
    threshold: 0.75,
  });
  return (
    <Card sx={{ background: "#4659A7", borderRadius: 2, width: { md: 0.737 } }}>
      <CardContent sx={{ width: { md: 0.725 }, pl: 2 }}>
        <div
          ref={featRef}
          className={`${
            featVisible &&
            "animate__animated animate__backInRight animate_slower"
          }`}
        >
          {[1, 2, 3].map((elem, index) => (
            <CardContent key={index}>
              <Typography
                variant="h4"
                color="white"
                fontFamily="Jost"
                sx={{ mt: -2 }}
              >
                Fall 2021
              </Typography>
              <Divider
                sx={{ borderBottomWidth: 3, borderRadius: 2 }}
                style={{ background: "white" }}
              />
              <Typography
                variant="h6"
                color="white"
                fontFamily="Jost"
                style={{ float: "right" }}
              >
                18 hours
              </Typography>
              <br></br>
              <br></br>
              <Button
                sx={{ mt: -2, mr: 2.6, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
              <Button
                sx={{ mt: -2, mr: 2.6, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
              <Button
                sx={{ mt: -2, mr: 0, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
              <Button
                sx={{ mr: 2.6, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
              <Button
                sx={{ mr: 2.6, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
              <Button
                sx={{ mr: 0, mb: 1, py: 0, px: 3 }}
                variant="contained"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                CS 1336
              </Button>
            </CardContent>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
