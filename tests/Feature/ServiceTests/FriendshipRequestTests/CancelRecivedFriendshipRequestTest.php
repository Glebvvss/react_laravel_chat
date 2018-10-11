<?php

namespace Tests\Feature\ServiceTests\FriendshipRequestTests;

use Hash;
use Auth;
use Tests\TestCase;
use App\Models\User;
use App\Models\Friend;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\FriendshipRequest as FriendshipRequestTable;
use App\Services\Realizations\FriendshipRequest;
use Tests\Feature\ServiceTests\FriendshipRequestTests\Traits\TMockDataForTables;

class CancelRecivedFriendshipRequestTest extends TestCase
{
    use RefreshDatabase, TMockDataForTables;

    public function testCancelRecivedFromInvalidSender() 
    {
        $this->userTableMock();

        Auth::attempt([
            'username' => 'testuser1',
            'password' => 'password',
        ]);

        $friendshipRequest = new FriendshipRequest();
        $resultMessage = $friendshipRequest->cancelRecivedFrom(999999);

        $this->assertEquals('Sender is not valid.', $resultMessage);

        Auth::logout();
    }

    public function testCancelRecivedFromNonexistentRequest() 
    {
        $this->userTableMock();

        Auth::attempt([
            'username' => 'testuser1',
            'password' => 'password',
        ]);

        $senderId = User::where('username', '=', 'testuser2')->first()->id;

        $friendshipRequest = new FriendshipRequest();
        $resultMessage = $friendshipRequest->cancelRecivedFrom($senderId);

        $this->assertEquals('Request is not valid.', $resultMessage);

        Auth::logout();
    }

    public function testSuccessCancelRecivedFromSender() 
    {
        $this->userTableMock();
        $this->mockDataForFriendshipRequestTable();

        Auth::attempt([
            'username' => 'testuser1',
            'password' => 'password',
        ]);

        $senderId = User::where('username', '=', 'testuser2')->first()->id;

        $friendshipRequest = new FriendshipRequest();
        $resultMessage = $friendshipRequest->cancelRecivedFrom($senderId);

        $this->assertEquals('Friendship request canceled.', $resultMessage);
        $this->assertTrue($this->checkDatabaseAfterSuccessCancel('testuser2', 'testuser1'));

        Auth::logout();
    }

    private function checkDatabaseAfterSuccessCancel( string $sender, string $recipient ) : bool {
        $senderId    = User::where('username', '=', $sender)->first()->id;
        $recipientId = User::where('username', '=', $recipient)->first()->id;

        $check = FriendshipRequestTable::where('sender_id', '=', $senderId)
            ->where('recipient_id', '=', $recipientId)
            ->first();

        if ( $check === null ) {
            return true;
        }
        return false;
    }

    private function mockDataForFriendshipRequestTable() {
        $friendshipRequestTable = new FriendshipRequestTable();
        $friendshipRequestTable->sender_id = User::where('username', '=', 'testuser2')->first()->id;
        $friendshipRequestTable->recipient_id = User::where('username', '=', 'testuser1')->first()->id;
        $friendshipRequestTable->save();
    }

}