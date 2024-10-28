document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    try {
        const borrowedBooksApi = "http://localhost:5116/api/BorrowedBook";
        const memberApi = "http://localhost:5116/api/Member/get-all-members";
        const books = "http://localhost:5116/api/Book/get-all-books-with-images";
        const TableView=document.querySelector('tbody');

        TableView.innerHTML="";

       
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
        

    

        const bookResonse = await fetch(books);
        const Books = await bookResonse.json();

        console.log(Books);

        Members.forEach(member => {
           
            const BorrowedForMembers=BorroedBooks.filter(b=>b.userNicNumber===member.nic);
            console.log(BorrowedForMembers);
           
            
            BorrowedForMembers.forEach(borrow=>{
             
                 const bookDetails=Books.find(book=>book.title===borrow.bookname);
                
                 console.log(bookDetails);
                 console.log(BorrowedForMembers);

                 let row=document.createElement('tr');
                 row.innerHTML=`
                <td>${member.firstName}</td>
                <td>${member.nic}</td>
                <td>${bookDetails.title}</td>
                <td><img src="${bookDetails.images}" alt="${borrow.bookName}" style="width: 100px; height: auto;"></td>
                 `;

                 TableView.appendChild(row);


                 
            })
        });
      
        
    } catch (error) {
        console.log(error);

    }

})