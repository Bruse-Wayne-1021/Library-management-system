// const { assert } = require("console");
// const { json } = require("stream/consumers");


document.addEventListener('DOMContentLoaded', async () => {
    

    const BookRequestApiurl = "ht";

    const response = await fetch(BookRequestApiurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {
        alert("Book request fetch sucess")
    }
    const Requestes = await response.json();
    console.log(Requestes);
    

    const requestTable = document.querySelector('tbody');
    requestTable.innerHTML = "";
    Requestes.forEach((Request, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${Request.UserNicNumber}</td>
        <td>${Request.UserID}</td>
        <td>${Request.UserFirstName}</td>
        <td>${Request.Bookname}</td>
        <td>
            <button onclick="AcceptRequest(${index})">Accept</button>
            <button>Reject</button>
        </td>
        `;
        requestTable.appendChild(row)
    });
})


let AcceptRequest = async (index) => {
   
    const BookRequestApiurl = "http://localhost:3000/BookRequest";
    const response = await fetch(BookRequestApiurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const Request = await response.json();
    

    const BorrowedBooks = "http://localhost:3000/borrowedBooks";

    const ApiResponse = await fetch(BorrowedBooks, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const borrowedBooks = await ApiResponse.json();
    const SelectedRequest = Request[index];

    const memberBorrowedBooks = borrowedBooks.filter(b => b.UserNicNumber === SelectedRequest.UserNicNumber);
    if (memberBorrowedBooks.length >= 2) {
        alert("Member cannot borrow more than 2 books at once.")
        return
    }

    if (memberBorrowedBooks.some(b => b.Bookname === SelectedRequest.Bookname)) {
        alert("Member cannot borrow the same book twice.")
        return
    }


    const data = {
        UserNicNumber: SelectedRequest.UserNicNumber,
        bookname: SelectedRequest.Bookname
    };


    const Requestes = await fetch(BorrowedBooks, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if(Requestes.ok){
        alert("ok")
    }

    Request.splice(index,1)
    const fetchdata = await fetch(BookRequestApiurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Request)
    })
    if(fetchdata.ok){
        alert("ok")
    }

    const bookapiurl="http://localhost:3000/book";
    const bookResponse=await fetch(bookapiurl,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const books =await bookResponse.json();
    if(bookResponse.ok){
        console.log(" book ok")
    }


    

    // let books = JSON.parse(localStorage.getItem('books')) || [];
    books =books.map(book => {
        if (book.Bookname === SelectedRequest.Bookname) {
            book.copies--;
        }
        return book;
    });

    const Bookresponse = await fetch(bookapiurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(books)
    })
    if(Bookresponse.ok){
        alert("ok")
    }


}
// AcceptRequest();

