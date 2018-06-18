import React from 'react';
import firebase from 'firebase';

class JobPreview extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {

  }
  render() {
    return (
      <div>
        <p>{this.props.title}</p>
        <p>{this.props.company}</p>
        <p>{this.props.location}</p>
      </div>

    )
  }
}
export default JobPreview;