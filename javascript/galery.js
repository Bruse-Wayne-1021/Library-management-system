document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();

    let books = []; // Array to hold all books
    const gallyDiv = document.getElementById('gallery');
    const searchInput = document.getElementById('searchInput');
    const sortOptions = document.getElementById('sortOptions');

    try {
        const bookurl = "http://localhost:5116/api/Book/get-all-books-with-images";
        const bookresponse = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        books = await bookresponse.json();
        console.log(books);
        displayBooks(books); 
    } catch (error) {
        console.error(error);
        alert("Some issues occurred: " + error);
    }

    // // Display welcome message
    // let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));
    // if (loggedinUserData) {
    //     let displayName = document.getElementById('UserNames');
    //     displayName.textContent = "Welcome, " + loggedinUserData.FirstName + " " + loggedinUserData.LastName;
    // }

   
    function displayBooks(booksToDisplay) {
        gallyDiv.innerHTML = ""; 
        booksToDisplay.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');
            card.innerHTML = `
                <img src="${book.images}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>ISBN: ${book.isbn}</p>
                <p>Publisher: ${book.publisher}</p>
                <p>Genre: ${book.genre}</p>
                <p>Copies: ${book.bookCopies}</p>
                <button onclick="requestBook('${book.isbn}', '${book.title}')">Request</button>
            `;
            gallyDiv.appendChild(card);
        });
    }
    const loggedInUser = JSON.parse(localStorage.getItem('logedInUser'));
    const id = loggedInUser.id;
     // Ensure correct property name
     console.log(id);
});

let requestBook = async (isbn, bookName) => {
    let loggedinUserData = JSON.parse(localStorage.getItem('logedInUser'));

    if (!loggedinUserData) {
        alert("You must be logged in to request a book.");
        return;
    }

    let RequestData = {
        UserFirstName: loggedinUserData.FirstName,
        UserLastName: loggedinUserData.LastName,
        UserNicNumber: loggedinUserData.Nic,
        RequestedDate: new Date().toISOString(),  // Send in ISO format for DateTime
        Isbn: parseInt(isbn),  // Convert ISBN to integer if it isn't already
        BookName: bookName
    };

    console.log("Requesting Book:", RequestData);

    const BookRequestApiUrl = "http://localhost:5116/api/BookRequest";

    try {
        const response = await fetch(BookRequestApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RequestData)
        });

        if (response.ok) {
            alert("Book requested successfully");
        } else {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert("Failed to request book: " + (errorData.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to request book. Please try again later.");
    }
};


document.addEventListener("DOMContentLoaded", async () => {
    // Function to display logged-in user data in the modal
    function showUserDetails() {
        const loggedInUser = JSON.parse(localStorage.getItem('logedInUser'));

        if (loggedInUser) {
            document.getElementById('userFirstName').value = loggedInUser.FirstName;
            document.getElementById('userLastName').value = loggedInUser.LastName;
            document.getElementById('userNic').value = loggedInUser.Nic;
            document.getElementById('userEmail').value = loggedInUser.email;
            document.getElementById('userPhone').value = loggedInUser.phoneNumber;
            document.getElementById('userPassword').value = loggedInUser.password;
        }
    }

    // Toggle editing mode for specific fields
    function toggleEditMode(isEditMode) {
        document.getElementById('userFirstName').readOnly = !isEditMode;
        document.getElementById('userPhone').readOnly = !isEditMode;
        document.getElementById('userPassword').readOnly = !isEditMode;

        document.getElementById('editButton').classList.toggle('d-none', isEditMode);
        document.getElementById('saveButton').classList.toggle('d-none', !isEditMode);
        document.getElementById('cancelButton').classList.toggle('d-none', !isEditMode);
    }

    // Event listener for Edit button
    document.getElementById('editButton').addEventListener('click', () => {
        toggleEditMode(true);
    });

    // Event listener for Save button
    document.getElementById('userDetailsForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedUser = {
          //  ...JSON.parse(localStorage.getItem('logedInUser')),
            firstName: document.getElementById('userFirstName').value,
            phoneNumber: document.getElementById('userPhone').value,
            password: document.getElementById('userPassword').value
        };

        console.log(updatedUser);
        console.log("Sending data to server:", JSON.stringify(updatedUser));

        const loggedInUser = JSON.parse(localStorage.getItem('logedInUser'));
        const nic = loggedInUser.Nic;
         // Ensure correct property name
         console.log(nic);
         

        // Construct URL with ID as a query parameter
        //const userUpdateUrl = `http://localhost:5116/api/Member/${nic}`;

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
                alert("Failed to update details: " + errorData.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update details. Please try again.");
        }
    });

    // Event listener for Cancel button
    document.getElementById('cancelButton').addEventListener('click', () => {
        toggleEditMode(false);
        showUserDetails();
    });

    // Initialize the modal with current user data
    showUserDetails();
});
