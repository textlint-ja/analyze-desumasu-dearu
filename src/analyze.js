// LICENSE : MIT
"use strict";
// This RegExp are based of https://github.com/recruit-tech/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/JapaneseStyleValidator.java
const DEARU_PATTERN = /のだが|ないかと|であるから/g;
const DEARU_END_PATTERN = /(だ|である|った|ではない｜ないか|しろ|しなさい|いただきたい|いただく|ならない|あろう|られる)。/;

const DESUMASU_PATTERN = /でしたが|でしたので|ですので|ですが/g;
const DESUMASU_END_PATTERN = /(です|ます|ました|ません|ですね|でしょうか|ください|ませ)。/;
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
    let {analyzeConjunction} = options;
    if (!analyzeConjunction) {
        return countMatchContentEnd(text, DESUMASU_END_PATTERN);
    }
    let retDesumasu = countMatchContent(text, DESUMASU_PATTERN);
    let retDesumasuEnd = countMatchContentEnd(text, DESUMASU_END_PATTERN);
    return retDesumasu.concat(retDesumasuEnd)
}
/**
 * `text` の常体(である調)について解析します
 * @param {string} text
 * @param {object} options
 * @param {boolean} options.analyzeConjunction 接続詞を解析するかどうか default: true
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */
export function analyzeDearu(text, options = {analyzeConjunction: true}) {
    let {analyzeConjunction} = options;
    if (!analyzeConjunction) {
        return countMatchContentEnd(text, DEARU_END_PATTERN);
    }
    let retDearu = countMatchContent(text, DEARU_PATTERN);
    let retDearuEnd = countMatchContentEnd(text, DEARU_END_PATTERN);
    return retDearu.concat(retDearuEnd)
}
