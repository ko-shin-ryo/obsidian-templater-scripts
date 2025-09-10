/**
 * タイトルで検索して映画.comの該当作ページへのMarkdownリンク文字列を生成する
 * @param {string} title 検索対象タイトル名
 * @returns {string} 映画.comの紹介ページへのMarkdownリンク文字列
 */
async function get_eigacom_title_link (title) {
    if (!title) return "";
    // 映画.com検索結果から対象作品のIDを取得する
    const title_body = extractQuoted(title)
    const url = "https://eiga.com/search/" + encodeURIComponent(title_body) + "/movie/";
    let res;
    try {
        res = await request(url);
    } catch (e) {
        return "";
    }
    const elms = new DOMParser().parseFromString(res, "text/html").getElementsByClassName("col-s-3");
    //console.log(elms);
    for (const elm of elms) {
        const movie_title = elm.querySelector('.col-s-3 .title').textContent.trim();
        const movie_id = elm.querySelector('.col-s-3 a').getAttribute('href').match(/\/movie\/(\d+)/)?.[1];
        if (compareIgnoringSpaces(title_body, movie_title)) {
            return create_markdown_link(movie_title, movie_id);
        }
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

/**
 * タイトル文字列を比較する
 * 映画.comはスペースは全角を採用しているため、スペースを変換して比較する
 * @param {string} title1 
 * @param {string} title2
 * @returns 
 */
function compareIgnoringSpaces(title1, title2) {
  const normalizeSpaces = (str) => str.replace(/ /g, '　');
  return normalizeSpaces(title1) === normalizeSpaces(title2);
}

/**
 * Markdownリンクを作成
 * @param {string} movie_title 映画タイトル
 * @param {string} movie_id 映画.com内ID
 * @returns {string} 映画.comの紹介ページへのMarkdownリンク文字列
 */
function create_markdown_link(movie_title, movie_id) {
    const title_sub = " : 作品情報 - 映画.com"
    return "[" + movie_title + title_sub + "](https://eiga.com/movie/" + movie_id + ")";
}

module.exports = get_eigacom_title_link;