const { exit } = require('process');
const http = require('request');
var _Argument = process.argv[2];
function log(string) { 
    console.log(string);
}

function _exit() {
    process.exit();
}

function _RequestSearch(uuid) {
    // Convert Steam Decimal to Hex
    var _DecimalToUUID = parseInt(uuid, 16);
    log(`UwU - I found your request player mwaster`);
    log(`Link: https://steamcommunity.com/profiles/${_DecimalToUUID}`); // I dont want to check if a user exists because that requires effort and I have no effort lol
    _exit()
}
_RequestSearch(_Argument);