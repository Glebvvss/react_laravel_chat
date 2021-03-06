import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactScrollbar from 'react-scrollbar-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createGroup } from '../../../../../../actions/groups.js';
import CreateNewGroup from './components/CreateNewGroup/CreateNewGroup.jsx';
import AddFriendsToExistsGroup from './components/AddFriendsToExistsGroup/AddFriendsToExistsGroup.jsx';
import LeaveGroup from './components/LeaveGroup.jsx';

const scrollbar = {
  width: 250,
  height: '100%',
};

const tabTitles = [
  { title: 'New',   tab: 'CREATE_NEW_GROUP_TAB' },
  { title: 'Edit',  tab: 'ADD_FRIENDS_TO_EXISTS_GROUP_TAB' },
  { title: 'Leave', tab: 'LEAVE_GROUP_TAB' },
];

class GroupManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleComponent: {
        left: 0
      },
      scrollbar: {
        width: 260,
        height: document.documentElement.clientHeight - 20,
      },
      groupName: '',
      tab: 'CREATE_NEW_GROUP_TAB',
    };

    this.changeScrollbarStateByResizeWindow();
  }

  changeScrollbarStateByResizeWindow() {
    window.addEventListener('resize', (event) => {
      this.setState({
        ...this.state,
        scrollbar: {
          width: 260,
          height: document.documentElement.clientHeight - 20,
        } 
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ( this.props !== prevProps ) {
      this.checkVisibleStatusComponent();
    }
  }

  checkVisibleStatusComponent() {
    if ( this.props.visible === true ) {
      this.setState({
        ...this.state,
        visibleComponent: {
          left: '260px'
        }
      });
    } else {
      this.setState({
        ...this.state,
        visibleComponent: {
          left: 0
        }
      });
    }
  }

  renderContentTabs() {
    if ( this.state.tab === 'CREATE_NEW_GROUP_TAB' ) {
      return (
        <CreateNewGroup />
      );
    } else if ( this.state.tab === 'ADD_FRIENDS_TO_EXISTS_GROUP_TAB' ) {
      return (
        <AddFriendsToExistsGroup />
      );
    } else if ( this.state.tab === 'LEAVE_GROUP_TAB' ) {
      return (
        <LeaveGroup />
      );
    }
  }

  showSelectedTab(event) {
    this.highlightSelectedTabTitle(event);

    const selectedTab = event.target.attributes['data-tab']['value'];
    this.setState({
      ...this.state,
      tab: selectedTab
    });
  }

  highlightSelectedTabTitle(item) {
    if ( this.state.tab === item.tab ) {
      return 'active-tab';
    }
    return '';
  }

  render() {
    return (
      <div className="group-manager-block" style={this.state.visibleComponent}>
        <div className="group-manager-tabs">
          <ul>
            {
              tabTitles.map((item, index) => (
                <li className={this.highlightSelectedTabTitle(item)}
                    key={index}
                    data-tab={item.tab}
                    onClick={this.showSelectedTab.bind(this)}>

                  {item.title}
                </li> ))
            }
          </ul>
        </div>
        <ReactScrollbar style={this.state.scrollbar}>
          {this.renderContentTabs()}
        </ReactScrollbar>
      </div>
    );
  }

}

export default connect(
  state => ({
    visible:             state.sidebarDropdownElements.groupManagerVisible,
    selectedContactType: state.selectedContact.type
  }),
  dispatch => ({
    createGroup: (groupName, groupMembersIdList) => {
      dispatch(createGroup(groupName, groupMembersIdList));
    },
    changeGroupMemberList: clickedFriendId => {
      dispatch({ type: 'CHANGE_GROUP_MEMBER_LIST_BEFORE_CREATED', payload: clickedFriendId });
    }
  })
)(GroupManager);