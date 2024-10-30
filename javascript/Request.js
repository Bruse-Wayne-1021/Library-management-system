document.addEventListener('DOMContentLoaded', async () => {
    const BookRequestApiurl = "http://localhost:5116/api/BookRequest";

    try {
        const response = await fetch(BookRequestApiurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch book requests.");
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
                <button onclick="RejectRequest(${index})">Reject</button>
            </td>
            `;
            requestTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    }
});

const AcceptRequest = async (index) => {
    const BookRequestApiurl = "http://localhost:5116/api/BookRequest";
    const BorrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
    const BorrowedBookhistory = "http://localhost:5116/api/Record";

    try {
        const response = await fetch(BookRequestApiurl);
        const Requests = await response.json();
        const SelectedRequest = Requests[index];

        const borrowedBooksResponse = await fetch(BorrowedBooksApiUrl);
        const borrowedBooks = await borrowedBooksResponse.json();
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

        const formattedBorrowedDate = BorrowedDate.toISOString().split('T')[0];
        const formattedDueDate = dueDate.toISOString().split('T')[0];

        const data = {
            UserNicNumber: SelectedRequest.userNicNumber,
            Bookname: SelectedRequest.bookName,
            bookIsbn: SelectedRequest.isbn,
            BorrowedDate: formattedBorrowedDate,
            duedate: formattedDueDate
        };

        const data2 = {
            UserFirstName: SelectedRequest.userFirstName,
            UserLastName: SelectedRequest.userLastName,
            UserNicNumber: SelectedRequest.userNicNumber,
            Bookname: SelectedRequest.bookName,
            BookIsbn: SelectedRequest.isbn,
            BorrowedDate: formattedBorrowedDate,
            ReturnedDate: formattedDueDate // Changed to formattedDueDate for correct return date
        };

        const addBorrowedResponse = await fetch(BorrowedBooksApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!addBorrowedResponse.ok) {
            throw new Error(`Failed to add borrowed book. Status: ${addBorrowedResponse.status}`);
        }

        const bookResponse = await fetch("http://localhost:5116/api/Book/Get-all-books");
        const books = await bookResponse.json();
        const updatedBook = books.find(book => book.isbn === SelectedRequest.isbn && book.bookCopies > 0);
        
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
            }

            alert("Book copies decremented and updated in the database.");

            // Remove the accepted request
            await fetch(`http://localhost:5116/api/BookRequest/${SelectedRequest.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const createHistoryResponse = await fetch(BorrowedBookhistory, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data2)
            });

            if (!createHistoryResponse.ok) {
                throw new Error(`Failed to add to history. Status: ${createHistoryResponse.status}`);
            }

            alert("Borrowed book history created successfully.");
        } else {
            alert("Book not found or no copies left.");
        }
    } catch (error) {
        console.error("Error: ", error);
        alert(`Error: ${error.message}`);
    }
};

const RejectRequest = async (index) => {
    const BookRequestApiurl = "http://localhost:5116/api/BookRequest";

    try {
        const response = await fetch(BookRequestApiurl);
        const Requests = await response.json();
        const SelectedRequest = Requests[index];

        const deleteRequestResponse = await fetch(`${BookRequestApiurl}/${SelectedRequest.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!deleteRequestResponse.ok) {
            throw new Error("Failed to reject book request.");
        }

        alert("Book request rejected.");
        // Optionally, re-render the table here after removal
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    }
};
