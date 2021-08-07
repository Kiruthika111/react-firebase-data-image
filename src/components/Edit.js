import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
var image_link_firebase;

class Edit extends Component {

  constructor(props) {
    var today = new Date(),
    time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    super(props);
    this.state = {
      key: '',
      title: '',
      description: '',
      author: '',
      downloadURL: null,
      currentDate: date.toLocaleString(),
      currentTime: time.toLocaleString()
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('boards').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const board = doc.data();
        this.setState({
          key: doc.id,
          title: board.title,
          description: board.description,
          author: board.author,
          downloadURL: board.downloadURL
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({board:state});
  }

  onSubmit = (e) => {
    e.preventDefault();
    image_link_firebase = this.state.downloadURL;
    console.log(image_link_firebase);
    this.setState({
        downloadURL: image_link_firebase
    })
    // console.log(downloadURL);
    console.log(image_link_firebase);
    const { title, description, author, downloadURL } = this.state;

    const updateRef = firebase.firestore().collection('boards').doc(this.state.key);
    updateRef.set({
      title,
      description,
      author,
      downloadURL
    }).then((docRef) => {
      this.setState({
        key: '',
        title: '',
        description: '',
        author: '',
        downloadURL: ''
      });
      this.props.history.push("/show/"+this.props.match.params.id)
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

handleDelete = () => {
  var storage = firebase.storage();
  let pictureRef = storage.refFromURL(this.state.downloadURL);
    pictureRef.delete()
      .then(() => {
          this.setState({
            downloadURL: null
          })
        })
      .catch((err) => {
        console.log(err);
      });
}


handleUpload = () =>{
  if(this.state.image){
  if(this.state.downloadURL){
    this.handleDelete();
  }  
  let file = this.state.image;
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var file_Name = this.state.currentDate + '_' + this.state.currentTime  ;
  var uploadTask = storageRef.child('blogimages/' + file_Name).put(file);

  
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
  else{
    alert("select an image");
  }
  /*
  // console.log(this.state.image);
  let file = this.state.image;
  var storage = firebase.storage();
  var storageRef = storage.ref();
  let pictureRef = storage.refFromURL(this.state.downloadURL);
  var file_Name = file.name +  this.state.currentDate + this.state.currentTime  ;
  var uploadTask = storageRef.child('blogimages/' + file_Name).put(file);

  if(this.state.downloadURL){
  pictureRef.delete()
    .then(() => {
        this.setState({
          downloadURL: null
        })
      })
    .catch((err) => {
      console.log(err);
    });
  }

  
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
 */
}


  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              EDIT BOARD
            </h3>
          </div>


          <div class="panel-body">

          <h4>upload image</h4>
        <label>
          Choose file
        <input type="file" id="file" onChange={this.handleChange} />        
        </label>

        {this.state.progress}
        <button className="button" onClick={this.handleUpload}>Upload</button>
        <button className="button" onClick={this.handleDelete}>Delete Image</button>
        <img
          className="ref"
          src={this.state.downloadURL || "https://via.placeholder.com/400x300"}
          alt="Uploaded Images"
          height="300"
          width="400"
        />


            <h4><Link to={`/show/${this.state.key}`} class="btn btn-primary">Board List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" name="title" value={this.state.title} onChange={this.onChange} placeholder="Title" />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" class="form-control" name="description" value={this.state.description} onChange={this.onChange} placeholder="Description" />
              </div>
              <div class="form-group">
                <label for="author">Author:</label>
                <input type="text" class="form-control" name="author" value={this.state.author} onChange={this.onChange} placeholder="Author" />
              </div>
              <div class="form-group">
                <span>downloadURL:</span> <br/>
                <span>{this.state.downloadURL} </span>
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;