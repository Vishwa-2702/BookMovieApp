import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Rating } from '@material-ui/lab';
import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';

import "./Details.css";
import Header from "../../common/header/Header";

/* NOTE:
Used  
ImageList insted of GridList, 
ImageListItem insted of GridListTile, 
ImageListItemBar insted of GridListTileBar  to resolved devtool error
*/

const Details = () => {
  let { id } = useParams();
  const [movieDetails, setMoviedetails] = useState([]);
  const movieID = id;
  function loadData() {
    fetch(
      `http://localhost:8085/api/v1/movies/${movieID}`
    )
      .then((input) => input.json())
      .then((data) => setMoviedetails(data));
  }

  useEffect(() => {
    loadData();
  }, []);

  var releaseDate = new Date(movieDetails.release_date).toDateString();
  
  const opts = {
    height: "300",
    width: "100%",
    playerVars: {
      autoplay: 0,
      origin: "http://localhost:3000",
    },
  };
  
  const useStyles = makeStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
    },
    gridList: {
      width: 300,
      height: 350,
    },
    emptyStar: {
      color: "black"
    }
  });

  const classes = useStyles();

  return (
    <div className="detailsPage">
    <Header bookShow={movieDetails.id} />
    <div className="details-content">
      <Typography style={{ margin: "10px" }}>
        <Link to="/" className="back-link">
          <span className="back-to-home">&#60; Back to Home</span>
        </Link>
      </Typography>
      <div className="main-content">
        <div className="first-container">
          <img src={movieDetails.poster_url} alt={movieDetails.title} />
        </div>
        <div className="mid-container">
          <Typography variant="h2" component="h2" name="movie title">
            {movieDetails.title}
          </Typography>
          <Typography variant="subtitle1" name="genere" component="p" gutterBottom>
            <b>Genre: </b>
            {movieDetails.genres ? movieDetails.genres.join() : ""}
          </Typography>
          <Typography variant="subtitle1" name="duration" component="p" gutterBottom>
            <b>Duration: </b>
            {movieDetails.duration}
          </Typography>
          <Typography variant="subtitle1" name="released date" component="p" gutterBottom>
            <b>Release Date: </b>
            {releaseDate}
          </Typography>
          <Typography variant="subtitle1" name="rating" component="p" gutterBottom>
            <b>Rating: </b>
            {movieDetails.rating}
          </Typography>
          <Typography variant="subtitle1" name="plot" component="p" gutterBottom style={{ marginTop: "16px" }}>
            <b>Plot: </b>
            ({movieDetails.wiki_url ? (<Link to={{pathname: movieDetails.wiki_url}} target="_blank">Wiki link</Link>) : ("")})
            {movieDetails.storyline}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            name="trailer"
            style={{ marginTop: "16px" }}
          >
            <b>Trailer:</b>
            <YouTube
              videoId={movieDetails.trailer_url ? movieDetails.trailer_url.split("?v=")[1]: "" } 
              opts={opts}
              onReady={(event) => {event.target.pauseVideo(); }}
            />
          </Typography>
        </div>
        <div className="last-container">
          <Typography variant="subtitle1" gutterBottom>
            <b>Rate this movie:</b>
            <div className="star-container">
              <Rating
                emptyIcon={ <StarBorderIcon fontSize="inherit" className={classes.emptyStar} />}
              />
            </div>
            <div className="artist-heading">
              <b>Artists: </b>
            </div>
            <div className={classes.root}>
              <ImageList rowHeight={180} cols={2} className={classes.gridList}>
                {movieDetails.artists && movieDetails.artists.length > 1 ? (
                  movieDetails.artists.map((actor) => (
                    <ImageListItem key={actor.id}>
                      <img src={actor.profile_url} alt={actor.first_name} />
                      <ImageListItemBar
                        title={actor.first_name + " " + actor.last_name}
                      />
                    </ImageListItem>
                  ))
                ) : (
                  <h6>No actor data available</h6>
                )}
              </ImageList>
            </div>
          </Typography>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Details;
