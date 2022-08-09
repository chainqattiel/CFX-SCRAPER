const { exit } = require('process');
const http = require('request');
const fs = require('fs');
var _Argument = process.argv[2];

var _RequestServerInformation = [] // Cache the servers from the FiveM-API we already searched
var _AnonServers = []  // Servers that are private [Not in server list] - This wont display player names/identifiers [Only Server Name and Info]


function isLinuxServer(string) { if (string.indexOf('win32') > -1) {    return "Windows";}else{    return "Linux";}}
function log(string) { console.log(string);}
function _exit() {process.exit();}
function _saveArray() { fs.writeFileSync(`_TempData.json`, JSON.stringify(_RequestServerInformation, null, 4));setTimeout(_saveArray, 1000 * 2);}_saveArray()

function HandleData(_CurrentID, body) { 
    var _AnonServer = false // If the server is anon or not
    var _FailedServerID = ''  // We are going to need this because we are going to retry the request if it fails
    var _FailedServerIP = '' // We are going to need this because we are going to retry the request if it fails
    var _serverJSONData = JSON.parse(body);
    // Data
    var _getPlayers = _serverJSONData.Data.players;
    var _totalClients = _serverJSONData.Data.clients;
    var _gameType = _serverJSONData.Data.gamename;
    var _country = _serverJSONData.Data.locale;
    var _serverHostName = _serverJSONData.Data.hostname;
    var _hostType = isLinuxServer(_serverJSONData.Data.server);
    var _serverVersion = _serverJSONData.Data.server
    var _serverResources = _serverJSONData.Data.resources;
    // Server Varaibles
    var _maxClients = _serverJSONData.Data.vars.maxClients;
    var _projectName = _serverJSONData.Data.vars.sv_projectName;
    var _projectDescription = _serverJSONData.Data.vars.sv_projectDesc;
    var _oneSync = _serverJSONData.Data.vars.onesync_enabled;
    var _enforceBuild = _serverJSONData.Data.vars.sv_enforceGameBuild;
    var _scriptHook = _serverJSONData.Data.vars.sv_scriptHookAllowed;
    var _purityLevel = _serverJSONData.Data.sv_pureLevel;
    var _serverDiscord = _serverJSONData.Data.vars.Discord;
    var _ownerForum = _serverJSONData.Data.ownerProfile;
    var _ownerForumName = _serverJSONData.Data.ownerName;
    var _ownerForumID = _serverJSONData.Data.ownerID;
    var _serverSupportStatus = _serverJSONData.Data.support_status;
    var _serverTags = _serverJSONData.Data.vars.tags;
    var _AnonServer = _serverJSONData.Data.private;
    var _EndPoint = _serverJSONData.Data.connectEndPoints[0];
    var PlayerList = [] // Dump The Players into an array
    if (_projectName != undefined) {
            log(`Server has been found and stored in the JSON file`)
            for (let i = 0; i < _getPlayers.length; i++) {
                if (_getPlayers[i].identifiers != '') {
                    var IdentitiyInformation = []
                    for (let x = 0; x < _getPlayers[i].identifiers.length; x++) {
                        if (_getPlayers[i].identifiers[x].includes('steam:')) {
                            _temp = {"type": "Steam", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                        if (_getPlayers[i].identifiers[x].includes('license:')) {
                            _temp = {"type": "License", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                        if (_getPlayers[i].identifiers[x].includes('xbl:')) {
                            _temp = {"type": "Xbl", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                        if (_getPlayers[i].identifiers[x].includes('live:')) {
                            _temp = {"type": "Live", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                        if (_getPlayers[i].identifiers[x].includes('fivem:')) {
                            _temp = {"type": "FiveM", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                        if (_getPlayers[i].identifiers[x].includes('discord:')) {
                            _temp = {"type": "Discord", "id": _getPlayers[i].identifiers[x]}
                            IdentitiyInformation.push(_temp)
                        }
                    }
                    PlayerList.push({
                        "name": _getPlayers[i].name,
                        "identity": IdentitiyInformation,
                        "ping": _getPlayers[i].ping,
                        "id": _getPlayers[i].id,
                    })
                }else{
                    _FailedServerID = _CurrentID
                    _FailedServerIP = _EndPoint
                    _AnonServer = true 
                }
            }
            _RequestServerInformation.push({
                "Server Unique ID": _CurrentID,
                "Server IPv4": _EndPoint,
                "Server Host Name": _serverHostName,
                "Server Project Name": _projectName,
                "Server Project Description": _projectDescription,
                "Server Tags": _serverTags,
                "Server Discord": _serverDiscord,
                "Server Owner Forum": _ownerForum,
                "Server Owner Forum Name": _ownerForumName,
                "Server Owner Forum ID": _ownerForumID,
                "Server Support Status": _serverSupportStatus,
                "Server Purity Level": _purityLevel,
                "Server Enforce Build": _enforceBuild,
                "Server Script Hook": _scriptHook,
                "Server OneSync": _oneSync,
                "Server Max Clients": _maxClients,
                "Server Total Clients": _totalClients,
                "Private Server": _AnonServer,
                "Server Game Type": _gameType,
                "Server Country": _country,
                "Server Host Type": _hostType,
                "Server Version": _serverVersion,
                "Server Resources": _serverResources,
                "Server Players": PlayerList,
            })
            if (_AnonServer == true) {
                _AnonServer = false
                _AnonServers.push(_CurrentID)
            }
            fs.writeFileSync(`_TempData.json`, JSON.stringify(_RequestServerInformation, null, 4)) 
            setTimeout(function() {
            _exit()
            }, 1000)
    }
}


    
async function _Execute(ID) { 
    var headers = {	'Content-Type': 'application/json',	'Accept-Encoding': 'gzip','user-agent': 'Mozilla/5.0'};
    var options = {url: `https://servers-frontend.fivem.net/api/servers/single/${ID}`,method: 'GET',headers: headers,gzip: true};
    http(options, function(error, response, body) {
        var _CurrentID = ID
        if (!error && response.statusCode == 200) {
            HandleData(_CurrentID, body)
        }
    });
}
_Execute(_Argument)