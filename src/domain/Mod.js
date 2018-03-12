class Mod {
  constructor(id, slot, set, level, pips, primaryStat, secondaryStats, currentCharacter) {
    this.id = id;
    this.slot = slot;
    this.set = set;
    this.level = level;
    this.pips = pips;
    this.primaryStat = primaryStat;
    this.secondaryStats = secondaryStats;
    this.currentCharacter = currentCharacter;
  }

  /**
   * Given a stat classifier, apply the proper class to each secondary stat this mod has.
   * @param statClassifier
   */
  classifyStats(statClassifier) {
    for (let j = 0; j < this.secondaryStats.length; j++) {
      let stat = this.secondaryStats[j];
      stat.setClass(statClassifier.classify(stat));
    }
  }
}

export default Mod;
