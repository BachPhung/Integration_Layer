"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOrder = void 0;
const formatOrder = (req1, req2, req3) => {
    let { extOderId, fromLocation } = req1, rest1 = __rest(req1, ["extOderId", "fromLocation"]);
    let { toLocation } = req2, rest2 = __rest(req2, ["toLocation"]);
    let { cargoType, cargoAmount } = req3, rest3 = __rest(req3, ["cargoType", "cargoAmount"]);
    return { extOderId, fromLocation, toLocation, cargoType, cargoAmount };
};
exports.formatOrder = formatOrder;
//# sourceMappingURL=formatRequest.js.map