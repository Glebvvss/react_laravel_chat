<?php

namespace App\Services\Realizations\GroupServices;

use Auth;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use App\Services\Interfaces\IGroupServices\IPublicTypeGroupService;

class PublicTypeGroupService extends BaseGroupService implements IPublicTypeGroupService
{
    public function getAll() : array
    {
        return User::find( Auth::user()->id )
                   ->groups()
                   ->publicType()
                   ->get()
                   ->toArray();
    }

    public function create(string $groupName, array $memberIdList) : array
    {
        if ( $groupName === '' ) {
            return ['message' => 'Group name cannot be empty.'];
        }

        if ( empty($memberIdList) ) {
            return ['message' => 'No users in member list of group.'];
        }

        $newGroupId = $this->createNewEmptyGroup($groupName);
        $this->associateUsersWithGroups($newGroupId, $memberIdList);

        return [
            'message'    => 'Group created!',
            'newGroupId' => $newGroupId
        ];
    }

    public function addNewMembersTo(int $groupId, array $userIdList) : string
    {
        if ( empty($userIdList) ) {
            return 'Userlist cannot be empty.';
        }

        foreach( $userIdList as $userId ) {
            $user = User::find($userId);

            $group = Group::find($groupId);
            $group->users()->attach($user);
            $group->save();
        }

        return 'New members to group added.';
    }

    public function leaveMemberFrom(int $groupId, int $userId) : void
    {
        $user = User::find($userId);
        
        $group = Group::find($groupId);
        $group->users()->detach($user);
        $group->save();
    }

    private function createNewEmptyGroup(string $groupName) : int
    {
        $group = new Group();

        $group->group_name = $groupName;
        $group->type       = 'public';
        $group->save();

        return $group->id;
    }

    private function associateUsersWithGroups(int $groupId, array $memberIdList) : void
    {
        $memberIdListWithCreator = $this->addGroupCreatorToMemberList($memberIdList);

        foreach( $memberIdListWithCreator as $memberId ) {
            $user = User::find($memberId);

            $group = Group::find($groupId);
            $group->users()->attach($user);
            $group->save();
        }
    }

    private function addGroupCreatorToMemberList(array $memberIdList) : array
    {
        $memberIdList[] = Auth::user()->id;
        return $memberIdList;
    }

}