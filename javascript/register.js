
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const MemberApi = "http://localhost:3000/member";
    const adminApi = "http://localhost:3000/admin";



    const userRole = document.getElementById('role').value;
    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Nic = document.getElementById('nic').value;
    const Password = document.getElementById('password').value;
    const ConfirmPAssword = document.getElementById('confirmPassword').value;

    const Users = {
        userRole,
        FirstName,
        LastName,
        Nic,
        Password,
        joinDate: new Date().toLocaleDateString()
    }

    if (ConfirmPAssword !== Password) {
        alert("password Does not matching")
        return;
    }

    
    try {
        const apiEndpt = (userRole === "admin") ? adminApi : MemberApi;

       const Response= await fetch(apiEndpt, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Users)


        });
        alert("Registeration sucess");
       
        document.getElementById('registerForm').reset();
        if(Response.ok){
            window.location.href="login.html"
        }

    } catch (error) {
        console.log("Some errorin Regestration : " + error)
    }
});





