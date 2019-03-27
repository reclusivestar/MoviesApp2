import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup
} from 'react-bootstrap';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         msgContent: ""
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         content: this.state.msgContent
      });
   }

   handleChange = (e) => {
      this.setState({ msgContent: e.target.value });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState({ msgContent: "" })
      }
   }

   render() {
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}
         >
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.msgContent.length ?
                     this.close("Ok") : this.close("Cancel")}> 
                  <FormGroup controlId="formBasicText">
                     <FormControl
                        as="textarea" rows="3"
                        value={this.state.msgContent}
                        placeholder="Enter message here"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback  />
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}