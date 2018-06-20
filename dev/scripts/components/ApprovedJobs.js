import React from 'react';
import firebase from 'firebase';
import JobPreview from './JobPreview'
import Search from './Search'
import FullJob from './FullJob'

class ApprovedJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            approvedJobs: []
        }
    }
    componentDidMount() {
        const dbRef = firebase.database().ref(`jobs/approved`)

        dbRef.on('value', snapshot => {
            this.setState({ approvedJobs: snapshot.val() });
        })

    }
    showJobDetails = (jobId) => {
        this.setState({
            showDetails: true,
            showingJobId: jobId
        })
    }

    render() {
        return <div>
            This is approved Jobs
            <Search />
            {this.state.approvedJobs && Object.keys(this.state.approvedJobs).map(jobId => {
              let job = this.state.approvedJobs[jobId];

              return 
                  <JobPreview showJobDetails={this.showJobDetails} saveJob={this.saveJob} key={jobId} companyName={job.companyName} jobTitle={job.jobTitle} jobLocation={job.jobLocation} jobDescription={job.jobDescription} datePosted={job.timeCreated} jobId={i} userId={this.props.userId} />;
            })}
            {this.state.showDetails && <FullJob
                jobId={this.state.showingJobId}
                jobTitle={this.state.approvedJobs[`${this.state.showingJobId}`]['jobTitle']}
                jobLocation={this.state.approvedJobs[`${this.state.showingJobId}`]['jobLocation']}
                jobDescription={this.state.approvedJobs[`${this.state.showingJobId}`]['jobDescription']}
                companyName={this.state.approvedJobs[`${this.state.showingJobId}`]['companyName']}
                datePosted={this.state.approvedJobs[`${this.state.showingJobId}`]['datePosted']}
                approved={this.state.approvedJobs[`${this.state.showingJobId}`]['approved']}
                jobCommitment={this.state.approvedJobs[`${this.state.showingJobId}`]['jobCommitment']}

            />}
          </div>;
    }
}
export default ApprovedJobs