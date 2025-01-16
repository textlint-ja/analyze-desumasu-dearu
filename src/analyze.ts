// LICENSE : MIT
import type { KuromojiToken } from "kuromojin";
import { tokenize } from "kuromojin";
/**
 * Analyzed result Object
 */
export type AnalyzedResultObject = {
    type: string;
    value: string;
    surface: string;
    token: KuromojiToken;
    index: number;
};
export type AnalyzeOptions = {
    /**
     * 接続詞を分析対象から除外するかどうか
     */
    ignoreConjunction: boolean;
};
/**
 * デフォルトのオプション値
 * @type {{ignoreConjunction: boolean}}
 */
const defaultOptions = {
    // 接続的な "である" を無視する
    // e.g.) 今日はいい天気であるが明日はどうなるかは分からない。
    ignoreConjunction: false
};
/**
 * Type enum
 * @type {{desu: string, dearu: string}}
 * @example
 *  analyze(text).filter(results => results.type === Types.desu);
 */
export const Types = {
    desu: "特殊・デス",
    masu: "特殊・マス",
    dearu: "特殊・ダ"
};

/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export function isDesumasu({ type }: AnalyzedResultObject) {
    return isDesumasuType(type);
}

/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export function isDearu({ type }: AnalyzedResultObject) {
    return isDearuType(type);
}

/**
 * typeが敬体(ですます調)なら true を返す
 * @param {string} type
 * @returns {boolean}
 */
const isDesumasuType = (type: string) => type === Types.desu || type === Types.masu;
/**
 * typeが常体(である調)なら true を返す
 * @param type
 * @returns {boolean}
 */
const isDearuType = (type: string) => type === Types.dearu;

/**
 * tokenが文末のtokenなのかどうか
 * 文末とは"。"やこれ以上後ろにtokenがないケースを示す
 * @param {AnalyzedToken} targetToken
 * @param allTokens
 * @returns {boolean}
 */
const isLastToken = (targetToken: KuromojiToken, allTokens: KuromojiToken[]): boolean => {
    const nextPunctureToken = findNextPunctureToken(targetToken, allTokens);
    if (nextPunctureToken === undefined) {
        return true;
    }
    const nextPunctureTokenSurface = nextPunctureToken.surface_form;
    if (/[\!\?！？。]/.test(nextPunctureTokenSurface)) {
        return true;
    }
    return false;
};
/**
 * targetTokenより後ろにあるtokenから切り口となるtokenを探す
 * @param targetToken
 * @param allTokens
 * @returns {AnalyzedToken|undefined}
 */
const findNextPunctureToken = (targetToken: KuromojiToken, allTokens: KuromojiToken[]) => {
    const PUNCTUATION = /、|。/;
    const CONJUGATED_TYPE = /特殊/;
    const indexOfTargetToken = allTokens.indexOf(targetToken);
    // value is collection of these tokens: [ {target}, token, token, nextTarget|PunctuationToken ]
    const postTokens = allTokens.slice(indexOfTargetToken + 1);
    return postTokens.find((token) => {
        // 接続、末尾なので切る
        if (PUNCTUATION.test(token["surface_form"])) {
            return true;
        }
        // 次の特殊・がきたら
        if (CONJUGATED_TYPE.test(token["conjugated_type"])) {
            return true;
        }
        // 明示的なtokenがない場合は、名詞がきたらそこで切ってしまう
        if (token["pos"] === "名詞") {
            return true;
        }
        return false;
    });
};
/**
 * tokensからAnalyzedTokenにmapを作る
 */
const mapToAnalyzedResult = (tokens: KuromojiToken[]) => {
    return function mapTokenToAnalyzedResult(token: KuromojiToken): AnalyzedResultObject {
        const indexOfTargetToken = tokens.indexOf(token);
        const nextPunctureToken = findNextPunctureToken(token, tokens);
        // if has not next token, use between token <--> last.
        const nextTokenIndex = nextPunctureToken ? tokens.indexOf(nextPunctureToken) : tokens.length;
        const valueTokens = tokens.slice(indexOfTargetToken, nextTokenIndex + 1);
        const value = valueTokens.map((token) => token["surface_form"]).join("");
        return {
            type: token["conjugated_type"],
            value: value,
            surface: token["surface_form"], // index start with 0
            index: token["word_position"] - 1,
            /**
             * @type {AnalyzedToken}
             */
            token: Object.assign({}, token)
        };
    };
};

/**
 * `text`から敬体(ですます調)と常体(である調)を取り出した結果を返します。
 */
export function analyze(text: string, options: AnalyzeOptions = defaultOptions): Promise<AnalyzedResultObject[]> {
    const ignoreConjunction =
        options.ignoreConjunction !== undefined ? options.ignoreConjunction : defaultOptions.ignoreConjunction;
    return tokenize(text).then((tokens) => {
        const filterByType = tokens.filter((token, index) => {
            const nextToken = tokens[index + 1];
            // token[特殊・ダ] + nextToken[アル] なら 常体(である調) として認識する
            const conjugatedType = token["conjugated_type"];
            if (isDearuType(conjugatedType)) {
                // "である" を取り出す。この時点では接続なのか末尾なのかは区別できない
                if (token["pos"] === "助動詞" && token["conjugated_form"] === "連用形") {
                    if (nextToken && nextToken["conjugated_type"] === "五段・ラ行アル") {
                        // 文末の"である"のみを許容する場合は文末であるかどうかを調べる
                        if (ignoreConjunction) {
                            return isLastToken(token, tokens);
                        } else {
                            return true;
                        }
                    }
                }
            } else if (isDesumasuType(conjugatedType)) {
                // "やす" は "特殊・マス" として認識されるが、誤判定を避けるために除外する
                // https://github.com/textlint-ja/textlint-rule-no-mix-dearu-desumasu/issues/52
                if (token["basic_form"] === "やす") {
                    return false;
                }

                // TODO: can omit?
                if (token["conjugated_form"] === "基本形") {
                    // 文末の"です"のみを許容する場合は、文末であるかどうかを調べる
                    if (ignoreConjunction) {
                        return isLastToken(token, tokens);
                    } else {
                        return true;
                    }
                }
            }
            return false;
        });
        return filterByType.map(mapToAnalyzedResult(tokens));
    });
}

/**
 * `text` の敬体(ですます調)について解析し、敬体(ですます調)のトークン情報を返します。
 * @param {string} text
 * @param {Object} options
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export function analyzeDesumasu(
    text: string,
    options: AnalyzeOptions = defaultOptions
): Promise<AnalyzedResultObject[]> {
    return analyze(text, options).then((results) => results.filter(isDesumasu));
}

/**
 * `text` の常体(である調)について解析し、常体(である調)のトークン情報を返します。
 * @param {string} text
 * @param {Object} options
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export function analyzeDearu(text: string, options: AnalyzeOptions = defaultOptions): Promise<AnalyzedResultObject[]> {
    return analyze(text, options).then((results) => results.filter(isDearu));
}
