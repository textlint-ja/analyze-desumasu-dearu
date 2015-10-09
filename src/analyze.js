// LICENSE : MIT
"use strict";
// This RegExp are based of https://github.com/recruit-tech/redpen/blob/master/redpen-core/src/main/java/cc/redpen/validator/sentence/JapaneseStyleValidator.java
const DEARU_PATTERN = /のだが|ないかと|してきた|であるから/g;
const DEARU_END_PATTERN = /(?:だ|である|った|ではない｜ないか|しろ|しなさい|いただきたい|いただく|ならない|あろう|られる)(?:[。]?)$/g;

const DESUMASU_PATTERN = /でしたが|でしたので|ですので|ですが/g;
const DESUMASU_END_PATTERN = /(?:です|ます|ました|ません|ですね|でしょうか|ください|ませ)(?:[。]?)$/g;
/**
 *
 * @param text
 * @param reg
 * @returns {{count: number, matches: Array}}
 */
function countMatchContent(text, reg) {
    let count = 0;
    let matches = [];
    let tmpMatch;
    while ((tmpMatch = reg.exec(text)) != null) {
        matches.push({
            value: tmpMatch[0],
            index: reg.lastIndex - tmpMatch[0].length
        });
    }
    count += matches.length;
    return {count, matches};
}
/**
 *
 * @param text
 * @param reg
 * @returns {{count: number, matches: Array}}
 */
function countMatchContentEnd(text, reg) {
    let count = 0;
    let lines = text.split(/\r\n|\r|\n|\u2028|\u2029/g);
    let matches = [];
    lines.forEach(line => {
        let ret = countMatchContent(line, reg);
        matches = matches.concat(ret.matches);
    });
    count += matches.length;
    return {count, matches};
}
/**
 * `text` の敬体(ですます調)について解析します
 * @param {string} text
 * @returns {{matches: {value:string, index:number}, count: number}}
 */
export function analyzeDesumasu(text) {
    let matchDesumasu = countMatchContent(text, DESUMASU_PATTERN);
    let matchDesumasuEnd = countMatchContentEnd(text, DESUMASU_END_PATTERN);
    return {
        matches: matchDesumasu.matches.concat(matchDesumasuEnd.matches),
        count: matchDesumasu.count + matchDesumasuEnd.count
    }
}
/**
 * `text` の常体(である調)について解析します
 * @param {string} text
 * @returns {{matches: {value:string, index:number}, count: number}}
 */
export function analyzeDearu(text) {
    let matchDearu = countMatchContent(text, DEARU_PATTERN);
    let matchDearuEnd = countMatchContentEnd(text, DEARU_END_PATTERN);
    return {
        matches: matchDearu.matches.concat(matchDearuEnd.matches),
        count: matchDearu.count + matchDearuEnd.count
    }
}