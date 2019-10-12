import PlayerProfile from "../../domain/PlayerProfile";
import nothing from "../../utils/nothing";
import { GameSettings } from "../../domain/CharacterDataClasses";
import OptimizationPlan from "../../domain/OptimizationPlan";

class Database {
  database;

  dbName = 'ModsOptimizer';

  /**
   * Generate a new Database instance
   * @param onsuccess {function(Database)}
   * @param onerror {function(error)}
   */
  constructor(onsuccess = nothing, onerror = nothing) {
    const self = this;
    const openDbRequest = indexedDB.open(this.dbName, 2);

    openDbRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    openDbRequest.onsuccess = function (event) {
      self.database = event.target.result;

      self.database.onversionchange = function (event) {
        if (!event.newVersion) {
          self.database.close();
        }
      };

      onsuccess(self);
    };

    openDbRequest.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (event.oldVersion < 1) {
        // Create object stores for: game data about each character, player profiles, and the last run done by each
        // player
        db.createObjectStore('gameSettings', { keyPath: 'baseID' });
        db.createObjectStore('profiles', { keyPath: 'allyCode' });
        db.createObjectStore('lastRuns', { keyPath: 'allyCode' });
      }
      if (event.oldVersion < 2) {
        db.createObjectStore('characterTemplates', { keyPath: 'name' });
      }
    };
  }

  /**
   * Export all the data from the database, calling the callback with the result
   * @param onsuccess {function(Object)}
   * @param onerror {function(error)}
   */
  export(onsuccess = nothing, onerror = nothing) {
    const getDataRequest = this.database.transaction(['gameSettings', 'profiles', 'lastRuns', 'characterTemplates']);
    const userData = {};

    getDataRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    getDataRequest.oncomplete = function () {
      onsuccess(userData);
    };

    const profilesRequest = getDataRequest.objectStore('profiles').getAll();
    profilesRequest.onsuccess = function (event) {
      userData.profiles = event.target.result;
    };

    const gameSettingsRequest = getDataRequest.objectStore('gameSettings').getAll();
    gameSettingsRequest.onsuccess = function (event) {
      userData.gameSettings = event.target.result;
    };

    const lastRunsRequest = getDataRequest.objectStore('lastRuns').getAll();
    lastRunsRequest.onsuccess = function (event) {
      userData.lastRuns = event.target.result;
    };

    const characterTemplatesRequest = getDataRequest.objectStore('characterTemplates').getAll();
    characterTemplatesRequest.onsuccess = function (event) {
      userData.characterTemplates = event.target.result;
    };
  }

  /**
   * Delete everything from the database, and the database itself
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  delete(onsuccess = nothing, onerror = nothing) {
    const deleteDataRequest = indexedDB.deleteDatabase(this.dbName);

    deleteDataRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    deleteDataRequest.onsuccess = function () {
      onsuccess();
    };
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

    deleteProfileRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    deleteProfileRequest.onsuccess = function () {
      self.deleteLastRun(allyCode);
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

    deleteLastRunRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    deleteLastRunRequest.onsuccess = function (event) {
      onsuccess();
    };
  }

  deleteCharacterTemplate(name, onsuccess = nothing, onerror = nothing) {
    const deleteTemplateRequest = this.database
      .transaction('characterTemplates', 'readwrite')
      .objectStore('characterTemplates')
      .delete(name);

    deleteTemplateRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    deleteTemplateRequest.onsuccess = function (event) {
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

    getGameSettingsRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    getGameSettingsRequest.onsuccess = function (event) {
      const gameSettings = event.target.result.map(gameSetting => GameSettings.deserialize(gameSetting));
      onsuccess(gameSettings);
    };
  }

  /**
   * Get a single profile. If no allyCode is given, the first profile in the database will be returned.
   * @param allyCode {string}
   * @param onsuccess {function(PlayerProfile)}
   * @param onerror {function(error)}
   */
  getProfile(allyCode, onsuccess = nothing, onerror = nothing) {
    if (allyCode) {
      const getProfileRequest =
        // Using a read/write transaction forces the database to finish loading profiles before reading from here
        this.database.transaction('profiles', 'readwrite').objectStore('profiles').get(allyCode);

      getProfileRequest.onsuccess = function (event) {
        const profile = PlayerProfile.deserialize(event.target.result);
        onsuccess(profile);
      };

      getProfileRequest.onerror = function (event) {
        onerror(event.target.error);
      };
    } else {
      const getProfileRequest =
        this.database.transaction('profiles', 'readwrite').objectStore('profiles').openCursor();

      getProfileRequest.onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
          const profile = PlayerProfile.deserialize(cursor.value);
          onsuccess(profile);
        } else {
          onsuccess(null);
        }
      };

      getProfileRequest.onerror = function (event) {
        onerror(event.target.error);
      };
    }
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

    profilesRequest.onsuccess = function (event) {
      const profiles = event.target.result.map(profile => PlayerProfile.deserialize(profile));
      onsuccess(profiles);
    };

    profilesRequest.onerror = function (event) {
      onerror(event.target.error);
    }
  }

  /**
   * Retrieve a character template from the database by name
   * @param name {string}
   * @param onsuccess {function(Object)}
   * @param onerror {function(error)}
   */
  getCharacterTemplate(name, onsuccess = nothing, onerror = nothing) {
    const templateRequest = this.database.transaction('characterTemplates', 'readwrite')
      .objectStore('characterTemplates').get(name);

    templateRequest.onsuccess = function (event) {
      const template = event.target.result;
      onsuccess({
        name: template.name,
        selectedCharacters: template.selectedCharacters.map(({ id, target }) =>
          ({ id: id, target: OptimizationPlan.deserialize(target) })
        )
      });
    };

    templateRequest.onerror = function (event) {
      onerror(event.target.error);
    };

  }

  /**
   * Get all of the saved character templates from the database
   * @param onsuccess {function(Array<Object>)}
   * @param onerror {function(error)}
   */
  getCharacterTemplates(onsuccess = nothing, onerror = nothing) {
    const templatesRequest =
      this.database.transaction('characterTemplates', 'readwrite').objectStore('characterTemplates').getAll();

    templatesRequest.onsuccess = function (event) {
      const templates = event.target.result.map(template => ({
        name: template.name,
        selectedCharacters: template.selectedCharacters.map(({ id, target }) =>
          ({ id: id, target: OptimizationPlan.deserialize(target) })
        )
      }));
      onsuccess(templates);
    };

    templatesRequest.onerror = function (event) {
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

    saveProfileRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveProfileRequest.onsuccess = function (event) {
      onsuccess(event.target.result);
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

    saveProfileRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveProfileRequest.oncomplete = function (event) {
      onsuccess(keys);
    };

    profiles.forEach(profile => {
      const profileRequest = saveProfileRequest.objectStore('profiles').put(
        'function' === typeof profile.serialize ? profile.serialize() : profile
      );

      profileRequest.onsuccess = function (event) {
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

    saveGameSettingsRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveGameSettingsRequest.oncomplete = function (event) {
      onsuccess(keys);
    };

    gameSettings.forEach(gameSetting => {
      const singleRequest = saveGameSettingsRequest.objectStore('gameSettings').put(
        'function' === typeof gameSetting.serialize ? gameSetting.serialize() : gameSetting
      );

      singleRequest.onsuccess = function (event) {
        keys.push(event.target.result);
      };
    });
  }

  /**
   * Save an optimizer run to the database, or update an existing one
   * @param lastRun {OptimizerRun}
   * @param onsuccess {function(string)}
   * @param onerror {function(error)}
   */
  saveLastRun(lastRun, onsuccess = nothing, onerror = nothing) {
    const saveLastRunRequest = this.database.transaction(['lastRuns'], 'readwrite')
      .objectStore('lastRuns')
      .put('function' === typeof lastRun.serialize ? lastRun.serialize() : lastRun);

    saveLastRunRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveLastRunRequest.onsuccess = function (event) {
      onsuccess(event.target.result);
    }
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

    saveLastRunsRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveLastRunsRequest.oncomplete = function (event) {
      onsuccess(keys);
    };

    lastRuns.forEach(lastRun => {
      const singleRequest = saveLastRunsRequest.objectStore('lastRuns').put(
        'function' === typeof lastRun.serialize ? lastRun.serialize() : lastRun
      );

      singleRequest.onsuccess = function (event) {
        keys.push(event.target.result);
      };
    });
  }

  saveCharacterTemplate(name, selectedCharacters, onsuccess = nothing, onerror = nothing) {
    const templateObject = {
      name: name,
      selectedCharacters: selectedCharacters.map(({ id, target }) => ({ id: id, target: target.serialize() }))
    };

    const saveTemplateRequest = this.database.transaction(['characterTemplates'], 'readwrite')
      .objectStore('characterTemplates')
      .put(templateObject);

    saveTemplateRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveTemplateRequest.onsuccess = function (event) {
      onsuccess(event.target.result);
    }
  }

  saveCharacterTemplates(templates, onsuccess = nothing, onerror = nothing) {
    const saveTemplatesRequest = this.database.transaction(['characterTemplates'], 'readwrite');
    const keys = [];

    saveTemplatesRequest.onerror = function (event) {
      onerror(event.target.error);
    };

    saveTemplatesRequest.oncomplete = function (event) {
      onsuccess(keys);
    };

    templates.forEach(template => {
      const templateObject = {
        name: template.name,
        selectedCharacters:
          template.selectedCharacters.map(({ id, target }) => ({ id: id, target: target.serialize() }))
      };

      const singleRequest = saveTemplatesRequest.objectStore('characterTemplates').put(templateObject);

      singleRequest.onsuccess = function (event) {
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
