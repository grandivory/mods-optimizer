import React from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import characters from "../../constants/characters";

class OptimizerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'view': 'sets',
    };

    if ('function' === typeof props.saveState) {
      this.saveState = props.saveState;
    } else {
      this.saveState = function() {};
    }

    this.state.modAssignments = this.optimizeMods(props.mods);
  }

  render() {
    const mods = this.props.mods;

    return (
      <div className={'optimizer-view'}>
        <nav className={'sub-nav'}>
          <button className={'sets' === this.state.view ? 'active' : ''}
                  onClick={this.updateView.bind(this, 'sets')}>View sets</button>
          <button className={'mods' === this.state.view ? 'active' : ''}
                  onClick={this.updateView.bind(this, 'mods')}>Show me the mods to move!</button>
        </nav>
        {'sets' === this.state.view &&
          <ReviewSets characterSets={this.state.modAssignments} mods={mods} />}
        {'mods' === this.state.view &&
          <ReviewList mods={mods} saveState={this.saveState} />
        }
      </div>
    );
  }

  /**
   * Update the view with a new page
   *
   * @param view The name of the new view to show. Currently, either 'sets' or 'mods'
   */
  updateView(view) {
    this.setState({'view': view});
  }

  /**
   * Run the optimizer, and store the results in this.state.modAssignments
   *
   * @param mods Array the mods to use in the optimization
   */
  optimizeMods(mods) {
    const modAssignments = new Optimizer(mods).optimizeMods([
      characters['CT-7567 "Rex"'],
      characters['Wampa'],
      characters['Mother Talzin'],
      characters['Darth Nihilus'],
      characters['General Kenobi'],
      characters['Darth Vader'],
      characters['BB-8'],
      characters['Grand Admiral Thrawn'],
      characters['Commander Luke Skywalker'],
      characters['Rey (Jedi Training)'],
      characters['Resistance Trooper'],
      characters['Rey (Scavenger)'],
      characters['R2-D2'],
      characters['Sabine Wren'],
      characters['Han Solo'],
      characters['Chirrut Îmwe'],
      characters['Jedi Knight Anakin'],
      characters['General Veers'],
      characters['Shoretrooper'],
      characters['Death Trooper'],
      characters['Snowtrooper'],
      characters['Colonel Starck'],
      characters['Boba Fett'],
      characters['Zam Wesell'],
      characters['Greedo'],
      characters['Jawa Engineer'],
      characters['Ewok Elder'],
      characters['Admiral Ackbar'],
      characters['Stormtrooper Han'],
      characters['Princess Leia'],
      characters['Ezra Bridger'],
      characters['Hoth Rebel Scout'],
      characters['Hoth Rebel Soldier'],
      characters['Jyn Erso'],
      characters['Baze Malbus'],
      characters['Cassian Andor'],
      characters['K-2SO'],
      characters['Poe Dameron'],
      characters['Finn'],
      characters['Resistance Pilot'],
      characters['Darth Sidious'],
      characters['Chopper'],
      characters['Hera Syndulla'],
      characters['Garazeb "Zeb" Orrelios'],
      characters['Kanan Jarrus'],
      characters['Rebel Officer Leia Organa'],
      characters['Captain Han Solo'],
      characters['Grand Master Yoda'],
      characters['Biggs Darklighter'],
      characters['Wedge Antilles'],
      characters['Emperor Palpatine'],
      characters['TIE Fighter Pilot'],
      characters['Stormtrooper'],
      characters['IG-88'],
      characters['Dengar'],
      characters['Sith Assassin'],
      characters['Count Dooku'],
      characters['Sith Trooper'],
      characters['Asajj Ventress'],
      characters['Old Daka'],
      characters['Nightsister Acolyte'],
      characters['Talia'],
      characters['Nightsister Initiate'],
      characters['Darth Maul']
    ]);

    this.saveState();

    return modAssignments;
  }
}

export default OptimizerView;
