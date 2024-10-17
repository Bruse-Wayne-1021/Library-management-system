document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const Userrole = document.getElementById('role').value;
    const Nicnumber = document.getElementById('loginNic').value;
    const LgnPassword = document.getElementById('loginPassword').value;

    const Admin=await fetch('http://localhost:5116/api/Admin');
    const Adminresponse=await Admin.json();
    console.log(Adminresponse);

    const response=await fetch('http://localhost:5116/api/Member/get-all-members');
    const member=await response.json();
    console.log(member);

    try {
        const apiurl = (Userrole === "admin")
            ? `http://localhost:5116/api/Admin?nic=${Nicnumber}&password=${LgnPassword}`
            : `http://localhost:5116/api/Member/get-all-members?nic=${Nicnumber}&password=${LgnPassword}`;

        const response = await fetch(apiurl);

        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const userdata = await response.json();


        
        if (userdata && userdata.length > 0) {  
            const user = userdata[0];
            console.log(user);
            

            if (user) {
                const userdataToStore = {
                    FirstName: user.firstName,
                    LastName: user.lastName,
                    Nic: user.nic,
                    joinDate: user.joinDate,
                    id: user.id,
                    userRole: user.userRole
                };

                
                localStorage.setItem('logedInUser', JSON.stringify(userdataToStore));

                alert("Login success");

            
                if (Userrole === "admin") {
                    window.location.href = "admin.html";
                } else {
                   // window.location.href = "gallery.html";
                }
            } else {
                alert("Failed to store login data");
            }
        } else {
            alert("Invalid user data, please try again later");
        }

    } catch (error) {
        console.log("Error during login:", error);
        alert("Some issues occurred during login, please try again later.");
    }
});
