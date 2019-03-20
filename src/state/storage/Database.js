import PlayerProfile from "../../domain/PlayerProfile";
import nothing from "../../utils/nothing";
import {GameSettings} from "../../domain/CharacterDataClasses";

class Database {
  database;

  /**
   * Generate a new Database instance
   * @param onsuccess {function(Database)}
   * @param onerror {function(error)}
   */
  constructor(onsuccess = nothing, onerror = nothing) {
    const self = this;
    const openDbRequest = indexedDB.open('ModsOptimizer', 1);

    openDbRequest.onerror = function(event) {
      onerror(event.target.error);
      // dispatch(showError(
      //   'Unable to load database: ' +
      //   event.target.error.message +
      //   ' Please fix the problem and try again, or ask for help in the discord server below.'
      // ));
    };

    openDbRequest.onsuccess = function(event) {
      self.database = event.target.result;
      onsuccess(self);
      // Dispatch an event to say that the database is ready
      // dispatch(databaseReady(self));
    };

    openDbRequest.onupgradeneeded = function(event) {
      const db = event.target.result;

      // Create object stores for: game data about each character, player profiles, and the last run done by each player
      db.createObjectStore('gameSettings', {keyPath: 'baseID'});
      db.createObjectStore('profiles', {keyPath: 'allyCode'});
      db.createObjectStore('lastRuns', {keyPath: 'allyCode'});
    };
  }

  /**
   * Export all the data from the database, calling the callback with the result
   * @param onsuccess {function(Object)}
   * @param onerror {function(error)}
   */
  export(onsuccess = nothing, onerror = nothing) {
    const getDataRequest = this.database.transaction(['gameSettings', 'profiles', 'lastRuns']);
    const userData = {};

    getDataRequest.onerror = function(event) {
      onerror(event.target.error);
    };

    getDataRequest.oncomplete = function() {
      onsuccess(userData);
    };

    const profilesRequest = getDataRequest.objectStore('profiles').getAll();
    profilesRequest.onsuccess = function(event) {
      userData.profiles = event.target.result;
    };

    const gameSettingsRequest = getDataRequest.objectStore('gameSettings').getAll();
    gameSettingsRequest.onsuccess = function(event) {
      userData.gameSettings = event.target.result;
    };

    const lastRunsRequest = getDataRequest.objectStore('lastRuns').getAll();
    lastRunsRequest.onsuccess = function(event) {
      userData.lastRuns = event.target.result;
    }
  }

  /**
   * Delete everything from the database
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  clear(onsuccess = nothing, onerror = nothing) {
    const deleteDataRequest = this.database.transaction(['gameSettings', 'profiles', 'lastRuns'], 'readwrite');

    deleteDataRequest.onerror = function(event) {
      onerror(event.target.error);
      // self.dispatch(showError('Error clearing out data from the database: ' +
      //   event.target.error.message +
      //   ' You may need to manually delete the database to clear it'));
    };

    deleteDataRequest.onsuccess = function(event) {
      onsuccess();
    };

    deleteDataRequest.objectStore('gameSettings').clear();
    deleteDataRequest.objectStore('profiles').clear();
    deleteDataRequest.objectStore('lastRuns').clear();
  }

  /**
   * Delete a profile from the database
   * @param allyCode {string}
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  deleteProfile(allyCode, onsuccess = nothing, onerror = nothing) {
    const self = this;
    const deleteProfileRequest = this.database
      .transaction('profiles', 'readwrite')
      .objectStore('profiles')
      .delete(allyCode);

    deleteProfileRequest.onerror = function(event) {
      onerror(event.target.error);
      // self.dispatch(showFlash(
      //   'Storage Error',
      //   'Error deleting your profile: ' +
      //   event.target.error.message
      // ));
    };

    deleteProfileRequest.onsuccess = function() {
      self.deleteLastRun(allyCode);
      // self.getProfiles();
      onsuccess();
    };
  }

  /**
   * Delete an Optimizer Run from the database
   * @param allyCode {string}
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  deleteLastRun(allyCode, onsuccess = nothing, onerror = nothing) {
    const deleteLastRunRequest = this.database
      .transaction('lastRuns', 'readwrite')
      .objectStore('lastRuns')
      .delete(allyCode);

    deleteLastRunRequest.onerror = function(event) {
      onerror(event.target.error);
      // self.dispatch(showFlash(
      //   'Storage Error',
      //   'Error clearing a previous run. ' +
      //   event.target.error.message +
      //   ' The optimizer may not recalculate correctly.'
      // ))
    };

    deleteLastRunRequest.onsuccess = function(event) {
      onsuccess();
    };
  }

  /**
   * Get all of the gameSettings from the database and return them as an object
   * @param onsuccess {function(Array<GameSettings>)}
   * @param onerror {function(error)}
   */
  getGameSettings(onsuccess = nothing, onerror = nothing) {
    const getGameSettingsRequest =
      this.database.transaction('gameSettings', 'readwrite').objectStore('gameSettings').getAll();

    getGameSettingsRequest.onerror = function(event) {
      onerror(event.target.error);
    };

    getGameSettingsRequest.onsuccess = function(event) {
      const gameSettings = event.target.result.map(gameSetting => GameSettings.deserialize(gameSetting));
      onsuccess(gameSettings);
    };
  }

  /**
   * Get a single profile
   * @param allyCode {string}
   * @param onsuccess {function(PlayerProfile)}
   * @param onerror {function(error)}
   */
  getProfile(allyCode, onsuccess = nothing, onerror = nothing) {
    if (!allyCode) {
      return onsuccess(null);
    }

    const getProfileRequest =
      // Using a read/write transaction forces the database to finish loading profiles before reading from here
      this.database.transaction('profiles', 'readwrite').objectStore('profiles').get(allyCode);

    getProfileRequest.onsuccess = function(event) {
      const profile = PlayerProfile.deserialize(event.target.result);
      onsuccess(profile);
    };

    getProfileRequest.onerror = function(event) {
      onerror(event.target.error);
    };
  }

  /**
   * Get all of the profiles from the database, where each entry is [baseID, playerName]
   * @param onsuccess {function(Array<PlayerProfile>)}
   * @param onerror {function(error)}
   */
  getProfiles(onsuccess = nothing, onerror = nothing) {
    const profilesRequest =
    // Using a read/write transaction forces the database to finish loading profiles before reading from here
      this.database.transaction('profiles', 'readwrite').objectStore('profiles').getAll();

    profilesRequest.onsuccess = function(event) {
      const profiles = event.target.result.map(profile => PlayerProfile.deserialize(profile));
      onsuccess(profiles);
    };

    profilesRequest.onerror = function(event) {
      onerror(event.target.error);
    }
  }

  /**
   * Add or update a single profile in the database, then dispatch an action to load that profile into the state
   * @param profile {PlayerProfile}
   * @param onsuccess {function(string)}
   * @param onerror {function(error)}
   */
  saveProfile(profile, onsuccess = nothing, onerror = nothing) {
    const saveProfileRequest = this.database.transaction(['profiles'], 'readwrite');

    saveProfileRequest.onerror = function(event) {
      onerror(event.target.error);
      // self.dispatch(showFlash(
      //   'Storage Error',
      //   'Error saving your profile: ' + event.target.error.message + ' Your progress is not saved.'
      // ));
    };

    saveProfileRequest.onsuccess = function(event) {
      onsuccess(event.target.result);
      // self.getProfiles();
      // self.getProfile(profile.allyCode);
    };

    saveProfileRequest.objectStore('profiles')
      .put('function' === typeof profile.serialize ? profile.serialize() : profile);
  }

  /**
   * Add new profiles to the database, or update existing ones
   * @param profiles {Array<PlayerProfile>}
   * @param onsuccess {function(Array<string>)}
   * @param onerror {function(error)}
   */
  saveProfiles(profiles, onsuccess = nothing, onerror = nothing) {
    const saveProfileRequest = this.database.transaction(['profiles'], 'readwrite');
    const keys = [];

    saveProfileRequest.onerror = function(event) {
      onerror(event.target.error);
    };

    saveProfileRequest.oncomplete = function(event) {
      console.log(event.target.result);
      onsuccess(keys);
      // Reset the profiles available in the state
      // self.getProfiles();
    };

    profiles.forEach(profile => {
      const profileRequest = saveProfileRequest.objectStore('profiles').put(
        'function' === typeof profile.serialize ? profile.serialize() : profile
      );

      profileRequest.onsuccess = function(event) {
        keys.push(event.target.result);
      };
    });
  }

  /**
   * Add new gameSettings to the database, or update existing ones
   * @param gameSettings {Array<GameSettings>}
   * @param onsuccess {function(Array<string>)}
   * @param onerror {function(error)}
   */
  saveGameSettings(gameSettings, onsuccess = nothing, onerror = nothing) {
    const saveGameSettingsRequest = this.database.transaction(['gameSettings'], 'readwrite');
    const keys = [];

    saveGameSettingsRequest.onerror = function(event) {
      onerror(event.target.error);
    };

    saveGameSettingsRequest.oncomplete = function(event) {
      onsuccess(keys);
    };

    gameSettings.forEach(gameSetting => {
      const singleRequest = saveGameSettingsRequest.objectStore('gameSettings').put(
        'function' === typeof gameSetting.serialize ? gameSetting.serialize() : gameSetting
      );

      singleRequest.onsuccess = function(event) {
        keys.push(event.target.result);
      };
    });
  }

  /**
   * Save a group of last runs
   * @param lastRuns {Array<OptimizerRun>}
   * @param onsuccess {function(Array<string>)}
   * @param onerror {function(error)}
   */
  saveLastRuns(lastRuns, onsuccess = nothing, onerror = nothing) {
    const saveLastRunsRequest = this.database.transaction(['lastRuns'], 'readwrite');
    const keys = [];

    saveLastRunsRequest.onerror = function(event) {
      onerror(event.target.error);
    };

    saveLastRunsRequest.oncomplete = function(event) {
      onsuccess(keys);
    };

    lastRuns.forEach(lastRun => {
      const singleRequest = saveLastRunsRequest.objectStore('lastRuns').put(
        'function' === typeof lastRun.serialize ? lastRun.serialize() : lastRun
      );

      singleRequest.onsuccess = function(event) {
        keys.push(event.target.result);
      };
    });
  }
}

let instance = null;

export default function getDatabase(onsuccess = nothing, onerror = nothing) {
  if (instance) {
    onsuccess(instance);
    return instance;
  }

  instance = new Database(onsuccess, onerror);
  return instance;
};
