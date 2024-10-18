// const { json } = require("node:stream/consumers");

document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    const borrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
    const booksApiUrl = "http://localhost:5116/api/Book/get-all-books-with-images";
  
    const tableBody = document.querySelector('tbody');

    try {
        const BorrowedBooksResponse = await fetch(borrowedBooksApiUrl)
           
        if (!BorrowedBooksResponse.ok) {
            console.log("can't fetch from borrowed books");
        }
        const BrrowedBooks = await BorrowedBooksResponse.json();
        console.log(BrrowedBooks);

        const BookResponse = await fetch(booksApiUrl)
        
        if (!BookResponse.ok) {
            console.log("Can't fetch data from books ");

        }
        const Books = await BookResponse.json();
        console.log(Books);


       



        tableBody.innerHTML = "";

        BrrowedBooks.forEach((borrow, index) => {
            const bookDetails = Books.find(b1 => b1.bookIsbn === borrow.isbn);
            //const memberDetails = members.find(m1 => m1.Nic === borrow.UserNicNumber);
            // console.log(bookDetails);
            // console.log(memberDetails);


            let row = document.createElement('tr');
            row.innerHTML = `
            <td>${borrow.id}</td>
            <td>${borrow.userNicNumber}</td>
            <td>${borrow.bookname}</td>
            <td>${borrow.bookIsbn}</td>
            <td>${borrow.borrowDate}</td>
            <td>${borrow.duedate}</td>
            <td><img src="${bookDetails.images}" alt="${borrow.bookName}" style="width: 100px; height: auto;"></td>
            <td><button onclick="processReturn(${index})">Process Return</button></td>
            `;
            tableBody.appendChild(row);
        });


        window.processReturn = async (index) => {
            const borrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
            const booksApiUrl = "http://localhost:5116/api/Book/get-all-books-with-images";
            
            try {
                // Fetch borrowed books
                const borrowedBooksResponse = await fetch(borrowedBooksApiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!borrowedBooksResponse.ok) {
                    console.log("Can't fetch borrowed books");
                    return;
                }
        
                const borrowedBooks = await borrowedBooksResponse.json();
                const returnBook = borrowedBooks[index];
                console.log("Returning book:", returnBook);
        
                // Fetch all books to find the returned book
                const bookResponse = await fetch(booksApiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!bookResponse.ok) {
                    console.log("Can't fetch books");
                    return;
                }
        
                const books = await bookResponse.json();
                const bookToUpdate = books.find(book => book.isbn === returnBook.bookIsbn);
                
                if (!bookToUpdate) {
                    alert("Book not found.");
                    return;
                }
        
                // Increment book copies
                
                
                console.log("Updated book copies:", bookToUpdate.bookCopies);
        
                // Update book in the database
                const bookApiUrl = "http://localhost:5116/api/Book";
                const updateResponse = await fetch(`${bookApiUrl}/${bookToUpdate.isbn}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bookToUpdate.bookCopies++)
                });
        
                if (updateResponse.ok) {
                    alert("Book copies updated successfully.");
                } else {
                    console.log("Failed to update book copies.");
                }
        
                // Remove the returned book from BorrowedBooks table
                const deleteResponse = await fetch(`${borrowedBooksApiUrl}/id?id=${returnBook.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (deleteResponse.ok) {
                    alert("Book returned successfully.");
                } else {
                    console.error("Failed to return the book.");
                }
        
                // Optionally, re-render the table or refresh the page here after removal
                borrowedBooks.splice(index, 1); // Remove from the local array to reflect UI changes
        
            } catch (error) {
                console.error("Error processing return:", error);
                alert("Failed to process return.");
            }
        };
        

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
