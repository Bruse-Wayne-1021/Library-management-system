document.addEventListener('DOMContentLoaded',  async () => {
    let base64Image = "";

   
    document.getElementById('coverUrl').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(e) {
            base64Image = e.target.result; 
            document.getElementById('imageDisplay').src = base64Image;
            document.getElementById('imageDisplay').style.display = "block";  // Show image preview
        };
    });

  
    document.getElementById('addBookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookName = document.getElementById('bookName').value;
        const isbn = document.getElementById('isbn').value;
        const publisher = document.getElementById('publisher').value;
        const copies = document.getElementById('copies').value;
        const genre = document.getElementById('genre').value;

        const bookDetails = {
            Title: bookName,
            Isbn: isbn,
            Publisher: publisher,
            BookCopies: copies,
            Genre: genre,
          
        };

        const image={
            Image: base64Image,
            Isbn:isbn
        }

      

        try {
            const response = await fetch('http://localhost:3000/book', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookDetails)
            });

            if (response.ok) {
               try {
               
                const response =await fetch("http://localhost:3000/imageurl",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(image)

                })
                if(response.ok){
                    console.log("image add ")
                }
               } catch (error) {
                alert(`Error is :  ${error}`)
               }
            } else {
                throw new Error("Failed to add book");
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    });

    await displaybooks();
    await dispalyamembers();
});

let displaybooks = async () => {

    const bookurl = "http://localhost:3000/book";
    const imagerl="http://localhost:3000/imageurl";
    const BooktableBdy = document.querySelector('tbody');

    try {

        const image=await fetch(imagerl);
        const img=await image.json();

        const booksdata = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const books = await booksdata.json();
        console.log(books);

        BooktableBdy.innerHTML = "";
        books.forEach((book, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
             <td>${book.BookName}</td>
             <td>${book.Isbn}</td>
             <td>${book.publisher}</td>
             <td>${book.copies}</td>
             <td>${book.genre}</td>
             <td><img src="${book.Image}" alt="Book cover" style="width:50px; height:75px;"></td>
             <td><button onclick="EditBookDetails(${index})">Edit</button></td>
             <td><button onclick="Deletebook(${index})">Delete</button></td>
             `

            BooktableBdy.appendChild(row);

        });

    } catch (error) {
        // console.log(error)
        // alert("Error  :" + error)
    }
};

// member registrtion
document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Nic = document.getElementById('nic').value;
    const email = document.getElementById('Email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;


    // if (Password !== ConfirmPAssword) {
    //     alert("password does not matching")
    //     return;
    // }

    // const membersdata = {
    //     FirstName,
    //     LastName,
    //     Nic,
    //     Password,
    //     joinDate: new Date().toLocaleDateString()
    // }

    const membersData={
        FirstName,
        LastName,
        Nic,
        email,
        phoneNumber
    }



    const memnersurl = "http://localhost:5116/api/Member/add";


    try {
        const addmember = await fetch(memnersurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(membersData)
        })

        if (addmember.ok) {
            alert("member registed sucess")
            await dispalyamembers();
        }
        else {
            throw new Error("some error in member registation please try again later");

        }
    } catch (error) {
        alert("error " + error)
    }



});
// display members in table

let dispalyamembers = async () => {
    const memberurl = "http://localhost:5116/api/Member/get-all-members";
    const MemTablebody = document.getElementById('membertablebody');

    try {

        const memberdata = await fetch(memberurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })


        const members = await memberdata.json();
        console.log(members);

        MemTablebody.innerHTML = ""
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${member.id }</td>
              <td>${member. firstName}</td>
              <td>${member.lastName}</td>
              <td>${member. nic}</td>
              <td>${member.email}</td>
              <td>${member. phoneNumber}</td>
            `
            MemTablebody.appendChild(row);
        })

    } catch (error) {
        console.error(error)
    }

};
// Fetch and populate the selected book's details into the form for editing
// const EditBookDetails = async (index) => {
//     const bookApi = "http://localhost:3000/book";

//     try {
//         // Fetch book data from the server
//         const response = await fetch(bookApi);
//         const books = await response.json();
        
//         // Find the selected book using the index--
//         const selectedBook = books[index];
        
//         // If the book exists, populate the form fields with its details
//         if (selectedBook) {
//             document.getElementById('bookName').value = selectedBook.BookName;
//             document.getElementById('isbn').value = selectedBook.Isbn;
//             document.getElementById('publisher').value = selectedBook.publisher;
//             document.getElementById('copies').value = selectedBook.copies;
//             document.getElementById('coverUrl').value = selectedBook.coverUrl;
//             document.getElementById('genre').value = selectedBook.genre;
            
//             // Store the selected book's id for later use during the update
//             document.getElementById('bookId').value = selectedBook.id;
//         } else {
//             throw new Error("Book not found");
//         }
//     } catch (error) {
//         console.error("Error fetching book details:", error);
//         alert("Error fetching book details: " + error.message);
//     }
// };

// // On form submit, handle both adding a new book and updating an existing one
// document.getElementById('addBookForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const bookApi = "http://localhost:3000/book";
    
//     // Capture the book details from the form
//     const bookData = {
//         BookName: document.getElementById('bookName').value,
//         Isbn: document.getElementById('isbn').value,
//         publisher: document.getElementById('publisher').value,
//         copies: document.getElementById('copies').value,
//         coverUrl: document.getElementById('coverUrl').value,
//         genre: document.getElementById('genre').value
//     };

//     // Get the bookId from the hidden input field (if editing an existing book)
//     const bookId = document.getElementById('bookId').value;

//     try {
//         if (bookId) {
//             // Update existing book (PUT request)
//             await fetch(`${bookApi}/${bookId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(bookData)
//             });
//             alert("Book updated successfully");
//         } else {
//             // Add a new book (POST request)
//             await fetch(bookApi, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(bookData)
//             });
//             alert("Book added successfully");
//         }

//         // Reload the book display
//         await displaybooks();
//     } catch (error) {
//         console.error("Error saving book:", error);
//         alert("Error saving book: " + error.message);
//     }
    
// });




const Deletebook = async (index) => {
    const bookApi = "http://localhost:3000/book";

    try {
        // Fetch the current books to get the ID of the book to be deleted
        const response = await fetch(bookApi);
        const books = await response.json();
        
        // Get the ID of the book to delete using the index
        const bookToDelete = books[index];

        if (bookToDelete) {
            const deleteResponse = await fetch(`${bookApi}/${bookToDelete.id}`, {
                method: "DELETE"
            });

            if (deleteResponse.ok) {
                alert("Book deleted successfully");
                // Refresh the book display
                await displaybooks();
            } else {
                throw new Error("Failed to delete the book");
            }
        } else {
            alert("Book not found");
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book: " + error.message);
    }
};


// row.innerHTML = `
//     <td>${book.BookName}</td>
//     <td>${book.Isbn}</td>
//     <td>${book.publisher}</td>
//     <td>${book.copies}</td>
//     <td>${book.genre}</td>
//     <td><img src="${book.coverUrl}" alt="Book cover" style="width:50px; height:75px;"></td>
//     <td><button onclick="EditBookDetails(${index})">Edit</button></td>
//     <td><button onclick="Deletebook(${index})">Delete</button></td>
// `;



// document.addEventListener('DOMContentLoaded', async () => {
//     let image = ''; // Declare image variable in the outer scope

//     document.getElementById('imageInput').addEventListener('change', function(event) {
//         const file = event.target.files[0];
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = function(e) {
//             image = e.target.result; // Set the image variable
//             console.log(image);
//             document.getElementById('imageDisplay').src = image; // Set image source to display
//         };
//     });

//     document.getElementById('addBookForm').addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const BookName = document.getElementById('bookName').value;
//         const Isbn = document.getElementById('isbn').value;
//         const publisher = document.getElementById('publisher').value;
//         const copies = document.getElementById('copies').value;
//         const genre = document.getElementById('genre').value;

//         const bookurl = "http://localhost:3000/book";

//         const bookDetails = {
//             BookName,
//             Isbn,
//             publisher,
//             copies,
//             image, // Use the image from the outer scope
//             genre,
//             bookaddedDate: new Date().toLocaleDateString()
//         };

//         try {
//             const response = await fetch(bookurl, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(bookDetails)
//             });
//             if (response.ok) {
//                 alert("Book added successfully");
//                 await displaybooks();
//             } else {
//                 throw new Error("Failed to add book");
//             }
//         } catch (error) {
//             console.log(error);
//             alert("Error: " + error);
//         }
//     });

//     await displaybooks();
//     await dispalyamembers();
// });

