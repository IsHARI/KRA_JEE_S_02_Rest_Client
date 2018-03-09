function displayBooks(list, json) {
    json.forEach(elem => {
        let newLi = document.createElement("li");
        let newDiv = document.createElement("div");
        let newH1 = document.createElement("h1");

        newH1.innerText = elem.title;

        newLi.appendChild(newH1);
        newLi.appendChild(newDiv);
        list.appendChild(newLi);
    })
}

document.addEventListener("DOMContentLoaded", function () {
    const bookList = document.getElementById("book_list");

    fetch("http://localhost:8282/books", {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then(responseJson => displayBooks(bookList, responseJson));
});