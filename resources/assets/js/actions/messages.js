import { scrfToken, 
         makeUriForRequest, 
         scrollDocumentToBottom } from '../functions.js';


export const getMessagesOfGroup = groupId => dispatch => {
  fetch( makeUriForRequest('/get-messages-of-group/' + groupId), {
    method: 'get'
  })
  .then(response => {
    response.json().then(data => {
      dispatch({ 
        type:    'FETCH_MESSAGES_OF_SELECTED_CONTACT',
        payload: data.messages 
      });
      dispatch({ type: 'SET_CONTACT_TYPE', payload: 'PUBLIC' });
      scrollDocumentToBottom();
    });
  });
};

export const getMessagesOfDialog = friendId => dispatch => {
  fetch( makeUriForRequest('/get-messages-of-dialog/' + friendId), {
    method: 'get'
  })
  .then(response => {
    response.json().then(data => {
      dispatch({ 
        type:    'FETCH_MESSAGES_OF_SELECTED_CONTACT',
        payload: data.messages 
      });
      dispatch({ type: 'SET_CONTACT_TYPE', payload: 'DIALOG' });
      scrollDocumentToBottom();
    });
  });
};

export const sendMessageToGroup = (groupId, text) => dispatch => {
  fetch( makeUriForRequest('/send-message-to-group'), {
    method: 'post',
    headers: {
      'X-CSRF-TOKEN': scrfToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 
      'groupId=' + groupId + '&' +
      'text='    + text

  })
  .then(response => {
    dispatch( getMessagesOfGroup(groupId) );
  });
}