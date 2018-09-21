import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendRequestForFriendship, getSearchMatchesList } from '../../../actions/friends.js';

class SearchFriends extends Component {

	constructor(props) {
		super(props);
		this.clearSeatchMatchesListIfClickWasOutOfBlock();
		this.state = {
			searchInputText: ''
		}
	}

	searchUsersByChangeInputText(event) {
		this.searchUsersMatchesByTextInput();
		this.setState({
			...this.state,
			searchInputText: event.target.value
		});
	}

	searchUsersMatchesByTextInput() {
		this.props.getSearchMatchesList(this.state.searchInputText);
	}

	pushThisUsernameIntoInputElement( event ) {
		this.setState({
			...this.state,
			searchInputText: event.target.innerText
		});
	}

	sendRequestForFriendship() {
		this.props.sendRequestForFriendship(this.state.searchInputText);
	}

	selectMatchUsernameAndInsertIntoInput(event) {
		this.setState({
			...this.state,
			searchInputText: event.target.innerText
		});
		this.props.clearSeatchMatchesList();
	}

	clearSeatchMatchesListIfClickWasOutOfBlock(event) {
		document.addEventListener('click', (event) => {
			this.props.clearSeatchMatchesList();
		});
	}

	render() {
		return (
			<div className="search-friends">
				<input 	type="text" 
								name="search"
								placeholder="Search For New Friends"
								value={this.state.searchInputText}
								onChange={this.searchUsersByChangeInputText.bind(this)} />

				<button onClick={this.sendRequestForFriendship.bind(this)}>add</button>
				<div className="search-matches-list">
					<ul>
						{
							this.props.searchMatches.map((item, index) => (
								<li key={index} onClick={this.selectMatchUsernameAndInsertIntoInput.bind(this)}>{item.username}</li>
							))
						}
					</ul>
				</div>
			</div>
		);
	}

}

export default connect(
	state => ({
		searchMatches: state.searchFriends
	}),
	dispatch => ({
		getSearchMatchesList: (usernameOccurrence) => {
			dispatch(getSearchMatchesList(usernameOccurrence))
		},
		clearSeatchMatchesList: () => {
			dispatch({ type: 'CLEAR_SEARCH_MATCH_LIST' });
		},
		sendRequestForFriendship: (friendUsername) => {
			dispatch(sendRequestForFriendship(friendUsername));
		}
	}),
)(SearchFriends);