import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, NavLink, Route} from 'react-router-dom';
import firebase from 'firebase';
import ReadmeLoginForm from './components/ReadmeLoginForm';
import EmailLoginForm from './components/EmailLoginForm';
import UserBar from './components/UserBar';
import AddJobForm from './components/AddJobForm';
import JobFeed from './components/JobFeed';
import PendingJobs from './components/PendingJobs';
import ApprovedJobs from './components/ApprovedJobs';
import MyPostedJobs from './components/MyPostedJobs';
import Search from './components/Search'

const config = {
  apiKey: "AIzaSyDhpZQDqygKV1G_ne9JJwxxWPnYYKxaX0Q",
  authDomain: "hy-jobs-board.firebaseapp.com",
  databaseURL: "https://hy-jobs-board.firebaseio.com",
  projectId: "hy-jobs-board",
  storageBucket: "hy-jobs-board.appspot.com",
  messagingSenderId: "1023755007156"
};
firebase.initializeApp(config);


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      userId: '', 
      provider:''    
    }
  }
  componentDidMount(){
    
    this.dbRef = firebase.database().ref();

    this.userRef = firebase.database().ref(`users/${this.state.userId}`)
    
    firebase.auth().onAuthStateChanged(user => {

      if (user !== null) {
        // console.log(user)
        this.dbRef.on('value', snapshot => { });
        this.setState({
          loggedIn: true,
          userId: user.uid,
          userName: user.displayName
        });
        this.userRef.on('value', snapshot =>{
          let resp = snapshot.val()
          resp = resp[this.state.userId]
          this.setState({
            admin: resp.admin,
            alumni: resp.alumni,
            jobPoster: resp.jobPoster
          })
        })

      } else {
        this.setState({
          loggedIn: false,
          userId: '',
          userName: '',
          admin:'',
          alumni:'',
          jobPoster:''

        });
      }
    });
  } 

  onChangeEmail = (e) =>{
    this.setState({
      email:e.target.value
    })
  }

  
  onChangePassword = (e) =>{
    this.setState({
      password: e.target.value
    })
  }

  loginWithReadme = (e) =>{
    e.preventDefault();

    this.setState({
      provider:'readme'
    })
  }

  loginWithGoogle = (e) => {
    e.preventDefault();
    
    this.setState({
      provider: 'google'
    })

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        this.setState({
          loggedIn: true
        });
        //find the user's uid from the firebase auth process
        const userRef = firebase.database().ref(`users/${res.user.uid}`)
        //if the user exists already in the database, return
        userRef.on('value', function (snapshot) {
          if (snapshot.val()==null){
          // else, create a user in the database 
            userRef.set({
              'name':res.user.displayName,
              'jobPoster':true,
              'alumni':false,
              'admin':false
            })
          } else{
            console.log('already there!')
            return
          }
        });
      })
      .catch(err => {

      });

  }

  loginWithEmail = (e) => {
    e.preventDefault();
    this.setState({
      provider: 'email'
    })
  }

  signOut = () => {
    firebase.auth().signOut();
    this.dbRef.off('value');
    this.setState({
      loggedIn: false,
      userId: '',
      provider:'',
      admin: '',
      alumni: '',
      jobPoster: ''
    });
  }
  postAJob = () => {
    this.setState({
      editing:true
    })
  }
  closePostAJob = () =>{
    this.setState({
      editing:false
    })
  }
  getData(param) {
    return new Promise((resolve, reject) => {
      const dbRef = firebase.database().ref(`jobs/approved`)
      resolve(
        console.log(param)
        // dbRef.orderByChild(param).equalTo(param).once('value', snapshot => {
        //   console.log(snapshot.val());
        // })
      )
      
    })

  }
  findJobInDatabase(jobLocation, jobCommitment, timeSincePosting, searchTerm, salary, searchKeywords){
    let queries =[jobLocation, jobCommitment, timeSincePosting, searchTerm, salary, searchKeywords]

    // filter the queries and make a new array of the not-null ones
    //do the promise on all the things in the new array
    queries.map(query => {
      return this.getData(query)
    })

    // Promise.all(queries).then( res =>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log(err)
    //   }
    // }

    // dbRef.orderByChild(`companyName`).equalTo(``).once('value', snapshot => {
    //   console.log(snapshot.val())
    // })
      
}
  search = (e, jobLocation, jobCommitment, timeSincePosting, searchTerm,salary, searchKeywords) => {
    e.preventDefault();
    console.log('search')
    this.findJobInDatabase(jobLocation, jobCommitment, timeSincePosting, searchTerm, salary, searchKeywords)
  } 
  render() {
    return <div className="wrapper">
        {this.state.loggedIn ? <div>
            <UserBar userId={this.state.userId} userName={this.state.userName} userEmail={this.state.email} loggedIn={this.state.loggedIn} provider={this.state.provider} jobPoster={this.state.jobPoster} alumni={this.state.alumni} admin={this.state.admin} signOut={this.signOut} />

            {this.state.editing ? <AddJobForm editing={this.state.editing} userId={this.state.userId} close={this.closePostAJob} /> : <button onClick={this.postAJob}>
                Post a job </button>}
                <nav>
                  {/* <NavLink>Pending Jobs</NavLink>
                  <NavLink>My Posted Jobs</NavLink>
                  <NavLink>Approved Jobs</NavLink>
                  <NavLink>Approved Jobs</NavLink> */}

                </nav>
            <Search userId={this.state.userId} search={this.search} />
            <div className="tab-container">
          {this.state.admin && <PendingJobs userId={this.state.userId}/>}
              {this.state.jobPoster && <MyPostedJobs userId={this.state.userId} />}
              {this.state.alumni && <JobFeed userId={this.state.userId}/>}
          {this.state.admin && <ApprovedJobs userId={this.state.userId}/>}
            </div>
          </div> : <div>
            <p>Sign up or sign in with</p>
            <button onClick={this.loginWithReadme}>Readme</button>
            <button onClick={this.loginWithGoogle}>Google</button>
            <button onClick={this.loginWithEmail}>Email</button>
            {this.state.loggedIn === false && this.state.provider === "readme" && <ReadmeLoginForm />}
            {this.state.loggedIn === false && this.state.provider === "email" && <EmailLoginForm />}
          </div>}
      </div>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
