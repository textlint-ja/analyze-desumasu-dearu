// LICENSE : MIT
"use strict";
const ObjectAssign = require("object.assign");
const find = require('array-find');
const getTokenizer = require("kuromojin").getTokenizer;
/**
 * token object
 * @typedef {{word_id: number, word_type: string, word_position: number, surface_form: string, pos: string, pos_detail_1: string, pos_detail_2: string, pos_detail_3: string, conjugated_type: string, conjugated_form: string, basic_form: string, reading: string, pronunciation: string}} AnalyzedToken
 * @see https://github.com/takuyaa/kuromoji.js#api
 */

/**
 * Analyzed result Object
 * @typedef {{type:string, value:string, surface: string, token:AnalyzedToken, index: number}} AnalyzedResultObject
 */

// Cache tokens
const _tokensCacheMap = {};
/**
 * Type enum
 * @type {{desu: string, dearu: string}}
 * @example
 *  analyze(text).filter(results => results.type === Types.desu);
 */
export const Types = {
    desu: "特殊・デス",
    dearu: "特殊・ダ"
};
/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export function isDesumasu(resultObject) {
    return resultObject.type === Types.desu;
}
/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export function isDearu(resultObject) {
    return resultObject.type === Types.dearu;
}
/**
 *
 * @param {AnalyzedToken[]}tokens
 * @returns {function(token: AnalyzedToken)}
 */
const mapToAnalyzedResult = tokens => {
    /**
     * @param {AnalyzedToken} token
     * @return {AnalyzedResultObject}
     */
    return function mapTokenToAnalyzedResult(token) {
        const PUNCTUATION = /、|。/;
        const CONJUGATED_TYPE = /特殊/;
        const indexOfTargetToken = tokens.indexOf(token);
        // value is collection of these tokens: [ {target}, token, token, nextTarget|PunctuationToken ]
        const postTokens = tokens.slice(indexOfTargetToken + 1);
        const nextPunctureToken = find(postTokens, token => {
            if (PUNCTUATION.test(token["surface_form"])) {
                return true;
            }
            if (CONJUGATED_TYPE.test(token["conjugated_type"])) {
                return true;
            }
            // 明示的なtokenがない場合は、名詞がきたらそこで切ってしまう
            if (token["pos"] === "名詞") {
                return true;
            }
            return false;
        });
        // if has not next token, use between token <--> last.
        const nextTokenIndex = nextPunctureToken ? tokens.indexOf(nextPunctureToken) : tokens.length;
        const valueTokens = tokens.slice(indexOfTargetToken, nextTokenIndex + 1);
        const value = valueTokens.map(token => token["surface_form"]).join("");
        return {
            type: token["conjugated_type"],
            value: value,
            surface: token["surface_form"],
            // index start with 0
            index: token["word_position"] - 1,
            /**
             * @type {AnalyzedToken}
             */
            token: ObjectAssign({}, token)
        };
    };
};
/**
 * `text`から敬体(ですます調)と常体(である調)を取り出した結果を返します。
 * @param text
 * @returns {Promise.<AnalyzedResultObject[]>}
 */
export function analyze(text) {
    return getTokenizer().then(tokenizer => {
        const tokens = _tokensCacheMap[text] ? _tokensCacheMap[text] : tokenizer.tokenizeForSentence(text);
        _tokensCacheMap[text] = tokens;
        const filterByType = tokens.filter(token => {
            const conjugatedType = token["conjugated_type"];
            return conjugatedType === Types.dearu || conjugatedType === Types.desu;
        });
        return filterByType.map(mapToAnalyzedResult(tokens));
    });
}
/**
 * `text` の敬体(ですます調)について解析し、敬体(ですます調)のトークン情報を返します。
 * @param {string} text
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export function analyzeDesumasu(text) {
    return analyze(text).then(results => results.filter(isDesumasu));
}
/**
 * `text` の常体(である調)について解析し、常体(である調)のトークン情報を返します。
 * @param {string} text
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export function analyzeDearu(text) {
    return analyze(text).then(results => results.filter(isDearu))
}