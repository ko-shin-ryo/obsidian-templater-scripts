/**
 * タイトルで検索してFilmarks映画の紹介ページへのMarkdownリンク文字列を生成する
 * @param {string} title 検索対象タイトル名
 * @returns {string} Filmarksの紹介ページへのMarkdownリンク文字列
 */
async function get_filmarks_movie_title_link (title) {
    if (!title) return "";
    // Filmarks検索結果から対象作品のIDを取得する
    const url = "https://filmarks.com/search/movies?q=" + encodeURIComponent(title);
    let res;
    let min_distance = {
        distance: 100,
        movie_title: "",
        movie_id: null,
    };
    try {
        res = await request(url);
    } catch (e) {
        return "";
    }
    //const elms = new DOMParser().parseFromString(res, "text/html").getElementsByClassName("p-content-cassette");
    const elms = new DOMParser().parseFromString(res, "text/html").getElementsByClassName("js-movie-cassette");
    //console.log(elms);
    for (const elm of elms) {
        const title_elm = elm.getElementsByClassName("p-content-cassette__title");
        const movie_title = title_elm[0].textContent;
        const movie_id = JSON.parse(elm.getAttribute('data-clip')).movie_id;
        if (title == movie_title) {
            return create_markdown_link(movie_title, movie_id);
        }
        // 完全一致しない場合はレーベンシュタイン距離で類似度を求める
        const distance = levenshtein_distance(title, movie_title);
        if (distance < min_distance.distance) {
            min_distance.distance = distance;
            min_distance.movie_title = movie_title;
            min_distance.movie_id = movie_id;
        }
    }
    // 最も類似度が高い、かつレーベンシュタイン距離が5以下の場合表記ゆれと判断して採用
    console.log(min_distance);
    if (min_distance.distance <= 5) {
        return create_markdown_link(min_distance.movie_title, min_distance.movie_id);
    }
    return "";
}

/**
 * Markdownリンクを作成
 * @param {string} movie_title 映画タイトル
 * @param {string} movie_id Filmarks内ID
 * @returns {string} Filmarksの紹介ページへのMarkdownリンク文字列
 */
function create_markdown_link(movie_title, movie_id) {
    const title_sub = " - 映画情報・レビュー・評価・あらすじ・動画配信 | Filmarks映画"
    return "[" + movie_title + title_sub + "](https://filmarks.com/movies/" + movie_id + ")";
}

/**
 * 2つの文字列のレーベンシュタイン距離を算出
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} レーベンシュタイン距離
 */
function levenshtein_distance(str1, str2) {
    let i1, i2, cost;
    let d = [];

    for (i1=0; i1<=str1.length; i1++) {
        d[i1] = [i1];
    }
    for (i2=0; i2<=str2.length; i2++) {
        d[0][i2] = i2;
    }
    for (i1=1; i1<=str1.length; i1++) {
        for (i2=1; i2<=str2.length; i2++) {
            cost = str1.charCodeAt(i1-1) == str2.charCodeAt(i2-1) ? 0: 1;
            d[i1][i2] = Math.min(d[i1-1][i2] + 1, d[i1][i2-1] + 1, d[i1-1][i2-1] + cost);
        }
    }
    return d[str1.length][str2.length];
}

module.exports = get_filmarks_movie_title_link;