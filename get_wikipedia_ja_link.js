async function get_wikipedia_ja_link (word) {
    const url = "https://ja.wikipedia.org/wiki/" + encodeURI(word);
    try {
        const res = await request(url);
        const doc = new DOMParser().parseFromString(res, "text/html");
        const elms = doc.getElementsByTagName("title");
        return "[" + elms[0].textContent + "](" + url + ")";
    } catch (e) {
        console.log(e);
        return "";
    }
}
module.exports = get_wikipedia_ja_link;