import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

import IconButton from '@material-ui/core/IconButton';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

import Search from '../Search/Search';
import ListModal from './ListModal';
import { ConfDialog } from '../index';


const tileData = [
   {
     id: 1,
     img: 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg',
     title: 'Breakfast',
     author: 'jill111'
   }
];

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
class MyMovieList extends Component {
  constructor(props) {
     super(props);
      console.log(this.props.Prss.id);
      this.props.updateLists(parseInt(this.props.Prss.id));
     this.state = {
        showModal: false,
        showConfirmation: false,
        delList: null,
        editList: null
     }
  }

openModal = (lst) => {
  const newState = { showModal: true };

  if (lst)
     newState.editList = lst;
  this.setState(newState);
}

modalDismiss = (result) => {
  if (result.status === "Ok") {
     console.log(result);
     if (this.state.editList)
        this.modList(result);
     else
        this.newList(result);
     this.props.clearError();
  }
  this.setState({ showModal: false, editList: null });
}

modList(result) {
   console.log(result);
  this.props.modList(this.state.editList.id, {title : result.title, publicFlag: result.publicFlag ? 1 : 0});
}

newList(result) {
  this.props.addList({ title: result.title, publicFlag: result.publicFlag ? 1 : 0});
}

openConfirmation = (lst) => {
  this.setState({ delList: lst, showConfirmation: true })
}

closeConfirmation = (res) => {
  if (res === 'Yes') {
     this.props.delList(this.state.delList);
  }
  this.setState({delList: null, showConfirmation: false});
}


render() {
   console.log(this.props);
  const { classes } = this.props;
  return (
    <div className={classes.root}>
    <h1>My Movies Lists</h1>
    <Button variant="contained" color="primary" className={classes.button} onClick={() => this.openModal()}>
        Add New List
      </Button>
      <ListModal
        showModal={this.state.showModal}
        title={this.state.editList ? "Edit title" : "New Movie List"}
        lst={this.state.editList}
        onDismiss={this.modalDismiss} 
      />
      <ConfDialog
          show={this.state.showConfirmation}
          title="Delete Movie List"
          body={`Are you sure you want to delete the Movie List 
          ${this.state.delList && this.state.delList.title}?`}
          buttons={['Yes', 'Abort']}
          onClose={answer => this.closeConfirmation(answer)}
      />
      <GridList cellHeight={180} className={classes.gridList}>
        {this.props.Lists.map(tile => (
          <GridListTile key={tile.id}>
            <img src={tile.lastImage ? tile.lastImage : "http://clipart-library.com/images/rcLoRBLni.jpg"} alt={tile.title} />
            <GridListTileBar 
              title={  <Link style = {{fontSize: '18px', marginBottom:'2px'}} to={"/Movies/" + tile.id}>{tile.title}</Link>}
              subtitle={<p style = {{fontSize: '12px'}}>by: {tile.email}</p>}
              actionIcon={
                <div>
                  { this.props.Prss.role === 1 || (this.props.Prss.email === tile.email) ?
                  [<IconButton color='primary' onClick={() => this.openConfirmation(tile)}>
                     <DeleteIcon />
                  </IconButton> ] : []}
                  { this.props.Prss.role === 1 || (this.props.Prss.email === tile.email) ?
                  [<IconButton color='primary' onClick={() => this.openModal(tile)}>
                     <Edit  />
                  </IconButton>] : []}
                </div>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
}
export default withStyles(styles)(MyMovieList) 

