async function get_wikipedia_ja_link (word) {
    const url = "https://ja.wikipedia.org/wiki/" + encodeURIComponent(word);
    try {
        const res = await request(url);
        const elms = new DOMParser().parseFromString(res, "text/html").getElementsByTagName("title");
        return "[" + elms[0].textContent + "](" + url + ")";
    } catch (e) {
        return "";
    }
}
module.exports = get_wikipedia_ja_link;