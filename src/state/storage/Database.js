import {showError, showFlash} from "../actions/app";
import {databaseReady, setGameSettings, setProfile, setProfiles} from "../actions/storage";
import PlayerProfile from "../../domain/PlayerProfile";

export default class Database {
  database;
  dispatch;

  /**
   * Generate a new Database instance
   * @param dispatch {Function} The Redux dispatch function, used to send state events as the database completes calls
   */
  constructor(dispatch) {
    const self = this;
    const openDbRequest = indexedDB.open('ModsOptimizer', 1);

    this.dispatch = dispatch;

    openDbRequest.onerror = function(event) {
      dispatch(showError(
        'Unable to load database: ' +
        event.target.error.message +
        ' Please fix the problem and try again, or ask for help in the discord server below.'
      ));
    };

    openDbRequest.onsuccess = function(event) {
      self.database = event.target.result;
      // Dispatch an event to say that the database is ready
      dispatch(databaseReady(self));
    };

    openDbRequest.onupgradeneeded = function(event) {
      const db = event.target.result;

      // Create two object stores: One to hold game data about each character, and one to hold player profiles
      db.createObjectStore('gameSettings', {keyPath: 'baseID'});
      db.createObjectStore('profiles', {keyPath: 'allyCode'});
      db.createObjectStore('lastRuns', {keyPath: 'allyCode'});
    };
  }

  /**
   * Export all the data from the database, calling the callback with the result
   * @param callback
   */
  export(callback) {
    const self = this;
    const getDataRequest = this.database.transaction(['gameSettings', 'profiles', 'lastRuns']);
    const userData = {};
    let outstandingRequests = 3;

    getDataRequest.onerror = function(event) {
      self.dispatch(showError('Error fetching data from the database: ' + event.target.error.message));
    };

    function tryComplete() {
      if (0 === outstandingRequests) {
        callback(userData);
      }
    }

    const profilesRequest = getDataRequest.objectStore('profiles').getAll();
    profilesRequest.onsuccess = function(event) {
      outstandingRequests--;
      userData.profiles = event.target.result;
      tryComplete();
    };

    const gameSettingsRequest = getDataRequest.objectStore('gameSettings').getAll();
    gameSettingsRequest.onsuccess = function(event) {
      outstandingRequests--;
      userData.gameSettings = event.target.result;
      tryComplete();
    };

    const lastRunsRequest = getDataRequest.objectStore('lastRuns').getAll();
    lastRunsRequest.onsuccess = function(event) {
      outstandingRequests--;
      userData.lastRuns = event.target.result;
      tryComplete();
    }
  }

  /**
   *  Delete everything from the database
   */
  clear() {
    const self = this;
    const deleteDataRequest = this.database.transaction(['gameSettings', 'profiles', 'lastRuns'], 'readwrite');

    deleteDataRequest.onerror = function(event) {
      self.dispatch(showError('Error clearing out data from the database: ' +
        event.target.error.message +
        ' You may need to manually delete the database to clear it'));
    };

    deleteDataRequest.objectStore('gameSettings').clear();
    deleteDataRequest.objectStore('profiles').clear();
    deleteDataRequest.objectStore('lastRuns').clear();
  }

  /**
   * Delete a profile from the database
   * @param allyCode {string}
   * @param callback {function()}
   */
  deleteProfile(allyCode, callback) {
    const self = this;
    const deleteProfileRequest = this.database
      .transaction('profiles', 'readwrite')
      .objectStore('profiles')
      .delete(allyCode);

    deleteProfileRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error deleting your profile: ' +
        event.target.error.message
      ));
    };

    deleteProfileRequest.onsuccess = function() {
      self.deleteLastRun(allyCode);
      self.getProfiles();
      callback();
    };
  }

  deleteLastRun(allyCode) {
    const self = this;
    const deleteLastRunRequest = this.database
      .transaction('lastRuns', 'readwrite')
      .objectStore('lastRuns')
      .delete(allyCode);

    deleteLastRunRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error clearing a previous run. ' +
        event.target.error.message +
        ' The optimizer may not recalculate correctly.'
      ))
    };
  }

  /**
   * Get all of the gameSettings from the database and return them as an object
   */
  getGameSettings() {
    const self = this;
    const getGameSettingsRequest =
      this.database.transaction('gameSettings', 'readwrite').objectStore('gameSettings').getAll();

    getGameSettingsRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error reading basic character settings: ' +
        event.target.error.message +
        ' The settings will be restored when you next fetch data'
      ));
    };

    getGameSettingsRequest.onsuccess = function(event) {
      const gameSettings = {};
      event.target.result.forEach(gameSetting => gameSettings[gameSetting.baseID] = gameSetting);
      self.dispatch(setGameSettings(gameSettings));
    };
  }

  /**
   * Get a single profile
   * @param allyCode {string}
   * @param callback {function(profile)} A callback function to process the profile. If none is given,
   *                                     a setProfile action will be dispatched instead.
   */
  getProfile(allyCode, callback) {
    const self = this;
    if (!allyCode) {
      if (callback) {
        return callback(null);
      } else {
        return self.dispatch(setProfile(null));
      }
    }

    const getProfileRequest =
      // Using a read/write transaction forces the database to finish loading profiles before reading from here
      this.database.transaction('profiles', 'readwrite').objectStore('profiles').get(allyCode);

    getProfileRequest.onsuccess = function(event) {
      const profile = PlayerProfile.deserialize(event.target.result);
      if (callback) {
        callback(profile);
      } else {
        self.dispatch(setProfile(profile));
      }
    };

    getProfileRequest.onerror = function(event) {
      self.dispatch(showError('Error loading your profile from the database: ' + event.target.error.message));
    };
  }

  /**
   * Get all of the profiles from the database, where each entry is [baseID, playerName]
   * @returns {*}
   */
  getProfiles() {
    const self = this;
    const profiles = {};
    const profilesCursor =
    // Using a read/write transaction forces the database to finish loading profiles before reading from here
      this.database.transaction('profiles', 'readwrite').objectStore('profiles').openCursor();

    profilesCursor.onsuccess = function(event) {
      const cursor = event.target.result;
      if (!cursor) {
        self.dispatch(setProfiles(profiles));
        return;
      }

      profiles[cursor.key] = cursor.value.playerName;
      cursor.continue();
    };

    profilesCursor.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error retrieving profiles: ' + event.target.error.message
      ));
    }
  }

  /**
   * Add or update a single profile in the database, then dispatch an action to load that profile into the state
   * @param profile {PlayerProfile}
   */
  saveProfile(profile) {
    const self = this;
    const saveProfileRequest = this.database.transaction(['profiles'], 'readwrite');

    saveProfileRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error saving your profile: ' + event.target.error.message + ' Your progress is not saved.'
      ));
    };

    saveProfileRequest.oncomplete = function(event) {
      self.getProfiles();
      self.getProfile(profile.allyCode);
    };

    saveProfileRequest.objectStore('profiles')
      .put('function' === typeof profile.serialize ? profile.serialize() : profile);
  }

  /**
   * Add new profiles to the database, or update existing ones
   * @param profiles {Array<PlayerProfile>}
   */
  saveProfiles(profiles) {
    const self = this;
    const saveProfileRequest = this.database.transaction(['profiles'], 'readwrite');

    saveProfileRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error saving your profile: ' + event.target.error.message + ' Your progress is not saved.'
      ));
    };

    saveProfileRequest.oncomplete = function(event) {
      // Reset the profiles available in the state
      self.getProfiles();
    };

    profiles.forEach(profile => saveProfileRequest.objectStore('profiles').put(
      'function' === typeof profile.serialize ? profile.serialize() : profile
    ));
  }

  /**
   * Add new gameSettings to the database, or update existing ones
   * @param gameSettings {Array<GameSettings>}
   */
  saveGameSettings(gameSettings) {
    const self = this;
    const saveGameSettingsRequest = this.database.transaction(['gameSettings'], 'readwrite');

    saveGameSettingsRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error saving base character settings: ' +
        event.target.error.message +
        ' The optimizer may not function properly for all characters'
      ));
    };

    saveGameSettingsRequest.oncomplete = function(event) {
      // Set the game settings back to the app state
      self.getGameSettings();
    };

    gameSettings.forEach(gameSetting =>
      saveGameSettingsRequest.objectStore('gameSettings').put(
        'function' === typeof gameSetting.serialize ? gameSetting.serialize() : gameSetting
      )
    );
  }

  saveLastRuns(lastRuns) {
    const self = this;
    const saveLastRunsRequest = this.database.transaction(['lastRuns'], 'readwrite');

    saveLastRunsRequest.onerror = function(event) {
      self.dispatch(showFlash(
        'Storage Error',
        'Error saving previous runs: ' +
        event.target.error.message +
        ' The optimizer will need to recalculate optimized values on the next run.'
      ));
    };

    lastRuns.forEach(lastRun => {
      saveLastRunsRequest.objectStore('lastRuns').put(
        'function' === typeof lastRun.serialize ? lastRun.serialize() : lastRun
      )
    });
  }
}
