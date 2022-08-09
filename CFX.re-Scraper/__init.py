import os 
import sys
import time 
import datetime
import requests
import json


def RoundError(Status, CurrentIssue, CurrentMS):
    if Status == "All Systems Operational":
        TableStatus['Status'] = "\033[92mAll Systems Operational\033[0m"
        TableStatus['CurrentIssue'] = "\033[92mN/A\033[0m"
    else:
        TableStatus['Status'] = "\033[91mAll Systems Not Operational\033[0m"
        TableStatus['CurrentIssue'] = "\033[91m"+CurrentIssue+"\033[0m"
    if int(CurrentMS) < 260:
        TableStatus['CurrentMS'] = "\033[92m" + str(CurrentMS) + "\033[0m"
    else:
        TableStatus['CurrentMS'] = "\033[91m" + str(CurrentMS) + "\033[0m"

request_get = requests.get('https://status.cfx.re/api/v2/status.json')
request_getv2 = requests.get('https://status.cfx.re/metrics-display/1hck2mqcgq3h/day.json')
convertJson = request_get.json()
convertJsonv2 = request_getv2.json()
TableStatus = {"Status": "","CurrentMS": "","CurrentIssue": "",}
RoundError(convertJson['status']['description'], convertJson['status']['indicator'], round(convertJsonv2['summary']['mean'], 0)  )


_Logo_ = """

             ██████ ███████ ██   ██    ██████  ███████     ███████  ██████ ██████   █████  ██████  ███████ ██████  
            ██      ██       ██ ██     ██   ██ ██          ██      ██      ██   ██ ██   ██ ██   ██ ██      ██   ██ 
            ██      █████     ███      ██████  █████       ███████ ██      ██████  ███████ ██████  █████   ██████  
            ██      ██       ██ ██     ██   ██ ██               ██ ██      ██   ██ ██   ██ ██      ██      ██   ██ 
             ██████ ██      ██   ██ ██ ██   ██ ███████     ███████  ██████ ██   ██ ██   ██ ██      ███████ ██   ██       
                                                                                                  
                                             Created by K3YOMI@github [RA66IT]
                                 I am not responsible for any damage caused by this tool.
                 (I am awaiting for d-bub to revamp the server list api so this cant be done in the future)

                                      [Cfx.re Status] """+TableStatus['Status']+""" - """+TableStatus['CurrentIssue']+"""
                                            [CnL Self Time] """+str(TableStatus['CurrentMS'])+""" milliseconds                                                                                                                    
"""

def _searchServerName():
    getRegex = input("Enter the server name (Can be something like 'csrp'): ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-Name.js " + getRegex)
def _searchServerID():
    getRegex234 = input("Enter the server ID: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-ID.js " + getRegex234)
def _searchServerResource():
    getRegex = input("Enter the server resource name: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-Resource.js " + getRegex)
def _searchServerPlayerCount():
    getMin = input("Min Playercount (Example: 5): ")
    getMax = input("Max Playercount (Example: 10): ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-MinMax.js " + getMin + " " + getMax)
def _searchBooleanOneSync():
    getRegex = input("OneSync [true/false]: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-OneSync.js " + getRegex)
def _searchBooleanScriptHook():
    getRegex = input("ScriptHook [true/false]: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Server-ScriptHook.js " + getRegex)
def _searchBuildVersion():
    getRegex = input("Enter the build version: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-BuildVersion.js " + getRegex)
def _searchHostType():
    print("[1] Linux")
    print("[2] Windows")
    getRegex = input("Enter your choice: ")
    if getRegex == "1":
        os.system('cls || clear')
        os.system("node Javascript/FiveM-API-Server-HostType.js linux")
    elif getRegex == "2":
        os.system('cls || clear')
        os.system("node Javascript/FiveM-API-Server-HostType.js windows")
def _searchSupportType():
    print("[1] Support")
    print("[2] No Support")
    getRegex = input("Enter your choice: ")
    if getRegex == "1":
        os.system('cls || clear')
        os.system("node Javascript/FiveM-API-Server-Support.js supported")
    elif getRegex == "2":
        os.system('cls || clear')
        os.system("node Javascript/FiveM-API-Server-Support.js end_of_support")
def _searchForumID():
    getRegex = input("Enter the forum ID: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Forum.js " + getRegex)
def _searchSteamDecToHex(): # Easy way to convert the steam decimal ID to a link [Base16 Conversion] :D
    getRegex = input("Enter the Steam Decimal: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Steam.js " + getRegex)
def _runPlayerNameSearch():
    getRegex = input("Enter the player name: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Player-Name.js " + getRegex)
def _runPlayerIdentifierSearch():
    getRegex = input("Enter the player identifier: ")
    os.system('cls || clear')
    os.system("node Javascript/FiveM-API-Player-Identifiers.js " + getRegex)
def _scrapeEverything():
    os.system('node Javascript/FiveM-API-Scrape.js')
def _installNodeJS():
   os.system('py Javascript/_install.py')

_ChoicesArray = [  #Low-key pretty smart for doing this method instead of use if-else statements lmao
    {"Choice": "1", "Type": "SERVER", "Name": "Name Search",  "Function": _searchServerName},
    {"Choice": "2", "Type": "SERVER", "Name": "ID Search", "Function": _searchServerID},
    {"Choice": "3", "Type": "SERVER", "Name": "Resource Search", "Function": _searchServerResource},
    {"Choice": "4", "Type": "SERVER", "Name": "Player Count Search", "Function": _searchServerPlayerCount},
    {"Choice": "5", "Type": "SERVER", "Name": "OneSync Search", "Function": _searchBooleanOneSync},
    {"Choice": "6", "Type": "SERVER", "Name": "ScriptHook Search", "Function": _searchBooleanScriptHook},
    {"Choice": "7", "Type": "SERVER", "Name": "Build Version Search", "Function": _searchBuildVersion},
    {"Choice": "8", "Type": "SERVER", "Name": "Host Type Search", "Function": _searchHostType},
    {"Choice": "9", "Type": "SERVER", "Name": "Support Type Search", "Function": _searchSupportType},
    {"Choice": "10", "Type": "PLAYER", "Name": "Forum ID Search", "Function": _searchForumID},
    {"Choice": "11", "Type": "PLAYER", "Name": "Steam Decimal to Hex Search", "Function": _searchSteamDecToHex},
    {"Choice": "12", "Type": "PLAYER", "Name": "Name Search", "Function": _runPlayerNameSearch},
    {"Choice": "13", "Type": "PLAYER", "Name": "Identifier Search", "Function": _runPlayerIdentifierSearch},
    {"Choice": "14", "Type": "ALL_EN", "Name": "Everything", "Function": _scrapeEverything},
    {"Choice": "15", "Type": "NodeJS", "Name": "Install NodeJS Packages", "Function": _installNodeJS}

]


def _initChoosen():
    global CurrentIssue
    os.system("title " + "CFX.re Scraper - Created by K3YOMI@Github")
    os.system('cls || clear')
    print(_Logo_)
    print(f"[#]\t[Type]\t\t[Action]")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    for x in _ChoicesArray:
        if (int(x['Choice']) < 10):
            print(f"[0" + x['Choice'] + "] \t["+x['Type']+"]\t" + x['Name'])
        else:
           print(f"[" + x['Choice'] + "] \t["+x['Type']+"]\t" + x['Name'])
    print('\n')
    choosen = input("Select an option :: ")
    for x in _ChoicesArray:
        if (x['Choice']) == (choosen):
            x['Function']()

_initChoosen()


    
