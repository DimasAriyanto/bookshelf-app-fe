const books = [];
const RENDER_EVENT = 'render_book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateID() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id, 
        title, 
        author, 
        year, 
        isCompleted
    }
}

function findBook(bookId) {
    for(const bookItem of books) {
        if(bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for(const index in books) {
        if(books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
        books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const {id, title, author, year, isCompleted} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p');
    textYear.innerText = year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);

    if(isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.classList.add('green');
        undoButton.addEventListener('click', function() {
            undoBookFrommCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function() {
            removeBook(id);
        });

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit Buku';
        editButton.classList.add('yellow');
        editButton.addEventListener('click', function() {
            editBook(id);
        });

        const container = document.createElement('div');
        container.classList.add('action');
        container.append(undoButton, trashButton, editButton);

        article.append(container);
    } else {
        const completedButton = document.createElement('button');
        completedButton.innerText = 'Selesai dibaca';
        completedButton.classList.add('green');
        completedButton.addEventListener('click', function() {
            addBookFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function() {
            removeBook(id);
            console.log(id);
        });

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit Buku';
        editButton.classList.add('yellow');
        editButton.addEventListener('click', function() {
            editBook(id);
        });

        const container = document.createElement('div');
        container.classList.add('action');
        container.append(completedButton, trashButton, editButton);

        article.append(container);
    }

    return article;
}

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const checkComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, checkComplete);

    const confirmAddBook = confirm('Are you sure you want to add?');

    if(confirmAddBook) {
        books.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget == -1) return;

    const confirmRemoveBook = confirm('Are you sure you want to remove?');

    if(confirmRemoveBook) {
        books.splice(bookTarget, 1);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFrommCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook() {
    const inputSearch = document.getElementById('searchBookTitle').value.toLowerCase();
    const lisBook = document.querySelectorAll('.book_item > h3')
    
    for(list of lisBook) {
        if(inputSearch !== list.innerText) {
            list.parentElement.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const inputBook = document.getElementById('inputBook');

    inputBook.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });

    const cariBuku = document.getElementById('searchBook');

    cariBuku.addEventListener('submit', function(e) {
        e.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for(const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted){
            completeBookshelfList.append(bookElement);
        } else {
            incompleteBookshelfList.append(bookElement);
        }
    }
})