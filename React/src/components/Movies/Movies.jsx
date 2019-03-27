import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Search from '../Search/Search';
import Autofill from '../Autofill/Autofill';
import {ButtonToolbar, Button,} 
   from 'react-bootstrap';
import SortModal from './SortModal'
import IconButton from '@material-ui/core/IconButton';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
    fontFamily: 'Comic-Sans'
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginLeft: '50px',
    marginTop: '100px'
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

let id = 0;
class Movies extends Component {
   constructor(props) {
      super(props);
      this.props.updateMvs(this.props.mvID);
      this.state = {
        showSort: false
      }
   }

   openSort = () => {
    const newState = { showSort: true };
    this.setState(newState);
  }
  
  toggleFav = (mv) => {
    console.log(this.props.Mvs);
    var toggleFav = (mv.favoriteFlag ? 0 : 1);
    this.props.favMv(mv.id, {favoriteFlag: toggleFav});
    //this.setState({fav: !this.state.fav});
  };

  modalDismiss = (result) => {
    console.log(result);
    if (result.status === "OK") {
       this.props.updateMvs(this.props.mvID, result.genre, parseInt(result.ratingFlag), result.favoriteFlag ? 1 : 0);
    }
    this.setState({showSort: false});
  }

   render() {
   const { classes } = this.props;
   console.log(this.props);
   var selectedList = this.props.Lists && this.props.Lists.filter(lst => lst.id === this.props.mvID);
   var correctPerson = this.props.Prss.role === 1 ||
    (selectedList && selectedList[0].ownerId === this.props.Prss.id);
   return (
    <Paper className={classes.root}> 
        { correctPerson ?
          [<Autofill {...this.props}/>] :
          [<p>Viewing Other Persons List</p>]
        }
         <Button bsStyle = "primary" onClick={this.openSort}>Sort
         </Button>
        <br/>
      <SortModal
        showSort={this.state.showSort}
        title={this.state.editList ? "Edit title" : "New Movie List"}
        lst={this.state.editList}
        onDismiss={this.modalDismiss} />
        <br/>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Movie Title</CustomTableCell>
            <CustomTableCell align="right">Year</CustomTableCell>
            <CustomTableCell align="left">Genre</CustomTableCell>
            <CustomTableCell align="right">Rating on IMDB</CustomTableCell>
            <CustomTableCell align="right">
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.Mvs.map(mv => (
            <TableRow className={classes.row} key={mv.id}>
              <CustomTableCell component="th" scope="row">
              <a href={"https://www.imdb.com/title/" + mv.imdbID + "/?ref_=nv_sr_2"} target="_blank">{mv.Title}</a>
              </CustomTableCell>
              <CustomTableCell align="right">{mv.Year}</CustomTableCell>
              <CustomTableCell align="right">{mv.Genre}</CustomTableCell>
              <CustomTableCell align="right">{mv.imdbRating}</CustomTableCell>
              <CustomTableCell align="right">
              {correctPerson ?
                [<IconButton color='primary' key = {this.props.id} className={this.props.icon} onClick={() => this.toggleFav(mv)}>
                  {mv.favoriteFlag ? <Favorite /> : <FavoriteBorder />}
                </IconButton>] :
                [ ]
              }
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
          }
}

Movies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Movies);