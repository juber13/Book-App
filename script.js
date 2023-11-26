const sidebar = document.getElementsByClassName('category')[0];
const booksContainer = document.getElementsByClassName('cards')[0];
const overlay = document.getElementsByClassName('overlay')[0];
const container = document.getElementsByClassName('books-container')[0];
const darkModeBtn = document.getElementsByClassName('dark-mode')[0];
const signInBtn = document.getElementsByClassName('sing-in-btn')[0];
const formModal = document.getElementsByClassName('form-modal')[0];
const signInModalCloseBtn = document.getElementById('sign-in-close-btn');
const loginModalCloseBtn = document.getElementById('login-close-btn');
const singUpForm =  document.getElementsByClassName('sign-up')[0];
const singInForm =  document.getElementsByClassName('sign-in')[0];
const userData = JSON.parse(localStorage.getItem('user')) || [];
const alertMessage =  document.getElementsByClassName('alert-message')[0];
const heading = document.getElementsByClassName('heading')[0];
const logOutBtn = document.getElementsByClassName('logout-btn')[0];
const userLogOutBtn = document.getElementsByClassName('user-logout-btn')[0];
// login from button already user
const logInUpFormBtn = document.getElementsByClassName('login-sign-up-form-btn')[0];

window.addEventListener('load' , () => {
    if(userData){
        signInBtn.style.display = "none"
        logOutBtn.style.display = "block";
    }
})


logOutBtn.addEventListener('click' , () => {
    // userLogOutBtn.style.display = "block";
    userLogOutBtn.classList.toggle('show-logout-btn')
})



// singup from button already user
const signInFormBtn = document.getElementsByClassName('signIn-sign-form-in-btn')[0];

const signIn = document.getElementsByClassName('sign-in')[0];


logInUpFormBtn.addEventListener('click' , () => {
    singInForm.style.display = "none";
    singUpForm.style.display = "block";
})

signInFormBtn.addEventListener('click' , () => {
    singInForm.style.display = "block";
    singUpForm.style.display = "none";
})

// ======================== close modal


function showAlert(message , messageRes){
    alertMessage.classList.add('show-alert' , messageRes);
    alertMessage.textContent  = message;

    setTimeout(() => {
      alertMessage.classList.remove('show-alert' , messageRes);
    //   alertMessage.classList.remove('show-alert');
      alertMessage.textContent  = "";
    },1500)

}

const removeClassModal = () => formModal.classList.remove('show-modal');

loginModalCloseBtn.addEventListener('click' , removeClassModal);
signInModalCloseBtn.addEventListener('click' , removeClassModal);


// ==============  add user form data

function addUser(e){ 
    e.preventDefault();
    const name = e.target.children[0].value;
    const email = e.target.children[1].value;
    const password = e.target.children[2].value;
    let userData = [{name , email , password}];
    
    if(!name || !email || !password){
        // alert("all")
        showAlert("All field are necessary" , 'invalid');
        return;
      }else if(password.length <= 8){
               showAlert("Password length must be greater then 8" , 'error');
               return;
      }else{

         const isUserExits = userData.some(user => user.email  === email);
        //  console.log(isUserExits);
        if(isUserExits){
            showAlert('User Already Exits' , 'invalid');
            return;
        }
        localStorage.setItem('user' , JSON.stringify(userData));
        this.reset();
        formModal.classList.remove('show-modal');
        showAlert('User Added Sucessfully' , 'success');
        

    }
}


singUpForm.addEventListener('submit' , addUser);


// ============== login user

function loginUser(e){
    e.preventDefault();
    if(userData){
        const email  = userData[0].email;
        const password = userData[0].password;

        const inputEmailValue =  e.target.children[0].value;
        const inputPasswordValue =  e.target.children[1].value;
        // console.log(first)
        console.log(userData)

        if(inputEmailValue != email && password != inputPasswordValue){
            showAlert("Invalid Credientials" , 'invalid');
            return;
        }else{
            showAlert('Logged In Succesfully' , 'success');
            formModal.classList.remove('show-modal');
            // signInBtn.innerHTML = `</i> ${userData[0].name}`;
            signInBtn.style.display = "none";
            logOutBtn.style.display = "block";
            logOutBtn.innerHTML =  `<i class="fa-solid fa-user"></i> ${userData[0].name}`;
        }
    }
}

singInForm.addEventListener('submit' , loginUser);


// ============ check if uer persent



// ================= sinn up ==========
console.log(formModal)
signInBtn.addEventListener('click' , () => {
//   formModal.style.opacity = "1";/
console.log('first')
  formModal.classList.add('show-modal');
})



// ============ dark mode functions ===========
darkModeBtn.addEventListener('click' , () => {
        darkModeBtn.classList.toggle('mode');
        document.body.classList.toggle('mode-colors');
})



async function fetchApi(query) {
    console.log(query)
    try {
        overlay.classList.add('overlay-active');
        const data = await fetch(`https://books-backend.p.goit.global/books/${query}`)

        const result = await data.json();
        overlay.classList.remove('overlay-active')
        result.unshift({list_name : "All Categories" , books : []})
        console.log(result)
        renderSidebar(result);
        renderBooks(result);
        return result;
    } catch (err) {
        console.log(err)
    }
}

fetchApi("top-books");

function renderSidebar(books) {
    let lists = books.map(list => `<p data-id="${list.list_name}">${list.list_name}</p>`)
    sidebar.innerHTML = lists.join("");
    sidebar.children[0].classList.add('active');
    Array.from(sidebar.children).forEach(list => list.addEventListener('click' , showBooksCategoriesWise))
}


function showBooksCategoriesWise(e){
    Array.from(sidebar.children).forEach(list => list.classList.remove('active'))
    e.target.classList.add('active');
    
    if(e.target.dataset.id === "All Categories"){
        // renderBooks()
        heading.innerHTML = `<h1>Best Sellers <span>Books</span></h1>`;
        // heading.classList.add('remove-padding')
        fetchApi("top-books");
    }else{
        showMoreBooks(e);
    }
    // console.log(e.target.dataset.id);
}





// console.log(category)


async function renderBooks(booksList = []) {
    const html = booksList.map(book => {
        return `${book.list_name !== "All Categories" ? 
                 `<div class="books-card">
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
                 : ""}`
    })

    booksContainer.innerHTML = html.join("");
    const moreBtns = document.querySelectorAll('#show-more-btn')
    moreBtns.forEach(btn => btn.addEventListener('click', showMoreBooks))
}



async function showMoreBooks(e) {
    let category = e.target.dataset.id;
    let str  = category.split(" ");
    const startWord = str.slice(0, str.length - 1).join(" ");
    const lastWord =  str.slice(-1).toString();
    try {
        overlay.classList.add('overlay-active');
        const result = await fetch(`https://books-backend.p.goit.global/books/category?category=${category}`);
        const data = await result.json();
        overlay.classList.remove('overlay-active');
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
        heading.innerHTML = `<h1>${startWord} <span>${lastWord}</span></h1>`;
        // heading.classList.remove('remove-padding');
        booksContainer.innerHTML = html.join("");


    } catch (err) {
        console.log(er)

    }

}

