"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var Option_1 = require("fp-ts/lib/Option");
var util = __importStar(require("./util"));
var pullrequest_1 = require("./model/pullrequest");
var config_1 = require("./config");
// ---
function toggleState(bot, statusContext, sha, expectedState, msg) {
    return getCommitState(bot, sha, statusContext).then(function (state) {
        var alreadySet = state.filter(function (s) { return s == expectedState; });
        if (!alreadySet) {
            return Promise.resolve();
        }
        else {
            return bot.github.repos
                .createStatus(bot.repo({
                sha: sha,
                context: statusContext,
                state: expectedState,
                description: msg,
            }))
                .then(function (_r) { return Promise.resolve(); });
        }
    });
}
function getCommitState(bot, ref, ctx) {
    return bot.github.repos.listStatusesForRef(bot.repo({ ref: ref })).then(function (resp) {
        var found = resp.data.find(function (s) { return s.context == ctx; });
        if (!found) {
            return Promise.resolve(Option_1.none);
        }
        else {
            return Promise.resolve(Option_1.some(found.state));
        }
    });
}
module.exports = function (app) {
    app.on('pull_request.labeled', function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var event, pr, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util.fromEither(pullrequest_1.PullRequestLabelEvent.decode(context.payload))];
                case 1:
                    event = _a.sent();
                    context.log.debug('Event:', event);
                    pr = event.pull_request;
                    if (pr.state != 'open') {
                        return [2 /*return*/, context.log.debug("Skip label event on closed pull request #" + pr.number)];
                    }
                    return [4 /*yield*/, config_1.getConfig(context, pr.base.ref)];
                case 2:
                    config = _a.sent();
                    context.log('Config:', config);
                    // TODO: Check there is no other label matching expr of other state
                    // otherwise add warning as comment
                    return [4 /*yield*/, config_1.matchStatus(event.label.name, config).fold(Promise.resolve(context.log("Label '" + event.label.name + "' doesn't match status expressions", config)), function (ls) {
                            context.log("Toggle " + ls.context + " to " + ls.commitState + " (" + ls.internalState + ") on pull request #" + pr.number + " @ " + pr.head.sha);
                            var description = ls.internalState != 'required'
                                ? event.sender.login
                                : 'Waiting for someone to check it ...'; /* TODO: get label description + config */
                            return toggleState(context, ls.context, pr.head.sha, ls.commitState, description);
                        })];
                case 3:
                    // TODO: Check there is no other label matching expr of other state
                    // otherwise add warning as comment
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    app.on('pull_request.synchronize', function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var event, pr, config, statuses, statusLabels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util.fromEither(pullrequest_1.PullRequestEvent.decode(context.payload))];
                case 1:
                    event = _a.sent();
                    context.log.debug('Event:', event);
                    pr = event.pull_request;
                    return [4 /*yield*/, config_1.getConfig(context, pr.base.ref)];
                case 2:
                    config = _a.sent();
                    return [4 /*yield*/, context.github.repos
                            .listStatusesForRef(context.repo({ ref: pr.head.ref }))
                            .then(function (resp) { return resp.data.map(function (st) { return st; }); })];
                case 3:
                    statuses = _a.sent();
                    statusLabels = pr.labels
                        .map(function (label) {
                        return config_1.matchStatus(label.name, config).fold(new Array(), function (m) {
                            var found = statuses.find(function (st) { return m.commitState == st.state && m.context == st.context; });
                            return !!found ? [found] : [];
                        });
                    })
                        .reduce(function (acc, v) { return acc.concat(v); }, []);
                    statusLabels.forEach(function (st) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    context.log("Reset " + st.context + " to " + st.state + " on pull request #" + pr.number + " @ " + pr.head.sha);
                                    return [4 /*yield*/, toggleState(context, st.context, pr.head.sha, st.state, st.description)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
};
//# sourceMappingURL=index.js.map