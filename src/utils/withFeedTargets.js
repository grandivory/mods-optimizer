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
 * Refresh the selected characters that use a feed target's name ("HotUtils Meta") to the feed's new plan, so a selected
 * character optimizes with the same weights its saved target now has. A selection on any other target, or on a
 * character the feed has no target for, is kept as it is.
 *
 * @param selectedCharacters {Array<{id: String, target: OptimizationPlan}>} The profile's selected characters
 * @param feedTargets {Object<String, Object>} A serialized OptimizationPlan per base ID (feedTargetsOf)
 * @returns {Array<{id: String, target: OptimizationPlan}>} The same list, those selections refreshed
 */
export function withFeedSelections(selectedCharacters, feedTargets) {
  if (!feedTargets || 0 === Object.keys(feedTargets).length) {
    return selectedCharacters;
  }

  return selectedCharacters.map((selected) => {
    const serializedTarget = feedTargets[selected.id];

    return serializedTarget &&
      selected.target &&
      selected.target.name === serializedTarget.name
      ? { id: selected.id, target: OptimizationPlan.deserialize(serializedTarget) }
      : selected;
  });
}

/**
 * Save each character's feed target into its targets, like a target the player made: one with the same name is
 * replaced (OptimizerSettings.withTarget), so fetching again overwrites "HotUtils Meta" instead of adding a second one.
 * Selections are refreshed separately (withFeedSelections).
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
