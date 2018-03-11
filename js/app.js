// Single AJAX function
function doAjax(context) {
    let bookId;
    if(context.hasAttribute("data-id")) {
        bookId = context.dataset.id;
    } else {
        bookId = "";
    }

    let body;
    if (context.dataset.method === "POST") {
        body = JSON.stringify(readNewBook());
    } else {
        body = null;
    }

    let result = fetch("http://localhost:8282/books/" + bookId, {
        method: context.dataset.method,
        body: body,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    if (context.dataset.method === "GET") {
        result = result.then(response => response.json());
    }

    return result;
}

// Helper functions
function clearList(list) {
    Array.from(list.children).forEach(elem => list.removeChild(elem));
    list.dataset.contents = "empty";
}

function readNewBook() {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const type = document.getElementById("type");
    const publisher = document.getElementById("publisher");
    const isbn = document.getElementById("isbn");

    let book = {
        title: title.value,
        author: author.value,
        type: type.value,
        publisher: publisher.value,
        isbn: isbn.value
    };

    title.value = "";
    author.value = "";
    type.value = "";
    publisher.value = "";
    isbn.value = "";

    return book;
}

function displayTitles(list, books) {
    books.forEach(elem => {
        let newDiv = document.createElement("div");
        let newH1 = document.createElement("h1");
        let newA = document.createElement("a");
        let newDetailsDiv = document.createElement("div");

        newDetailsDiv.dataset.contents = "empty";
        newH1.innerText = elem.title;
        newH1.dataset.method = "GET";
        newH1.dataset.id = elem.id;
        newH1.addEventListener("click", function () {
            if(newDetailsDiv.dataset.contents === "empty") {
                doAjax(this)
                    .then(book => displayDetails(newDetailsDiv, book));
            } else {
                clearList(newDetailsDiv);
            }
        });

        newA.innerText = "[usuń]";
        newA.dataset.method = "DELETE";
        newA.dataset.id = elem.id;
        newA.addEventListener("click", function (ev) {
            ev.preventDefault();
            doAjax(this)
                .then(() => {
                    clearList(list);
                    doAjax(list)
                        .then(books => displayTitles(list, books));
                });
        });

        newDiv.appendChild(newH1);
        newDiv.appendChild(newDetailsDiv);
        newDiv.appendChild(newA);
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

// Main code:
document.addEventListener("DOMContentLoaded", function () {
    const addBookButton = document.getElementById("add_book");
    const bookList = document.getElementById("book_list");

    addBookButton.addEventListener("click", function (ev) {
        ev.preventDefault();
        doAjax(this)
            .then(() => {
                clearList(bookList);
                doAjax(bookList)
                    .then(books => displayTitles(bookList, books));
            });
    });

    doAjax(bookList)
        .then(books => displayTitles(bookList, books));
});