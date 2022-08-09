const { exit } = require('process');
const http = require('request');
const fs = require('fs');
var _Argument = process.argv[2];

function log(string) { console.log(string);}
function _exit() {process.exit();}


function _RequestSearch(uuid) {
    http(`https://policy-live.fivem.net/api/getUserInfo/`+uuid, function (err, response, body) {
        if (!err) {  
            if (response.statusCode == 200) {
                var _ReadJSON = JSON.parse(body);
                var UserName = _ReadJSON.username;
                var PossiblyRealName = _ReadJSON.name;
                var SuspensionUntil = _ReadJSON.suspended_till;
                var Clan = _ReadJSON.groups // When was this a thing lmao
                log("Link: https://forum.cfx.re/u/"+UserName);
                log("User ID: "+uuid);
                log(`Username: ${UserName}`);
                if (PossiblyRealName != ``) {
                    log(`Real Name: ${PossiblyRealName}`);
                }
                if (SuspensionUntil != ``) {
                    log(`Suspended until: ${SuspensionUntil}`);
                }
                _exit()
            }else{
                log(`[FiveM Policy Failed] Error: ${response.statusCode}\nUser does not exist.`);
                _exit()
            }
        }else{
            log(`Failed to connect to FiveM Policy API - Host Down?`);
            _exit()
        }
    });
}
_RequestSearch(_Argument);