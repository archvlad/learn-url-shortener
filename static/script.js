function shorten() {
    fetch(`/api/shorten`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: document.querySelector("[name=url]").value,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            document.querySelector("[name=url]").value = data.shortUrl;
        });
}
