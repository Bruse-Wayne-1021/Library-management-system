document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const Userrole = document.getElementById('role').value;
    const Nicnumber = document.getElementById('loginNic').value;
    const LgnPassword = document.getElementById('loginPassword').value;

    try {
        const apiurl = (Userrole === "admin")
            ? `http://localhost:3000/admin?Nic=${Nicnumber}&Password=${LgnPassword}`
            : `http://localhost:3000/member?Nic=${Nicnumber}&Password=${LgnPassword}`

        const response = await fetch(apiurl);
        const userdata = await response.json();


        // const getdata = await fetch(apiurl, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });

        // const logindata = await getdata.json();

        if (userdata.length > 0) {

            const user = userdata[0];

            // const memberData= user.member;
            // console.log(memberData);
            // console.log(user);
            // store current login user daa
            if (user) {
                try {
                    // const logedinUserapi = "http://localhost:3000/logedInUser";

                    // const response = await fetch(logedinUserapi, {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-type": "application/json"
                    //     },
                    //     body: JSON.stringify(user)

                    // })
                    const userdata={
                        FirstName:user.FirstName,
                        LastName:user.LastName,
                        Nic:user.Nic,
                        joinDate:user.joinDate,
                        id:user.id,
                        userRole: user.userRole
                    }



                    // let loginuser=JSON.parse(localStorage.getItem('logedInUser'))||[];
                    // loginuser.push(userdata);
                    localStorage.setItem('logedInUser',JSON.stringify(userdata));
                    
                   

                   
                } catch (error) {
                    console.log("some issuess in store data to logeinuser" + error)
                    // alert("some issuess in store data to logeduser" + error)
                }
            } else {
                alert("loged in data dose not store")
            }

            alert("login success")


            if (Userrole === "admin") {
                window.location.href = "admin.html";

            } else {
                window.location.href = "gallery.html"
            }
        } else {
            alert("invalid user data , please try again later")
        }

    } catch (error) {
        console.log(error);
        alert("some issues in login ,please try again later ");

    }

})