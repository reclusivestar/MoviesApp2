import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class ListModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lstTitle: (this.props.lst && this.props.lst.title) || "",
         publicFlag: this.props.lst && this.props.lst.publicFlag 
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.lstTitle,
         publicFlag: this.state.publicFlag
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

   handleCheck = (e) => {
       console.log(this.state.publicFlag);
      this.setState({publicFlag: e.target.checked});
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ lstTitle: (nextProps.lst && nextProps.lst.title) 
            || "" })
      }
   }

   render() {
       console.log(this.props);
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}
         >
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.lstTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                     validationState={this.getValidationState()}
                  >
                     <ControlLabel>Movie List Title</ControlLabel>
                     <FormControl
                        type="text"
                        value={this.state.lstTitle}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     <HelpBlock>Title can not be empty.</HelpBlock>
                  </FormGroup>
                  <div class="form-check">
                  <input onChange = {this.handleCheck} defaultChecked = {this.props.lst && this.props.lst.publicFlag} checked = {this.state.publicFlag} type="checkbox" class="form-check-input" id="exampleCheck1" />
                     <label class="form-check-label" for="exampleCheck1">Public</label>
                  </div>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}