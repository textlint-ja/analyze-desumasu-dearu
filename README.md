# analyze-desumasu-dearu

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
[{
    value: "のだが",
    index: 11
 },
 {
    value: "である。",
    index: 21
 }
]
*/
// ですます は含まれてないので空の配列を返す
analyzeDesumasu(text);// []
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