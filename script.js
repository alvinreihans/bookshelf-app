const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOK_APPS';
const bookStatDesc = document.getElementById('statusDesc');
const bookStat = document.getElementById('inputBookIsComplete');
const searchModal = document.getElementById("searchModal");
const searchmodalContent = document.getElementById("searchModalContent");
const searchBtn = document.getElementById("searchSubmit");
const searchModalClose = document.getElementById("searchModalClose");
const searchInput = document.getElementById("searchBookTitle");
const incompleteBookshelfListInModal = document.getElementById("incompleteBookshelfListInModal");
const completedBookshelfListInModal = document.getElementById("completedBookshelfListInModal");
const dialogModal = document.getElementById("dialogModal");
const dialogModalContent = document.getElementById("dialogModalContent");
function generateId() {
    return +new Date();
};

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert ('Sorry, your browser does not support web storage');
        return false;
    };
    return true;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    };
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Author : ${bookObject.author}`;
    const textYear = document.createElement('p');
    textYear.innerText = `Year : ${bookObject.year}`;
    const btnDone = document.createElement('button');
    btnDone.setAttribute('class', 'green');
    btnDone.innerText = "Finish read";
    btnDone.addEventListener('click', function() {
        moveToReaded(bookObject.id);
        closeSearchModal();
    });
    const btnUndone = document.createElement('button');
    btnUndone.setAttribute('class', 'green');
    btnUndone.innerText = "Undone finish read";
    btnUndone.addEventListener('click', function() {
        moveToUnfinished(bookObject.id);
        closeSearchModal();
    });
    const btnDel = document.createElement('button');
    btnDel.setAttribute('class', 'red');
    btnDel.innerText = "Remove book";
    btnDel.addEventListener('click', function() {
        removeConfirm(bookObject);
    });
    const actSect = document.createElement('div');
    actSect.setAttribute('class', 'action');
    if (bookObject.isComplete == true) {
        actSect.append(btnUndone, btnDel);
    } else {
        actSect.append(btnDone, btnDel);
    }
    const container = document.createElement('article');
    container.setAttribute('class', `book-${bookObject.id} book_item`);
    container.append(textTitle, textAuthor, textYear, actSect);
    return container;
};
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookStatus = bookStat.checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookStatus);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
function moveToReaded(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
function moveToUnfinished(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
};
document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    };
});
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';
    const completedBOOKList = document.getElementById('completedBookshelfList');
    completedBOOKList.innerHTML = '';
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete == true) {
            completedBOOKList.append(bookElement);
        } else {
            uncompletedBOOKList.append(bookElement);
        };
    };
});
bookStat.addEventListener('click', function () {
    if (bookStatDesc.innerHTML == "unfinished") {
        bookStatDesc.innerHTML = "readed";
    } else {
        bookStatDesc.innerHTML = "unfinished";
    };
});
searchBtn.onclick = function(e) {
    searchModal.style.display = "block";
    e.preventDefault();
    searchBook(searchInput.value);
}

function closeSearchModal() {
    searchModal.style.display = "none";
    completedBookshelfListInModal.innerHTML = '';
    incompleteBookshelfListInModal.innerHTML = '';
}
searchModalClose.onclick = function() {
    closeSearchModal();
}

function searchBook(bookTitle) {
    for (const bookItem of books) {
        if (bookItem.title === bookTitle) {
            const bookElement = makeBook(bookItem);
            if (bookItem.isComplete == true) {
                completedBookshelfListInModal.append(bookElement);
            } else {
                incompleteBookshelfListInModal.append(bookElement);
            };
        };
    };
    return null;
};
function removeConfirm (bookObject) {
    dialogModal.style.display = "block";
    const removeText = document.createElement('p');
    removeText.innerText = `Remove ${bookObject.title} from bookshelf?`;
    removeText.style.marginRight = "4%";
    const yes = document.createElement('button');
    yes.setAttribute('class', 'red');
    yes.innerText = "Remove";
    yes.addEventListener('click', function () {
        removeBook(bookObject.id);
        dialogModal.style.display = "none";
        dialogModalContent.innerHTML = "";
        closeSearchModal();
    });
    const no = document.createElement('button');
    no.setAttribute('class', 'green');
    no. innerText = "Cancel";
    no.addEventListener('click', function () {
        dialogModal.style.display = "none";
        dialogModalContent.innerHTML = "";
    });
    dialogModalContent.append(removeText, no, yes);
};