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
            <button onclick="RejectRequest(${index})" class="Rejectbtn">Reject</button>
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
        console.log(SelectedRequest.id);
        console.log(SelectedRequest);

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
        console.log(borrowedBooks);

        const memberBorrowedBooks = borrowedBooks.filter(b => b.userNicNumber === SelectedRequest.userNicNumber);
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
        const formattedBorrowedDate = BorrowedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
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

        console.log(data);

        const addBorrowedResponse = await fetch(BorrowedBooksApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (addBorrowedResponse.ok) {


            try {

                const bookurl = "http://localhost:5116/api/Book/Get-all-books"
                const bookResponse = await fetch(bookurl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (!bookResponse.ok) {
                    alert("Failed to fetch books.");
                    return; // Stop further execution if GET fails
                }
        
                const books = await bookResponse.json();
                console.log(books);
        
        
                const SelectedRequest = Requests[index];
                const updatedBook = books.find(book => book.isbn === SelectedRequest.isbn && book.BookCopies > 0);
                console.log(updatedBook);
                if (updatedBook) {
                    updatedBook.BookCopies--;
                    
                    const UpdateUrl="http://localhost:5116/api/Book"
                    const updateResponse = await fetch(`${UpdateUrl}/${updatedBook.isbn}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedBook)
                    });
        
                    if (updateResponse.ok) {
                        alert("Book copies decremented and updated in database.");
                    } else {
                        alert("Failed to update book copies in the database.");
                    }
                } else {
                    alert("Book not found or no copies left.");
                }
        
            } catch (error) {
                console.log(error);
                alert("Some issue in updating book stock: " + error);
            }
            try {
                Requests.splice(index, 1);

                const DeleteApiUrl = "http://localhost:5116/api/BookRequest";
                const deleteRequestResponse = await fetch(`${DeleteApiUrl}/${SelectedRequest.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log(deleteRequestResponse);

                if (deleteRequestResponse.ok) {
                    alert("Book request removed.");
                } else {
                    alert("Failed to remove the book request.");
                    return;
                }
            } catch (error) {
                console.log(error);
                alert("Some issue in Delete method: " + error);
            }


            const createHistoryResponse = await fetch(BorrowedBookhistory, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data2)
            });

            if (createHistoryResponse.ok) {
                alert("ok")
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


    //  Remove the accepted request





   

};







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


