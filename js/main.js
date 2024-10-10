function getEl(sId) {
    return document.getElementById(sId);
}

var bDebuggerEnabled = true,
    oDebugger = getEl('debugger'),
    iRetryChannelLoad = 0;

var iCurrentChannel = false,
    sCurrentChannelName = false,
    sCurrentChannelGroup = false,
    sCurrentChannelLogo = false,
    iPreviousChannel = false,
    bChannelWasAlreadyPlaying = false,
    bPlayerLoaded = false,
    bSettingsLoaded = false,
    bPlaylistFileLoaded = false,
    bDownloadRunning = false,
    sUserAgent = 'Mozilla/5.0 (IPTV ' + sAppVersion + ') ' + sDeviceFamily,
    iDownloadId = false,
    iChannelInputNumber = '',
    sSelectedGroup = false,
    bJustStarted = true,
    bStorageInitReady = false,
    iSelectedAudioChannel = false,
    iSelectedSubtitleTrack = false,
    bChannelSettingsOpened = false,
    sChannelSetting = false,
    iChannelSettingsFocusedField = 0,
    sFilter = false,
    bIsBooting = true,

    // EPG
    bEpgLoaded = false,
    bEpgOpened = false,
    bEpgOverviewOpened = false,
    sPlaylistEpgUrl = false,
    bChannelHasEpg = false,
    bPlaylistEpgCompatible = false,
    bEpgBooted = false,
    aLazyLoadedEpgChannels = [],

    aSubTitleTracks = [],
    aAudioTracks = [],
    aVideoTracks = [],
    bTrackInfoLoaded = false,

    aFavourites = false,
    iVisibleChannels = 0,
    iFavChannels = false,
    bPlaylistHasFavs = false,
    aPlaylistHistory = false,
    aChannelList = [],
    aFilteredChannelList = [],
    oSelectedItem = false,
    iStatusTimeout = false,
    iChannelNameTimer = false,
    iZapTimer = false,
    iChannelInputTimer = false,
    bGuideOpened = false,
    iReconnectTimer = false,
    iReconnectTryAfter = 1000,
    bStreamWasInterrupted = false,
    bChannelNameOpened = false,
    bChannelInputOpened = false,
    bConfirmBoxOpened = false,
    bYesConfirmSelected = false,
    bAdvancedSettingsOpened = false,
    bSettingsOpened = false,
    bNavOpened = false,
    bGroupsOpened = false,
    bStatusOpened = false,
    bModalOpened = false,
    bSubtitlesActive = false,
    bDebuggerActive = false,
    bChannelErrorOpened = false,
    bSearchFocused = false,
    bSaveExitAllowed = false,
    sLocalCacheFile = 'downloads/herber-playlist.m3u',
    bNeedNavRefresh = false,
    bUsbManagerOpened = false,
    oHlsApi = false,
    iNavChannelHeight = 54,
    aLazyLoadedChannels = [],
    aChannelOrder = [],
    bChannelEditModeActive = false,
    sChannelEditMode = false,
    bHistoryBrowserOpened = false,

    // Some DOM-Elements
    oSearchField = getEl('search_field'),
    oAvPlayer = getEl('player'),
    oInputM3u = getEl('sM3uUrl'),
    oInputEpgUrl = getEl('epg_url'),
    oInputEpgTimeShift = getEl('epg_time_shift'),
    oInputCustomUserAgent = getEl('user_agent_setting'),
    oEpgChannelList = getEl('epg_nav_list'),
    oEpgOverview = getEl('epg_overview_table'),
    oLoader = getEl('loader'),
    oCheckboxEpgSetting = getEl('enable_epg_setting'),
    oBufferSetting = getEl('buffer_setting'),
    oNav = getEl('nav'),
    oGroupsNav = getEl('group_list'),
    oChannelList = getEl('channel_list'),
    oChannelSettingsList = getEl('channel_settings_list'),
    oChannelSubDubSettings = getEl('channel_settings_subs'),

    iSettingsFocusedField = 0,
    iAdvancedSettingsFocusedField = 0,
    iPremiumSettingsFocusedField = 0,
    iBufferLength = 15,
    oSettingsFields = document.querySelectorAll('#main_settings .focusable'),
    iSettingsFieldsLength = oSettingsFields.length,
    oAdvancedSettingsFields = document.querySelectorAll('#advanced_settings .focusable'),
    iAdvancedSettingsFieldsLength = oAdvancedSettingsFields.length,
    oPremiumSettingsFields = document.querySelectorAll('#premium_settings .focusable'),
    iPremiumSettingsFieldsLength = oPremiumSettingsFields.length;

// Channel info
var oChannelInfo = getEl('channel_info'),
    oChannelTrack = getEl('channel_tracking'),
    oChannelName = getEl('channel_name'),
    oChannelNum = getEl('channel_number'),
    oChannelGroup = getEl('channel_group'),
    oChannelEpg = getEl('channel_epg'),
    oPrevChannel = getEl('channel_prev'),
    oNextChannel = getEl('channel_next'),
    oChannelNumberInput = getEl('channel_input');


switch (sDeviceFamily) {
    case 'Browser':
        break;
    case 'Samsung':
    case 'LG':
    case 'Android':
        iNavChannelHeight = 64;
        break;
}

if (sDeviceFamily === 'Android' && !bIsAndroidTv) {
    iNavChannelHeight = 54;
}


// ---- Helpers
function debug(mVar) {
    if (bDebuggerEnabled) {
        if (sDeviceFamily !== 'Browser') {
            var oDate = new Date(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
            if (iSeconds < 10) {
                iSeconds = '0' + iSeconds;
            }
            if (iMinutes < 10) {
                iMinutes = '0' + iMinutes;
            }
            var sDate = oDate.getHours() + ":" + iMinutes + ":" + iSeconds;
            oDebugger.innerHTML = sDate + ': ' + mVar + '<hr>' + oDebugger.innerHTML;
            oDebugger.scrollTop = 0;
        }
        console.log(mVar);
        //console.trace(mVar);
        if (typeof(debugCallback) === 'function') {
            debugCallback(sDate + ': ' + mVar);
        }
    }
}


function defocus() {

    var oActiveElement = document.activeElement;
    if (oActiveElement) {
        oActiveElement.blur();
    }

    //getEl('defocus').focus();

}


function getMatch(sContent, sRegExp, iMatchNum) {

    iMatchNum = iMatchNum || 1;
    var aData = sContent.match(sRegExp);
    if (aData && aData.length > iMatchNum) {
        return aData[iMatchNum];
    }

    return '';

}


function fireRequest(sUrl, oFormdata, sOnSuccess, sOnFailure, sOnProgress) {

    var oHttp = new XMLHttpRequest(),
        bFailureFired = false;
    oHttp.timeout = 300000; // 5 min timeout
    oHttp.onreadystatechange = function() {
        if (oHttp.readyState == XMLHttpRequest.DONE) { // oHttpRequest.DONE == 4
            if (oHttp.status > 399) {
                if (!bFailureFired) {
                    bFailureFired = true;
                    sOnFailure(oHttp);
                }
            } else {
                sOnSuccess(oHttp);
            }
        }
    };

    if (typeof(sOnProgress) === 'function') {
        //oHttp.addEventListener('loadstart', sOnProgress);
        //oHttp.addEventListener('load', sOnProgress);
        //oHttp.addEventListener('loadend', sOnProgress);
        oHttp.addEventListener('progress', sOnProgress);
    }

    oHttp.addEventListener('error', function() {
        if (!bFailureFired) {
            bFailureFired = true;
            sOnFailure(oHttp);
        }
    });
    oHttp.addEventListener('abort', function() {
        if (!bFailureFired) {
            bFailureFired = true;
            sOnFailure(oHttp);
        }
    });
    oHttp.addEventListener('timeout', function() {
        if (!bFailureFired) {
            bFailureFired = true;
            sOnFailure(oHttp);
        }
    });

    if (sUrl && typeof(sOnSuccess) === 'function' && typeof(sOnFailure) === 'function') {
        try {
            if (oFormdata) {
                oHttp.open("POST", sUrl, true);
                oHttp.send(oFormdata);
            } else {
                oHttp.open("GET", sUrl, true);
                oHttp.setRequestHeader('Cache-Control', 'no-cache');
                oHttp.setRequestHeader('Pragma', 'no-cache');
                oHttp.setRequestHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
                oHttp.send();
            }
        } catch (e) {
            if (!bFailureFired) {
                bFailureFired = true;
                sOnFailure(e);
            }
            debug(e.message);
            return false;
        }
        return true;
    }

    return false;

}


function savePlaylistToStorage(sStorageName, sContent) {

    if (typeof(localforage) === 'object') {
        localforage.setItem('sChannelListStorage', sContent);
        return true;
    }

    localStorage.setItem('sChannelListStorage', sContent);
    return true;

}

function getPlaylistFromStorage(sStorageName) {

    var sContent = localStorage.getItem('sChannelListStorage');

    if (typeof(localforage) === 'object') {

        if (sContent) {
            localStorage.removeItem('sChannelListStorage');
            savePlaylistToStorage('default', sContent);
        }

        /*
        localforage.getItem('sChannelListStorage').then(function(sStorageValue) {
        	console.log("playlist loaded from forage");
        	sContent = sStorageValue;
        }).catch(function(err) {
        	console.log(err);
        });
        */

        try {
            //sContent = await localforage.getItem('sChannelListStorage');
            // This code runs once the value has been loaded
            // from the offline store.
            //console.log(sContent);
        } catch (err) {
            // This code runs if there were any errors.
            console.log(err);
        }

    }

    return sContent;

}

function removePlaylistFromStorage(sStorageName) {

    if (typeof(localforage) === 'object') {
        localforage.removeItem('sChannelListStorage');
    }

    localStorage.removeItem('sChannelListStorage');

}


function openExternalLink(oEl) {
    //navigator.app.loadUrl(oEl.href, {openExternal: true});
    window.open(oEl.href, "_system");
    return false;
}


function showElement(sId, bFade) {
    bFade = bFade || false;

    var oEl = getEl(sId);
    if (!oEl) {
        return false;
    }

    if (bFade) {
        oEl.style.opacity = '1';
    } else {
        oEl.style.display = 'block';
    }
}

function hideElement(sId, bFade) {
    bFade = bFade || false;

    var oEl = getEl(sId);
    if (!oEl) {
        return false;
    }

    if (bFade) {
        oEl.style.opacity = '0';
    } else {
        oEl.style.display = 'none';
    }
}


function showModal(sMessage, sError) {
    sError = sError || false;

    hideStatus();
    if (sError) {
        sMessage += '<br><br><span class="small">' + sError + '</span>';
    }

    bModalOpened = true;
    defocus();
    getEl('modal_content').innerHTML = sMessage + '<br><br><span class="small">' + getLang('hideModalHint') + '</span>';
    showElement('modal');
}

function hideModal() {
    bModalOpened = false;
    hideElement('modal');
    getEl('modal_content').style.width = 'auto';
    getEl('modal_content').style.maxWidth = 'auto';
}

function showGuide() {
    showControlsGuide(sDeviceFamily);
    return false;

    bGuideOpened = true;
    document.body.classList.add('showguide');
    getEl('guide_content').scrollIntoView();
}

function hideGuide() {
    bGuideOpened = false;
    document.body.classList.remove('showguide');
}

function showControlsGuide(sPlatForm) {

    getEl('modal_content').style.width = '70%';
    getEl('modal_content').style.maxWidth = '1100px';
    var sGuide = '<h2>' + getLang('guideControlsHeadline') + '</h2><ul class="unordered-list ALIGNLEFT" style="margin-bottom: 0">' + getLang('guideControls') + '</ul>';
    showModal(sGuide);

}


function showChannelError(sError, sErrorCode) {
    bChannelErrorOpened = true;
    getEl('channel_error_content').innerHTML = sError + '<br><br><span class="small">' + sErrorCode + '</span>';
    showElement('channel_error');
    oLoader.style.display = 'none';
}

function hideChannelError() {
    if (bChannelErrorOpened) {
        bChannelErrorOpened = false;
        hideElement('channel_error');
    }
}


function focusSettingsField(sId) {
    iSettingsFocusedField = getEl(sId).dataset.index; // focus download button
    oSettingsFields[iSettingsFocusedField].focus();
}


function showSaveExitButton() {
    var oSaveButton = getEl('settings_save_button');
    bSaveExitAllowed = true;
    iSettingsFocusedField = oSaveButton.dataset.index; // save-button

    getEl('main_settings').classList.add('playlist-ready');

    if (bSettingsOpened) {
        oSaveButton.focus();
    }
}


function hideSaveExitButton() {
    bSaveExitAllowed = false;

    getEl('main_settings').classList.remove('playlist-ready');
    hideElement('playlist_downloaded');
}

function checkM3uUrl(sM3uUrl) {
    return (sM3uUrl && sM3uUrl.length > 8 /*&& sM3uUrl.toLowerCase().indexOf('.m3u') > 4*/ );
}

function getPlaylist() {
    return localStorage.getItem('sM3uList');
}


// Check network status
function checkNetwork() {

    if (sDeviceFamily === 'Samsung') {
        try {
            // Check network status
            webapis.network.addNetworkStateChangeListener(function(value) {
                if (value == webapis.network.NetworkState.GATEWAY_DISCONNECTED) {
                    // Something you want to do when network is disconnected
                    showModal(getLang("connectionLost"));
                    debug("GATEWAY_DISCONNECTED");
                    if (bPlayerLoaded && iCurrentChannel) {
                        webapis.avplay.pause();
                    }

                } else if (value == webapis.network.NetworkState.GATEWAY_CONNECTED) {
                    // Something you want to do when network is connected again
                    hideModal();
                    debug("GATEWAY_CONNECTED");
                    if (bPlayerLoaded && iCurrentChannel) {
                        webapis.avplay.play();
                    }
                }
            });
        } catch (e) {
            debug(e.message);
        }
    }

    // LG: TODO: https://itnext.io/how-to-check-network-connection-on-smarttv-webos-and-tizen-75256c67584b

}


// First init function
function boot() {

    checkNetwork();

    applyLang();

    if (typeof(sDefaultUrl) === 'string') {
        // download from GET-param
        oInputM3u.value = sDefaultUrl;
        downloadPlaylistAjax(sDefaultUrl, playlistReadyHandler);
        //playlistReadyHandler();
        return false;
    }

    // no settings in storage yet
    var sM3uList = getPlaylist(),
        oSetting = false;
    if (!sM3uList) {
        if (oInputCustomUserAgent) {
            oInputCustomUserAgent.value = sUserAgent;
        }

        showSettings(true);
        return false;
    }

    // Only load valid playlist
    oInputM3u.value = sM3uList;

    oInputM3u.onfocus = function(e) {
        document.body.classList.add('keyboard-opened');
    }

    oInputM3u.onblur = function(e) {
        document.body.classList.remove('keyboard-opened');
    }

    loadSettings();

    oSetting = getEl('reload_playlist_setting');
    if (oSetting && getReloadPlaylistSetting() == '1') {
        oSetting.checked = true;
        // Reload playlist
        if (sM3uList && sM3uList.indexOf('USB://') !== 0 && sM3uList.indexOf('local://') !== 0) {
            debug('reload playlist: ' + sM3uList);
            downloadPlaylistAjax(sM3uList, playlistReadyHandler);
            return false;
        }
    }

    // m3u file was already downloaded, use it
    if (!loadChannelListFromCache()) {
        showSettings(false);
        return false;
    }

    playlistReadyHandler();

}


function resetSettings() {

    localStorage.setItem('iLastChannel', 1);
    //localStorage.removeItem('aFavourites');

    //localStorage.removeItem('sEpgUrl');
    localStorage.removeItem('sEpgLastUpdated');
    localStorage.removeItem('sEpgLastUrl');

    removeGroupFilter();

    setEpgEnableSetting(false);

    hideElement('epg_activator');

    if (iReconnectTimer) {
        clearTimeout(iReconnectTimer);
        iReconnectTimer = false;
    }

    if (oEpgOverview) {
        hideEpgOverview(true);
    }

    if (oEpgChannelList) {
        oEpgChannelList.innerHTML = '';
        bEpgNavListBuilt = false;
    }

    sFilter = false;
    //aFavourites = false;
    bTrackInfoLoaded = false;
    sPlaylistEpgUrl = false;
    bIsGrabbing = false;
    bPlaylistEpgCompatible = false;
    aChannelList = []; // remove old channels
    bPlaylistFileLoaded = false;
    hideSaveExitButton();
    resetEpgStatus();

    if (iCurrentChannel) {
        try {
            switch (sDeviceFamily) {
                case 'Android':
                case 'Apple':
                    m3uConnector.resetPlayer();
                    break;
                case 'Samsung':
                    webapis.avplay.stop();
                    break;
                case 'LG':
                case 'Browser':
                    oHlsApi.stopLoad();
                    oHlsApi.detachMedia();
                    break;
            }
        } catch (e) {
            debug(e.message);
        }

    }

    iCurrentChannel = false;
    bPlayerLoaded = false;

}


function downloadUsbPlaylist(sUrl) {

    // Download from USB
    if (sDeviceFamily === 'Samsung' && sUrl.indexOf('USB://') === 0) {

        if (!bStorageInitReady) {
            bStorageInitReady = true;
            initStorage();
            return true;
        }

        if (!iNumOfMountedUSB) {
            showModal(getLang('errorNoUsbMounted'));
            return true;
        }

        var sFileName = sUrl.replace('USB://', '');

        tizen.filesystem.listStorages(function(storages) {
            for (var i = 0; i < storages.length; i++) {
                if (storages[i].type == "EXTERNAL" && storages[i].state == "MOUNTED") {
                    tizen.filesystem.resolve(storages[i].label, function(oResolver) {
                        var oFile = oResolver.resolve(sFileName);
                        if (oFile != null && oFile.fileSize > 0) {
                            oFile.openStream("r",
                                function(fs) {
                                    var sText = fs.read(oFile.fileSize);
                                    if (sText.indexOf('#EXTM3U') !== 0) {
                                        showModal("Not a valid m3u playlist! #EXTM3U is missing!");
                                        onDownloadError();
                                    } else if (savePlaylist(sText)) {
                                        onDownloadSuccess();
                                    } else {
                                        showModal(getLang('checkM3uFileError'));
                                        onDownloadError();
                                    }
                                    fs.close();
                                },
                                function(e) {
                                    debug("Error " + e.message);
                                    showModal(getLang('checkM3uDownloadError'), 'Detailed error: ' + e.message);
                                    onDownloadError();
                                }, "UTF-8"
                            );
                        } else {
                            showModal(getLang('checkM3uFileError'));
                        }
                    });
                    break;
                }
            }
        });

        return true;
    }

    return false;

}


// With file_get_contents
function downloadPlaylistProxy(sUrl) {

    bDownloadRunning = true;
    showStatus(getLang('downloadM3uStatus'), false);

    var oFormData = new FormData();
    oFormData.append('sUrl', sUrl);

    // to avoid CORS issue, use proxy-download script
    fireRequest('#', oFormData, function(oHttp) {
        hideStatus();
        bDownloadRunning = false;
        if (oHttp.responseText && oHttp.responseText.indexOf('ERROR') !== 0) {
            if (savePlaylist(oHttp.responseText)) {
                savePlaylistToHistory(sUrl);
                onDownloadSuccess();
            }
        } else {
            // if no remote download possible, try local download with ajax
            //downloadPlaylistAjax(sUrl);
            showModal(getLang('checkM3uDownloadError'), 'Detailed error: ' + oHttp.responseText);
        }
    }, function(oHttp) {
        showModal(getLang('checkM3uDownloadError'), 'Detailed error: ' + oHttp.status + ' - ' + oHttp.statusText);
        hideStatus();
        bDownloadRunning = false;
    }, function(oHttp) { // progress
        if (oHttp.loaded) {
            var sDownloaded = (oHttp.loaded / 1024).toFixed(2);
            if (oHttp.total) {
                sDownloaded += ' / ' + (oHttp.total / 1024).toFixed(2);
            }
            showStatus(getLang('downloadM3uStatus') + '<br>' + sDownloaded + ' KB', false);
        }
    });

    return true;

}


// Web version
function downloadPlaylistAjax(sUrl, sCallback) {

    // Load demolist from demo-channels.js
    if (sUrl === "http://watch-ad.rf.gd/demo-pl.php" && typeof(sDemoPlaylist) !== 'undefined') {
        if (savePlaylist(sDemoPlaylist)) {
            onDownloadSuccess();
        }
        return true;
    }

    if (downloadUsbPlaylist(sUrl)) {
        return true;
    }

    bDownloadRunning = true;
    showStatus(getLang('downloadM3uStatus'), false);

    fireRequest(sUrl, false, function(oHttp) {
        hideStatus();
        bDownloadRunning = false;
        if (oHttp.responseText && oHttp.responseText !== 'ERROR') {
            if (savePlaylist(oHttp.responseText)) {
                savePlaylistToHistory(sUrl);
                onDownloadSuccess();
            }
        } else {
            // if no remote download possible, try local download
        }
        if (typeof(sCallback) === 'function') {
            sCallback();
        }
    }, function(oHttp) {
        hideStatus();
        bDownloadRunning = false;
        if (sDeviceFamily === 'Browser') {
            downloadPlaylistProxy(sUrl); // Try proxy fallback (CORS elimination)
        } else {
            showModal(getLang('checkM3uDownloadError'), 'Detailed error: ' + oHttp.status + ' - ' + oHttp.statusText);
        }
    }, function(oHttp) { // progress
        if (oHttp.loaded) {
            var sDownloaded = (oHttp.loaded / 1024).toFixed(2);
            if (oHttp.total) {
                sDownloaded += ' / ' + (oHttp.total / 1024).toFixed(2);
            }
            showStatus(getLang('downloadM3uStatus') + '<br>' + sDownloaded + ' KB', false);
        }
    });

    return true;

}


function savePlaylist(sContent) {

    try {
        if (sContent && sContent.length > 4900000) {
            showModal(getLang('checkM3uDownloadSizeError'));
            sContent = sContent.substr(0, 4900000);
        }

        return savePlaylistToStorage('default', sContent);
    } catch (e) {
        debug(e.message);
    }

    return false;

}


function deletePlaylist() {

    debug('deletePlaylist');

    if (bDownloadRunning) {
        return false;
    }

    resetSettings();

    // first delete old m3u file from cache/downloads
    try {
        removePlaylistFromStorage('default');
    } catch (e) {
        debug(e.message);
    }

}


function onDownloadSuccess() {

    if (loadChannelListFromCache()) {
        //playlistReadyHandler();
        //getEl('playlist_downloaded').innerHTML = aChannelList.length + ' <span class="i18n" data-langid="channelsLoaded">' + getLang('channelsLoaded') + '</span>';
        var sText = getLang('playlistDownloaded').replace('%i', aChannelList.length);
        //		showModal(sText);

View all
