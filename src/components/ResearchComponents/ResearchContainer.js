import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import ResearchStart from './ResearchStart';
import ResearchForm from './ResearchForm';
import CollegePrograms from './CollegePrograms';
import ResearchAcademicStats from './ResearchAcademicStats';

class ResearchContainer extends React.Component {
  constructor() {

    super();

    this.addStart = this.addStart.bind(this);
    this.addAcademic = this.addAcademic.bind(this);
    this.addSpecial = this.addSpecial.bind(this);

    this.state = {
      Schools: [],
      showStart: true,
      showAcademic: false,
      showSpecial: false
    };
  }
  componentWillMount() {
    axios.get(`https://kipp-madness-api.herokuapp.com/teams/${this.props.params.id}.json`)
      .then((response) =>{
        this.setState({Schools:response.data});
      });
    }


    addStart() {
      this.setState({showStart: true});
      this.setState({showAcademic: false});
      this.setState({showSpecial: false});
    }
    addAcademic() {
      this.setState({showStart: false});
      this.setState({showAcademic: true});
      this.setState({showSpecial: false});
    }
    addSpecial() {
      this.setState({showStart: false});
      this.setState({showAcademic: false});
      this.setState({showSpecial: true});
    }


    render() {
      const start = this.state.showStart ? <ResearchStart map={this.collegeMap} props={this.props} className="research__initial" school={this.state.Schools}/> : '';
      const academic = this.state.showAcademic ? <ResearchAcademicStats props={this.props} className="research__initial" school={this.state.Schools}/> : '';
      const programs = this.state.showSpecial ? <CollegePrograms props={this.props} className="research__initial" school={this.state.Schools}/> : '';

        return (
            <div>
                <nav className="nav__container">
                    <ul>
                        <li className={ this.state.showStart ? 'nav__items is__active': 'nav__items' } onClick={this.addStart}>College Starter</li>
                        <li className={ this.state.showAcademic ? 'nav__items is__active': 'nav__items' } onClick={this.addAcademic}>Academic Stats</li>
                        <li className={ this.state.showSpecial ? 'nav__items is__active': 'nav__items' }onClick={this.addSpecial}>Watch & Learn</li>
                        <Link to="/bracket" className="nav__items">Back to Bracket</Link>

                    </ul>
                </nav>
                <div className="research__container">
                  {start}
                  {academic}
                  {programs}
                  <ResearchForm user={this.props.user} roster={this.props.roster} updateFormInput={this.props.updateFormInput} props={this.props} school={this.state.Schools} className="research__form" />
                </div>
            </div>
        );
    }
}

export default ResearchContainer;
