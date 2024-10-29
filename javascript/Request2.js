document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    const BookRequestApiurl = "http://localhost:5116/api/BookRequest";

    const response = await fetch(BookRequestApiurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.log("can,t fetch data");

    }

    const Requests = await response.json();
    console.log(Requests);

    const requestTable = document.querySelector('tbody');
    requestTable.innerHTML = "";

    Requests.forEach((Request, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${Request.userNicNumber}</td>
        <td>${Request.userFirstName}</td>
        <td>${Request.userLastName}</td>
        <td>${Request.isbn}</td>
        <td>${Request.bookName}</td>
        <td>${Request.requestedDate}</td>
        <td>
            <button onclick="AcceptRequest(${index})">Accept</button>
         
        </td>
        `;
        requestTable.appendChild(row);
    });
});


const AcceptRequest = async (index) => {
    const BookRequestApiurl = "http://localhost:5116/api/BookRequest";
    const BorrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
    const BorrowedBookhistory = "http://localhost:5116/api/Record";

    try {
        // Fetch book requests
        const response = await fetch(BookRequestApiurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch book requests. Status: ${response.status}`);
        }

        const Requests = await response.json();
        const SelectedRequest = Requests[index];

        // Fetch borrowed books
        const borrowedBooksResponse = await fetch(BorrowedBooksApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!borrowedBooksResponse.ok) {
            throw new Error(`Failed to fetch borrowed books. Status: ${borrowedBooksResponse.status}`);
        }

        const borrowedBooks = await borrowedBooksResponse.json();
        const memberBorrowedBooks = borrowedBooks.filter(b => b.userNicNumber === SelectedRequest.userNicNumber);
        console.log(memberBorrowedBooks);
       
        if (memberBorrowedBooks.length >= 2) {
            alert("Member cannot borrow more than 2 books at once.");
            return;
        }

        if (memberBorrowedBooks.some(b => b.bookName === SelectedRequest.bookName)) {
            alert("Member cannot borrow the same book twice.");
            return;
        }

        const BorrowedDate = new Date();
        const dueDate = new Date(BorrowedDate);
        dueDate.setDate(BorrowedDate.getDate() + 7);

        const formattedBorrowedDate = BorrowedDate.toISOString().split('T')[0];
        const formattedDueDate = dueDate.toISOString().split('T')[0];

        const data = {
            UserNicNumber: SelectedRequest.userNicNumber,
            Bookname: SelectedRequest.bookName,
            bookIsbn: SelectedRequest.isbn,
            BorrowedDate: formattedBorrowedDate,
            duedate: formattedDueDate
        };

        const returnDate = new Date(BorrowedDate);
        returnDate.setDate(BorrowedDate.getDate() + 7);
        const formattedreturnDate = returnDate.toISOString().split('T')[0];

        const data2 = {
            UserFirstName: SelectedRequest.userFirstName,
            UserLastName: SelectedRequest.userLastName,
            UserNicNumber: SelectedRequest.userNicNumber,
            Bookname: SelectedRequest.bookName,
            BookIsbn: SelectedRequest.isbn,
            BorrowedDate: formattedBorrowedDate,
            ReturnedDate: formattedreturnDate
        };

        // Add book to borrowed list
        const addBorrowedResponse = await fetch(BorrowedBooksApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (addBorrowedResponse.ok) {
            // Fetch all books
            const bookResponse = await fetch("http://localhost:5116/api/Book/Get-all-books", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!bookResponse.ok) {
                alert("Failed to fetch books.");
                return;
            }

            const books = await bookResponse.json();
          //  console.log(books);
            
          //  console.log(SelectedRequest);
            
            const updatedBook = books.find(book => book.isbn === SelectedRequest.isbn && book.bookCopies > 0);
          //  console.log(updatedBook);
            
           // console.log(updatedBook.isbn);
            
            if (updatedBook) {
                
               const copies= (updatedBook.bookCopies)-1;
               console.log(copies);
              
           
                
                console.log("Updated book copies:", updatedBook.bookCopies);

                // Send PUT request to update book copies in the database
                const updateResponse = await fetch(`http://localhost:5116/api/Book/${updatedBook.isbn}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(copies)
                });

                if (updateResponse.ok) {
                    alert("Book copies decremented and updated in the database.");
                } else {
                    alert("Failed to update book copies in the database.");
                }
            } else {
                alert("Book not found or no copies left.");
            }

            
            Requests.splice(index, 1);

        
            const deleteRequestResponse = await fetch(`http://localhost:5116/api/BookRequest/${SelectedRequest.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (deleteRequestResponse.ok) {
                alert("Book request removed.");
            } else {
                alert("Failed to remove the book request.");
            }

            
            const createHistoryResponse = await fetch(BorrowedBookhistory, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data2)
            });

            if (createHistoryResponse.ok) {
                alert("Borrowed book history created successfully.");
            } else {
                throw new Error(`Failed to add to history. Status: ${createHistoryResponse.status}`);
            }
        } else {
            throw new Error(`Failed to add borrowed book. Status: ${addBorrowedResponse.status}`);
        }
    } catch (error) {
        console.error("Error: ", error);
        alert(`Error: ${error.message}`);
    }
};


    //  Remove the accepted request





   









// Reject request (for completion, implement as needed)
const RejectRequest = async (index) => {
    const BookRequestApiurl = "http://localhost:3000/BookRequest";

    // Fetch all book requests
    const response = await fetch(BookRequestApiurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const Requests = await response.json();
    const SelectedRequest = Requests[index];

    // Remove the rejected request
    const deleteRequestResponse = await fetch(`${BookRequestApiurl}/${SelectedRequest.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (deleteRequestResponse.ok) {
        alert("Book request rejected.");
    }

    // Optionally, re-render the table here after removal
};


