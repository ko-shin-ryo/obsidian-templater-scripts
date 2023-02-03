/**
 * Wikipedia日本語版の記事へのMarkdownリンクを生成
 * @param {string} word リンク生成ワード
 * @returns {string} Wikipedia日本語版の該当記事へのMarkdownリンク文字列
 */
async function get_wikipedia_ja_link (word) {
    const url = "https://ja.wikipedia.org/wiki/" + encodeURIComponent(toHalfWidth(word));
    let res;
    try {
        res = await request(url);
    } catch (e) {
        return "";
    }
    const elms = new DOMParser().parseFromString(res, "text/html").getElementsByTagName("title");
    return "[" + elms[0].textContent + "](" + url + ")";
}

/**
 * Wikipediaの記事名の付け方に従って英数字、記号を半角に変換
 * @param {string} str 文字列
 * @return {string} 全角→半角に変換された文字列
 */
function toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
    });
}

module.exports = get_wikipedia_ja_link;