// @flow
import setBonuses from "../../constants/setbonuses";

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
