document.addEventListener('DOMContentLoaded', async () => {
    try {
        const LoggedInUser = JSON.parse(localStorage.getItem('logedInUser'));

        if (!LoggedInUser) {
            alert("User is not logged in");
            return;
        }

        const BorrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
        const bookApiUrl = "http://localhost:5116/api/Book/get-all-books-with-images";

        
        const BookResponse = await fetch(BorrowedBooksApiUrl);
        if (!BookResponse.ok) {
            alert("Can't fetch borrowed books data");
            return;
        }

        const BorrowedBooks = await BookResponse.json();
        console.log("Borrowed Books:", BorrowedBooks);

        
        const booksResponse = await fetch(bookApiUrl);
        if (!booksResponse.ok) {
            alert("Can't fetch books details");
            return;
        }

        const books = await booksResponse.json();
        console.log("Books:", books);
        console.log("Logged In User:", LoggedInUser);

        const tableView = document.getElementById('borrowedBooksTable');
        const bookCardContainer = document.getElementById('borrowedBooksCards');

        BorrowedBooks.filter(b => b.userNicNumber === LoggedInUser.nic)
        .forEach(borrowedBook => {
            console.log("Borrowed Book:", borrowedBook);

            const bookData = books.find(book => {
                const isMatching = book.isbn === borrowedBook.bookIsbn;
                console.log(`Comparing borrowed book ISBN: '${borrowedBook.bookIsbn}' with book ISBN: '${book.isbn}' - Match: ${isMatching}`);
                return isMatching;
            });

            console.log("Book Data:", bookData);

            if (bookData) {
                
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${String(borrowedBook.bookname)}</td>
                    <td>${String(bookData.isbn)}</td>
                    <td>${String(bookData.publisher)}</td>
                    <td>${borrowedBook.borrowedDate ? new Date(borrowedBook.borrowedDate).toLocaleDateString() : 'N/A'}</td>
                    <td>${borrowedBook.duedate ? new Date(borrowedBook.duedate).toLocaleDateString() : 'N/A'}</td>
                `;
                tableView.appendChild(row);

                
                let card = document.createElement('div');
                card.className = "col-md-4 mb-4";
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="${bookData.images}" class="card-img-top" alt="${borrowedBook.bookname}" />
                        <div class="card-body">
                            <h5 class="card-title">${borrowedBook.bookname}</h5>
                            <p class="card-text">ISBN: ${bookData.isbn}</p>
                            <p class="card-text">Publisher: ${bookData.publisher}</p>
                        </div>
                    </div>
                `;
                bookCardContainer.appendChild(card);

            } else {
                console.log(`No book data found for ISBN: ${borrowedBook.bookIsbn}`);
            }
        });

    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

document.addEventListener("DOMContentLoaded", async () => {

    function showUserDetails() {
        const loggedInUser = JSON.parse(localStorage.getItem('logedInUser'));

        if (loggedInUser) {
            document.getElementById('userFirstName').value = loggedInUser.firstName || '';
            document.getElementById('userLastName').value = loggedInUser.lastName || '';
            document.getElementById('userNic').value = loggedInUser.nic || '';
            document.getElementById('userEmail').value = loggedInUser.email || '';
            document.getElementById('userPhone').value = loggedInUser.phoneNumber || '';
            document.getElementById('userPassword').value = loggedInUser.password || '';
        }
    }

    function toggleEditMode(isEditMode) {
        document.getElementById('userFirstName').readOnly = !isEditMode;
        document.getElementById('userLastName').readOnly = !isEditMode;
        document.getElementById('userPhone').readOnly = !isEditMode;
        document.getElementById('userEmail').readOnly = !isEditMode;
        document.getElementById('userPassword').readOnly = !isEditMode;

        document.getElementById('editButton').classList.toggle('d-none', isEditMode);
        document.getElementById('saveButton').classList.toggle('d-none', !isEditMode);
        document.getElementById('cancelButton').classList.toggle('d-none', !isEditMode);
    }

    document.getElementById('editButton').addEventListener('click', () => {
        toggleEditMode(true);
    });

    document.getElementById('userDetailsForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedUser = {
            nic: document.getElementById('userNic').value,
            firstName: document.getElementById('userFirstName').value,
            phoneNumber: document.getElementById('userPhone').value,
            password: document.getElementById('userPassword').value,
            lastName: document.getElementById('userLastName').value,
            email: document.getElementById('userEmail').value,
        };

        console.log(updatedUser);
        console.log("Sending data to server:", JSON.stringify(updatedUser));

        const loggedInUser = JSON.parse(localStorage.getItem('logedInUser'));
        const nic = loggedInUser.nic;

        try {
            const response = await fetch(`http://localhost:5116/api/Member/${nic}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                localStorage.setItem('logedInUser', JSON.stringify(updatedUser));
                alert("Details updated successfully");
                toggleEditMode(false);
                showUserDetails();
            } else {
                const errorData = await response.json();
                alert("Failed to update details: " + (errorData.message || "An error occurred"));
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update details. Please try again.");
        }
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        toggleEditMode(false);
        showUserDetails();
    });

    showUserDetails();
});
