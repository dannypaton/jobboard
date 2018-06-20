import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class JobFeed extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      jobs:[],
      showingJobId: ''

    }
  }
  componentDidMount(){
    const dbRef = firebase.database().ref(`jobs/approved`)
    dbRef.on('value', snapshot =>{
      this.setState({
        jobs: snapshot.val()
      })
    })

  }
  showJobDetails = (jobId) =>{
    this.setState({
      showDetails:true,
      showingJobId:jobId
    })

  }

  render(){
    return(
      <div>
      <Search />

      {Object.keys(this.state.jobs).map((i) =>{
        let job= this.state.jobs[i]
        
        return(
          <div key={i}>
            <JobPreview 
              showJobDetails={this.showJobDetails}
              saveJob={this.saveJob}
              key={i}
              companyName={job.companyName}
              jobTitle={job.jobTitle}
              jobLocation={job.jobLocation}
              jobDescription={job.jobDescription}
              datePosted={job.timeCreated}
              jobId={i}
              userId={this.props.userId}
            />

          </div>

        )
      })}

        {this.state.showDetails && < FullJob
                jobId={this.state.showingJobId}
        jobTitle={this.state.jobs[`${this.state.showingJobId}`]['jobTitle']}
        jobLocation={this.state.jobs[`${this.state.showingJobId}`]['jobLocation']}
        jobDescription={this.state.jobs[`${this.state.showingJobId}`]['jobDescription']}
        companyName={this.state.jobs[`${this.state.showingJobId}`]['companyName']}
        datePosted={this.state.jobs[`${this.state.showingJobId}`]['datePosted']}
        approved={this.state.jobs[`${this.state.showingJobId}`]['approved']}
        jobCommitment={this.state.jobs[`${this.state.showingJobId}`]['jobCommitment']}

            />}

      </div>

    )
  }
}
export default JobFeed