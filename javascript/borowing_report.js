
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


const DisplayBookHistory=async()=>{
    try {
        const Historyapi="http://localhost:3000/Borrwedbookshistory";
        const Memberapi="http://localhost:3000/member";
        // const bookapi="http://localhost:3000/book";
        

        const HistoryTable=document.getElementById('tablebody');
        HistoryTable.innerHTML="";


        // fetch data from history api
        const HistoryResponse=await fetch(Historyapi);
        if(!HistoryResponse.ok){
            alert("some issue in while fetching data from history table")
        }
        const BookHistory=await HistoryResponse.json();

        // fetch data from  

        const MemberResponse=await fetch(Memberapi);

        if(!MemberResponse .ok){
            alert("some error in fetch data from member api")
        }
        const member=await MemberResponse.json();

        // fetch data from book api

        // const Bookresponse=await fetch(bookapi);
        // if(!Bookresponse.ok){
        //     alert("somme error in fetching data from api")
        // }

        // const books=await Bookresponse.json()


        BookHistory.forEach(BkHistory => {
            
            const memInfo=member.find(mem => mem.Nic===BkHistory.UserNicNumber)

            // const bookInfo=books.find(bkinfo=>)

            const row=document.createElement('tr')
            row.innerHTML=`
            <td>${BkHistory.UserNicNumber}</td>
            <td>${memInfo.FirstName}</td>
            <td>${memInfo.LastName}</td>
            <td>${BkHistory.Bookname}</td>
            <td>${BkHistory.BorrowedDate}</td>

            `
            HistoryTable.appendChild(row)
            
        });


    } catch (error) {
        alert("Some error in display books table :"+error)
    }


}
window.onload=DisplayBookHistory;