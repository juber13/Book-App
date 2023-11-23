const sidebar = document.getElementsByClassName('categories')[0];
const booksContainer = document.getElementsByClassName('cards')[0];
const overlay = document.getElementsByClassName('overlay')[0];
const container = document.getElementsByClassName('books-container')[0];

async function fetchApi(query) {
    console.log(query)
    try {
        overlay.classList.add('overlay-active');
        const data = await fetch(`https://books-backend.p.goit.global/books/${query}`)

        const result = await data.json();
        overlay.classList.remove('overlay-active')
        renderSidebar(result);
        renderBooks(result);
        return result;
    } catch (err) {
        console.log(err)
    }
}

fetchApi("top-books");

async function renderSidebar(books) {
    let lists = books.map(list => `<p>${list.list_name}</p>`)
    sidebar.innerHTML += lists.join("");
}




async function renderBooks(booksList = []) {
    console.log(booksList)
    const html = booksList.map(book => {
        return `<div class="books-card">
                  <p class="book-category-name">${book.list_name}</p>
                  <div class="cards-parent">
                   ${book.books.map(bo => {
            return `<div class="card">
                            <img src=${bo.book_image} />
                             <small><strong>${bo.title.length > 5 ? bo.title.slice(0, 20) + "..." : bo.title}</strong></small>
                             <p>${bo.author}</p>
                            </div>`
        }).join("")}
                   </div>
                   <button class="btn" data-id="${book.list_name}" id="show-more-btn">Show More</button>
                 </div>`
    })

    booksContainer.innerHTML = html.join("");
    const moreBtns = document.querySelectorAll('#show-more-btn')
    moreBtns.forEach(btn => btn.addEventListener('click', showMoreBooks))
}



async function showMoreBooks(e) {
    let category = e.target.dataset.id;
    console.log(category.length)
    let str  = category.split(" ");
    const startWord = str.slice(0, str.length - 1).join(" ");
    const lastWord =  str.slice(-1).toString();
    console.log(startWord , lastWord)
    try {
        const result = await fetch(`https://books-backend.p.goit.global/books/category?category=${category}`);
        const data = await result.json();
        console.log(data)
        const html = data.map(book => {
            return `<div class="booklist">
                      <div class="list-parent">
                        <div class="card">
                                <img src=${book.book_image} />
                                
                                </div>
                                <p class="book-category-name">${book.title.length > 5 ? book.title.slice(0, 25) + "..." : book.title}</p>
                                <p>${book.author}</p>
                        </div>
                     </div>`
        })
        document.getElementsByClassName('heading')[0].innerHTML = `<h1>${startWord} <span>${lastWord}</span></h1>`;
        booksContainer.innerHTML = html.join("");


    } catch (err) {
        console.log(er)

    }

}

