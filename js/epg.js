var oEpgChannelContainer = getEl('epg_container'),
    oEpgChannelContent = getEl('epg'),
    oEpgClock = getEl('epg_overview_time'),
    oEpgNavClock = getEl('epg_nav_time'),
    oNavChannelEpg = getEl('epg_nav_channel'),
    iEpgClockTimer = false,
    oEpgTimeShiftInput = getEl('epg_time_shift'),
    iEpgTimeShift = 0,
    oEpgGrapIntervalInput = getEl('epg_grab_interval'),
    oEpgDownloadStatus = getEl('epg_downloaded'),
    oEpgProgramDownloadStatus = getEl('epg_downloaded_programms');

var bDbInitiated = false,
    oDb = false,
    sLoadingFromDb = false,
    iDbVersion = 10,
    bIsGrabbing = false,
    bNeedEpgUpdate = false,
    bEpgTableBuilt = false,
    aAltIds = {},
    iSecondsSinceEpgOverviewRefresh = 0,
    iSecondsSinceEpgNavListRefresh = 0,
    iSecondsSinceEpgChannelRefresh = 0,
    bEpgNavListBuilt = false,
    iEpgNavListClockTimer = false,
    iSelectedEpgOverviewChannel = false;

var iEpgOverviewScrollMin = 0,
    iEpgOverviewScrollMax = 0,
    iLastOverviewScrollPos = 0,
    aLazyLoadedOverviewItems = [],
    iEpgOverviewItemHeight = 49;


Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 3600000));
    return this;
};

Date.prototype.subHours = function(h) {
    this.setTime(this.getTime() - (h * 3600000));
    return this;
};

function getTimeNow() {

    if (iEpgTimeShift) {
        var oDateNowLocal = new Date();
        oDateNowLocal.addHours(iEpgTimeShift);
        return oDateNowLocal.getTime();
    } else {
        return new Date().getTime();
    }

}

function insertCharAt(sString, sChar, iPos) {
    return sString.substring(0, iPos) + sChar + sString.substring(iPos);
}


function syncScrollEpgList(oNav) {

    if (bEpgLoaded) {
        oEpgChannelList.scrollTop = oNav.scrollTop;
    }

}


function getEpgDateObject(sTimeString, iAddTimezoneHours) {

    if (sTimeString) {

        var oDate = new Date(sTimeString);
        var iTimezoneOffset = oDate.getTimezoneOffset();
        if (iTimezoneOffset) {
            oDate.addHours(Math.round(iTimezoneOffset / 60 * -1));
        }

        if (iAddTimezoneHours) {
            iAddTimezoneHours = Math.round(iAddTimezoneHours / 100);
            if (iAddTimezoneHours) {
                oDate.addHours(iAddTimezoneHours);
            }
        }

        return oDate;

    }

    return false;

}


function getEpgTimeString(oDate, aOptions) {

    var aOptions = aOptions || {
        hour: '2-digit',
        minute: '2-digit'
    };

    return oDate.toLocaleTimeString(navigator.language, aOptions);

}


var bEpgClockInit = false;

function initEpgClock() {

    if (bEpgClockInit) {
        return false;
    }

    bEpgClockInit = true;

    /*if( iEpgNavListClockTimer ) {
    	clearInterval(iEpgNavListClockTimer);
    }*/

    if (iEpgClockTimer) {
        clearInterval(iEpgClockTimer);
    }

    epgTimer();
    iEpgClockTimer = setInterval(function() {
        epgTimer();

        iSecondsSinceEpgNavListRefresh++;
        iSecondsSinceEpgOverviewRefresh++;
        iSecondsSinceEpgChannelRefresh++;
        // Wenn Übersicht geöffnet, dann jede Minute Tabelle aktualisieren
        if (bEpgOverviewOpened && iSecondsSinceEpgOverviewRefresh > 120) {
            refreshEpgOverviewTable();
        }
        if (bNavOpened && iSecondsSinceEpgNavListRefresh > 60) {
            refreshEpgNavList();
        }

        if (sLoadingFromDb && iSecondsSinceEpgChannelRefresh > 60) {
            sLoadingFromDb = false;
            iSecondsSinceEpgChannelRefresh = 0;
        }
    }, 1000);

}


/*
function refreshAltIds() {

	return false;

	if( Object.keys(aAltIds).length || !oDb ) {
		return false;
	}

	console.log('refreshAltIds start');

	var oRequest = oDb.transaction("epgAlternativeIds").objectStore("epgAlternativeIds").openCursor();
	oRequest.onsuccess = function() {
		var oRecord = event.target.result;
		if( oRecord ) {
			if( oRecord.value.name ) {
				aAltIds[oRecord.value.name] = oRecord.value.id;
			}
			oRecord.continue();
		} else {
			iSecondsSinceEpgNavListRefresh = 9999;
			iSecondsSinceEpgOverviewRefresh = 9999;
			bNeedNavRefresh = true;
			console.log('refreshAltIds done');
		}
	};

}


var sLastFoundAlternativeId = false;
function getAlternativeNameId( sTvgName ) {

	refreshAltIds();

	if( aAltIds[sTvgName] && aAltIds[sTvgName] !== sTvgName ) {
		return aAltIds[sTvgName];
	}

	return false;

}*/


function updateEpgTimeShift(bForceUpdate) {

    var bForceUpdate = bForceUpdate || false;
    if (bForceUpdate) {
        bNeedEpgUpdate = true;
    }

    iEpgTimeShift = oEpgTimeShiftInput.value; // global var
    localStorage.setItem('sEpgTimeShiftSetting', iEpgTimeShift);
    getEl('epg_time_shift_output').innerText = '(' + iEpgTimeShift + ' h)';

    bEpgNavListBuilt = false;
    bEpgTableBuilt = false;
    iSecondsSinceEpgNavListRefresh = 9999;
    iSecondsSinceEpgOverviewRefresh = 9999;
    iSecondsSinceEpgChannelRefresh = 9999;
    resetEpgStatus();

}


function updateEpgGrabInterval(bForceUpdate) {

    var bForceUpdate = bForceUpdate || false;
    if (bForceUpdate) {
        bNeedEpgUpdate = true;
    }

    setGrabbingInterval();

    if (isEpgOutdated()) {
        startEgpGrabbing();
    }

}


function isEpgOutdated() {

    var sLastUpdateTime = localStorage.getItem('sEpgLastUpdated'),
        sLastEpgUrl = localStorage.getItem('sEpgLastUrl');

    if (sLastEpgUrl !== getEpgUrl()) {
        return true;
    }

    var iGrabIntervalSetting = oEpgGrapIntervalInput.value;
    if (sLastUpdateTime && iGrabIntervalSetting) {
        var bIsOutdated = (Date.now() - (iGrabIntervalSetting * 3600000) > parseInt(sLastUpdateTime));
        if (!bIsOutdated) {
            var sLastDownloadDate = new Date(parseInt(sLastUpdateTime)).toLocaleString();
            debug('no EPG download needed. Last download was on ' + sLastDownloadDate);
            oEpgDownloadStatus.innerText = sLastDownloadDate;
            oEpgDownloadStatus.className = 'icon icon-check';
        }
        return bIsOutdated;
    }

    return true;

}


// EPG DB
function initDb() {

    try {
        var oDbOpen = indexedDB.open("m3u", iDbVersion);

        oDbOpen.onupgradeneeded = function() {
            debug('onupgradeneeded');
            oDb = oDbOpen.result;

            // recreate DB
            for (var i = 0; i < oDb.objectStoreNames.length; i++) {
                oDb.deleteObjectStore(oDb.objectStoreNames[i]);
            }

            createObjectStores(oDb);
        };

        oDbOpen.onsuccess = function() {
            // Start a new transaction
            oDb = oDbOpen.result;

            if (oDb.objectStoreNames.length < 2) {
                //createObjectStores(oDb);
                debug("DB recreation neeeded");
            }
            debug('db open success');
            bDbInitiated = 'OK';

        };
        oDbOpen.onerror = function(event) {
            debug("Error loading db");
        };

    } catch (e) {
        debug(e.message);
    }

}


function loadEpgDb() {

    if (!bDbInitiated && getEnabledEpgSetting() == '1') {

        bDbInitiated = 'ERROR'; // Is overwriten if success
        initDb();

    }

}


function stopDb() {

    if (oDb) {
        oDb.close();
        console.log('db closed');

        bDbInitiated = false;
        oDb = false;
    }

}


function createObjectStores(oDb) {

    try {
        var oStore = oDb.createObjectStore("epgStore", {
            keyPath: "id"
        });

        //oStore = oDb.createObjectStore("epgAlternativeIds", {keyPath: 'name'});
        //oStore.createIndex("id", "name", { unique: false });

        oStore = oDb.createObjectStore("epgProgramme", {
            keyPath: ['id', 'start']
        });
        oStore.createIndex("id", "id", {
            unique: false
        });
    } catch (e) {
        debug(e.message);
    }

}


function parseAlternativeChannelIds(oStore, sContent, sId) {

    var aMatches = sContent.match(/<display-name[^>]*>([\s\S]*?)<\/display-name>/g);

    if (aMatches) {
        var iCount = aMatches.length;
        for (var i = 0; i < iCount; i++) {

            var sDisplayTag = aMatches[i];
            var sDisplayName = getMatch(sDisplayTag, /<display-name[^>]*>(.+)<\/display-name>/),
                sLangId = getMatch(sDisplayTag, /lang="([^"]+)"/);
            oStore.put({
                id: sId,
                name: sDisplayName,
                lang: sLangId
            });

        }
    }

}


var oActiveWorker = false;

function loadEpgSource(sUrl) {

    if (getEnabledEpgSetting() == '0') {
        bIsGrabbing = false;
        return false;
    }

    if (!aChannelList) {
        debug('no playlist to grab against. Please load playlist first');
        return false;
    }

    if (!bPlaylistEpgCompatible) {
        notCompatibleHandler();
        return false;
    }

    if (!bNeedEpgUpdate && isEpgOutdated()) {
        bNeedEpgUpdate = true;
    }

    if (!bNeedEpgUpdate) {
        showElement('epg_activator');
        bEpgLoaded = true;
        document.body.classList.add('epg-loaded');
        bIsGrabbing = false;

        if (bNavOpened) {
            bEpgNavListBuilt = false;
            buildEpgNavList();
        }

        if (bEpgOverviewOpened) {
            buildEpgOverview();
        }
        return false;
    }

    loadEpgDb();

    bEpgLoaded = false;
    aAltIds = {};
    document.body.classList.remove('epg-loaded');
    oEpgDownloadStatus.innerText = getLang('epgIsDownloading') + '...';
    oEpgDownloadStatus.className = 'e-loading';
    oEpgProgramDownloadStatus.innerText = '';
    hideElement('epg_activator');

    if (window.Worker) {

        if (oActiveWorker) {
            oActiveWorker.terminate();
            oActiveWorker = false;
        }

        bNeedEpgUpdate = false;
        bIsGrabbing = true;

        var sLangEpgChannelsProcessed = getLang('epgChannelsProcessed');
        var sLangEpgProgramsProcessed = getLang('epgProgramsProcessed');

        debug('Start epg download worker. Try grab EPG: ' + sUrl);
        oActiveWorker = new Worker("./js/epg-worker.js?v=c" + iDbVersion);

        oActiveWorker.postMessage({
            'url': sUrl,
            'timeshift': iEpgTimeShift,
            'interval': oEpgGrapIntervalInput.value,
            'version': iDbVersion,
            'playlist': aChannelList
        });

        oActiveWorker.onmessage = function(e) {
            var sResponseText = e.data;
            if (sResponseText) {

                if (typeof(sResponseText) === 'object') {
                    aAltIds[sResponseText.name] = sResponseText.id;
                    return true;
                } else if (sResponseText.indexOf('OK channels: ') == 0) {
                    oEpgDownloadStatus.innerText = sResponseText.replace('OK channels: ', sLangEpgChannelsProcessed);
                    return true;
                } else if (sResponseText.indexOf('OK programms: ') == 0) {
                    oEpgProgramDownloadStatus.innerText = sResponseText.replace('OK programms: ', sLangEpgProgramsProcessed);
                    return true;
                } else if (sResponseText.indexOf('DB ERROR: ') == 0) {
                    if (sResponseText === 'DB ERROR: Not enough space') {
                        showModal(getLang('epgQuotaExceededError'));
                    } else {
                        showModal(sResponseText);
                    }
                    resetEpgStatus();
                    oEpgDownloadStatus.innerText = sResponseText.replace('DB ERROR: ', '');
                    return true;
                }

                switch (sResponseText) {
                    case 'downloading':
                        oEpgDownloadStatus.innerText = getLang('epgIsDownloading');
                        break;
                    case 'playlist not compatible':
                        resetEpgStatus();
                        notCompatibleHandler();
                        break;
                    case 'finish insertChannels':
                    case 'start programmsImport':
                        oEpgDownloadStatus.className = 'icon icon-check';
                        oEpgProgramDownloadStatus.className = 'e-loading';
                        oEpgProgramDownloadStatus.innerText = sLangEpgProgramsProcessed + '...';
                        break;
                    case 'finish':
                        bEpgLoaded = true;
                        bIsGrabbing = false;
                        document.body.classList.add('epg-loaded');
                        showElement('epg_activator');
                        oEpgDownloadStatus.className = 'icon icon-check';
                        oEpgProgramDownloadStatus.className = 'icon icon-check';

                        localStorage.setItem('sEpgLastUpdated', Date.now()),
                            localStorage.setItem('sEpgLastUrl', sUrl);

                        if (bNavOpened) {
                            bEpgNavListBuilt = false;
                            buildEpgNavList();
                        }

                        if (bEpgOverviewOpened) {
                            buildEpgOverview();
                        }
                        break;

                    default:
                        resetEpgStatus();
                        oEpgDownloadStatus.innerText = sResponseText;
                }

            }

        };

        oActiveWorker.onerror = function(e) {
            bIsGrabbing = false;
            resetEpgStatus();
            oEpgDownloadStatus.innerText = e.message;
        };

    } else {
        debug('Your device doesn\'t support web workers.');
        bIsGrabbing = false;
    }
}


function epgItemClick(oEl, oEv) {

    // Zoom image
    if (oEv.target.classList.contains('p-icon')) {
        oEl.classList.toggle('p-zoom');
    } else {

        // Remove previous click-classes from other epg-items
        var oItems = document.getElementsByClassName('p-item');
        if (oItems) {
            [].forEach.call(oItems, function(oItem) {
                if (oItem !== oEl) {
                    oItem.classList.remove('p-zoom', 'active');
                }
            });
        }

        // Open extended channel info
        if (oEl.classList.contains('short')) {
            oEl.classList.toggle('active');
        }

    }

}



function loadChannelEpg(iChNum, sTvgId) {

    if (!bEpgLoaded) {
        return false;
    }

    iChNum = iChNum || iCurrentChannel;
    iChNum--; // because iCurrentChannel is not key value

    var sTvgId = sTvgId || false,
        sAltId = sTvgId;

    if (!sTvgId && iChNum >= 0) {
        var aCurrentChannel = aChannelList[iChNum];
        if (aCurrentChannel && typeof(aCurrentChannel.tvgid) === 'string') {
            sTvgId = aCurrentChannel.tvgid;
        }
    }

    if (!sTvgId) {
        oEpgChannelContent.innerHTML = getLang('noEpgForChannel')
        oEpgChannelContainer.classList.add('no-epg');
        sLoadingFromDb = false;
    } else if (sLoadingFromDb !== sTvgId && oDb) {

        oEpgChannelContent.innerHTML = getLang('epgIsDownloading');
        oEpgChannelContainer.className = '';

        sLoadingFromDb = sTvgId;
        var iReferredChannel = iChNum + 1,
            iDateNow = getTimeNow();
        var oRequest = oDb.transaction("epgStore").objectStore("epgStore").get(sTvgId);
        oRequest.chNum = iChNum;

        //debug('load from db...' + sTvgId);
        oRequest.onsuccess = function() {

            if (!this.result) {

                oEpgChannelContent.innerHTML = getLang('noEpgForChannel');
                oEpgChannelContainer.classList.add('no-epg');

            } else if (this.result.id) {

                if (this.result.epgid) {
                    sTvgId = this.result.epgid;
                }

                bChannelHasEpg = true;
                oChannelInfo.classList.add('show-epg');

                oEpgChannelContainer.classList.add('has-epg');

                var sEpgHtml = '<div class="epg-chno">' + iReferredChannel + '</div>',
                    sProgrammHtml = '',
                    sMoreProgrammHtml = ''; //, sContent = this.result.xml;

                var sDisplayName = this.result.name; // getMatch(sContent, /<display-name>(.+)<\/display-name>/);
                var sIconUrl = this.result.icon; // getMatch(sContent, /<icon src="([^"]+)"/);

                if (sIconUrl) {
                    sEpgHtml += '<div class="epg-icon-container"><img class="epg-icon" src="' + sIconUrl + '"></div>';

                } else if (sDisplayName) {
                    sEpgHtml = '<h2 class="epg-title">' + sDisplayName + '</h2>';
                }

                // Get program
                var oProgramIndex = oDb.transaction("epgProgramme").objectStore("epgProgramme").index('id');
                //oProgramIndex.get(sTvgId);
                var singleKeyRange = IDBKeyRange.only(sTvgId);

                var iCount = 0;

                oEpgChannelContent.innerHTML = sEpgHtml;
                oEpgChannelContainer.classList.remove('no-epg');

                oProgramIndex.openCursor(singleKeyRange).onsuccess = (event) => {
                    var oRecord = event.target.result;
                    if (oRecord && oRecord.value) {

                        var tStart = oRecord.value.start,
                            tStop = oRecord.value.stop,
                            tzShift = oRecord.value.tz;

                        //sContent = oRecord.value.xml;
                        // "<programme start=\"20221023092500 +0000\" stop=\"20221023101000 +0000\" channel=\"ZDFinfo.de\"><title lang=\"de\">Da Vinci Code an der Loire</title></programme>"

                        // Check time
                        var oStartTime = getEpgDateObject(tStart, tzShift);
                        var oEndTime = getEpgDateObject(tStop, tzShift);

                        if (!oStartTime || !oEndTime) {
                            oRecord.continue();
                            return true;
                        }

                        // expired
                        if (iDateNow > oEndTime.getTime()) {
                            oRecord.continue();
                            return true;
                        }

                        var sTitle = oRecord.value.title; //getMatch(sContent, /<title([^>]+)>(.+)<\/title>/, 2);
                        var sDesc = oRecord.value.desc; //getMatch(sContent, /<desc([^>]+)>(.+)<\/desc>/, 2);
                        var sIcon = oRecord.value.icon; //getMatch(sContent, /<icon src="([^"]+)"/, 1);

                        sProgrammHtml = '';

                        // Channel > 1. Short Preview
                        if (iCount > 0) {
                            if (iCount === 1) {
                                sProgrammHtml = '<p class="p-after">' + getLang('epgAfter') + ' <span class="HR"></span></p>';
                            }
                            sProgrammHtml += '<div class="p-item short" onclick="epgItemClick(this, event);">';
                        } else {
                            sProgrammHtml = '<p class="p-now">' + getLang('epgNow') + ' <span class="HR"></span></p>';
                            sProgrammHtml += '<div class="p-item" onclick="epgItemClick(this, event);">';

                            // Current program in channel info
                            if (oRecord.value.duration) {
                                if (oStartTime.getTime() < iDateNow) {
                                    var iElapsedPct = Math.round(((iDateNow - oStartTime.getTime()) / (oEndTime.getTime() - oStartTime.getTime())) * 100);
                                    oChannelEpg.innerHTML = /*getLang('epgNow') + ':<br>'*/ '<div id="channel_info_epg_timeline"><div id="channel_info_epg_elapsed" style="width: ' + iElapsedPct + '%"></div></div>' + sTitle;
                                }
                            }

                        }

                        // Ausgabe
                        if (iEpgTimeShift) {
                            oEndTime.subHours(iEpgTimeShift);
                            oStartTime.subHours(iEpgTimeShift);
                        }

                        var sStartTime = getEpgTimeString(oStartTime);
                        var sEndTime = getEpgTimeString(oEndTime);

                        if (sIcon) {
                            sProgrammHtml += '<img class="p-icon" src="' + sIcon + '">';
                            sProgrammHtml += '<div class="p-body has-image">';
                        } else {
                            sProgrammHtml += '<div class="p-body">';
                        }

                        if (sTitle) {
                            sProgrammHtml += '<h3 class="p-title">' + sTitle + '</h3>';
                        }

                        if (sStartTime) {
                            sProgrammHtml += '<p class="p-time"><i class="NOBR">' + sStartTime + '</i> - <i class="NOBR">' + sEndTime + '</i></p>';
                        }

                        if (sDesc) {
                            sProgrammHtml += '<p class="p-desc">' + sDesc + '</p>';
                        }
                        sProgrammHtml += '</div>';

                        sProgrammHtml += '<div class="CLEAR"></div></div>';

                        iCount++;
                        if (iCount > 5) {
                            sMoreProgrammHtml += sProgrammHtml;
                        } else {
                            oEpgChannelContent.innerHTML += sProgrammHtml;
                        }

                        oRecord.continue();
                    }
                };

            }
        };
        oRequest.oncomplete = function() {
            debug('EPG complete');
        };
        oRequest.onerror = function() {
            debug('EPG onerror');
        };

    }

}


function buildEpgNavList() {

    if (!bEpgLoaded) {
        oEpgChannelList.innerHTML = '';
        return false;
    }

    if (bEpgNavListBuilt) {
        if (iSecondsSinceEpgNavListRefresh > 120) {
            refreshEpgNavList();
        }
        return true;
    }

    if (aFilteredChannelList.length === 0) {
        oEpgChannelList.innerHTML = '';
    } else if (oDb) {

        var sTableHtml = '',
            sProgrammHtml = '';

        /*var iMinChannel = 1, iMaxChannel = aFilteredChannelList.length + 1;
        for( var i = iMinChannel; i < iMaxChannel; i++ ) {
        	var iChNum = i - 1;
        	if( typeof(aFilteredChannelList[iChNum]) !== 'undefined' ) {
        		sTableHtml += '<li id="en-c' + iChNum + '"></li>';
        	}
        }*/

        /*for( var iChNum in aFilteredChannelList ) {
        	if( typeof(aFilteredChannelList[iChNum]) !== 'undefined' ) {
        		sTableHtml += '<li id="en-c' + iChNum + '"></li>';
        	}
        }*/

        var iHeight = getEl('channel_list_ul').offsetHeight;
        oEpgChannelList.innerHTML = '<ul id="epg_nav_channels" style="height: ' + iHeight + 'px">' + sTableHtml + '</ul>';
        syncScrollEpgList(oChannelList);

        refreshEpgNavList();
        initEpgClock();

        bEpgNavListBuilt = true;
    }

}


function buildEpgOverview() {

    if (bEpgTableBuilt) {
        if (iSecondsSinceEpgOverviewRefresh > 120) {
            refreshEpgOverviewTable();
        }
        return true;
    }

    if (oDb && iCurrentChannel) {

        var sTableHtml = '',
            sProgrammHtml = '',
            aCurrentChannel = aChannelList[iCurrentChannel - 1];
        var iMinChannel = 1,
            iMaxChannel = aChannelList.length + 1;

        /*
        if( aCurrentChannel && typeof(aCurrentChannel.tvgid) === 'string' ) {
        	//sTvgId = aCurrentChannel.tvgid;
        }

        var iMinChannel = iCurrentChannel - 10, iMaxChannel = iCurrentChannel + 10;

        if( iMinChannel < 0 ) {
        	iMinChannel = 0;
        }

        if( iMaxChannel >

View all
