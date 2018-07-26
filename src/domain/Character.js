import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character {
  constructor(name,
              baseID,
              level,
              starLevel,
              gearLevel,
              gearPieces,
              galacticPower,
              physDmgPct,
              baseStats,
              totalStats,
              optimizationPlan,
              namedPlans,
              tags,
              extraTags,
              useOnly5DotMods,
              isLocked
  ) {
    this.name = name;
    this.baseID = baseID;
    this.level = level;
    this.starLevel = starLevel;
    this.gearLevel = gearLevel;
    this.gearPieces = gearPieces;
    this.galacticPower = galacticPower;
    this.physDmgPct = physDmgPct;
    this.baseStats = baseStats;
    this.totalStats = totalStats;
    this.optimizationPlan = optimizationPlan;
    this.namedPlans = namedPlans;
    this.tags = tags;
    this.extraTags = extraTags;
    this.useOnly5DotMods = useOnly5DotMods || false;
    this.isLocked = isLocked || false
  }

  static basicCharacter(name, baseID, physDmgPct, defaultPlan, namedPlans, tags, extraTags, useOnly5dotMods) {
    return new Character(
      name,
      baseID,
      1,
      1,
      1,
      [],
      0,
      physDmgPct,
      null,
      null,
      defaultPlan,
      namedPlans,
      tags,
      extraTags,
      useOnly5dotMods,
      false
    );
  }

  static defaultCharacter(name) {
    return new Character(
      name,
      '',
      1,
      1,
      1,
      [],
      0,
      1,
      null,
      null,
      new OptimizationPlan(),
      {},
      [],
      [],
      false,
      false
    );
  }

  /**
   * Return a shallow copy of this character
   */
  clone() {
    return new Character(
      this.name,
      this.baseID,
      this.level,
      this.starLevel,
      this.gearLevel,
      this.gearPieces,
      this.galacticPower,
      this.physDmgPct,
      this.baseStats,
      this.totalStats,
      this.optimizationPlan,
      Object.assign({}, this.namedPlans),
      this.tags,
      this.extraTags,
      this.useOnly5DotMods,
      this.isLocked
    );
  }

  /**
   * Comparison function useful for sorting characters by Galactic Power. If that has a higher GP, returns a value > 0.
   * If this has a higher GP, returns a value < 0. If the GPs are the same, returns a value to sort by character name.
   * @param that Character
   */
  compareGP(that) {
    if (that.galacticPower === this.galacticPower) {
      return this.name.localeCompare(that.name);
    }
    return that.galacticPower - this.galacticPower;
  }

  /**
   * Checks whether this character matches a given filter string in name or tags
   * @param filterString string The string to filter by
   * @returns boolean
   */
  matchesFilter(filterString) {
    return this.name.toLowerCase().includes(filterString) ||
      (this.tags || []).concat(this.extraTags || []).some(tag => tag.toLowerCase().includes(filterString))
  }

  /**
   * Apply any variable properties (level, starLevel, etc) from other to this character
   * @param other Character
   */
  apply(other) {
    this.level = other.level;
    this.starLevel = other.starLevel;
    this.gearLevel = other.gearLevel;
    this.gearPieces = other.gearPieces;
    this.baseStats = other.baseStats || this.baseStats;
    this.totalStats = other.totalStats || this.totalStats;
    this.galacticPower = other.galacticPower;
    this.optimizationPlan = other.optimizationPlan;
    this.namedPlans = Object.assign(this.namedPlans, other.namedPlans);
    this.useOnly5DotMods = other.useOnly5DotMods;
    this.isLocked = other.isLocked;
  }

  serialize() {
    let characterObject = {};

    const namedPlansObject = Object.keys(this.namedPlans).reduce((obj, key) => {
      obj[key] = this.namedPlans[key].serialize();
      return obj;
    }, {});

    characterObject.name = this.name;
    characterObject.baseID = this.baseID;
    characterObject.level = this.level;
    characterObject.starLevel = this.starLevel;
    characterObject.gearLevel = this.gearLevel;
    characterObject.gearPieces = this.gearPieces;
    characterObject.galacticPower = this.galacticPower;
    characterObject.physDmgPercent = this.physDmgPct;
    characterObject.baseStats = this.baseStats;
    characterObject.totalStats = this.totalStats;
    characterObject.optimizationPlan = this.optimizationPlan.serialize();
    characterObject.namedPlans = namedPlansObject;
    characterObject.useOnly5DotMods = this.useOnly5DotMods;
    characterObject.isLocked = this.isLocked;

    return characterObject;
  }

  static deserialize(characterJson, version) {
    const serializedNamedPlans = characterJson.namedPlans || {
      unnamed: characterJson.optimizationPlan
    };
    let planDeserializer;
    if (!version || version < '1.1.0') {
      planDeserializer = OptimizationPlan.deserializeVersionOne;
    } else {
      planDeserializer = OptimizationPlan.deserialize;
    }

    const namedPlansObject = Object.keys(serializedNamedPlans).reduce((obj, key) => {
      obj[key] = planDeserializer(serializedNamedPlans[key]);
      return obj;
    }, {});

    return new Character(
      characterJson.name,
      '',
      characterJson.level,
      characterJson.starLevel || 1,
      characterJson.gearLevel || 1,
      characterJson.gearPieces || [],
      characterJson.galacticPower || 0,
      characterJson.physDmgPercent,
      characterJson.baseStats ? BaseStats.deserialize(characterJson.baseStats) : new BaseStats(),
      characterJson.totalStats ? BaseStats.deserialize(characterJson.totalStats) : new BaseStats(),
      planDeserializer(characterJson.optimizationPlan),
      namedPlansObject,
      [],
      [],
      characterJson.useOnly5DotMods,
      characterJson.isLocked || false
    );
  }
}

const DamageType = {
  'physical': 1,
  'special': 0,
  'mixed': .5
};

Object.freeze(DamageType);

export default Character;

export {DamageType};
