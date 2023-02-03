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
 * https://ja.wikipedia.org/wiki/Wikipedia:%E8%A8%98%E4%BA%8B%E5%90%8D%E3%81%AE%E4%BB%98%E3%81%91%E6%96%B9#%E8%A8%98%E4%BA%8B%E5%90%8D%E3%81%AE%E6%9B%B8%E5%BC%8F
 * @param {string} str 文字列
 * @return {string} 全角→半角に変換された文字列
 */
function toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
    });
}

module.exports = get_wikipedia_ja_link;