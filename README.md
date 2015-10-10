# analyze-desumasu-dearu [![Build Status](https://travis-ci.org/azu/analyze-desumasu-dearu.svg?branch=master)](https://travis-ci.org/azu/analyze-desumasu-dearu)

文の敬体(ですます調)、常体(である調)を解析するライブラリ

## Installation

    npm install analyze-desumasu-dearu

## Usage

```js
import {analyzeDesumasu, analyzeDearu} from "analyze-desumasu-dearu";
let text = "昨日はいい天気であったのだが、今日は悪天候である。";
// である の情報
let ret = analyzeDearu(text);
/*
[
    {
        value: "のだが",
        lineNumber: 1,
        columnIndex: 11
    },
    {
        value: "である。",
        lineNumber: 1,
        columnIndex: 21
    }
]
*/
// ですます は含まれてないので空の配列を返す
analyzeDesumasu(text);// []
```

### analyzeDesumasu(text) /analyzeDearu(text) : object[]

`text`に含まれる文の敬体(ですます調) / 常体(である調)を解析して以下の配列を返します

Analyze `text` and return following array of object.

```js
[{
    value: string,
    lineNumber: number,  // start with 1
    columnIndex: number  // start with 0
}]
```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

## Acknowledge

Thank for [RedPen](http://redpen.cc/ "RedPen").