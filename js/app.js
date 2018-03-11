function addBookAjax(book) {
    return fetch("http://localhost:8282/books/", {
        method: 'POST',
        body: JSON.stringify(book),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
}

function getBooks() {
    return fetch("http://localhost:8282/books", {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json());
}

function getBook(bookId) {
    return fetch("http://localhost:8282/books/" + bookId, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json());
}

function clearList(list) {
    Array.from(list.children).forEach(elem => list.removeChild(elem));
    list.dataset.contents = "empty";
}

function addBook(ev, list) {
    ev.preventDefault();
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const type = document.getElementById("type");
    const publisher = document.getElementById("publisher");
    const isbn = document.getElementById("isbn");

    const book = {
        title: title.value,
        author: author.value,
        type: type.value,
        publisher: publisher.value,
        isbn: isbn.value
    };

    addBookAjax(book)
        .then(() => {
            clearList(list);
            getBooks()
                .then(books => displayTitles(list, books));
        });

    title.value = "";
    author.value = "";
    type.value = "";
    publisher.value = "";
    isbn.value = "";
}

function displayTitles(list, books) {
    books.forEach(elem => {
        let newDiv = document.createElement("div");
        let newH1 = document.createElement("h1");
        let newDetailsDiv = document.createElement("div");

        newDetailsDiv.dataset.contents = "empty";
        newH1.innerText = elem.title;
        newH1.addEventListener("click", function () {
            if(newDetailsDiv.dataset.contents === "empty") {
                getBook(elem.id)
                    .then(book => displayDetails(newDetailsDiv, book));
            } else {
                clearList(newDetailsDiv);
            }
        });

        newDiv.appendChild(newH1);
        newDiv.appendChild(newDetailsDiv);
        list.appendChild(newDiv);
    })
}

function displayDetails(list, book) {
    let newUl = document.createElement("ul");
    let authorLi = document.createElement("li");
    let typeLi = document.createElement("li");
    let publisherLi = document.createElement("li");
    let isbnLi = document.createElement("li");

    authorLi.innerText = "Autor: " + book.author;
    typeLi.innerText = "Kategoria: " + book.type;
    publisherLi.innerText = "Wydawca: " + book.publisher;
    isbnLi.innerText = "ISBN: " + book.isbn;

    newUl.appendChild(authorLi);
    newUl.appendChild(typeLi);
    newUl.appendChild(publisherLi);
    newUl.appendChild(isbnLi);
    list.appendChild(newUl);
    list.dataset.contents = "full";
}

document.addEventListener("DOMContentLoaded", function () {
    const addBookButton = document.getElementById("add_book");
    const bookList = document.getElementById("book_list");

    addBookButton.addEventListener("click", ev => addBook(ev, bookList));
    getBooks()
        .then(books => displayTitles(bookList, books));
});