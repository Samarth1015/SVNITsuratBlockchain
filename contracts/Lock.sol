    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.0;

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
        struct addressUser{
            address add;
        }

        
        mapping (address=>content[]) contentList;
        mapping (address=> connection[] ) private connectionString;
        mapping (address=>mapping(address=>bool))ownership;
        mapping (address=>addressUser[])access;

        function upload(address _user,string memory _userStatement,string memory _queryPoint)public{
            require(ownership[_user][msg.sender],"You dont have access to upload to his database");
        
                contentList[_user].push(content(_userStatement,_queryPoint,block.timestamp));


        }
        function uploadByOur(string memory _userStatement,string memory _queryPoint)public{
           
        
                contentList[msg.sender].push(content(_userStatement,_queryPoint,block.timestamp));


        }
        
        
        function addPermission(address _add) public{

            ownership[msg.sender][_add]=true;
            access[msg.sender].push(addressUser(_add));
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
        function viewAll(address _add) view public returns (content[] memory) {
            
    require(ownership[_add][msg.sender], "You do not have permission to view this data");
    require(contentList[_add].length > 0, "No content available for this user");

    return contentList[_add];
}
    function viewUserItsellf() public view returns (content[] memory){
        return contentList[msg.sender];


    }
   function SharedAccesWIth() public view returns(addressUser[] memory){
   return access[msg.sender];
   }
    }