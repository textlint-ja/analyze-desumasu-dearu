import assert from "power-assert";
import { analyzeDesumasu, analyzeDearu } from "../src/analyze.js";
describe("analyze-test", function() {
    describe("analyzeDesumasu", function() {
        it("should found ですが", function() {
            return analyzeDesumasu("昨日は雨だったのですが、今日は晴れて良かったです。").then(results => {
                assert(results.length === 2);
                const [result1, result2] = results;
                assert(result1.value === "ですが、");
                assert(result2.value === "です。");
            });
        });
        it("should found ますが", function() {
            return analyzeDesumasu("明日は雨になりますが、今日は晴れて良かったです。").then(results => {
                assert(results.length === 2);
                const [result1, result2] = results;
                assert(result1.value === "ますが、");
                assert(result2.value === "です。");
            });
        });
        it("should return {index, match, value}", function() {
            let text = "昨日は雨だったのですが、今日は晴れて良かったです。";
            return analyzeDesumasu(text).then(results => {
                assert(results.length === 2);
                const [match0, match1] = results;
                assert.equal(match0.value, "ですが、");
                assert.equal(match0.index, 8);
                assert.equal(text.substring(match0.index, match0.index + match0.value.length), "ですが、");
                assert.equal(match1.value, "です。");
                assert.equal(match1.index, 22);
                assert.equal(text.substring(match1.index, match1.index + match1.value.length), "です。");
            });
        });
        it("should return {index, match, value}", function() {
            let text = "明日は雨になりますが、今日は晴れて良かったです。";
            return analyzeDesumasu(text).then(results => {
                assert(results.length === 2);
                const [match0, match1] = results;
                assert.equal(match0.value, "ますが、");
                assert.equal(match0.index, 7);
                assert.equal(text.substring(match0.index, match0.index + match0.value.length), "ますが、");
                assert.equal(match1.value, "です。");
                assert.equal(match1.index, 21);
                assert.equal(text.substring(match1.index, match1.index + match1.value.length), "です。");
            });
        });
        it("multiple line should return です {index, value, surface, token}", function() {
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
        it("multiple line should return ます {index, value, surface, token}", function() {
            let text = `1行目
これを2行目とします。`;
            return analyzeDesumasu(text).then(results => {
                assert(results.length === 1);
                let match0 = results[0];
                assert.equal(match0.value, "ます。");
                assert.equal(match0.index, 12);
                assert.equal(match0.surface, "ます");
                assert(typeof match0.token === "object");
            });
        });

        context("when use ignoreConjunction options", function() {
            it("should 接続的な です を無視する", function() {
                return analyzeDesumasu("今日はいい天気ですが、明日はどうであるか。", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 0);
                });
            });
            it("should 接続的な ます を無視する", function() {
                return analyzeDesumasu("明日はいい天気になりますが、明後日はどうであるか。", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 0);
                });
            });
            it("should 文末の です は見つける", function() {
                return analyzeDesumasu("今日はいい天気です。", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should 文末の ます は見つける", function() {
                return analyzeDesumasu("今日はいい天気になります。", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should 文末の です には。がなくても良い", function() {
                return analyzeDesumasu("今日はいい天気です", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should 文末の ます には。がなくても良い", function() {
                return analyzeDesumasu("今日はいい天気になります", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should not contain です in examples", function() {
                const examples = ["本日は晴天ですが、明日が分からない。", "本日は晴天ですかと尋ねた。"];
                var examplePromises = examples.map(example => {
                    return analyzeDesumasu(example, {
                        ignoreConjunction: true
                    });
                });
                return Promise.all(examplePromises).then(allResults => {
                    allResults.forEach(results => {
                        assert(results.length === 0);
                    });
                });
            });
            it("should not contain ます in examples", function() {
                const examples = ["本日は晴天になりますが、明日が分からない。", "本日は晴天となりますかと尋ねた。"];
                var examplePromises = examples.map(example => {
                    return analyzeDesumasu(example, {
                        ignoreConjunction: true
                    });
                });
                return Promise.all(examplePromises).then(allResults => {
                    allResults.forEach(results => {
                        assert(results.length === 0);
                    });
                });
            });
        });
    });
    describe("analyzeDearu", function() {
        context("when use ignoreConjunction options", function() {
            it("should 接続的な である を無視する", function() {
                return analyzeDearu("今日はいい天気であるが、明日はどうなるかは分からない。", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 0);
                });
            });
            it("should 文末の である はチェックする", function() {
                return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。末尾", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should 文末の である には。がなくても良い", function() {
                return analyzeDearu("今日は悪天候である", {
                    ignoreConjunction: true
                }).then(results => {
                    assert(results.length === 1);
                });
            });
            it("should not contain である in examples", function() {
                const examples = [
                    "BufferはStringと相互変換が可能であるため、多くのgulpプラグインと呼ばれるものは、`gulpPrefixer`と`prefixBuffer`にあたる部分だけを実装しています。",
                    "単純なprototype拡張であると言えるので、利点はJavaScriptのprototypeと同様です。",
                    "`jQuery.fn`の実装を見てみると、実態は`jQuery.prototype`であるため実際にprototype拡張していることがわかります。",
                    "単純なprototype拡張であると言えるので、利点はJavaScriptのprototypeと同様です。",
                    "まだNode.jsで使われているCommonJSやES6 Modulesといったものがなかった時代に作られた仕組みであるため、",
                    "小さものを組み合わせて使えるようなエコシステムの土台となるものを書こうとした際に、プラグインアーキテクチャの仕組みが重要となると言えます。"
                ];
                var examplePromises = examples.map(example => {
                    return analyzeDearu(example, {
                        ignoreConjunction: true
                    });
                });
                return Promise.all(examplePromises).then(allResults => {
                    allResults.forEach(results => {
                        assert(results.length === 0);
                    });
                });
            });
        });
        context("when no match", function() {
            it("このパターンだけ**では**難しい", function() {
                return analyzeDearu("このパターンだけでは難しい").then(results => {
                    assert(results.length === 0);
                });
            });
            it("ではなく", function() {
                return analyzeDearu("動的にメソッドを追加するだけではなく、既存の実装を上書きする。").then(results => {
                    assert(results.length === 0);
                });
            });
            it("簡単**な***ものを作る", function() {
                // "な" は マッチしない
                // "conjugated_type": "特殊・ダ",
                // "conjugated_form": "体言接続",
                return analyzeDearu("これを使い簡単なものを作る").then(results => {
                    assert(results.length === 0);
                });
            });
        });
        it("should found である 後ろに明示的なストッパーがない場合", function() {
            return analyzeDearu("今日はいい天気である場合に明日はどうなるか").then(results => {
                assert(results.length === 1);
                const [result] = results;
                // 名詞までで区切る
                assert.equal(result.value, "である場合");
            });
        });
        it("should found である without 。", function() {
            return analyzeDearu("今日はいい天気である").then(results => {
                assert(results.length === 1);
                const [result] = results;
                assert.equal(result.value, "である");
            });
        });
        it("should return dearu count", function() {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。").then(results => {
                assert(results.length === 2);
            });
        });
        it("should found である + 。", function() {
            return analyzeDearu("昨日はいい天気であったのだが、今日は悪天候である。末尾").then(results => {
                assert(results.length === 2);
            });
        });
        it("should found である + ASCII", function() {
            return analyzeDearu(`2D物理演算ライブラリであるBox2DWeb`).then(results => {
                assert(results.length === 1);
            });
        });
        it("should return dearu {index, value, surface}", function() {
            let text = "昨日はいい天気であったのだが、今日は悪天候である。";
            return analyzeDearu(text).then(results => {
                assert(results.length === 2);
                let [match1, match2] = results;
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
        it("should not match dearu when using `してきた`", function() {
            let text = "ここまで説明してきた動作の中では、以下の2つがブラウザの仕事になります。";
            return analyzeDearu(text).then(results => {
                assert(results.length === 0);
            });
        });
    });
});
