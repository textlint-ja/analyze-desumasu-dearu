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
        context("when no match", function () {
            it("このパターンだけ**では**難しい", function () {
                return analyzeDearu("このパターンだけでは難しい").then(results => {
                    assert(results.length === 0);
                });
            });
            it("ではなく", function () {
                return analyzeDearu("動的にメソッドを追加するだけではなく、既存の実装を上書きする。").then(results => {
                    assert(results.length === 0);
                });
            });
            it("簡単**な***ものを作る", function () {
                // "な" は マッチしない
                // "conjugated_type": "特殊・ダ",
                // "conjugated_form": "体言接続",
                return analyzeDearu("これを使い簡単なものを作る").then(results => {
                    assert(results.length === 0);
                });
            });
        });
        it("should found である 後ろに明示的なストッパーがない場合", function () {
            return analyzeDearu("今日はいい天気である場合に明日はどうなるか").then(results => {
                assert(results.length === 1);
                const [result] = results;
                // 名詞までで区切る
                assert.equal(result.value, "である場合");
            });
        });
        it("should found である without 。", function () {
            return analyzeDearu("今日はいい天気である").then(results => {
                assert(results.length === 1);
                const [result] = results;
                assert.equal(result.value, "である");
            });
        });
        it("should return dearu count", function () {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。").then(results => {
                assert(results.length === 2);
            });
        });
        it("should found である + 。", function () {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。末尾").then(results => {
                assert(results.length === 2);
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
                assert(results.length === 2);
                let [match1,  match2] = results;
                assert.equal(match1.value, "であった");
                assert.equal(match1.surface, "で");
                assert.equal(match1.index, 7);
                assert(typeof match1.token === "object");
                assert.equal(text.substring(match1.index, match1.index + match1.value.length), "であった");
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
