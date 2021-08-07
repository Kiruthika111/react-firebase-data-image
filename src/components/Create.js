import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

var image_link_firebase;
class Create extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('boards');
    this.state = {
      title: '',
      description: '',
      author: '',
      image: null,
      progress:0,
      downloadURL: null
    };
    
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { title, description, author, downloadURL } = this.state;
    // this.imageurl.setState(this.state.downloadURL);
    console.log(this.state.downloadURL);
    image_link_firebase = this.state.downloadURL;
    console.log(image_link_firebase);
    this.setState({
        downloadURL: image_link_firebase
    })
    console.log(downloadURL);
    console.log(image_link_firebase);
    //this.imageurl.setState(this.state.downloadURL);
    this.ref.add({
      title,
      description,
      author,
      downloadURL
    }).then((docRef) => {
      this.setState({
        title: '',
        description: '',
        author: '',
        downloadURL: ''
      });
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }




  handleChange = (e) =>{
    if(e.target.files[0]){
      this.setState({
      image: e.target.files[0]
    })
  }
    // console.log(e.target.files[0])
}

handleUpload = () =>{
  // console.log(this.state.image);
  let file = this.state.image;
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var uploadTask = storageRef.child('blogimages/' + file.name).put(file);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) =>{
      var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
      this.setState({progress})
    },(error) =>{
      throw error
    },() =>{
      // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

      uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
        this.setState({
          downloadURL: url
        })
      })
    document.getElementById("file").value = null
    image_link_firebase = this.state.downloadURL;

   }
 ) 
}



  render() {
    const { title, description, author } = this.state;
    return (
      <div class="container">

        <h4>upload image</h4>
        <label>
          Choose file
        <input type="file" id="file" onChange={this.handleChange} />        
        </label>

        {this.state.progress}
        <button className="button" onClick={this.handleUpload}>Upload</button>
        <img
          className="ref"
          src={this.state.downloadURL || "https://via.placeholder.com/400x300"}
          alt="Uploaded Images"
          height="300"
          width="400"
        />


        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              ADD BOARD
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/" class="btn btn-primary">Book List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" name="title" value={title} onChange={this.onChange} placeholder="Title" />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <textArea class="form-control" name="description" onChange={this.onChange} placeholder="Description" cols="80" rows="3">{description}</textArea>
              </div>
              <div class="form-group">
                <label for="author">Author:</label>
                <input type="text" class="form-control" name="author" value={author} onChange={this.onChange} placeholder="Author" />
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
