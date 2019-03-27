import React, { Component } from 'react';
import { Register, SignIn, ErrorDialog } from '../index';
import { Link } from 'react-router-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Main.css';
import MovieList from '../MovieList/MovieList';
import PublicMovieList from '../MovieList/PublicMovieList';
import MyMovieList from '../MovieList/MyMovieList';
import Movies from '../Movies/Movies';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   // console.log("HELLOOOOO" + JSON.stringify(rest));
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Prss).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/signin'/>;}}/>);
   };
   
class Main extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showError: false
      }
   }

   signedIn() {
      return Object.keys(this.props.Prss).length !== 0; // Nonempty Prss obj
   }

   // Function component to generate a Route tag with a render method 
   // conditional on login.  Params {conditional: Cmp to render if signed in}

   render() {
      console.log("Redrawing main");
      return (
      <div >
         <div>
         <AppBar position="static">
            <Toolbar>
            {this.signedIn() ? 
             <Typography variant="h6" color="inherit" >
             {`Logged in as: ${this.props.Prss.firstName}
                             ${this.props.Prss.lastName}`}
             </Typography>
            : ''}
            {this.signedIn() ?
             [
               <Button key={0} color="inherit"
                onClick= {() => this.props.history.push("/allLists")}>Public Movie Lists</Button>,
                <Button key={1} color="inherit"
                onClick= {() => this.props.history.push("/myLists")}>My Movie Lists</Button>
             ]
             :
             [
               <Button key={0} color="inherit"
               onClick= {() => this.props.history.push("/signin")}>Sign in</Button>,
               <Button key={1} color="inherit"
               onClick= {() => this.props.history.push("/register")}>Register</Button>
             ]
            }
            {this.signedIn() ?
            <Button color="inherit" 
            onClick={() => this.props.signOut(() => this.props.history.push("/signin"))}>Log out
            </Button>
            : ''
            }
            </Toolbar>
         </AppBar>
         </div>
         {/* // <div>
         //    <div>
         //       <Navbar>
         //          <Navbar.Toggle />
         //          {this.signedIn() ?
         //             <Navbar.Text key={1}>
         //                {`Logged in as: ${this.props.Prss.firstName}
         //                 ${this.props.Prss.lastName}`}
         //             </Navbar.Text>
         //             :
         //             ''
         //          }
         //          <Navbar.Collapse>
         //             <Nav>
         //                {this.signedIn() ?
         //                   [
         //                      <LinkContainer key={"all"} to="/allLists">
         //                         <NavItem>Public Movie Lists</NavItem>
         //                      </LinkContainer>,
         //                      <LinkContainer key={"my"} to="/myLists">
         //                         <NavItem>My Movie Lists</NavItem>
         //                      </LinkContainer>
         //                   ]
         //                   :
         //                   [
         //                      <LinkContainer key={0} to="/signin">
         //                         <NavItem>Sign In</NavItem>
         //                      </LinkContainer>,
         //                      <LinkContainer key={1} to="/register">
         //                         <NavItem>
         //                            Register
         //                       </NavItem>
         //                      </LinkContainer>,
         //                   ]
         //                }
         //             </Nav>
         //             {this.signedIn() ?
         //                <Nav pullRight>
         //                   <NavItem eventKey={1}
         //                    onClick={() => this.props.signOut(() => this.props.history.push("/signin"))}>
         //                      Sign out
         //                   </NavItem>
         //                </Nav>
         //                :
         //                ''
         //             }
         //          </Navbar.Collapse>
         //       </Navbar>
         //          </div> */}

            
            <Switch>
               <Route exact path='/'
                  component={() => this.props.Prss ? 
                   <Redirect to="/allLists" /> : <Redirect to="/signin" />} />
               <Route path='/signin' 
                render={() => <SignIn {...this.props} />} />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
                <ProtectedRoute path='/allLists' component={PublicMovieList}
                {...this.props}/>
                <ProtectedRoute path='/myLists' component={MyMovieList}
                  userOnly="true" {...this.props}/> 
               <Route path='/Movies/:id' render = {(props) => 
                <Movies mvID = {parseInt(props.match.params.id)} {...this.props}/>}
               />
            </Switch>
 
            <ErrorDialog
               show={this.props.Errs.length ? true : false}
               title="Error Notice"
               body={this.props.Errs.toString()}
               buttons={['OK']}
               onClose={() => {
                 this.props.clearError();
               }}
            />
         </div>
      )
   }
}

export default Main
