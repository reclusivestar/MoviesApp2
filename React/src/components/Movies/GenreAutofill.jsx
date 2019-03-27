/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {
    Modal, Dropdown, Button, Form, ControlLabel, FormGroup, HelpBlock
 } from 'react-bootstrap';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const suggestions = [
  { label: 'Action' },
  { label: 'Adventure' },
  { label: 'Animation' },
  { label: 'Biography' },
  { label: 'Comedy' },
  { label: 'Documentary' },
  { label: 'Drama' },
  { label: 'Family' },
  { label: 'Fantasy' },
  { label: 'Film Noir' },
  { label: 'History' },
  { label: 'Horror' },
  { label: 'Music' },
  { label: 'Musical' },
  { label: 'Mystery' },
  { label: 'Romance' },
  { label: 'Sci-Fi' },
  { label: 'Short' },
  { label: 'Sport' },
  { label: 'Superhero' },
  { label: 'Thriller' },
  { label: 'War' },
  { label: 'Western' },
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class GenreAutofill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            single: null,
            value: null,
            checked: false
          };
    }
    
   handleChangeRating = event => {
      this.setState({ value: event.target.value });
   };

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  dismiss = (result) => {
   console.log(this.props);
    this.props.onDismiss && this.props.onDismiss({
       status: result,
       genre: this.state.single && this.state.single.value,
       ratingFlag: this.state.value,
       favoriteFlag: this.state.checked
    });
 }

 handleCheck = () => {
   this.setState({checked: !this.state.checked});
 };


  render() {
    const { classes, theme } = this.props;
    var msg;
    if (this.state.checked) {
      msg = "Only Favortites";
    } else {
      msg = "Favorites and Not Favorites";
    }

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            options={suggestions}
            components={components}
            value={this.state.single}
            onChange={this.handleChange('single')}
            placeholder="Filter by Genre"
            isClearable
          />
        </NoSsr>
        <div>
        <p>Sort By Rating</p>
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="Rating"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChangeRating}
          >
            <FormControlLabel value="1" control={<Radio color="primary" />} label="Highest-Lowest" />
            <FormControlLabel value="2" control={<Radio color="primary" />} label="Lowest-Highest" />
          </RadioGroup>
        </FormControl>
        </div>
        <div>
          <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.checked}/>
         <p>{msg}</p>
         </div>
        <Button bsStyle="primary" onClick={() => this.dismiss("OK")}>Sort</Button>
      </div>
    );
  }
}

GenreAutofill.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(GenreAutofill);
