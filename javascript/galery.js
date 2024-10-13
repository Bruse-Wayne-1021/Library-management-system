document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();


    try {

        const bookurl = "http://localhost:3000/book";

        let gallyDiv = document.getElementById('gallery');
        const bookresponse = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const books = await bookresponse.json();
        gallyDiv.innerHTML = ""
        books.forEach(book  => {
            const card = document.createElement('div');
            card.classList.add('book-card')
            card.innerHTML = `
            <img src="${book.coverUrl}" alt="${book.name}">
            <h3>${book.BookName}</h3>
            <p>ISBN: ${book.Isbn}</p>
            <p>Publisher: ${book.publisher}</p>
            <p>Genre: ${book.genre}</p>
            <p>Copies: ${book.copies}</p>
            <button onclick="request('${book.BookName}')">Request</button>
            `;
            gallyDiv.appendChild(card)
        });
    } catch (error) {
        console.error(error);
        alert("some issues :" + error)
    }


    // login user section
    // const loginUserApiUrl = "http://localhost:3000/logedInUser";

    // try {
    //     const response = await fetch(loginUserApiUrl, {
    //         method: "GET",
    //         headers: {
    //             "Content-type": "application/json"
    //         }
    //     })
    //     const LoginUserData = await response.json();
    //     console.log(LoginUserData);





    //     const HeadingDiv = document.getElementById('WelcmeMeg');

    //     HeadingDiv.innerHTML = "";
    //     LoginUserData.forEach(logData => {
    //         let tag = document.createElement('div');
    //         tag.innerHTML = `
    //     <h1>welcome ${logData.FirstName} ${logData.LastName}</h1>
    //     `
    //         HeadingDiv.appendChild(tag)
    //     }

    //     const userFirstname = LoginUserData.FirstName;
    //     const userLastname = LoginUserData.LastName;

    //     console.log(userFirstname)
    //     console.log(userLastname)

    //     const headingtag = document.getElementById('UserNames');
    //     headingtag.innerHTML = " welcome " + userFirstname + " " + userLastname
    //     // 
    //     if (response.ok) {
    //         // alert("fetch user data from login end point ")
    //         console.log("sucess for fetch data")


    //     }

    //     if (!LoginUserData) {
    //         alert("You must login first");
    //         window.location.href = "login.html";
    //         return;
    //     }

    // } catch (error) {
    //     alert(error);
    // }

 
    // let welcomeMessage = document.getElementById('WelcomeMessage');
    // let a = welcomeMessage.textContent = `welcome ${LoginUserData.FirstName} ${LoginUserData.LastName}`;

    // console.log(a);

    // let logOutbtn = document.getElementById('logoutBtn');
    // logOutbtn.addEventListener('click', async () => {})



        let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
        // console.log(loggedinUserData)
        let diaplayName = document.getElementById('UserNames');

        diaplayName.textContent = "welcome ," + loggedinUserData.FirstName + " "+loggedinUserData.LastName

});

let request= async (bookname)=>{
    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
    let RequstData={
        UserID:loggedinUserData.id,
        UserFirstName:loggedinUserData.FirstName,
        UserLastName:loggedinUserData.LastName,
        UserNicNumber:loggedinUserData.Nic,
        Bookname:bookname
    }

    const BookRequestApiurl="http://localhost:3000/BookRequest";

    const Request=await fetch(BookRequestApiurl,{
        method:"POST",
        headers:{
            "Content-Type":"applicaion/json"
        },
        body:JSON.stringify(RequstData)
    })

    if(Request.ok){
        alert("book requested")
    }

    
}













