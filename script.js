let myLibrary = [];
let bookIndex = 0;

const openFormButton = document.querySelectorAll(".spawn-form");
const submitFormButton = document.querySelector("#submit");
const cancelFormButton = document.querySelector("#cancel");
const form = document.querySelector("form")
const cards = document.querySelector(".content");
const deleteButton = document.querySelector(".delete-button");

const header = document.querySelector(".top");
const warning = document.createElement("h2");
warning.textContent = "Cannot add new book. Library already contains that book";
warning.classList.add("hidden");
header.appendChild(warning);

function Book(title, author, noOfPages, isRead) {
    this.title = title;
    this.author = author;
    this.noOfPages = noOfPages;
    this.isRead = isRead;
}

function removeCards() {
    while (cards.firstChild) {
        cards.removeChild(cards.lastChild);
    }
}

getFromLocalStorage();
displaybooks();

openFormButton[0].addEventListener('click', () => {

    removeCards();
    document.querySelector(".form-popup").style.visibility = "visible";

});

form.addEventListener('submit', addBookToLibrary);
cancelFormButton.addEventListener('click', closeForm);

document.querySelector('body').addEventListener('click', function(event) {

    if (event.target.className === 'delete-book btn') {

        let card = event.target.parentNode.parentNode;
        let cardIndex = card.getAttribute("data-index");
        console.log(cardIndex);
        myLibrary.splice(cardIndex, 1);
        removeCards();
        displaybooks();
        saveToLocalStorage();
    }

    if(event.target.className === 'update-reading btn') {

        let card = event.target.parentNode.parentNode;
        let cardIndex = card.getAttribute("data-index");
        let book = myLibrary[cardIndex];
        let readingStatus = card.querySelector("h3");

        if(book.isRead == "Yes") {
            readingStatus.textContent = "Reading in progress";
            book.isRead = "No";
        } else {
            readingStatus.textContent = "Finished reading";
            book.isRead = "Yes";
        }
        saveToLocalStorage();
    }

});

function addBookToLibrary() {

    closeForm();
    removeCards();
    warning.classList.add("hidden");

    let author = document.querySelector("#author").value;
    let title = document.querySelector("#title").value;
    let pages = document.querySelector("#pages").value;
    let isRead = document.querySelector("#isRead").value;
    let book = new Book(title, author, pages, isRead);

    if(containsBook(title)) {
        displaybooks();
        warning.classList.remove("hidden");
        return;
    }

    myLibrary.push(book);
    saveToLocalStorage();
    displaybooks();
}

function containsBook(title) {
    
    for(let i = 0; i < myLibrary.length; i++) {

        if(myLibrary[i].title === title) {

            return true;
        }
    }

    return false;
}

function createCard(book) {

    let card = document.createElement("div");
    let container = document.createElement("container");
    let title = document.createElement("h2");
    let author = document.createElement("p");
    let pages = document.createElement("p");
    let isRead = document.createElement("h3");
    let deleteButton = document.createElement("button");
    let updateisReadButton = document.createElement("button");

    card.classList.add("card");
    card.dataset.index = bookIndex;
    container.classList.add("container");
    deleteButton.classList.add("delete-book");
    deleteButton.classList.add("btn");
    deleteButton.textContent = "Delete book";

    updateisReadButton.classList.add("update-reading");
    updateisReadButton.classList.add("btn");
    updateisReadButton.textContent = "Toggle progress"

    title.textContent = book.title;
    author.textContent = "By " + book.author;
    pages.textContent = book.noOfPages + " pages";

    if(book.isRead == "Yes") {
        isRead.textContent = "Finished reading";
    } else {
        isRead.textContent = "Reading in progress";
    }

    container.appendChild(title);
    container.appendChild(author);
    container.appendChild(pages);
    container.appendChild(isRead);
    container.appendChild(deleteButton);
    container.appendChild(updateisReadButton);
    card.appendChild(container);

    cards.appendChild(card);

}

function displaybooks() {
    bookIndex = 0;
    myLibrary.forEach((book) => {
        createCard(book);
        bookIndex++;
    });

}


function closeForm() {
    displaybooks();
    document.querySelector(".form-popup").style.visibility = "hidden";
}

function saveToLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function getFromLocalStorage() {
    const lib = JSON.parse(localStorage.getItem('myLibrary'))
    if (lib) {
        myLibrary = lib.map((book) => new Book(book.title, book.author, book.noOfPages, book.isRead))
    } else {
      myLibrary = []
    }
}



