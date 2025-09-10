/**
 * DuckDuckGoで"映画タイトル site:imdb.com"を検索、トップの結果を正としてMarkdownリンクを作成する
 * @param {string} title 検索対象タイトル名
 * @returns {string} IMDbの紹介ページへのMarkdownリンク文字列 
 */
async function get_imdb_title_link (title) {
    if (!title) return "";
    const title_body = extractQuoted(title);
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(title_body + " site:imdb.com")}`;
    console.log(ddgUrl);
    let res;
    try {
        res = await request(ddgUrl);
    } catch (e) {
        return "";
    }
    const firstResult = new DOMParser().parseFromString(res, "text/html").querySelector('.result.results_links.results_links_deep.web-result');
    //console.log(firstResult);

    // タイトルを取得
    let page_title = null;
    const titleElement = firstResult.querySelector('.result__title a');
    page_title = titleElement ? titleElement.textContent.trim() : null;
    
    // URLを取得
    let page_url = null;
    const urlElement = firstResult.querySelector('.result__url');
    page_url = urlElement ? urlElement.textContent.trim() : null;

    if (page_title != null && page_url != null) {
        return "[" + page_title + "](https://" + page_url + ")";
    }
    return "";
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

module.exports = get_imdb_title_link;