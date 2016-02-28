import assert from "power-assert";
import {analyzeDesumasu, analyzeDearu} from "../src/analyze.js";
describe("analyze-test", function () {
    describe("analyzeDesumasu", function () {
        it("should return desumasu count", function () {
            let results = analyzeDesumasu("昨日は雨だったのですが、持ち直しました。");
            assert(results.length === 2);
        });
        it("should return desumasu count", function () {
            let results = analyzeDesumasu("昨日は雨だったのですが、持ち直しました。末尾");
            assert(results.length === 2);
        });
        it("should return desumasu {index, match}", function () {
            let text = "昨日は雨だったのですが、持ち直しました。";
            let results = analyzeDesumasu(text);
            assert(results.length === 2);
            let match0 = results[0];
            assert.equal(match0.value, "ですが");
            assert.equal(match0.lineNumber, 1);
            assert.equal(match0.columnIndex, 8);
            assert.equal(text.substring(match0.columnIndex, match0.columnIndex + match0.value.length), "ですが");
            let match1 = results[1];
            assert.equal(match1.value, "ました。");
            assert.equal(match1.lineNumber, 1);
            assert.equal(match1.columnIndex, 16);
            assert.equal(text.substring(match1.columnIndex, match1.columnIndex + match1.value.length), "ました。");
        });
        it("multiple line should return desumasu {index, match}", function () {
            let text = `1行目
2行目これはですます文です。`;
            let results = analyzeDesumasu(text);
            assert(results.length === 1);
            let match0 = results[0];
            assert.equal(match0.value, "です。");
            assert.equal(match0.lineNumber, 2);
            assert.equal(match0.columnIndex, 11);
        });
    });
    describe("analyzeDearu", function () {
        it("should return dearu count", function () {
            let results = analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。");
            assert(results.length === 2);
        });
        it("should return dearu count", function () {
            let results = analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。末尾");
            assert(results.length === 2);
        });
        it("should return dearu count", function () {
            let results = analyzeDearu(`2D物理演算ライブラリであるBox2DWeb`);
            assert(results.length === 0);
        });
        it("should return dearu {index, match}", function () {
            let text = "昨日はいい天気であったのだが、今日は悪天候である。";
            let results = analyzeDearu(text);
            assert(results.length === 2);
            let match0 = results[0];
            assert.equal(match0.value, "のだが");
            assert.equal(match0.lineNumber, 1);
            assert.equal(match0.columnIndex, 11);
            assert.equal(text.substring(match0.columnIndex, match0.columnIndex + match0.value.length), "のだが");
            let match1 = results[1];
            assert.equal(match1.value, "である。");
            assert.equal(match1.lineNumber, 1);
            assert.equal(match1.columnIndex, 21);
            assert.equal(text.substring(match1.columnIndex, match1.columnIndex + match1.value.length), "である。");
        });
        it("should not match dearu when using `してきた`", function () {
            let text = "ここまで説明してきた動作の中では、以下の2つがブラウザの仕事になります。";
            let results = analyzeDearu(text);
            assert(results.length === 0);
        });
    });
});
