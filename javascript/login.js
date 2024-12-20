document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const Userrole = document.getElementById('role').value;
    const Nicnumber = document.getElementById('loginNic').value;
    const LgnPassword = document.getElementById('loginPassword').value;

    try {
        const apiurl = (Userrole === "admin")
        ? `http://localhost:5116/api/Admin/LOGIN?nic=${Nicnumber}&password=${LgnPassword}`
        : `http://localhost:5116/api/Member/login?nic=${Nicnumber}&password=${LgnPassword}`;

        const response = await fetch(apiurl);

        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const userdata = await response.json();
        console.log(userdata);



        

        
        if (userdata) {  
            
            const user = Array.isArray(userdata) ? userdata[0] : userdata;
            
            console.log(user); 
        
            if (user) {
                const userdataToStore = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    nic: user.nic,
                    joinDate: user.joinDate,
                    id: user.id,
                    userRole: user.userRole,
                    phoneNumber:user.phoneNumber,
                    password:user.password,
                    email:user.email
                      
                };
        
                localStorage.setItem('logedInUser', JSON.stringify(userdataToStore));
        
                alert("Login success");
        
                if (Userrole === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "gallery.html";
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
