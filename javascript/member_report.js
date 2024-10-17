document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    try {
        const borrowedBooksApi = "http://localhost:5116/api/BorrowedBook";
        const memberApi = "http://localhost:3000/member";
        const books = "http://localhost:3000/book";
        const TableView=document.querySelector('tbody');

        TableView.innerHTML="";

        // fetch dat from borrowed books url
        const Response = await fetch(borrowedBooksApi, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const BorroedBooks = await Response.json();
        console.log(BorroedBooks);
        
        

        const Response2 = await fetch(memberApi, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const Members = await Response2.json();
        console.log(Members);
        

        // fetch daa from Boooks url

        const bookResonse = await fetch(books);
        const Books = await bookResonse.json();

        console.log(Books);

        Members.forEach(member => {
             // Get borrowed books for the member
            const BorrowedForMembers=BorroedBooks.filter(b=>b.UserNicNumber===member.Nic);
           
            
            BorrowedForMembers.forEach(borrow=>{
                 // find appropirate member
                 const bookDetails=Books.find(book=>book.BookName===borrow.Bookname);
                
                 console.log(bookDetails);
                 console.log(BorrowedForMembers);

                 let row=document.createElement('tr');
                 row.innerHTML=`
                <td>${member.FirstName}</td>
                <td>${member.Nic}</td>
                <td>${bookDetails.BookName}</td>
                <td><img src="${bookDetails.coverUrl}" alt="${borrow.bookName}" style="width: 100px; height: auto;"></td>
                 `;

                 TableView.appendChild(row);
            })
        });
      
        
    } catch (error) {
        console.log(error);

    }

})