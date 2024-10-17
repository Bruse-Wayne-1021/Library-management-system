document.addEventListener('DOMContentLoaded',async(e)=>{
    e.preventDefault();

    try {
        const bookapiurl="http://localhost:5116/api/Book/Get-all-books";

        const Response=await fetch(bookapiurl,{
            method:"GET",
            headers:{
                "Content-Type":"aplication/json"
            }
        })
        const books=await Response.json();
        console.log(books);
        

        const ViewTable=document.getElementById('tablebody');
        ViewTable.innerHTML="";

        books.forEach(book => {
            let row =document.createElement('tr');
            row.innerHTML=`
             <td>${book.title}</td>
             <td>${book.isbn}</td>
             <td>${book.publisher}</td>
             <td>${book.genre}</td>
             <td>${book.bookCopies}</td>
            
            `;
            ViewTable.appendChild(row)
            
        });
    } catch (error) {
        console.log(error);
        
    }
})