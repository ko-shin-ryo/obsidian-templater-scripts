/**
 * Wikipedia日本語版の記事へのMarkdownリンクを生成
 * @param {string} word リンク生成ワード
 * @returns {string} Wikipedia日本語版の該当記事へのMarkdownリンク文字列
 */
async function get_wikipedia_ja_link (word) {
    const url = "https://ja.wikipedia.org/wiki/" + encodeURIComponent(toHalfWidth(extractQuoted(word)));
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
 * 鉤括弧または二重鉤括弧の中身を抽出
 * @param {string} str 文字列
 * @returns 
 */
function extractQuoted(str) {
    // 鉤括弧「」または二重鉤括弧『』の中身を抽出する正規表現
    const match = str.match(/(?:「([^」]*)」|『([^』]*)』)/);
    if (match) {
        // 最初の捕捉グループまたは2番目の捕捉グループを返す
        return match[1] || match[2];
    }
    return str;
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