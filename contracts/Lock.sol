// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
   
    struct content{
        string userStatement;
        string queryPoint;
        uint time;

    }
    struct connection{
        string url;
    }

    
    mapping (address=>content[]) contentList;
    mapping (address=> connection[] ) private connectionString;
    mapping (address=>mapping(address=>bool))ownership;

    function upload(address _user,string memory _userStatement,string memory _queryPoint)public{
        require(ownership[_user][msg.sender],"You dont have access to upload to his database");
       
            contentList[msg.sender].push(content(_userStatement,_queryPoint,block.timestamp));

    }
    function addPermission(address _add) public{
        ownership[msg.sender][_add]=true;
    }
    function viewConnectionString(address _add)public view returns(connection []memory){
        require(ownership[_add][msg.sender]);
        
    
        if(connectionString[_add].length>0){

            return connectionString[_add];
            
        }
        else{
            revert("No connection string found");
        }
    }
    function viewAll(address _add) view public returns(content [] memory) {
        require(ownership[_add][msg.sender]);
        return contentList[_add];
       
    }

   
    
}