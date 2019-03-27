import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import {ButtonToolbar, Button,} 
   from 'react-bootstrap';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.Title) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.Title + " (" + suggestion.Year + ")"}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, props) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  var suggestions = [];
  if (props.Search && props.Search.Search) {
    suggestions = props.Search.Search;
  }

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.Title.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }
        return keep;
      });
}

class Autofill extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         inputValue: '',
         selectedItem: [],
       };
   }

   addMovies = (selectedMvs) => {
      selectedMvs.forEach(mv => {
         this.props.getMvDetails(mv.id, this.props.mvID);
      });
      this.setState({selectedItem: []});
   }

   
  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  getInfo = () => {
   console.log(this.props);
 // axios.get(`${API_URL}?api_key=${API_KEY}&prefix=${this.state.query}&limit=7`)
   this.props.searchMvs(this.state.inputValue);
 // .then(({ data }) => {
   this.setState({results: this.props.Mvs});
}

handleInputChange = event => {
   console.log(event.target.value);
   console.log(this.state);
   console.log(this.props);
  this.setState({
   inputValue: event.target.value
  }, () => {
    if (this.state.inputValue && this.state.inputValue.length > 1) {
      // if (this.state.query.length % 2 === 0) {
        this.getInfo()
      //}
    } else if (!this.state.inputValue) {
    }
  })
}

//   handleInputChange = event => {
//      console.log(event.target.value);
//     this.setState({ inputValue: event.target.value });
//   };

  handleChange = item => {
    console.log(item);
    console.log(this.state);
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
    });
  };

  render() {
    const { classes } = this.props;
    const { inputValue, selectedItem } = this.state;
    console.log(this.state);

    return (
      <div>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item.id}
                    tabIndex={-1}
                    label={item.title}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: 'Select a movie',
              }),
              label: 'Search for a move',
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue2, this.props).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: {title: suggestion.Title,
                      year: suggestion.Year,
                     id: suggestion.imdbID}}),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
      <br/>
      <ButtonToolbar>
         <Button bsStyle = "primary" onClick={() => this.addMovies(this.state.selectedItem)}>Add Movies
         </Button>
      </ButtonToolbar>
      </div>
    );
  }
}

Autofill.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

let popperNode;

// function IntegrationDownshift(props) {
//   const { classes } = props;

//   return (
//     <div className={classes.root}>
//       <Downshift id="downshift-simple">
//         {({
//           getInputProps,
//           getItemProps,
//           getMenuProps,
//           highlightedIndex,
//           inputValue,
//           isOpen,
//           selectedItem,
//         }) => (
//           <div className={classes.container}>
//             {renderInput({
//               fullWidth: true,
//               classes,
//               InputProps: getInputProps({
//                 placeholder: 'Search a country (start with a)',
//               }),
//             })}
//             <div {...getMenuProps()}>
//               {isOpen ? (
//                 <Paper className={classes.paper} square>
//                   {getSuggestions(inputValue).map((suggestion, index) =>
//                     renderSuggestion({
//                       suggestion,
//                       index,
//                       itemProps: getItemProps({ item: suggestion.label }),
//                       highlightedIndex,
//                       selectedItem,
//                     }),
//                   )}
//                 </Paper>
//               ) : null}
//             </div>
//           </div>
//         )}
//       </Downshift>
//       <div className={classes.divider} />
//       <Autofill classes={classes} />
//       <div className={classes.divider} />
//       <Downshift id="downshift-popper">
//         {({
//           getInputProps,
//           getItemProps,
//           getMenuProps,
//           highlightedIndex,
//           inputValue,
//           isOpen,
//           selectedItem,
//         }) => (
//           <div className={classes.container}>
//             {renderInput({
//               fullWidth: true,
//               classes,
//               InputProps: getInputProps({
//                 placeholder: 'With Popper',
//               }),
//               ref: node => {
//                 popperNode = node;
//               },
//             })}
//             <Popper open={isOpen} anchorEl={popperNode}>
//               <div {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}>
//                 <Paper
//                   square
//                   style={{ marginTop: 8, width: popperNode ? popperNode.clientWidth : null }}
//                 >
//                   {getSuggestions(inputValue).map((suggestion, index) =>
//                     renderSuggestion({
//                       suggestion,
//                       index,
//                       itemProps: getItemProps({ item: suggestion.label }),
//                       highlightedIndex,
//                       selectedItem,
//                     }),
//                   )}
//                 </Paper>
//               </div>
//             </Popper>
//           </div>
//         )}
//       </Downshift>
//     </div>
//   );
// }

Autofill.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Autofill);
