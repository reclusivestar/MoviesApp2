import React, { Component } from 'react';
import {
   Modal, Dropdown, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';
import GenreAutofill from './GenreAutofill';

export default class SortModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lstTitle: (this.props.lst && this.props.lst.title) || ""
      }
   }

   close = (result) => {
       console.log(result);
      this.props.onDismiss && this.props.onDismiss({
         status: result.status,
         genre: result.genre,
         ratingFlag: result.ratingFlag,
         favoriteFlag: result.favoriteFlag
      });
   }

   getValidationState = () => {
      if (this.state.lstTitle) {
         return null
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({ lstTitle: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ lstTitle: (nextProps.lst && nextProps.lst.title) 
            || "" })
      }
   }

   render() {
      return (
         <Modal show={this.props.showSort} onHide={() => this.close("Cancel")}
         >
            <Modal.Header closeButton>
               <Modal.Title>Sort Movies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <GenreAutofill {...this.props}/>
            </Modal.Body>
            {/* <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer> */}
         </Modal>)
   }
}