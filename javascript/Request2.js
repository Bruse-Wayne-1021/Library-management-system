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
    const BookApiUrl = "http://localhost:3000/book";
    const BorrowedBookhistory = "http://localhost:3000/Borrwedbookshistory ";


    const response = await fetch(BookRequestApiurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"                                                                                      // Fetch all book requests
        }
    });

    const Requests = await response.json();
    console.log(Requests);
    
    const SelectedRequest = Requests[index];

    // Fetch borrowed books
    const borrowedBooksResponse = await fetch(BorrowedBooksApiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const borrowedBooks = await borrowedBooksResponse.json();
    console.log(borrowedBooks);
    

    // Check if the member borrowed more than 2 books
    const memberBorrowedBooks = borrowedBooks.filter(b => b.UserNicNumber === SelectedRequest.UserNicNumber);
    if (memberBorrowedBooks.length >= 2) {
        
        alert("Member cannot borrow more than 2 books at once.");
        return;
    }

    // Check if the member has already borrowed the same book
    if (memberBorrowedBooks.some(b => b.Bookname === SelectedRequest.Bookname)) {
        alert("Member cannot borrow the same book twice.");
        return;
    }
    const BorrowedDate = new Date();
    const dueDate = new Date(BorrowedDate);
    dueDate.setDate(BorrowedDate.getDate() + 7)
    const formattedBorrowedDate = BorrowedDate.toLocaleDateString();
    const formattedDueDate = dueDate.toLocaleDateString();



    // Add new borrowed book
    const data = {
        UserNicNumber: SelectedRequest.UserNicNumber,
        Bookname: SelectedRequest.Bookname,
        bookIsbn:SelectedRequest.Isbn,
        BorrowedDate: formattedBorrowedDate,
        duedate: formattedDueDate
        
    };

    try {
        const addBorrowedResponse = await fetch(BorrowedBooksApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (addBorrowedResponse.ok) {
            try {

                const CreateHistory = await fetch(BorrowedBookhistory, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })

                if (CreateHistory.ok) {
                    alert("add book in history")
                }

            } catch (error) {
                alert(error)
            }
        }
    } catch (error) {
        console.log(error);
        // alert("some issuse in post to add borrow books " + error)
    }

    // Remove the accepted request

    // try {
        Requests.splice(index, 1);
        const deleteRequestResponse = await fetch(`${BookRequestApiurl}/${SelectedRequest.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (deleteRequestResponse.ok) {
            alert("Book request removed.");
        }
    // } catch (error) {
        // console.log(error);
        // alert("some issuse in Delete method " + error)
    // }
    // const book123=await fetch (BookApiUrl);
    // const book2=await book123.json();
    // console.log(book2);



    // Fetch books and update the stock
    const bookResponse = await fetch(BookApiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const books = await bookResponse.json();

    const updatedBooks = books.map(book => {
        if (book.BookName === SelectedRequest.Bookname && book.copies > 0) {
            book.copies--;  // Decrement the number of copies
            alert("decrememted book copies")
        }
        return book;
    });



    // Update books in the backend
    try {
        for (let updatedBook of updatedBooks) {
            const updateBookResponse = await fetch(`${BookApiUrl}/${updatedBook.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedBook)
            });
            if (updateBookResponse.ok) {
                console.log(`Updated book: ${updatedBook.Bookname}`);
            }
        }
    } catch (error) {
        alert("some error in update books " + error)
    }
    //   






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


