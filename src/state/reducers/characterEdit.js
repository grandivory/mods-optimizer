// @flow
import setBonuses from "../../constants/setbonuses";
import generateKey from "../../utils/generateKey";

export function changeCharacterEditMode(state, action) {
  return Object.assign({}, state, {
    characterEditMode: action.mode
  });
}

export function changeCharacterFilter(state, action) {
  return Object.assign({}, state, {
    characterFilter: action.filter
  });
}

export function toggleHideSelectedCharacters(state, action) {
  return Object.assign({}, state, {
    hideSelectedCharacters: !state.hideSelectedCharacters
  });
}

export function toggleCharacterEditSortView(state, action) {
  return Object.assign({}, state, {
    characterEditSortView: !state.characterEditSortView
  })
}

export function changeSetRestrictions(state, action) {
  return Object.assign({}, state, {
    setRestrictions: action.setRestrictions
  });
}

export function selectSetBonus(state, action) {
  const currentRestrictions = Object.assign({}, state.setRestrictions);
  const updatedRestrictions = Object.assign({}, currentRestrictions, {
    [action.setBonus]: (currentRestrictions[action.setBonus] || 0) + 1
  });

  // Only update the set restrictions if the sets can still be fulfilled
  const requiredSlots = Object.entries(updatedRestrictions).reduce((acc, [setName, count]) =>
    acc + setBonuses[setName].numberOfModsRequired * count, 0);

  if (requiredSlots <= 6) {
    return Object.assign({}, state, {
      setRestrictions: updatedRestrictions
    });
  } else {
    return state;
  }
}

export function removeSetBonus(state, action) {
  const currentRestrictions = Object.assign({}, state.setRestrictions);

  if (currentRestrictions[action.setBonus] && currentRestrictions[action.setBonus] > 1) {
    return Object.assign({}, state, {
      setRestrictions: Object.assign({}, currentRestrictions, {
        [action.setBonus]: currentRestrictions[action.setBonus] - 1
      })
    });
  } else if (currentRestrictions[action.setBonus] && currentRestrictions[action.setBonus] === 1) {
    delete currentRestrictions[action.setBonus];
    return Object.assign({}, state, {
      setRestrictions: Object.assign({}, currentRestrictions)
    });
  }

  return state;
}

export function changeTargetStats(state, action) {
  return Object.assign({}, state, {
    targetStats: action.targetStats ? action.targetStats.map(targetStat => ({
      key: generateKey(24),
      target: targetStat
    })) :
      action.targetStats
  });
}

export function addTargetStat(state, action) {
  return Object.assign({}, state, {
    targetStats: state.targetStats.concat({
      key: generateKey(24),
      target: action.targetStat
    })
  });
}

export function removeTargetStat(state, action) {
  const newTargetStats = state.targetStats.slice(0);

  newTargetStats.splice(action.index, 1);
  return Object.assign({}, state, {
    targetStats: newTargetStats
  });
}
