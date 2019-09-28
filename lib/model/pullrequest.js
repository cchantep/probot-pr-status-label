"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("io-ts"));
exports.UserInfo = t.exact(t.type({
    login: t.string,
}));
var BranchInfo = t.exact(t.type({
    label: t.string,
    ref: t.string,
    sha: t.string,
}));
exports.Label = t.exact(t.type({
    name: t.string,
}));
exports.PullRequestInfo = t.exact(t.type({
    number: t.number,
    html_url: t.string,
    state: t.string,
    title: t.string,
    user: exports.UserInfo,
    base: BranchInfo,
    head: BranchInfo,
    labels: t.array(exports.Label),
}));
// --- Events
var RepoInfo = t.exact(t.type({
    id: t.number,
    name: t.string,
    owner: exports.UserInfo,
}));
var prEventBase = {
    pull_request: exports.PullRequestInfo,
    repository: RepoInfo,
    sender: exports.UserInfo
};
exports.PullRequestEvent = t.exact(t.type(prEventBase));
exports.PullRequestLabelEvent = t.exact(t.type(__assign(__assign({}, prEventBase), { label: exports.Label })));
//# sourceMappingURL=pullrequest.js.map