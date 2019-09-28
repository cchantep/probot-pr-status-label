"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromEither(e) {
    return e.fold(function (cause) { return Promise.reject(new Error(JSON.stringify(cause))); }, function (res) { return Promise.resolve(res); });
}
exports.fromEither = fromEither;
//# sourceMappingURL=util.js.map