// LICENSE : MIT
"use strict";
// This RegExp are based of https://github.com/recruit-tech/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/JapaneseStyleValidator.java
const DEARU_PATTERN = /のだが|ないかと|してきた|であるから/g;
const DEARU_END_PATTERN = /(?:だ|である|った|ではない｜ないか|しろ|しなさい|いただきたい|いただく|ならない|あろう|られる)。$/g;

const DESUMASU_PATTERN = /でしたが|でしたので|ですので|ですが/g;
const DESUMASU_END_PATTERN = /(?:です|ます|ました|ません|ですね|でしょうか|ください|ませ)。$/g;
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
        let ret = countMatchContent(line, reg);
        // adjust line number
        ret.forEach(match => match.lineNumber += index);
        matches = matches.concat(ret);
    });
    return matches;
}
/**
 * `text` の敬体(ですます調)について解析します
 * @param {string} text
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */

export function analyzeDesumasu(text) {
    let retDesumasu = countMatchContent(text, DESUMASU_PATTERN);
    let retDesumasuEnd = countMatchContentEnd(text, DESUMASU_END_PATTERN);
    return retDesumasu.concat(retDesumasuEnd)
}
/**
 * `text` の常体(である調)について解析します
 * @param {string} text
 * @returns {{value:string, columnIndex: number, lineNumber:number}}[]
 */
export function analyzeDearu(text) {
    let retDearu = countMatchContent(text, DEARU_PATTERN);
    let retDearuEnd = countMatchContentEnd(text, DEARU_END_PATTERN);
    return retDearu.concat(retDearuEnd)
}