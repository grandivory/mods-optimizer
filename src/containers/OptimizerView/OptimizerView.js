import React from "react";
import Optimizer from "../../utils/Optimizer";
import characterOptimizations from "../../constants/characterOptimizations";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";

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
      characterOptimizations['CT-7567 "Rex"'],
      characterOptimizations['Wampa'],
      characterOptimizations['Mother Talzin'],
      characterOptimizations['Darth Nihilus'],
      characterOptimizations['General Kenobi'],
      characterOptimizations['Darth Vader'],
      characterOptimizations['BB-8'],
      characterOptimizations['Grand Admiral Thrawn'],
      characterOptimizations['Commander Luke Skywalker'],
      characterOptimizations['Rey (Jedi Training)'],
      characterOptimizations['Resistance Trooper'],
      characterOptimizations['Rey (Scavenger)'],
      characterOptimizations['R2-D2'],
      characterOptimizations['Sabine Wren'],
      characterOptimizations['Han Solo'],
      characterOptimizations['Chirrut Îmwe'],
      characterOptimizations['Jedi Knight Anakin'],
      characterOptimizations['General Veers'],
      characterOptimizations['Shoretrooper'],
      characterOptimizations['Death Trooper'],
      characterOptimizations['Snowtrooper'],
      characterOptimizations['Colonel Starck'],
      characterOptimizations['Boba Fett'],
      characterOptimizations['Zam Wesell'],
      characterOptimizations['Greedo'],
      characterOptimizations['Jawa Engineer'],
      characterOptimizations['Ewok Elder'],
      characterOptimizations['Admiral Ackbar'],
      characterOptimizations['Stormtrooper Han'],
      characterOptimizations['Princess Leia'],
      characterOptimizations['Ezra Bridger'],
      characterOptimizations['Hoth Rebel Scout'],
      characterOptimizations['Hoth Rebel Soldier'],
      characterOptimizations['Jyn Erso'],
      characterOptimizations['Baze Malbus'],
      characterOptimizations['Cassian Andor'],
      characterOptimizations['K-2SO'],
      characterOptimizations['Poe Dameron'],
      characterOptimizations['Finn'],
      characterOptimizations['Resistance Pilot'],
      characterOptimizations['Darth Sidious'],
      characterOptimizations['Chopper'],
      characterOptimizations['Hera Syndulla'],
      characterOptimizations['Garazeb "Zeb" Orrelios'],
      characterOptimizations['Kanan Jarrus'],
      characterOptimizations['Rebel Officer Leia Organa'],
      characterOptimizations['Captain Han Solo'],
      characterOptimizations['Grand Master Yoda'],
      characterOptimizations['Biggs Darklighter'],
      characterOptimizations['Wedge Antilles'],
      characterOptimizations['Emperor Palpatine'],
      characterOptimizations['TIE Fighter Pilot'],
      characterOptimizations['Stormtrooper'],
      characterOptimizations['IG-88'],
      characterOptimizations['Dengar'],
      characterOptimizations['Sith Assassin'],
      characterOptimizations['Count Dooku'],
      characterOptimizations['Sith Trooper'],
      characterOptimizations['Asajj Ventress'],
      characterOptimizations['Old Daka'],
      characterOptimizations['Nightsister Acolyte'],
      characterOptimizations['Talia'],
      characterOptimizations['Nightsister Initiate'],
      characterOptimizations['Darth Maul']
    ]);

    this.saveState();

    return modAssignments;
  }
}

export default OptimizerView;
