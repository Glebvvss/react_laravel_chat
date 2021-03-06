import { scrfToken, makeUriForRequest } from '../functions.js';

export const getGroups = () => dispatch => {
  fetch( makeUriForRequest('/get-public-type-groups'), {
    method: 'get'
  })
  .then(response => {
    response.json().then(data => {
      dispatch({ type: 'FETCH_GROUPS', payload: data.groups });
    });
  });
};

export const createGroup = (groupName, groupMembersIdList) => dispatch => {
  fetch( makeUriForRequest('/create-group'), {
    method: 'post',
    headers: {
      'X-CSRF-TOKEN': scrfToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:
      'groupName='          + groupName + '&' +
      'groupMembersIdList=' + JSON.stringify(groupMembersIdList)

  })
  .then(response => {
    console.log(response);
    response.json().then(data => {
      dispatch({type: 'OUTPUT_NOTIFICATION', payload: data.message});
      dispatch(getGroups());
    });
  });
};

export const getFriendsWhoNotInGroup = groupId => dispatch => {
  fetch( makeUriForRequest('/get-all-friends-who-not-in-group/' + groupId), {
    method: 'get',
  })
  .then(response => {
    response.json().then(data => {
      dispatch({ 
        type:   'FETCH_FRIENDS_WHO_NOT_IN_SELECTED_CONTACT', 
        payload: data.friendsWhoNotInGroup
      });
    });
  });
};

export const getMembersOfGroup = groupId => dispatch => {
  fetch( makeUriForRequest('/get-members-of-group/' + groupId), {
    method: 'get',
  })
  .then(response => {
    response.json().then(data => {

      dispatch({
        type:   'FETCH_MEMBERS_OF_SELECTED_CONTACT', 
        payload: data.members
      });
    });
  });
};

export const addSelectedMembersToGroup = (groupId, newGroupMembersIdList) => dispatch => {
  fetch( makeUriForRequest('/add-new-members-to-group'), {
    method: 'post',
    headers: {
      'X-CSRF-TOKEN': scrfToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:
      'groupId='               + groupId + '&' +
      'newGroupMembersIdList=' + JSON.stringify(newGroupMembersIdList)

  })
  .then(response => {
    response.json().then(data => {
      dispatch({type: 'OUTPUT_NOTIFICATION', payload: data.message});
      dispatch(getFriendsWhoNotInGroup(groupId));
      dispatch(getMembersOfGroup(groupId));
      dispatch({ type: 'RESET_NEW_MEMBERS_ID_TO_CONTACT' });
    });
  });  
};

export const leaveGroup = groupId => dispatch => {
  fetch( makeUriForRequest('/leave-group/' + groupId), {
    method: 'get',
  })
  .then(response => {
    dispatch(getGroups());
    dispatch({ type: 'RESET_CONTACT_PARAMS' });
    dispatch({ type: 'RESET_MESSAGE_LIST' });
  });
};