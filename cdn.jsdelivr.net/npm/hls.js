! function t(e) {
    var r, i;
    r = this, i = function() {
            "use strict";

            function r(t, e) {
                var r = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    e && (i = i.filter((function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    }))), r.push.apply(r, i)
                }
                return r
            }

            function i(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var i = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? r(Object(i), !0).forEach((function(e) {
                        var r, a, s;
                        r = t, a = e, s = i[e], (a = n(a)) in r ? Object.defineProperty(r, a, {
                            value: s,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : r[a] = s
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : r(Object(i)).forEach((function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
                    }))
                }
                return t
            }

            function n(t) {
                var e = function(t, e) {
                    if ("object" != typeof t || !t) return t;
                    var r = t[Symbol.toPrimitive];
                    if (void 0 !== r) {
                        var i = r.call(t, e || "default");
                        if ("object" != typeof i) return i;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return ("string" === e ? String : Number)(t)
                }(t, "string");
                return "symbol" == typeof e ? e : String(e)
            }

            function a(t, e) {
                for (var r = 0; r < e.length; r++) {
                    var i = e[r];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, n(i.key), i)
                }
            }

            function s(t, e, r) {
                return e && a(t.prototype, e), r && a(t, r), Object.defineProperty(t, "prototype", {
                    writable: !1
                }), t
            }

            function o() {
                return o = Object.assign ? Object.assign.bind() : function(t) {
                    for (var e = 1; e < arguments.length; e++) {
                        var r = arguments[e];
                        for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i])
                    }
                    return t
                }, o.apply(this, arguments)
            }

            function l(t, e) {
                t.prototype = Object.create(e.prototype), t.prototype.constructor = t, h(t, e)
            }

            function u(t) {
                return u = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }, u(t)
            }

            function h(t, e) {
                return h = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                    return t.__proto__ = e, t
                }, h(t, e)
            }

            function d(t, e, r) {
                return d = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                    } catch (t) {
                        return !1
                    }
                }() ? Reflect.construct.bind() : function(t, e, r) {
                    var i = [null];
                    i.push.apply(i, e);
                    var n = new(Function.bind.apply(t, i));
                    return r && h(n, r.prototype), n
                }, d.apply(null, arguments)
            }

            function c(t) {
                var e = "function" == typeof Map ? new Map : void 0;
                return c = function(t) {
                    if (null === t || ! function(t) {
                            try {
                                return -1 !== Function.toString.call(t).indexOf("[native code]")
                            } catch (e) {
                                return "function" == typeof t
                            }
                        }(t)) return t;
                    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== e) {
                        if (e.has(t)) return e.get(t);
                        e.set(t, r)
                    }

                    function r() {
                        return d(t, arguments, u(this).constructor)
                    }
                    return r.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: r,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), h(r, t)
                }, c(t)
            }

            function f(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
                return i
            }

            function g(t, e) {
                var r = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                if (r) return (r = r.call(t)).next.bind(r);
                if (Array.isArray(t) || (r = function(t, e) {
                        if (t) {
                            if ("string" == typeof t) return f(t, e);
                            var r = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === r && t.constructor && (r = t.constructor.name), "Map" === r || "Set" === r ? Array.from(t) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? f(t, e) : void 0
                        }
                    }(t)) || e && t && "number" == typeof t.length) {
                    r && (t = r);
                    var i = 0;
                    return function() {
                        return i >= t.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: t[i++]
                        }
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }

            function v(t) {
                return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
            }
            var m = {
                exports: {}
            };
            ! function(t, e) {
                var r, i, n, a, s;
                r = /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/, i = /^(?=([^\/?#]*))\1([^]*)$/, n = /(?:\/|^)\.(?=\/)/g, a = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g, s = {
                    buildAbsoluteURL: function(t, e, r) {
                        if (r = r || {}, t = t.trim(), !(e = e.trim())) {
                            if (!r.alwaysNormalize) return t;
                            var n = s.parseURL(t);
                            if (!n) throw new Error("Error trying to parse base URL.");
                            return n.path = s.normalizePath(n.path), s.buildURLFromParts(n)
                        }
                        var a = s.parseURL(e);
                        if (!a) throw new Error("Error trying to parse relative URL.");
                        if (a.scheme) return r.alwaysNormalize ? (a.path = s.normalizePath(a.path), s.buildURLFromParts(a)) : e;
                        var o = s.parseURL(t);
                        if (!o) throw new Error("Error trying to parse base URL.");
                        if (!o.netLoc && o.path && "/" !== o.path[0]) {
                            var l = i.exec(o.path);
                            o.netLoc = l[1], o.path = l[2]
                        }
                        o.netLoc && !o.path && (o.path = "/");
                        var u = {
                            scheme: o.scheme,
                            netLoc: a.netLoc,
                            path: null,
                            params: a.params,
                            query: a.query,
                            fragment: a.fragment
                        };
                        if (!a.netLoc && (u.netLoc = o.netLoc, "/" !== a.path[0]))
                            if (a.path) {
                                var h = o.path,
                                    d = h.substring(0, h.lastIndexOf("/") + 1) + a.path;
                                u.path = s.normalizePath(d)
                            } else u.path = o.path, a.params || (u.params = o.params, a.query || (u.query = o.query));
                        return null === u.path && (u.path = r.alwaysNormalize ? s.normalizePath(a.path) : a.path), s.buildURLFromParts(u)
                    },
                    parseURL: function(t) {
                        var e = r.exec(t);
                        return e ? {
                            scheme: e[1] || "",
                            netLoc: e[2] || "",
                            path: e[3] || "",
                            params: e[4] || "",
                            query: e[5] || "",
                            fragment: e[6] || ""
                        } : null
                    },
                    normalizePath: function(t) {
                        for (t = t.split("").reverse().join("").replace(n, ""); t.length !== (t = t.replace(a, "")).length;);
                        return t.split("").reverse().join("")
                    },
                    buildURLFromParts: function(t) {
                        return t.scheme + t.netLoc + t.path + t.params + t.query + t.fragment
                    }
                }, t.exports = s
            }(m);
            var p = m.exports,
                y = Number.isFinite || function(t) {
                    return "number" == typeof t && isFinite(t)
                },
                E = Number.isSafeInteger || function(t) {
                    return "number" == typeof t && Math.abs(t) <= T
                },
                T = Number.MAX_SAFE_INTEGER || 9007199254740991,
                S = function(t) {
                    return t.MEDIA_ATTACHING = "hlsMediaAttaching", t.MEDIA_ATTACHED = "hlsMediaAttached", t.MEDIA_DETACHING = "hlsMediaDetaching", t.MEDIA_DETACHED = "hlsMediaDetached", t.BUFFER_RESET = "hlsBufferReset", t.BUFFER_CODECS = "hlsBufferCodecs", t.BUFFER_CREATED = "hlsBufferCreated", t.BUFFER_APPENDING = "hlsBufferAppending", t.BUFFER_APPENDED = "hlsBufferAppended", t.BUFFER_EOS = "hlsBufferEos", t.BUFFER_FLUSHING = "hlsBufferFlushing", t.BUFFER_FLUSHED = "hlsBufferFlushed", t.MANIFEST_LOADING = "hlsManifestLoading", t.MANIFEST_LOADED = "hlsManifestLoaded", t.MANIFEST_PARSED = "hlsManifestParsed", t.LEVEL_SWITCHING = "hlsLevelSwitching", t.LEVEL_SWITCHED = "hlsLevelSwitched", t.LEVEL_LOADING = "hlsLevelLoading", t.LEVEL_LOADED = "hlsLevelLoaded", t.LEVEL_UPDATED = "hlsLevelUpdated", t.LEVEL_PTS_UPDATED = "hlsLevelPtsUpdated", t.LEVELS_UPDATED = "hlsLevelsUpdated", t.AUDIO_TRACKS_UPDATED = "hlsAudioTracksUpdated", t.AUDIO_TRACK_SWITCHING = "hlsAudioTrackSwitching", t.AUDIO_TRACK_SWITCHED = "hlsAudioTrackSwitched", t.AUDIO_TRACK_LOADING = "hlsAudioTrackLoading", t.AUDIO_TRACK_LOADED = "hlsAudioTrackLoaded", t.SUBTITLE_TRACKS_UPDATED = "hlsSubtitleTracksUpdated", t.SUBTITLE_TRACKS_CLEARED = "hlsSubtitleTracksCleared", t.SUBTITLE_TRACK_SWITCH = "hlsSubtitleTrackSwitch", t.SUBTITLE_TRACK_LOADING = "hlsSubtitleTrackLoading", t.SUBTITLE_TRACK_LOADED = "hlsSubtitleTrackLoaded", t.SUBTITLE_FRAG_PROCESSED = "hlsSubtitleFragProcessed", t.CUES_PARSED = "hlsCuesParsed", t.NON_NATIVE_TEXT_TRACKS_FOUND = "hlsNonNativeTextTracksFound", t.INIT_PTS_FOUND = "hlsInitPtsFound", t.FRAG_LOADING = "hlsFragLoading", t.FRAG_LOAD_EMERGENCY_ABORTED = "hlsFragLoadEmergencyAborted", t.FRAG_LOADED = "hlsFragLoaded", t.FRAG_DECRYPTED = "hlsFragDecrypted", t.FRAG_PARSING_INIT_SEGMENT = "hlsFragParsingInitSegment", t.FRAG_PARSING_USERDATA = "hlsFragParsingUserdata", t.FRAG_PARSING_METADATA = "hlsFragParsingMetadata", t.FRAG_PARSED = "hlsFragParsed", t.FRAG_BUFFERED = "hlsFragBuffered", t.FRAG_CHANGED = "hlsFragChanged", t.FPS_DROP = "hlsFpsDrop", t.FPS_DROP_LEVEL_CAPPING = "hlsFpsDropLevelCapping", t.MAX_AUTO_LEVEL_UPDATED = "hlsMaxAutoLevelUpdated", t.ERROR = "hlsError", t.DESTROYING = "hlsDestroying", t.KEY_LOADING = "hlsKeyLoading", t.KEY_LOADED = "hlsKeyLoaded", t.LIVE_BACK_BUFFER_REACHED = "hlsLiveBackBufferReached", t.BACK_BUFFER_REACHED = "hlsBackBufferReached", t.STEERING_MANIFEST_LOADED = "hlsSteeringManifestLoaded", t
                }({}),
                L = function(t) {
                    return t.NETWORK_ERROR = "networkError", t.MEDIA_ERROR = "mediaError", t.KEY_SYSTEM_ERROR = "keySystemError", t.MUX_ERROR = "muxError", t.OTHER_ERROR = "otherError", t
                }({}),
                A = function(t) {
                    return t.KEY_SYSTEM_NO_KEYS = "keySystemNoKeys", t.KEY_SYSTEM_NO_ACCESS = "keySystemNoAccess", t.KEY_SYSTEM_NO_SESSION = "keySystemNoSession", t.KEY_SYSTEM_NO_CONFIGURED_LICENSE = "keySystemNoConfiguredLicense", t.KEY_SYSTEM_LICENSE_REQUEST_FAILED = "keySystemLicenseRequestFailed", t.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED = "keySystemServerCertificateRequestFailed", t.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED = "keySystemServerCertificateUpdateFailed", t.KEY_SYSTEM_SESSION_UPDATE_FAILED = "keySystemSessionUpdateFailed", t.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED = "keySystemStatusOutputRestricted", t.KEY_SYSTEM_STATUS_INTERNAL_ERROR = "keySystemStatusInternalError", t.MANIFEST_LOAD_ERROR = "manifestLoadError", t.MANIFEST_LOAD_TIMEOUT = "manifestLoadTimeOut", t.MANIFEST_PARSING_ERROR = "manifestParsingError", t.MANIFEST_INCOMPATIBLE_CODECS_ERROR = "manifestIncompatibleCodecsError", t.LEVEL_EMPTY_ERROR = "levelEmptyError", t.LEVEL_LOAD_ERROR = "levelLoadError", t.LEVEL_LOAD_TIMEOUT = "levelLoadTimeOut", t.LEVEL_PARSING_ERROR = "levelParsingError", t.LEVEL_SWITCH_ERROR = "levelSwitchError", t.AUDIO_TRACK_LOAD_ERROR = "audioTrackLoadError", t.AUDIO_TRACK_LOAD_TIMEOUT = "audioTrackLoadTimeOut", t.SUBTITLE_LOAD_ERROR = "subtitleTrackLoadError", t.SUBTITLE_TRACK_LOAD_TIMEOUT = "subtitleTrackLoadTimeOut", t.FRAG_LOAD_ERROR = "fragLoadError", t.FRAG_LOAD_TIMEOUT = "fragLoadTimeOut", t.FRAG_DECRYPT_ERROR = "fragDecryptError", t.FRAG_PARSING_ERROR = "fragParsingError", t.FRAG_GAP = "fragGap", t.REMUX_ALLOC_ERROR = "remuxAllocError", t.KEY_LOAD_ERROR = "keyLoadError", t.KEY_LOAD_TIMEOUT = "keyLoadTimeOut", t.BUFFER_ADD_CODEC_ERROR = "bufferAddCodecError", t.BUFFER_INCOMPATIBLE_CODECS_ERROR = "bufferIncompatibleCodecsError", t.BUFFER_APPEND_ERROR = "bufferAppendError", t.BUFFER_APPENDING_ERROR = "bufferAppendingError", t.BUFFER_STALLED_ERROR = "bufferStalledError", t.BUFFER_FULL_ERROR = "bufferFullError", t.BUFFER_SEEK_OVER_HOLE = "bufferSeekOverHole", t.BUFFER_NUDGE_ON_STALL = "bufferNudgeOnStall", t.INTERNAL_EXCEPTION = "internalException", t.INTERNAL_ABORTED = "aborted", t.UNKNOWN = "unknown", t
                }({}),
                R = function() {},
                b = {
                    trace: R,
                    debug: R,
                    log: R,
                    warn: R,
                    info: R,
                    error: R
                },
                k = b;

            function D(t) {
                for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) r[i - 1] = arguments[i];
                r.forEach((function(e) {
                    k[e] = t[e] ? t[e].bind(t) : function(t) {
                        var e = self.console[t];
                        return e ? e.bind(self.console, "[" + t + "] >") : R
                    }(e)
                }))
            }

            function I(t, e) {
                if ("object" == typeof console && !0 === t || "object" == typeof t) {
                    D(t, "debug", "log", "info", "warn", "error");
                    try {
                        k.log('Debug logs enabled for "' + e + '" in hls.js version 1.5.16')
                    } catch (t) {
                        k = b
                    }
                } else k = b
            }
            var w = k,
                C = /^(\d+)x(\d+)$/,
                _ = /(.+?)=(".*?"|.*?)(?:,|$)/g,
                x = function() {
                    function t(e) {
                        "string" == typeof e && (e = t.parseAttrList(e)), o(this, e)
                    }
                    var e = t.prototype;
                    return e.decimalInteger = function(t) {
                        var e = parseInt(this[t], 10);
                        return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e
                    }, e.hexadecimalInteger = function(t) {
                        if (this[t]) {
                            var e = (this[t] || "0x").slice(2);
                            e = (1 & e.length ? "0" : "") + e;
                            for (var r = new Uint8Array(e.length / 2), i = 0; i < e.length / 2; i++) r[i] = parseInt(e.slice(2 * i, 2 * i + 2), 16);
                            return r
                        }
                        return null
                    }, e.hexadecimalIntegerAsNumber = function(t) {
                        var e = parseInt(this[t], 16);
                        return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e
                    }, e.decimalFloatingPoint = function(t) {
                        return parseFloat(this[t])
                    }, e.optionalFloat = function(t, e) {
                        var r = this[t];
                        return r ? parseFloat(r) : e
                    }, e.enumeratedString = function(t) {
                        return this[t]
                    }, e.bool = function(t) {
                        return "YES" === this[t]
                    }, e.decimalResolution = function(t) {
                        var e = C.exec(this[t]);
                        if (null !== e) return {
                            width: parseInt(e[1], 10),
                            height: parseInt(e[2], 10)
                        }
                    }, t.parseAttrList = function(t) {
                        var e, r = {};
                        for (_.lastIndex = 0; null !== (e = _.exec(t));) {
                            var i = e[2];
                            0 === i.indexOf('"') && i.lastIndexOf('"') === i.length - 1 && (i = i.slice(1, -1)), r[e[1].trim()] = i
                        }
                        return r
                    }, s(t, [{
                        key: "clientAttrs",
                        get: function() {
                            return Object.keys(this).filter((function(t) {
                                return "X-" === t.substring(0, 2)
                            }))
                        }
                    }]), t
                }();

            function P(t) {
                return "SCTE35-OUT" === t || "SCTE35-IN" === t
            }
            var F = function() {
                    function t(t, e) {
                        if (this.attr = void 0, this._startDate = void 0, this._endDate = void 0, this._badValueForSameId = void 0, e) {
                            var r = e.attr;
                            for (var i in r)
                                if (Object.prototype.hasOwnProperty.call(t, i) && t[i] !== r[i]) {
                                    w.warn('DATERANGE tag attribute: "' + i + '" does not match for tags with ID: "' + t.ID + '"'), this._badValueForSameId = i;
                                    break
                                }
                            t = o(new x({}), r, t)
                        }
                        if (this.attr = t, this._startDate = new Date(t["START-DATE"]), "END-DATE" in this.attr) {
                            var n = new Date(this.attr["END-DATE"]);
                            y(n.getTime()) && (this._endDate = n)
                        }
                    }
                    return s(t, [{
                        key: "id",
                        get: function() {
                            return this.attr.ID
                        }
                    }, {
                        key: "class",
                        get: function() {
                            return this.attr.CLASS
                        }
                    }, {
                        key: "startDate",
                        get: function() {
                            return this._startDate
                        }
                    }, {
                        key: "endDate",
                        get: function() {
                            if (this._endDate) return this._endDate;
                            var t = this.duration;
                            return null !== t ? new Date(this._startDate.getTime() + 1e3 * t) : null
                        }
                    }, {
                        key: "duration",
                        get: function() {
                            if ("DURATION" in this.attr) {
                                var t = this.attr.decimalFloatingPoint("DURATION");
                                if (y(t)) return t
                            } else if (this._endDate) return (this._endDate.getTime() - this._startDate.getTime()) / 1e3;
                            return null
                        }
                    }, {
                        key: "plannedDuration",
                        get: function() {
                            return "PLANNED-DURATION" in this.attr ? this.attr.decimalFloatingPoint("PLANNED-DURATION") : null
                        }
                    }, {
                        key: "endOnNext",
                        get: function() {
                            return this.attr.bool("END-ON-NEXT")
                        }
                    }, {
                        key: "isValid",
                        get: function() {
                            return !!this.id && !this._badValueForSameId && y(this.startDate.getTime()) && (null === this.duration || this.duration >= 0) && (!this.endOnNext || !!this.class)
                        }
                    }]), t
                }(),
                M = function() {
                    this.aborted = !1, this.loaded = 0, this.retry = 0, this.total = 0, this.chunkCount = 0, this.bwEstimate = 0, this.loading = {
                        start: 0,
                        first: 0,
                        end: 0
                    }, this.parsing = {
                        start: 0,
                        end: 0
                    }, this.buffering = {
                        start: 0,
                        first: 0,
                        end: 0
                    }
                },
                O = "audio",
                N = "video",
                U = "audiovideo",
                B = function() {
                    function t(t) {
                        var e;
                        this._byteRange = null, this._url = null, this.baseurl = void 0, this.relurl = void 0, this.elementaryStreams = ((e = {})[O] = null, e[N] = null, e[U] = null, e), this.baseurl = t
                    }
                    return t.prototype.setByteRange = function(t, e) {
                        var r, i = t.split("@", 2);
                        r = 1 === i.length ? (null == e ? void 0 : e.byteRangeEndOffset) || 0 : parseInt(i[1]), this._byteRange = [r, parseInt(i[0]) + r]
                    }, s(t, [{
                        key: "byteRange",
                        get: function() {
                            return this._byteRange ? this._byteRange : []
                        }
                    }, {
                        key: "byteRangeStartOffset",
                        get: function() {
                            return this.byteRange[0]
                        }
                    }, {
                        key: "byteRangeEndOffset",
                        get: function() {
                            return this.byteRange[1]
                        }
                    }, {
                        key: "url",
                        get: function() {
                            return !this._url && this.baseurl && this.relurl && (this._url = p.buildAbsoluteURL(this.baseurl, this.relurl, {
                                alwaysNormalize: !0
                            })), this._url || ""
                        },
                        set: function(t) {
                            this._url = t
                        }
                    }]), t
                }(),
                G = function(t) {
                    function e(e, r) {
                        var i;
                        return (i = t.call(this, r) || this)._decryptdata = null, i.rawProgramDateTime = null, i.programDateTime = null, i.tagList = [], i.duration = 0, i.sn = 0, i.levelkeys = void 0, i.type = void 0, i.loader = null, i.keyLoader = null, i.level = -1, i.cc = 0, i.startPTS = void 0, i.endPTS = void 0, i.startDTS = void 0, i.endDTS = void 0, i.start = 0, i.deltaPTS = void 0, i.maxStartPTS = void 0, i.minEndPTS = void 0, i.stats = new M, i.data = void 0, i.bitrateTest = !1, i.title = null, i.initSegment = null, i.endList = void 0, i.gap = void 0, i.urlId = 0, i.type = e, i
                    }
                    l(e, t);
                    var r = e.prototype;
                    return r.setKeyFormat = function(t) {
                        if (this.levelkeys) {
                            var e = this.levelkeys[t];
                            e && !this._decryptdata && (this._decryptdata = e.getDecryptData(this.sn))
                        }
                    }, r.abortRequests = function() {
                        var t, e;
                        null == (t = this.loader) || t.abort(), null == (e = this.keyLoader) || e.abort()
                    }, r.setElementaryStreamInfo = function(t, e, r, i, n, a) {
                        void 0 === a && (a = !1);
                        var s = this.elementaryStreams,
                            o = s[t];
                        o ? (o.startPTS = Math.min(o.startPTS, e), o.endPTS = Math.max(o.endPTS, r), o.startDTS = Math.min(o.startDTS, i), o.endDTS = Math.max(o.endDTS, n)) : s[t] = {
                            startPTS: e,
                            endPTS: r,
                            startDTS: i,
                            endDTS: n,
                            partial: a
                        }
                    }, r.clearElementaryStreamInfo = function() {
                        var t = this.elementaryStreams;
                        t[O] = null, t[N] = null, t[U] = null
                    }, s(e, [{
                        key: "decryptdata",
                        get: function() {
                            if (!this.levelkeys && !this._decryptdata) return null;
                            if (!this._decryptdata && this.levelkeys && !this.levelkeys.NONE) {
                                var t = this.levelkeys.identity;
                                if (t) this._decryptdata = t.getDecryptData(this.sn);
                                else {
                                    var e = Object.keys(this.levelkeys);
                                    if (1 === e.length) return this._decryptdata = this.levelkeys[e[0]].getDecryptData(this.sn)
                                }
                            }
                            return this._decryptdata
                        }
                    }, {
                        key: "end",
                        get: function() {
                            return this.start + this.duration
                        }
                    }, {
                        key: "endProgramDateTime",
                        get: function() {
                            if (null === this.programDateTime) return null;
                            if (!y(this.programDateTime)) return null;
                            var t = y(this.duration) ? this.duration : 0;
                            return this.programDateTime + 1e3 * t
                        }
                    }, {
                        key: "encrypted",
                        get: function() {
                            var t;
                            if (null != (t = this._decryptdata) && t.encrypted) return !0;
                            if (this.levelkeys) {
                                var e = Object.keys(this.levelkeys),
                                    r = e.length;
                                if (r > 1 || 1 === r && this.levelkeys[e[0]].encrypted) return !0
                            }
                            return !1
                        }
                    }]), e
                }(B),
                K = function(t) {
                    function e(e, r, i, n, a) {
                        var s;
                        (s = t.call(this, i) || this).fragOffset = 0, s.duration = 0, s.gap = !1, s.independent = !1, s.relurl = void 0, s.fragment = void 0, s.index = void 0, s.stats = new M, s.duration = e.decimalFloatingPoint("DURATION"), s.gap = e.bool("GAP"), s.independent = e.bool("INDEPENDENT"), s.relurl = e.enumeratedString("URI"), s.fragment = r, s.index = n;
                        var o = e.enumeratedString("BYTERANGE");
                        return o && s.setByteRange(o, a), a && (s.fragOffset = a.fragOffset + a.duration), s
                    }
                    return l(e, t), s(e, [{
                        key: "start",
                        get: function() {
                            return this.fragment.start + this.fragOffset
                        }
                    }, {
                        key: "end",
                        get: function() {
                            return this.start + this.duration
                        }
                    }, {
                        key: "loaded",
                        get: function() {
                            var t = this.elementaryStreams;
                            return !!(t.audio || t.video || t.audiovideo)
                        }
                    }]), e
                }(B),
                H = function() {
                    function t(t) {
                        this.PTSKnown = !1, this.alignedSliding = !1, this.averagetargetduration = void 0, this.endCC = 0, this.endSN = 0, this.fragments = void 0, this.fragmentHint = void 0, this.partList = null, this.dateRanges = void 0, this.live = !0, this.ageHeader = 0, this.advancedDateTime = void 0, this.updated = !0, this.advanced = !0, this.availabilityDelay = void 0, this.misses = 0, this.startCC = 0, this.startSN = 0, this.startTimeOffset = null, this.targetduration = 0, this.totalduration = 0, this.type = null, this.url = void 0, this.m3u8 = "", this.version = null, this.canBlockReload = !1, this.canSkipUntil = 0, this.canSkipDateRanges = !1, this.skippedSegments = 0, this.recentlyRemovedDateranges = void 0, this.partHoldBack = 0, this.holdBack = 0, this.partTarget = 0, this.preloadHint = void 0, this.renditionReports = void 0, this.tuneInGoal = 0, this.deltaUpdateFailed = void 0, this.driftStartTime = 0, this.driftEndTime = 0, this.driftStart = 0, this.driftEnd = 0, this.encryptedFragments = void 0, this.playlistParsingError = null, this.variableList = null, this.hasVariableRefs = !1, this.fragments = [], this.encryptedFragments = [], this.dateRanges = {}, this.url = t
                    }
                    return t.prototype.reloaded = function(t) {
                        if (!t) return this.advanced = !0, void(this.updated = !0);
                        var e = this.lastPartSn - t.lastPartSn,
                            r = this.lastPartIndex - t.lastPartIndex;
                        this.updated = this.endSN !== t.endSN || !!r || !!e || !this.live, this.advanced = this.endSN > t.endSN || e > 0 || 0 === e && r > 0, this.updated || this.advanced ? this.misses = Math.floor(.6 * t.misses) : this.misses = t.misses + 1, this.availabilityDelay = t.availabilityDelay
                    }, s(t, [{
                        key: "hasProgramDateTime",
                        get: function() {
                            return !!this.fragments.length && y(this.fragments[this.fragments.length - 1].programDateTime)
                        }
                    }, {
                        key: "levelTargetDuration",
                        get: function() {
                            return this.averagetargetduration || this.targetduration || 10
                        }
                    }, {
                        key: "drift",
                        get: function() {
                            var t = this.driftEndTime - this.driftStartTime;
                            return t > 0 ? 1e3 * (this.driftEnd - this.driftStart) / t : 1
                        }
                    }, {
                        key: "edge",
                        get: function() {
                            return this.partEnd || this.fragmentEnd
                        }
                    }, {
                        key: "partEnd",
                        get: function() {
                            var t;
                            return null != (t = this.partList) && t.length ? this.partList[this.partList.length - 1].end : this.fragmentEnd
                        }
                    }, {
                        key: "fragmentEnd",
                        get: function() {
                            var t;
                            return null != (t = this.fragments) && t.length ? this.fragments[this.fragments.length - 1].end : 0
                        }
                    }, {
                        key: "age",
                        get: function() {
                            return this.advancedDateTime ? Math.max(Date.now() - this.advancedDateTime, 0) / 1e3 : 0
                        }
                    }, {
                        key: "lastPartIndex",
                        get: function() {
                            var t;
                            return null != (t = this.partList) && t.length ? this.partList[this.partList.length - 1].index : -1
                        }
                    }, {
                        key: "lastPartSn",
                        get: function() {
                            var t;
                            return null != (t = this.partList) && t.length ? this.partList[this.partList.length - 1].fragment.sn : this.endSN
                        }
                    }]), t
                }();

            function V(t) {
                return Uint8Array.from(atob(t), (function(t) {
                    return t.charCodeAt(0)
                }))
            }

            function Y(t) {
                var e, r, i = t.split(":"),
                    n = null;
                if ("data" === i[0] && 2 === i.length) {
                    var a =

View all
