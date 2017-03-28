import React from 'react';
import Region from './Region';
import FinalFour from './FinalFour';
import axios from 'axios';
import Dummy4 from '../../Data/Dummy4.js';
import Dummy2 from '../../Data/Dummy2.js';

class MainBracket extends React.Component {
  constructor() {
    super();
    this.filterByRegion = this.filterByRegion.bind(this);
    // this.filterByWins = this.filterByWins.bind(this);
    // this.filterByPredictedWins = this.filterByPredictedWins.bind(this);
    this.checkFinalFour = this.checkFinalFour.bind(this);
    // this.checkNatChamp = this.checkNatChamp.bind(this);
    this.sendBracketData = this.sendBracketData.bind(this);

    this.state = {
      AllTeams: [],
      East: [],
      West: [],
      Midwest: [],
      South: [],
      FinalFour: Dummy4.user_predictions,
      NatChamp: Dummy2.user_predictions,
      Champion: []
    };
  }
  componentDidMount() {
    const currentUser = this.props.user || 2; // remove 'or' for production

    axios.get(`https://kipp-madness-api.herokuapp.com/users/${currentUser}.json`)
      .then((response) =>{
        const regionalBreakdown = response.data.user_predictions;
        this.filterByRegion(1, regionalBreakdown);
        this.filterByRegion(2, regionalBreakdown);
        this.filterByRegion(3, regionalBreakdown);
        this.filterByRegion(4, regionalBreakdown);
        this.setState({AllTeams: regionalBreakdown});
        // for actual wins // vvv
        // this.filterByWins(4, regionalBreakdown);
        // this.filterByWins(5, regionalBreakdown);
        // this.filterByWins(6, regionalBreakdown);
      });
    }

    checkFinalFour(arg1, arg2) {
      let FinalFour = [...this.state.FinalFour];

      if (arg1 === 1) {
        FinalFour[0] = arg2;
      }
      if (arg1 === 2) {
        FinalFour[1] = arg2;
      }
      if (arg1 === 3) {
        FinalFour[2] = arg2;
      }
      if (arg1 === 4) {
        FinalFour[3] = arg2;
      }
      this.setState({FinalFour});
    }
    // filterByWins(score, data) {
    //     const teams = data.filter((val) => {
    //         return val.team.wins === score;
    //     });
    //     if (score === 4) {
    //         this.setState({FinalFour: teams});
    //     }
    //     if (score === 5) {
    //         this.setState({NatChamp: teams});
    //     }
    //     if (score === 6) {
    //         this.setState({Champion: teams});
    //     }
    //     return
    // }
    //
    // filterByPredictedWins(score, data) {
    //     const teams = data.filter((val) => {
    //         return val.predicted_wins === score;
    //     });
    //     if (score === 4) {
    //         this.setState({FinalFour: teams});
    //     }
    //     if (score === 5) {
    //         this.setState({NatChamp: teams});
    //     }
    //     if (score === 6) {
    //         this.setState({Champion: teams});
    //     }
    //     return
    // }

    filterByRegion(region, data) {
        const teams = data.filter((val) => {
            return val.team.region === region;
        });
        if (region === 1) {
            this.setState({East: teams});
        }
        if (region === 2) {
            this.setState({West: teams});
        }
        if (region === 3) {
            this.setState({Midwest: teams});
        }
        if (region === 4) {
            this.setState({South: teams});
        }
        return
    }

    sendBracketData(event) {
      let currentId = this.props.user;
      event.preventDefault();

      let allTeams = this.state.AllTeams;
      let brentice = {
        "id":currentId,
        arrWins: []
      };
      allTeams.map((team) => {
          let data = {
            "id": team.id,
            "predicted_wins": team.predicted_wins
          }
          brentice.arrWins.push(data);

      });
      console.log('in send bracket data', brentice);
      // console.log('in send bracket data', submitBracket);
      axios.put(`https://kipp-madness-api.herokuapp.com/user_predictions/batch_update`, brentice)
        .then((response) =>{
          console.log('They\'re good dogs Bront');
        });

    }

    render() {
      if (!this.state.AllTeams.length) {
        return (<h1>Loading</h1>);
      }

        return (
            <div className="component__container">
              <Region filter={this.filterByPredictedWins} check={this.checkFinalFour} teams={this.state.East} allTeams={this.state.AllTeams}/>
              <Region filter={this.filterByPredictedWins} check={this.checkFinalFour} teams={this.state.West} allTeams={this.state.AllTeams}/>
              <Region filter={this.filterByPredictedWins} check={this.checkFinalFour} teams={this.state.Midwest} allTeams={this.state.AllTeams} />
              <Region filter={this.filterByPredictedWins} check={this.checkFinalFour} teams={this.state.South} allTeams={this.state.AllTeams}/>
              <FinalFour teams={this.state.FinalFour} two={this.state.NatChamp} one={this.state.Champion} allTeams={this.state.AllTeams}/>
              <form ref={(input) => this.submitBracket = input} onSubmit={(event) => this.sendBracketData(event)}>
                <input className="kippBtn" type="submit"></input>
              </form>
            </div>
        );
    }
}

export default MainBracket;
