"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("io-ts"));
var Option_1 = require("fp-ts/lib/Option");
var util = __importStar(require("./util"));
// ---
var content_1 = require("./model/content");
function getContent(bot, path, ref) {
    return bot.github.repos
        .getContents(bot.repo({ path: path, ref: ref }))
        .then(function (payload) { return util.fromEither(content_1.GetContentResponse.decode(payload)); });
}
// ---
var pr_status_label_json_1 = __importDefault(require("./resources/pr-status-label.json"));
exports.Config = t.exact(t.type({
    requiredStatusRegex: t.string,
    pendingStatusRegex: t.string,
    successStatusRegex: t.string,
    errorStatusRegex: t.string,
}));
exports.DefaultConfig = pr_status_label_json_1.default;
// ---
function matchStatus(input, c) {
    return _matchStatus(input, c.successStatusRegex)
        .map(function (s) {
        var res = {
            context: s,
            commitState: 'success',
            internalState: 'success',
        };
        return res;
    })
        .orElse(function () {
        return _matchStatus(input, c.requiredStatusRegex).map(function (s) {
            return { context: s, commitState: 'pending', internalState: 'required' };
        });
    })
        .orElse(function () {
        return _matchStatus(input, c.pendingStatusRegex).map(function (s) {
            return { context: s, commitState: 'pending', internalState: 'pending' };
        });
    })
        .orElse(function () {
        return _matchStatus(input, c.errorStatusRegex).map(function (s) {
            return { context: s, commitState: 'error', internalState: 'error' };
        });
    });
}
exports.matchStatus = matchStatus;
function _matchStatus(input, re) {
    var m = input.match(re);
    return !m || m.length != 2 ? Option_1.none : Option_1.some(m[1]);
}
exports._matchStatus = _matchStatus;
// ---
function getFromJson(bot, path, ref) {
    return getContent(bot, path, ref).then(function (resp) {
        var buff = Buffer.from(resp.data.content, resp.data.encoding);
        return JSON.parse(buff.toString('ascii'));
    });
}
function getConfig(bot, ref) {
    return getFromJson(bot, '.github/pr-status-label.json', ref)
        .then(function (json) { return util.fromEither(exports.Config.decode(json)); })
        .then(function (decoded) { return decoded; }, function (err) {
        bot.log.debug("Fails to load configuration from branch '" + ref + "'", err);
        return exports.DefaultConfig;
    });
}
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map