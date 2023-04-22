import { WordResult } from "sdapi/lib/dictionary";
import { JishoResult } from "unofficial-jisho-api";

const isJishoResult = (
    word: WordResult | JishoResult
): word is JishoResult => {
    return (word as JishoResult)["japanese"] !== undefined;
};

export default isJishoResult;