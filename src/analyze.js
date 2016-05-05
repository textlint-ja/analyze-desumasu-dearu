// LICENSE : MIT
"use strict";
const getTokenizer = require("kuromojin").getTokenizer;
const mapToAnalyzedResult = tokens => {
    return token => {
        const PUNCTUATION = /、|。/;
        const CONJUGATED_TYPE = /特殊/;
        const indexOfTargetToken = tokens.indexOf(token);
        // value is collection of these tokens: [ {target}, token, token, nextTarget|PunctuationToken ]
        const nextPunctureToken = tokens.slice(indexOfTargetToken + 1).find(token => {
            if (PUNCTUATION.test(token["surface_form"])) {
                return true;
            }
            if (CONJUGATED_TYPE.test(token["conjugated_type"])) {
                return true;
            }
            return false;
        });
        const postTokens = tokens.slice(indexOfTargetToken, tokens.indexOf(nextPunctureToken) + 1);
        const value = postTokens.map(token => token["surface_form"]).join("");
        return {
            value: value,
            surface: token["surface_form"],
            index: token["word_position"] - 1
        }
    }
};

/**
 *
 * @param text
 * @param reg
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */
function countMatchContent(text, reg) {
    let matches = [];
    let tmpMatch;
    while ((tmpMatch = reg.exec(text)) != null) {
        matches.push({
            value: tmpMatch[0],
            lineNumber: 1,
            columnIndex: reg.lastIndex - tmpMatch[0].length
        });
    }
    return matches;
}
/**
 *
 * @param text
 * @param reg
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */
function countMatchContentEnd(text, reg) {
    let lines = text.split(/\r\n|\r|\n|\u2028|\u2029/g);
    let matches = [];
    lines.forEach((line, index) => {
        var match = line.match(reg);
        if (!match) {
            return;
        }
        // adjust line number
        matches.push({
            value: match[0],
            lineNumber: 1 + index,
            columnIndex: match.index
        });
    });
    return matches;
}
/**
 * `text` の敬体(ですます調)について解析します
 * @param {string} text
 * @param {object} options
 * @param {boolean} options.analyzeConjunction 接続詞を解析するかどうか default: true
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */

export function analyzeDesumasu(text, options = {analyzeConjunction: true}) {
    const analyzeConjunction = options.analyzeConjunction || true;
    return getTokenizer().then(tokenizer => {
        const tokens = tokenizer.tokenizeForSentence(text);
        const filterByType = tokens.filter(token => {
            // 接続詞を解析しない場合は、連用形かどうかを確認して無視する
            if (!analyzeConjunction) {
                return token["conjugated_type"] === "特殊・デス" && token["conjugated_form"] !== "連用形";
            }
            return token["conjugated_type"] === "特殊・デス";
        });
        return filterByType.map(mapToAnalyzedResult(tokens));
    });
}
/**
 * `text` の常体(である調)について解析します
 * @param {string} text
 * @param {object} options
 * @param {boolean} options.analyzeConjunction 接続詞を解析するかどうか default: true
 * @returns {{value:string, index: number}}[]
 */
export function analyzeDearu(text, options = {analyzeConjunction: true}) {
    const analyzeConjunction = options.analyzeConjunction || true;
    return getTokenizer().then(tokenizer => {
        const tokens = tokenizer.tokenizeForSentence(text);
        const filterByType = tokens.filter(token => {
            // 接続詞を解析しない場合は、連用形かどうかを確認して無視する
            if (!analyzeConjunction) {
                return token["conjugated_type"] === "特殊・ダ" && token["conjugated_form"] !== "連用形";
            }
            return token["conjugated_type"] === "特殊・ダ";
        });
        return filterByType.map(mapToAnalyzedResult(tokens));
    });
}
