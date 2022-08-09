const { exit } = require('process');
const http = require('request');

var _ServerCache = [] // Cache the servers from the FiveM-API
var _AnonServers = []  // Servers that are private [Not in server list] - This wont display player names/identifiers [Only Server Name and Info]
var _TotalServersCached = 0 // Total servers cached
var _TotalServersFinished = 0 // Total servers finished
var _TotalFailedRequestes = 0 // Total failed requests 
var _TotalOfflineServers = 0 // Total offline servers
var _TotalRecoveredServers = 0 // Total servers recovered that we couln't reach due to ratelimit issues
var _TotalPlayersFound = 0 // Total players


function log(string) { console.log(string);}
function _exit() {process.exit();}
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
    var _serverJSONData = JSON.parse(body);
    log(`${_CurrentIP} is online.`)
    log(_serverJSONData)
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
        log(`Total Servers Finished - ${_TotalServersFinished} / ${_TotalServersCached}`)
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
            log(`Total Servers Finished - ${_TotalServersFinished} / ${_TotalServersCached}`)
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
