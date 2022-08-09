const { exit } = require('process');
const http = require('request');
const fs = require('fs');
var _Argument = process.argv[2];

var _ServerCache = [] // Cache the servers from the FiveM-API
var _RequestServerInformation = [] // Cache the servers from the FiveM-API we already searched
var _AnonServers = []  // Servers that are private [Not in server list] - This wont display player names/identifiers [Only Server Name and Info]
var _TotalServersCached = 0 // Total servers cached
var _TotalServersFinished = 0 // Total servers finished
var _TotalFailedRequestes = 0 // Total failed requests 
var _TotalOfflineServers = 0 // Total offline servers
var _TotalRecoveredServers = 0 // Total servers recovered that we couln't reach due to ratelimit issues
var _TotalPlayersFound = 0 // Total players found
var _TotalFoundByArgument = 0 // Total servers found by argument


function isLinuxServer(string) { if (string.indexOf('win32') > -1) {    return "Windows";}else{    return "Linux";}}
function log(string) { console.log(string);}
function _exit() {process.exit();}
function _saveArray() { fs.writeFileSync(`_TempData.json`, JSON.stringify(_RequestServerInformation, null, 4));setTimeout(_saveArray, 1000 * 2);}_saveArray()
function _delay(ms) { return new Promise(resolve => setTimeout(resolve, ms));}




function _getServers() {  // This is pretty big so relax and eat a cookie or some shit. [Estimated Time per 1000 Servers: ~1.5 minutes] (So basically 20 ish minutes if you have good internet)
    var headers = {	'Content-Type': 'application/json',	'Accept-Encoding': 'gzip',    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'};
    var options = {url: 'https://servers-frontend.fivem.net/api/servers/streamRedir/',method: 'GET',headers: headers,gzip: true};
    http(options, function(error, response, body) {
        if (!error && response.statusCode == 200) { 
            const RegularExpression = /\x0A\x06(?! *locale)(?<id>[a-z0-9]{6})\x12([^]*?)?(?<ip>(?:\d{1,3}\.){3}\d{1,3}:\d{1,5})/gim 
            for (const match of body.matchAll(RegularExpression)) {
                _ServerCache.push({id: match.groups.id,ip: match.groups.ip,})
                _TotalServersCached++
                
            }
            console.log(`Retrieved ${_TotalServersCached} Servers`)
            _Execute()
        }else{
            log(`Failed to connect to FiveM API - Host Down?`);
            _exit()
        }
    });
}
function HandleData(_CurrentIP, _CurrentID, body) { 
    var _AnonServer = false // If the server is anon or not
    var _FoundVariable = false // Check if we found the variable
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
    var _PlayerNameFound = [];
    var PlayerList = [] // Dump The Players into an array
    if (_projectName != undefined) {
        if (_AnonServer == false) {
            for (let i = 0; i < _getPlayers.length; i++) {
                for (let x = 0; x < _getPlayers[i].identifiers.length; x++) {
                    if (_getPlayers[i].identifiers[x].includes(_Argument.toLowerCase())) {
                        _PlayerNameFound.push({name: _getPlayers[i].name,id: _getPlayers[i].id, identifiers: _getPlayers[i].identifiers})
                        _FoundVariable = true
                    }
                }
            }
        }
        if (_FoundVariable == true) {
            _TotalFoundByArgument++
            for (let i = 0; i < _getPlayers.length; i++) {
                _TotalPlayersFound++
                if (_getPlayers[i].identifiers != '') {
                    // Good Server
                }else{
                    _FailedServerID = _CurrentID
                    _FailedServerIP = _CurrentIP
                    _AnonServer = true 
                }
            }
            log(`Server Name: ${_serverHostName}`)
            log(`Total Players: ${_totalClients}`)
            log(`Game Type: ${_gameType}`)
            log(`Country: ${_country}`)
            log(`Server Host Name: ${_serverHostName}`)
            log(`Host Type: ${_hostType}`)
            log(`Server Version: ${_serverVersion}`)
            log(`Max Clients: ${_maxClients}`)
            log(`Project Name: ${_projectName}`)
            log(`Project Description: ${_projectDescription}`)
            log(`OneSync: ${_oneSync}`)
            log(`Enforce Build: ${_enforceBuild}`)
            log(`Script Hook: ${_scriptHook}`)
            log(`Purity Level: ${_purityLevel}`)
            log(`Server Discord: ${_serverDiscord}`)
            log(`Owner Forum: ${_ownerForum}`)
            log(`Owner Forum Name: ${_ownerForumName}`)
            log(`Owner Forum ID: ${_ownerForumID}`)
            log(`Server Support Status: ${_serverSupportStatus}`)
            log(`Server Tags: ${_serverTags}`)
            log(`Anon Server: ${_AnonServer}`)
            log(`Players Found: ${_PlayerNameFound}`)
            _RequestServerInformation.push({
                "Server Unique ID": _CurrentID,
                "Server IPv4": _CurrentIP,
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
                "Server Players Found": _PlayerNameFound[0], // Kept on putting 2 of the same user. I'll fix this later but for now it works with just getting index 0
            })
            if (_AnonServer == true) {
                _AnonServer = false
                _AnonServers.push(_CurrentID)
            }
            fs.writeFileSync(`_TempData.json`, JSON.stringify(_RequestServerInformation, null, 4)) 
            setTimeout(function() {
            log(`Player was seen on ${_CurrentIP} - ${_CurrentID}`)
            _exit()
            }, 1000)
        }
    }
}

async function _ExecuteAgain(_CurrentIP, _CurrentID) {
    var _AnonServer = false // If the server is anon or not
    var _FailedServerID = ''  // We are going to need this because we are going to retry the request if it fails
    var _FailedServerIP = '' // We are going to need this because we are going to retry the request if it fails
    var _CheckFailed = false // Check if we failed to request a server
    var headers = {	'Content-Type': 'application/json',	'Accept-Encoding': 'gzip','user-agent': 'Mozilla/5.0'};
    var options = {url: `https://servers-frontend.fivem.net/api/servers/single/${_CurrentID}`,method: 'GET',headers: headers,gzip: true};
    http(options, function(error, response, body) {
        var _CurrentIP = _CurrentIP
        var _CurrentID = _CurrentID
        if (!error && response.statusCode == 200) {
            HandleData(_CurrentIP, _CurrentID, body)
            _TotalRecoveredServers++
        }else{
            if (response.statusCode == 404) {
                _TotalOfflineServers++
                log('[Server Manager]', `${response.statusCode} is offline.`)
                _FailedServerID = _CurrentID
                _FailedServerIP = _CurrentIP
                _CheckFailed = true 
            }else{
                _TotalFailedRequestes++ 
            }
        }
        _TotalServersFinished++
        log(`Total Private Servers - ${_AnonServers.length}`)
        log(`Total Failed Servers - ${_TotalFailedRequestes}`)
        log(`Total Servers Finished - ${_TotalServersFinished} / ${_TotalServersCached} - ${_TotalFoundByArgument}`)
        log(`Total Players Discovered - ${_TotalPlayersFound}`)
        log(`Total Offline Servers - ${_TotalOfflineServers}`)
        log(`Total Recovered Servers - ${_TotalRecoveredServers}`)
    });
    if (_CheckFailed == true) {
        _TotalFailedRequestes++
    }
}

    
async function _Execute() { 
    var _FailedServerID = ''  // We are going to need this because we are going to retry the request if it fails
    var _FailedServerIP = '' // We are going to need this because we are going to retry the request if it fails
    var _CheckFailed = false // Check if we failed to request a server
    for (let i =0; i < _ServerCache.length; i++) {
        if (i % 75 === 0) { // Every 75 servers, wait 3 seconds to prevent rate limit (This is a nice way to prevent ratelimit issues in the future)
            await _delay(3000);
        }
        var headers = {	'Content-Type': 'application/json',	'Accept-Encoding': 'gzip','user-agent': 'Mozilla/5.0'};
        var options = {url: `https://servers-frontend.fivem.net/api/servers/single/${_ServerCache[i].id}`,method: 'GET',headers: headers,gzip: true};
        http(options, function(error, response, body) {
            var _CurrentIP = _ServerCache[i].ip
            var _CurrentID = _ServerCache[i].id
            if (!error && response.statusCode == 200) {
                HandleData(_CurrentIP, _CurrentID, body)
            }else{
                _FailedServerID = _CurrentID
                _FailedServerIP = _CurrentIP
                _CheckFailed = true 
            }
            _TotalServersFinished++
            log(`Total Private Servers - ${_AnonServers.length}`)
            log(`Total Failed Servers - ${_TotalFailedRequestes}`)
            log(`Total Servers Finished - ${_TotalServersFinished} / ${_TotalServersCached} - ${_TotalFoundByArgument}`)
            log(`Total Players Discovered - ${_TotalPlayersFound}`)
            log(`Total Offline Servers - ${_TotalOfflineServers}`)
            log(`Total Recovered Servers - ${_TotalRecoveredServers}`)
        });
        if (_CheckFailed == true) {
            log(`Failed to get server information for ${_FailedServerID} - Waiting 5 seconds to try again`)
            await _delay(5000);
            _CheckFailed = false
            _ExecuteAgain(_FailedServerIP, _FailedServerID)
        }
    }
}

_getServers()