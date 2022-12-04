import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/styles'
import { Grid, ImageList, ImageListItem, ImageListItemBar, IconButton } from '@material-ui/core'
import { Card, 
  CardActions,
  CardContent,
  Typography,
  FormControl,
  Input,
  InputLabel,
  Button,
  Select,
  ListItemText,
  MenuItem,
  Checkbox,
  TextField } from '@material-ui/core';

import Header from "../../common/header/Header";
import "./Home.css";

/* NOTE:
Used  
ImageList insted of GridList, 
ImageListItem insted of GridListTile, 
ImageListItemBar insted of GridListTileBar  to resolved devtool error
*/

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    marginBottom: "15px",
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
  },

  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function Home(props) {

  const classes = useStyles();
  const [movieList, setMovie] = useState([]);
  const [releasedMovieList, setReleasedMovieList] = useState([]);
  const [resetMovieList, setResetMovieList] = useState([]);

  const [isFilterApply, setFilter] = useState(false);
 
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genrename, setGenrename] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [movieName, setMovieName] = useState("");

  function loadData() {
    fetch("http://localhost:8085/api/v1/movies")
      .then((input) => input.json())
      .then((data) => {
        setMovie(data.movies)
        setReleasedMovieList(data.movies.filter((movie) => movie.status === "RELEASED"));
        setResetMovieList(data.movies.filter((movie) => movie.status === "RELEASED"));
    });

    fetch("http://localhost:8085/api/v1/genres")
      .then((input) => input.json())
      .then((data) => {
        setGenres(data.genres);
    });

    fetch("http://localhost:8085/api/v1/artists")
      .then((input) => input.json())
      .then((data) => {
        setArtists(data.artists);
    });
  }
  
  useEffect(() => {
    loadData();
  }, []);

  const handlePersonChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenrename(event.target.value);
  };

  const handleMovieName = (event) => {
    setMovieName(event.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleFilterUpdate({
      movieName: movieName,
      personName: personName,
      genrename: genrename,
    });
  };

  const handleFilterUpdate = (val) => {
    let tempMovieList = [...releasedMovieList];
    if (
      val.movieName.length > 0 ||
      val.genrename.length > 0 ||
      val.personName.length > 0
    ) {
      tempMovieList = tempMovieList.filter((item) => {
        if (
          val.movieName.length > 0 &&
          item.title.toLowerCase().indexOf(val.movieName.toLowerCase()) !== -1
        ) {
          return item;
        } else if (val.genrename.length > 0) {
          for (const gen of val.genrename) {
            if (item.genres.includes(gen)) {
              return item;
            }
          }
        } else if (val.personName.length > 0) {
          for (const person of val.personName) {
            for (const artist of item.artists) {
              if (artist.first_name === person.split(" ")[0]) {
                return item;
              }
            }
          }
        }
        return false;
      });
      setReleasedMovieList(tempMovieList);
      setFilter(true);
    } else {
      setReleasedMovieList(resetMovieList);
      setFilter(false);
    }
  };

  return (
    <div className="main-Container">
      <Header {...props} />
      {
        !isFilterApply ? <div className="upcoming-movies">
          <div>
            <p className="heading">Upcoming Movies</p>
          </div>
          <div> 
            <ImageList className={classes.gridList} cols={6} rowHeight={250}>
            {movieList.map((tile) => (
              <ImageListItem key={tile.id}>
                <Link to={"/movie-details/" + tile.id}>
                  <img src={tile.poster_url} alt={tile.title} />
                </Link>
                <ImageListItemBar
                  title={tile.title}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                  actionIcon={<IconButton aria-label={`star ${tile.title}`} />}
                />
              </ImageListItem>
            ))}
            
            </ImageList>
          </div>
        </div> 
        : ""
      }
      <div className="releasedMovie">
        <div className="">
          <Grid container className="movielist" spacing={4}>
            <Grid item xs={9}>
              <ImageList gap={12} rowHeight={338} cols={4.2}>
                {releasedMovieList.map((item) => (
                  <ImageListItem key={item.poster_url}>
                    <Link to={"/movie-details/" + item.id}>
                      {" "}
                      <img src={item.poster_url} alt={item.title} />
                      <ImageListItemBar
                        title={item.title}
                        subtitle={<span>Release Date: {item.release_date}</span>}
                      />
                    </Link>
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
            <Grid item xs={3}>
            <Card>
      <form name="movieDetails" id="movieDetails">
        <CardContent>
          <Typography
            className="theme-primary-color text-uppercase"
            gutterBottom={true}
          >
            Find movies by:
          </Typography>
          <br />

          <FormControl className="formControl">
            <InputLabel htmlFor="movieName">Movie Name</InputLabel>
            <Input
              id="movieName"
              name="movieName"
              value={movieName}
              onChange={handleMovieName}
            />
          </FormControl>
          <br />
          <br />
          <FormControl className="formControl">
            <InputLabel id="demo-mutiple-checkbox-label">Genres</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={genrename}
              onChange={handleGenreChange}
              input={<Input />}
              name="genrename"
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {genres &&
                genres.map((name) => (
                  <MenuItem key={name.id} value={name.genre}>
                    <Checkbox checked={genrename.indexOf(name.genre) > -1} />
                    <ListItemText primary={name.genre} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl className="formControl">
            <InputLabel id="demo-mutiple-checkbox-label">Artists</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={personName}
              onChange={handlePersonChange}
              input={<Input />}
              name="personName"
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {artists &&
                artists.map((name) => (
                  <MenuItem key={name.id} value={name.first_name + " " + name.last_name}>
                    <Checkbox checked={personName.indexOf(name.first_name + " " + name.last_name) > -1} />
                    <ListItemText primary={name.first_name + " " + name.last_name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl className="formControl">
            <TextField
              id="releaseDateStart"
              label="Release Date Start"
              type="date"
              name="releaseDateStart"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <br />
          <br />
          <FormControl className="formControl">
            <TextField
              id="releaseDateEnd"
              label="Release Date End"
              type="date"
              name="releaseDateEnd"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <br />
          <br />
        </CardContent>
        <CardActions>
          <Button
            onClick={handleSubmitForm}
            fullWidth={true}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </CardActions>
      </form>
    </Card>
            </Grid>
          </Grid>
        </div> ̰
      </div>
      </div> 
  );
}
