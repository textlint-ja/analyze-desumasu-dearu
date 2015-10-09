import assert from "power-assert";
import {analyzeDesumasu, analyzeDearu} from "../src/analyze.js";
describe("analyze-test", function () {
    describe("analyzeDesumasu", function () {
        it("should return desumasu count", function () {
            let ret = analyzeDesumasu("昨日は雨だったのですが、持ち直しました。");
            assert(ret.count === 2);
        });
        it("should return desumasu {index, match}", function () {
            let text = "昨日は雨だったのですが、持ち直しました。";
            let ret = analyzeDesumasu(text);
            assert(ret.matches.length === 2);
            let match0 = ret.matches[0];
            assert.equal(match0.value, "ですが");
            assert.equal(match0.index, 8);
            assert.equal(text.substring(match0.index, match0.index + match0.value.length), "ですが");
            let match1 = ret.matches[1];
            assert.equal(match1.value, "ました。");
            assert.equal(match1.index, 16);
            assert.equal(text.substring(match1.index, match1.index + match1.value.length), "ました。");
        });
    });
    describe("analyzeDearu", function () {
        it("should return dearu count", function () {
            let ret = analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。");
            assert(ret.count === 2);
        });
        it("should return dearu {index, match}", function () {
            let text = "昨日はいい天気であったのだが、今日は悪天候である。";
            let ret = analyzeDearu(text);
            assert(ret.matches.length === 2);
            let match0 = ret.matches[0];
            assert.equal(match0.value, "のだが");
            assert.equal(match0.index, 11);
            assert.equal(text.substring(match0.index, match0.index + match0.value.length), "のだが");
            let match1 = ret.matches[1];
            assert.equal(match1.value, "である。");
            assert.equal(match1.index, 21);
            assert.equal(text.substring(match1.index, match1.index + match1.value.length), "である。");
        });
    });
});