import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } 
   from 'react-bootstrap';
import MsgModal from './MsgModal';

export default class CnvDetail extends Component {
   constructor(props){
      super(props);
      this.props.updateMsgs(this.props.cnvID);
      console.log(this.props);
      this.state = {
         showModal: false
      }
   }

   openModal = () => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         this.props.addMsg(this.props.cnvID, {content: result.content});
         this.props.clearError();
      }
      this.setState({ showModal: false});
   }

   render() {
      var msgItems = [];

      this.props.Msgs.forEach(msg => {
         msgItems.push(<MsgItem
               key={msg.id}
               id ={msg.id}
               content ={msg.content}
               whenMade={msg.whenMade}
               email={msg.email}/>);
      });
      return (
         <section className="container">
            <h1>{this.props.currCnv.title}</h1>
            <ListGroup>
               {msgItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Message
            </Button>
            <MsgModal
               showModal={this.state.showModal}
               title={"Enter New Message"}
               onDismiss={this.modalDismiss} />
         </section>
      )
   }
}

// A Cnv list item
const MsgItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>{props.email}</Col>
            <Col sm={4}>{new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.whenMade))}</Col>
         </Row>
         <Row>
            <Col sm={4}>{props.content}</Col> 
         </Row>
      </ListGroupItem>
   )
}