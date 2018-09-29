<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(['as' => 'authenticate'], function() {
    Route::post('/login', 'AuthController@login');

    Route::post('/registration', 'AuthController@registration');

    Route::get('/logout', 'AuthController@logout');

    Route::get('/check-login', 'AuthController@checkLogin');

    Route::get('/get-username', 'UserController@getUsername');

    Route::get('/get-user-id', 'UserController@getId');
});

Route::group(['as' => 'friends'], function() {
    Route::get('/get-friends', [ 
        'uses' => 'FriendController@getFriends'
    ]);

    Route::get('/search-friend/{usernameOccurrence}', [
        'uses' => 'FriendController@searchFriends'
    ]);

    Route::get('/get-recived-friendship-requests', [
        'uses' => 'FriendController@getRecivedFrendshipRequests'
    ]);

    Route::get('/get-sended-friendship-requests', [
        'uses' => 'FriendController@getSendedFrendshipRequests'
    ]);

    Route::get('/send-friendship-request/{recipientUsername}', [
        'uses' => 'FriendController@sendFriendshipRequest'
    ]);

    Route::get('/confirm-friendship-request/{senderUsername}', [
        'uses' => 'FriendController@confirmFriendshipRequest'
    ]);

    Route::get('/cancel-recived-friendship-request/{senderUsername}', [
        'uses' => 'FriendController@cancelReciviedFriendshipRequest'
    ]);

    Route::get('/cancel-sended-friendship-request/{senderUsername}', [
        'uses' => 'FriendController@cancelSendedFriendshipRequest'
    ]);
});