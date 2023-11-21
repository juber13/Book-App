const sidebar =  document.getElementsByClassName('sidebar')[0];
const booksContainer =  document.getElementsByClassName('cards')[0];

async function fetchApi(query){
    try{
        document.getElementsByClassName('overlay')[0].style.opacity = "1";
        const data = await fetch(`https://books-backend.p.goit.global/books/top-books`)
        const result =  await data.json();
        document.getElementsByClassName('overlay')[0].style.opacity = "0";
        renderSidebar(result);
        renderBooks(result);
        return result;
    }catch(err){
        console.log(err)
    }
}

fetchApi();

async function renderSidebar(books){
    let lists = books.map(list => `<p>${list.list_name}</p>`)
    sidebar.innerHTML +=     lists.join("");
}




async function renderBooks(booksList){
    console.log(booksList)
    const html = booksList.map(book =>  {
        return `<div class="books-card">
                  <p class="book-category-name">${book.list_name}</p>
                  <div class="cards-parent">
                   ${book.books.map(bo => {
                    return `<div class="card">
                            <img src=${bo.book_image} />
                            </div>`
                   }).join("")}
                   </div>
                   <button class="btn" >Show More</button>
                 </div>`
    })
       

    booksContainer.innerHTML = html.join("");

    // console.log(html)
}



