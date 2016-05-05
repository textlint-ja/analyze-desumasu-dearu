// LICENSE : MIT
"use strict";
const isDearu = require("analyze-desumasu-dearu").isDearu;
const isDesumasu = require("analyze-desumasu-dearu").isDesumasu;
const analyze = require("analyze-desumasu-dearu").analyze;
const analyzeDearu = require("analyze-desumasu-dearu").analyzeDearu;
const analyzeDesumasu = require("analyze-desumasu-dearu").analyzeDesumasu;
const text = "昨日はいい天気であったのだが、今日は悪天候です。";
// である の情報
analyzeDearu(text).then(results => {
    console.log("==analyzeDearu==");
    console.log(results);
});
// ですますの情報
analyzeDesumasu(text).then(results => {
    console.log("==analyzeDesumasu==");
    console.log(results);
});
console.log("=== analyze()の場合");
analyze(text).then(results => {
    console.log("==である==");
    console.log(results.filter(isDearu));
    console.log("==ですます==");
    console.log(results.filter(isDesumasu));
});