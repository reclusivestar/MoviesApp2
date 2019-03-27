import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, Glyphicon } 
   from 'react-bootstrap';
import CnvModal from './CnvModal';
import { ConfDialog } from '../index';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
         delCnv: null,
         editCnv: null
      }
   }

   // Open a model with a |cnv| (optional)
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

   openConfirmation = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if (res === 'Yes') {
         this.props.delCnv(this.state.delCnv);
      }
      this.setState({delCnv: null, showConfirmation: false});
   }

   render() {
      var cnvItems = [];

      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               id ={cnv.id}
               title ={cnv.title}
               lastMessage={cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => this.openModal(cnv)} />);
      });

      return (
         <section className="container">
            <h1>Cnv Overview</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Conversation
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.editCnv}
               onDismiss={this.modalDismiss} />
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete Conversation"
               body={`Are you sure you want to delete the Conversation 
                  ${this.state.delCnv && this.state.delCnv.title}?`}
               buttons={['Yes', 'Abort']}
               onClose={answer => this.closeConfirmation(answer)}
            />
         </section>
      
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
               <Link to={"/CnvDetail/" + props.id}>{props.title}</Link>
            </Col>
            <Col sm={4}>{props.lastMessage === null ? "N/A" : 
               new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.lastMessage))}</Col>
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}>
                     <Glyphicon glyph="trash" />
                  </Button>
                  <Button bsSize="small" onClick={props.onEdit}>
                     <Glyphicon glyph="edit" />
                  </Button>
               </div>
               : ''}
         </Row>
      </ListGroupItem>
   )
}
