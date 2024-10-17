
// const DisplayBorrowingReport=async ()=>{
//     try {
//         const BorrowBookApiUrl="http://localhost:3000/borrowedBooks";
//         const BookapiUrl="http://localhost:3000/book";
//         const Table=document.getElementById("tablebody");

//         const BOrrowDataResponse=await fetch(BorrowBookApiUrl,{
//             method:"GET",
//             headers:{
//                 "Content-Type":"application/json"
//             }
//         })
//         if(!BOrrowDataResponse.ok){
//             console.log("can't fetch daa from url")
//         }
//         const borrowdata=await BOrrowDataResponse.json();
//         console.log(borrowdata);

//         const BookResponse=await fetch(BookapiUrl,{
//             method:"GET",
//             headers:{
//                 "Content-Type":"application/json"
//             }
//         })
//         if(!BookResponse.ok){
//             console.log("can't fetch daa from url")
//         }
//         const books=await BookResponse.json();
//         console.log(books);

//         Table.innerHTML="";
//         borrowdata.forEach(borrow => {
//             const BOokDetails=books.find(book =>book.BookName=== borrow.Bookname)

//             const row =document.createElement('tr');
//             row.innerHTML=`
//              <td>${borrow.UserNicNumber}</td
//             <td>${borrow.Bookname}</td>
//             <td><img src="${BOokDetails.coverUrl}" alt="${borrow.Bookname}" style="width: 100px; height: auto;"></td>
//             `;

//             Table.appendChild(row)
//         });


//     } catch (error) {
//         console.log(error)
//     }
// }

// window.onload=DisplayBorrowingReport;


const DisplayBookHistory = async () => {
    try {
        const Historyapi = "http://localhost:5116/api/Record";
        const Memberapi = "http://localhost:3000/member";
        // const bookapi="http://localhost:3000/book";

        const HistoryTable = document.getElementById('tablebody');
        HistoryTable.innerHTML = "";

   
        const HistoryResponse = await fetch(Historyapi);
        if (!HistoryResponse.ok) {
            alert("Some issue occurred while fetching data from history API");
            return; 
        }

        const BookHistory = await HistoryResponse.json();
        console.log(BookHistory);

        
        BookHistory.forEach(BkHistory => {
            // Make sure the fields exist in BkHistory object
            console.log("BkHistory object:", BkHistory);

            const row = document.createElement('tr');

          
            //  const borrowedDate = new Date(BkHistory.borrowedDate).toLocaleDateString();
            // const returnedDate = BkHistory.returnedDate ? new Date(BkHistory.returnedDate).toLocaleDateString() : 'N/A';

            row.innerHTML = `
                <td>${BkHistory.userNicNumber || 'N/A'}</td>
                <td>${BkHistory.userFirstName || 'N/A'}</td>
                <td>${BkHistory.userLastName || 'N/A'}</td>
                <td>${BkHistory.bookName || 'N/A'}</td>
                <td>${BkHistory.bookIsbn || 'N/A'}</td>
                <td>${BkHistory.borrowedDate}</td>
                <td>${BkHistory.returnedDate}</td>
            `;

            HistoryTable.appendChild(row);
        });

    } catch (error) {
        alert("Some error occurred while displaying the books table: " + error);
    }
};

window.onload = DisplayBookHistory;
