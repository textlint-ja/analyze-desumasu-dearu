import type { KuromojiToken } from "kuromojin";
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
 * Type enum
 * @type {{desu: string, dearu: string}}
 * @example
 *  analyze(text).filter(results => results.type === Types.desu);
 */
export declare const Types: {
    desu: string;
    masu: string;
    dearu: string;
};
/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export declare function isDesumasu({ type }: AnalyzedResultObject): boolean;
/**
 * @param {AnalyzedResultObject} resultObject
 * @returns {boolean}
 */
export declare function isDearu({ type }: AnalyzedResultObject): boolean;
/**
 * `text`から敬体(ですます調)と常体(である調)を取り出した結果を返します。
 */
export declare function analyze(text: string, options?: AnalyzeOptions): Promise<AnalyzedResultObject[]>;
/**
 * `text` の敬体(ですます調)について解析し、敬体(ですます調)のトークン情報を返します。
 * @param {string} text
 * @param {Object} options
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export declare function analyzeDesumasu(text: string, options?: AnalyzeOptions): Promise<AnalyzedResultObject[]>;
/**
 * `text` の常体(である調)について解析し、常体(である調)のトークン情報を返します。
 * @param {string} text
 * @param {Object} options
 * @return {Promise.<AnalyzedResultObject[]>}
 */
export declare function analyzeDearu(text: string, options?: AnalyzeOptions): Promise<AnalyzedResultObject[]>;
//# sourceMappingURL=analyze.d.ts.map
