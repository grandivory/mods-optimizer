function requestProfile(allyCode) {
  return {
    type: 'REQUEST_PROFILE',
    allyCode: allyCode
  };
}

function receiveProfile(profile) {
  return {
    type: 'RECEIVE_PROFILE',
    profile: profile
  };
}
