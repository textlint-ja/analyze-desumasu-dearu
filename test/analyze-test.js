import assert from "power-assert";
import {analyzeDesumasu, analyzeDearu} from "../src/analyze.js";
describe("analyze-test", function () {
    describe("analyzeDesumasu", function () {
        it("should found ですが", function () {
            return analyzeDesumasu("昨日は雨だったのですが、今日は晴れて良かったです。").then(results => {
                assert(results.length === 2);
                const [result1, result2] = results;
                assert(result1.value === "ですが、");
                assert(result2.value === "です。");
            });
        });
        it("should return {index, match, value}", function () {
            let text = "昨日は雨だったのですが、今日は晴れて良かったです。";
            return analyzeDesumasu(text).then(results => {
                assert(results.length === 2);
                const [match0, match1] =results;
                assert.equal(match0.value, "ですが、");
                assert.equal(match0.index, 8);
                assert.equal(text.substring(match0.index, match0.index + match0.value.length), "ですが、");
                assert.equal(match1.value, "です。");
                assert.equal(match1.index, 22);
                assert.equal(text.substring(match1.index, match1.index + match1.value.length), "です。");
            });
        });
        it("multiple line should return です {index, value, surface, token}", function () {
            let text = `1行目
これは2行目です。`;
            return analyzeDesumasu(text).then(results => {
                assert(results.length === 1);
                let match0 = results[0];
                assert.equal(match0.value, "です。");
                assert.equal(match0.index, 10);
                assert.equal(match0.surface, "です");
                assert(typeof match0.token === "object");
            });
        });
    });
    describe("analyzeDearu", function () {
        it("should found である without 。", function () {
            return analyzeDearu("今日はいい天気である").then(results => {
                assert(results.length === 1);
                const [result] = results;
                assert.equal(result.value, "である");
            });
        });
        it("should return dearu count", function () {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。").then(results => {
                assert(results.length === 3);
            });
        });
        it("should found である + 。", function () {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。末尾").then(results => {
                assert(results.length === 3);
            });
        });
        it("should found である + ASCII", function () {
            return analyzeDearu(`2D物理演算ライブラリであるBox2DWeb`).then(results => {
                assert(results.length === 1);
            });
        });
        it("should return dearu {index, value, surface}", function () {
            let text = "昨日はいい天気であったのだが、今日は悪天候である。";
            return analyzeDearu(text).then(results => {
                assert(results.length === 3);
                let [match0, match1, match2] = results;
                assert.equal(match0.value, "であった");
                assert.equal(match0.surface, "で");
                assert.equal(match0.index, 7);
                assert(typeof match0.token === "object");
                assert.equal(text.substring(match0.index, match0.index + match0.value.length), "であった");
                //
                assert.equal(match1.value, "だが、");
                assert.equal(match1.surface, "だ");
                assert.equal(match1.index, 12);
                assert.equal(text.substring(match1.index, match1.index + match1.value.length), "だが、");
                //
                assert.equal(match2.value, "である。");
                assert.equal(match2.surface, "で");
                assert.equal(match2.index, 21);
                assert.equal(text.substring(match2.index, match2.index + match2.value.length), "である。");
            });
        });
        it("should not match dearu when using `してきた`", function () {
            let text = "ここまで説明してきた動作の中では、以下の2つがブラウザの仕事になります。";
            return analyzeDearu(text).then(results => {
                assert(results.length === 0);
            });
        });
    });
});
