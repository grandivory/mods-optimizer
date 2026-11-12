import OptimizationPlan from "../domain/OptimizationPlan";
import { mapObjectByKeyAndValue } from "./mapObject";

/**
 * Collect the target each unit of the /characters/ feed carries ("HotUtils Meta", HotUtils' meta stat weights), keyed by
 * base ID. Units without a target (no meta weights, ships), and every unit of a feed that has no `target` field at all,
 * are left out.
 *
 * @param units {Array<Object>} The feed's `units`
 * @returns {Object<String, Object>} A serialized OptimizationPlan per base ID
 */
export function feedTargetsOf(units) {
  return (units || []).reduce((targets, unit) => {
    if (unit && unit.baseId && unit.target) {
      targets[unit.baseId] = unit.target;
    }
    return targets;
  }, {});
}

/**
 * Save each character's feed target into its targets, like a target the player made: one with the same name is
 * replaced (OptimizerSettings.withTarget), so fetching again overwrites "HotUtils Meta" instead of adding a second one.
 * Only the saved targets change; which target a selected character uses is not touched.
 *
 * @param characters {Object<String, Character>} Characters by base ID
 * @param feedTargets {Object<String, Object>} A serialized OptimizationPlan per base ID (feedTargetsOf)
 * @returns {Object<String, Character>} The same characters, those with a feed target updated
 */
export default function withFeedTargets(characters, feedTargets) {
  if (!feedTargets || 0 === Object.keys(feedTargets).length) {
    return characters;
  }

  return mapObjectByKeyAndValue(characters, (id, character) => {
    const serializedTarget = feedTargets[id];

    if (!serializedTarget || !character.optimizerSettings) {
      return character;
    }

    return character.withOptimizerSettings(
      character.optimizerSettings.withTarget(
        OptimizationPlan.deserialize(serializedTarget)
      )
    );
  });
}
