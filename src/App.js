import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('boards');
    this.unsubscribe = null;
    this.state = {
      boards: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const boards = [];
    querySnapshot.forEach((doc) => {
      const { title, description, author, downloadURL } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        author,
        downloadURL
      });
    });
    this.setState({
      boards
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              BOARD LIST
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/create">Add Board</Link></h4>
            {/* <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                  <th>Url</th>
                </tr>
              </thead>
              <tbody>
                {this.state.boards.map(board =>
                  <tr>
                    <td><Link to={`/show/${board.key}`}>{board.title}</Link></td>
                    <td>{board.description}</td>
                    <td>{board.author}</td>
                    {board.downloadURL && <td><img src={board.downloadURL} style={{width: "100px", height: "102px" }} alt=""/></td> }
                  </tr>
                )}
              </tbody>
            </table> */}
            {this.state.boards.map(board =>
            <div>
            <h1><Link to={`/show/${board.key}`} style={{textDecoration: "none"}}>{board.title}</Link></h1>
            <p>{board.description}</p>
            {board.downloadURL && <td><img src={board.downloadURL} style={{width: "100px", height: "102px" }} alt=""/></td> }
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;