import withFeedTargets, { feedTargetsOf } from "./withFeedTargets";
import Character from "../domain/Character";
import OptimizationPlan from "../domain/OptimizationPlan";
import { OptimizerSettings } from "../domain/CharacterDataClasses";

// A base ID with no built-in (handwritten) targets in characterSettings
const NO_DEFAULTS = "NOT_A_REAL_CHARACTER";

function metaTarget(speed, physDmg) {
  return {
    name: "HotUtils Meta",
    health: 4,
    protection: 37,
    speed: speed,
    critDmg: 0,
    potency: 0,
    tenacity: 0,
    physDmg: physDmg,
    specDmg: 0,
    critChance: 0,
    armor: 1,
    resistance: 1,
    accuracy: 0,
    critAvoid: 0,
    upgradeMods: true,
    primaryStatRestrictions: {},
    setRestrictions: {},
    targetStats: [],
    useOnlyFullSets: false,
  };
}

function character(id, targets = []) {
  return new Character(id).withOptimizerSettings(
    new OptimizerSettings(new OptimizationPlan(), targets, 1, false, false)
  );
}

function metaTargetsOf(character) {
  return character.optimizerSettings.targets.filter(
    (target) => "HotUtils Meta" === target.name
  );
}

describe("feedTargetsOf", () => {
  it("collects each unit's target by base ID, leaving out units without one", () => {
    const vader = metaTarget(100, 26);
    expect(
      feedTargetsOf([
        { baseId: "LORDVADER", target: vader },
        { baseId: "SUPREMELEADERKYLOREN", target: null },
        { baseId: "MILLENNIUMFALCON", target: null },
      ])
    ).toEqual({ LORDVADER: vader });
  });

  it("finds nothing in a feed that has no target field", () => {
    expect(
      feedTargetsOf([{ baseId: "LORDVADER", name: "Lord Vader" }])
    ).toEqual({});
    expect(feedTargetsOf(undefined)).toEqual({});
  });
});

describe("withFeedTargets", () => {
  it("gives a character with no handwritten targets the HotUtils Meta target to choose", () => {
    const { [NO_DEFAULTS]: updated } = withFeedTargets(
      { [NO_DEFAULTS]: character(NO_DEFAULTS) },
      { [NO_DEFAULTS]: metaTarget(100, 26) }
    );

    expect(updated.targets().map((target) => target.name)).toEqual([
      "HotUtils Meta",
    ]);
    expect(updated.defaultTarget().name).toEqual("HotUtils Meta");
    expect(updated.defaultTarget().rawSpeed).toEqual(100);
    expect(updated.defaultTarget().rawPhysDmg).toEqual(26);
  });

  it("overwrites the HotUtils Meta target on the next fetch instead of adding another", () => {
    const first = withFeedTargets(
      { [NO_DEFAULTS]: character(NO_DEFAULTS) },
      { [NO_DEFAULTS]: metaTarget(100, 26) }
    );
    const second = withFeedTargets(first, {
      [NO_DEFAULTS]: metaTarget(90, 40),
    });

    const metas = metaTargetsOf(second[NO_DEFAULTS]);
    expect(metas).toHaveLength(1);
    expect(metas[0].rawSpeed).toEqual(90);
    expect(metas[0].rawPhysDmg).toEqual(40);
  });

  it("keeps the player's own targets and characters the feed has no target for", () => {
    const mine = new OptimizationPlan("Mine", 10, 0, 100);
    const untouched = character("SUPREMELEADERKYLOREN", [mine]);
    const characters = {
      LORDVADER: character("LORDVADER", [mine]),
      SUPREMELEADERKYLOREN: untouched,
    };

    const updated = withFeedTargets(characters, {
      LORDVADER: metaTarget(100, 26),
    });

    expect(
      updated.LORDVADER.optimizerSettings.targets.map((target) => target.name)
    ).toEqual(["Mine", "HotUtils Meta"]);
    expect(updated.SUPREMELEADERKYLOREN).toBe(untouched);
  });

  it("changes nothing when the feed carries no targets", () => {
    const characters = { [NO_DEFAULTS]: character(NO_DEFAULTS) };

    expect(withFeedTargets(characters, {})).toBe(characters);
    expect(withFeedTargets(characters, undefined)).toBe(characters);
  });
});
