import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
//import tileData from './tileData';
import Search from '../Search/Search';
import ListModal from './ListModal';


// const tileData = [
//    {
//      id: 1,
//      img: 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg',
//      title: 'Breakfast',
//      author: 'jill111'
//    }
// ];

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
    height: 500
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
class MovieList extends Component {
  constructor(props) {
     super(props);
     this.props.updateLists();
     this.state = {
        fav: 0,
        showModal: false,
        editLst: null,
        delLst: null
     }
  }
toggleFav = (tile) => {
  console.log(this.props.Mvs);
  this.setState({fav: !this.state.fav});
};

openModal = (cnv) => {
  const newState = { showModal: true };

  if (cnv)
     newState.editCnv = cnv;
  this.setState(newState);
}

modalDismiss = (result) => {
  if (result.status === "Ok") {
     console.log(result);
     if (this.state.editCnv)
        this.modCnv(result);
     else
        this.newCnv(result);
     this.props.clearError();
  }
  this.setState({ showModal: false, editCnv: null });
}

modCnv(result) {
  this.props.modCnv(this.state.editCnv.id, {title : result.title});
}

newCnv(result) {
  this.props.addCnv({ title: result.title });
}

render() {
   var lstItems = [];

   this.props.Lists.forEach(lst => {
      console.log(lst);
      console.log(this.props);
      if (!this.props.userOnly || this.props.Prss.id === lst.ownerId)
         lstItems.push(<LstItem
            key = {lst.id}
            title = {lst.title}
            lastImage = {lst.lastImage}
            id = {lst.id}
            favoriteFlag = {lst.favoriteFlag}
            icon = {this.props.classes.icon}
            showControls={lst.ownerId === this.props.Prss.id}
            />);
   });
  const { classes } = this.props;
  return (
    <div className={classes.root}>
      <GridList cellHeight={100} className={classes.gridList}>
        {lstItems}
      </GridList>
      <ListModal
            showModal={this.state.showModal}
            title={this.state.editCnv ? "Edit title" : "New Movie List Title"}
            lst={this.state.editLst}
            onDismiss={this.modalDismiss} />
    </div>
  );
}
}
const LstItem = function (props) {
   return (
      <GridListTile key={props.key}>
      <img src={props.lastImage} alt={props.title} />
      <GridListTileBar 
        title={  <Link style = {{fontSize: '18px', marginBottom:'2px'}} to={"/Movies/" + props.id}>{props.title}</Link>}
        subtitle={<p style = {{fontSize: '12px'}}>by: {props.author}</p>}
        actionIcon={
          <div>
          <IconButton key = {props.id} className={props.icon} onClick={() => this.toggleFav(props)}>
            {props.favoriteFlag ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={props.onEdit}>
            <Edit  />
          </IconButton>
          </div>
        }
      />
    </GridListTile>
   )
}
export default withStyles(styles)(MovieList) 