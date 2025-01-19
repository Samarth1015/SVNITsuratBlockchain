// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";


contract Lock {
    struct Content {
        string userStatement;
        string queryPoint;
        uint256 time;
    }

    struct Connection {
        string url;
    }

    mapping(address => Content[]) private contentList; // Store content by user
    mapping(address => Connection[]) private connectionString; // Store connection strings by user
    mapping(address => mapping(address => bool)) private ownership; // Permission mapping

    // Function to upload content to a user's content list
   function upload(
    address _user,
    string memory _userStatement,
    string memory _queryPoint
) public {
    console.log("User Statement is: %s", _userStatement); // Debug log
    contentList[_user].push(Content(_userStatement, _queryPoint, block.timestamp));
}


    // Function to grant permission to another address
    function addPermission(address _address) public {
        ownership[msg.sender][_address] = true;
    }

    // Function to view a user's connection strings (requires permission)
    function viewConnectionString(address _user) public view returns (Connection[] memory) {
        require(
            ownership[_user][msg.sender],
            "You don't have permission to view this user's connection strings"
        );

        if (connectionString[_user].length > 0) {
            return connectionString[_user];
        } else {
            revert("No connection string found");
        }
    }

    // Function to view all content of a user (requires permission)
    function viewAll(address _user) public view returns (Content[] memory) {
       
        return contentList[_user];
    }
}
