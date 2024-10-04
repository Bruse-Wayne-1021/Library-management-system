// const { json } = require("node:stream/consumers");

document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    const borrowedBooksApiUrl = "http://localhost:3000/borrowedBooks";
    const booksApiUrl = "http://localhost:3000/book";
    const membersApiurl = "http://localhost:3000/member";

    const tableBody = document.querySelector('tbody');

    try {
        const BorrowedBooksResponse = await fetch(borrowedBooksApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!BorrowedBooksResponse.ok) {
            console.log("can't fetch from borrowed books");
        }
        const BrrowedBooks = await BorrowedBooksResponse.json();
        console.log(BrrowedBooks);


        // get data from book

        const BookResponse = await fetch(booksApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!BookResponse.ok) {
            console.log("Can't fetch data from books ");

        }
        const Books = await BookResponse.json();
        console.log(Books);


        // get data from member api

        const memberResponse = await fetch(membersApiurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }

        })
        if (!memberResponse.ok) {
            console.log("can't fetch data from member");

        }
        const members = await memberResponse.json();
        console.log(members);


        tableBody.innerHTML = "";

        BrrowedBooks.forEach((borrow, index) => {
            const bookDetails = Books.find(b1 => b1.BookName === borrow.Bookname);
            const memberDetails = members.find(m1 => m1.Nic === borrow.UserNicNumber);
            // console.log(bookDetails);
            // console.log(memberDetails);


            let row = document.createElement('tr');
            row.innerHTML = `
              <td>${memberDetails.FirstName}</td>
            <td>${memberDetails.Nic}</td>
            <td>${bookDetails.BookName}</td>
            <td>${bookDetails.Isbn}</td>
            <td><img src="${bookDetails.coverUrl}" alt="${borrow.bookName}" style="width: 100px; height: auto;"></td>
            <td><button onclick="processReturn(${index})">Process Return</button></td>
            `;
            tableBody.appendChild(row);
        });


        window.processReturn = async (index) => {
            const BorrowedBooksResponse = await fetch(borrowedBooksApiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!BorrowedBooksResponse.ok) {
                console.log("can't fetch from borrowed books");
            }

            const BrrowedBooks = await BorrowedBooksResponse.json();
            // console.log(BrrowedBooks);

            const returnbooks = BrrowedBooks[index];



            const BookResponse = await fetch(booksApiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!BookResponse.ok) {
                console.log("Can't fetch data from books ");

            }
            const Books = await BookResponse.json();
            // console.log(Books);
            
            const UpdateBooks=Books.map(books=>{
                if(books.BookName===returnbooks.Bookname){
                    books.copies++
                }
                return books;
            })
            for(let updatebook of UpdateBooks){
                const updateRequest=await fetch(`${booksApiUrl}/${updatebook.id}`,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(updatebook)
                })
                if(updateRequest.ok){
                    alert("book has been updated")
                }
                
            }
            // const returnbooks = BrrowedBooks[index];
            BrrowedBooks.splice(index,1);
            const deletedata=await fetch(`${borrowedBooksApiUrl}/${returnbooks.id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(deletedata.ok){
                alert("Book returned")
            }
            
            // console.log(UpdateBooks);
            


            


        }


    } catch (error) {
        console.log(error);

    }
})

// let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
// const returnedBook = borrowedBooks[index];

// let books = JSON.parse(localStorage.getItem('books')) || [];
// books = books.map(book => {
//     if (book.name === returnedBook.bookName) {
//         book.copies++;
//     }
//     return book;
// });
// localStorage.setItem('books', JSON.stringify(books));

// borrowedBooks.splice(index, 1);
// localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

// displayBorrowedBooks();

// Assuming you have already fetched the borrowedBooks array and the index is valid.
// const returnbooks = BorrowedBooks[index];  // Corrected spelling

// // Remove the returned book from the local array (optional, if you want to reflect the change in the frontend)
// BorrowedBooks.splice(index, 1);

// // Send DELETE request to the server to remove the book from the database
// const deletedata = await fetch(`${BorrowedBooksApiUrl}/${returnbooks.id}`, {
//     method: "DELETE",
//     headers: {
//         "Content-Type": "application/json"
//     }
// });

// // Check if the request was successful
// if (deletedata.ok) {
//     alert("Book returned successfully");
// } else {
//     console.error("Failed to return the book.");
// }
