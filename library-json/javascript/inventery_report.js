document.addEventListener('DOMContentLoaded',async(e)=>{
    e.preventDefault();

    try {
        const bookapiurl="http://localhost:3000/book";

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
             <td>${book.BookName}</td>
             <td>${book.Isbn}</td>
             <td>${book.publisher}</td>
             <td>${book.genre}</td>
             <td>${book.copies}</td>
            
            `;
            ViewTable.appendChild(row)
            
        });
    } catch (error) {
        console.log(error);
        
    }
})