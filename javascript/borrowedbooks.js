document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    try {
       
        let LoggedInUser = JSON.parse(localStorage.getItem('logedInUser'));

        let BorrowedBooksApiUrl = "http://localhost:5116/api/BorrowedBook";
        let bookApiurl = "http://localhost:5116/api/Book/get-all-books-with-images";
      
     
        const BookResponse = await fetch(BorrowedBooksApiUrl)
         
        // console.log(booksResponse);

        if (!BookResponse.ok) {
            alert("Can't fetch borrowed books data");
            return;
        }

        const BorrowedBooks = await BookResponse.json();
        console.log(BorrowedBooks);
        
        
        const booksResponse = await fetch(bookApiurl)
           

        if (!booksResponse.ok) {
            alert("Can't fetch books details");
            return;
        }

        const books = await booksResponse.json();
        console.log(books);

        
        const tableView = document.getElementById('borrowedBooksTable');

        BorrowedBooks.filter(b => b.UserNicNumber === LoggedInUser.Nic)
        .forEach(borrowedBook => {
         
            const bookData = books.find(book => book.bookName === borrowedBook.bookName);

            if (bookData) {
                
                const BorrowedDate = new Date();
                const dueDate = new Date(BorrowedDate);
                dueDate.setDate(BorrowedDate.getDate() + 7)
                const formattedBorrowedDate = BorrowedDate.toLocaleDateString();
                const formattedDueDate = dueDate.toLocaleDateString();

                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${borrowedBook.Bookname}</td>
                    <td>${bookData.Isbn}</td>
                    <td>${bookData.publisher}</td>
                    <td>${formattedBorrowedDate}</td>
                    <td>${formattedDueDate}</td>
                `;
                tableView.appendChild(row);
            }

                  const bookcard=document.getElementById('borrowedBooksCards');
           
                let card=document.createElement('div');
                card.className="card"
                card.innerHTML=`
                 <img src="${bookData.coverUrl}" alt="${borrowedBook.BookName}">
                <h3>${borrowedBook.Bookname}</h3>
                <p>ISBN: ${bookData.Isbn}</p>
                <p>Publisher: ${bookData.publisher}</p>
             
                `
                bookcard.appendChild(card);
            

        })

    } catch (error) {
        console.log(`Error: ${error}`);
    }


});
