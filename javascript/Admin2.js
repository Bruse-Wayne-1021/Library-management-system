document.addEventListener('DOMContentLoaded', async () => {
    let base64Image = "";

  
    document.getElementById('coverUrl').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(e) {
            base64Image = e.target.result; 
            document.getElementById('imageDisplay').src = base64Image;
            document.getElementById('imageDisplay').style.display = "block";  
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

        const image = {
            ImagePath: base64Image,
            Isbn: isbn
        };


        try {
            
            const bookResponse = await fetch('http://localhost:5116/api/Book/add-new-book', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookDetails)
            });

            if (bookResponse.ok) {
                
                const imageResponse = await fetch("http://localhost:5116/api/Bookimage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(image)
                });

                if (imageResponse.ok) {
                    alert("Book and image added successfully!");
                } else {
                    throw new Error("Failed to add book image");
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

    const bookurl = "http://localhost:5116/api/Book/get-all-books-with-images";
    
    const BooktableBdy = document.querySelector('tbody');

    try {

     
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
             <td>${book.title}</td>
             <td>${book.isbn}</td>
             <td>${book.publisher}</td>
             <td>${book.bookCopies}</td>
             <td>${book.genre}</td>
             <td><img src="${book.images}" alt="Book cover" style="width:50px; height:75px;"></td>
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
    const Email = document.getElementById('Email').value;
    const PhoneNumber = document.getElementById('phoneNumber').value;
    //const confirmPassword=document.getElementById("password").value;
    const Password = document.getElementById('confirmPassword').value; 

    // Validate required fields
    // if (Password !== confirmPassword) {
    //     alert("Passwords do not match");
    //     return;
    // }
    
    const membersData = {
        Nic,
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Password,
        JoinDate: new Date().toISOString().split('T')[0]
    };

    console.log(membersData); 

    const memnersurl = "http://localhost:5116/api/Member";

    try {
        const addmember = await fetch(memnersurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(membersData)
        });

        if (addmember.ok) {
            alert("Member registered successfully!");
            
            
        } else {
            const errorMessage = await addmember.text(); 
            console.error("Error response:", errorMessage);
            throw new Error(`Failed to register member: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error occurred:", error); 
        alert("An error occurred: " + error.message);
    }
});

// display members in tabl

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
              <td>${member. joinDate}</td>
            `
            MemTablebody.appendChild(row);
        })

    } catch (error) {
        console.error(error)
    }

};
//Fetch and populate the selected book's details into the form for editing




const Deletebook = async (index) => {
    const bookApi = "http://localhost:5116/api/Book";

    try {
       
        const response = await fetch(bookApi);
        const books = await response.json();
        
     
        const bookToDelete = books[index];
        console.log(bookToDelete);

        if (bookToDelete) {
            const deleteResponse = await fetch(`${bookApi}/${bookToDelete.isbn}`, {
                method: "DELETE"
            });

            if (deleteResponse.ok) {
                alert("Book deleted successfully");
                
                await displaybooks();
            } else {
                throw new Error("Can't Delelete book .Book already borrowed");
            }
        } else {
            alert("Book not found");
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book: " + error.message);
    }
};


const EditBookDetails = async (index) => {
    const bookApi = "http://localhost:5116/api/Book";
    
    try {
        
        const response = await fetch(bookApi);
        const books = await response.json();
        
        
        const bookToEdit = books[index];
        if (!bookToEdit) {
            alert("Book not found");
            return;
        }

        
        document.getElementById('bookName').value = bookToEdit.title;
        document.getElementById('isbn').value = bookToEdit.isbn;
        document.getElementById('publisher').value = bookToEdit.publisher;
        document.getElementById('copies').value = bookToEdit.bookCopies;
        document.getElementById('genre').value = bookToEdit.genre;

        
        document.getElementById('addBookForm').onsubmit = async (e) => {
            e.preventDefault();

            const updatedBookDetails = {
                Title: document.getElementById('bookName').value,
                Isbn: document.getElementById('isbn').value,
                Publisher: document.getElementById('publisher').value,
                BookCopies: document.getElementById('copies').value,
                Genre: document.getElementById('genre').value,
            };

            
            try {
                const updateResponse = await fetch(`${bookApi}/${bookToEdit.isbn}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedBookDetails)
                });

                if (updateResponse.ok) {
                    alert("Book updated successfully!");
                    await displaybooks(); 
                } else {
                    throw new Error("Failed to update book");
                }
            } catch (error) {
                console.error("Error updating book:", error);
                alert("Error updating book: " + error.message);
            }
        };
    } catch (error) {
        console.error("Error fetching book for edit:", error);
        alert("Error fetching book for edit: " + error.message);
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

