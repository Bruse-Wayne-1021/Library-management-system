document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    
    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Nic = document.getElementById('nic').value;
    const Email = document.getElementById('Email').value;
    const PhoneNumber = document.getElementById('phoneNumber').value;
    //const confirmPassword=document.getElementById("password").value;
    const Password = document.getElementById('confirmPassword').value; 

    // Validate required fields
    // if (Password !== confirmPassword) {
    //     alert("Passwords do not match");
    //     return;
    // }
    
    const membersData = {
        Nic,
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Password,
        JoinDate: new Date().toISOString().split('T')[0]
    };

    console.log(membersData); 

    const memnersurl = "http://localhost:5116/api/Member";

    try {
        const addmember = await fetch(memnersurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(membersData)
        });

        if (addmember.ok) {
            alert("Member registered successfully!");
            
            
        } else {
            const errorMessage = await addmember.text(); 
            console.error("Error response:", errorMessage);
            throw new Error(`Failed to register member: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error occurred:", error); 
        alert("An error occurred: " + error.message);
    }
});

// display members in table

let dispalyamembers = async () => {
    const memberurl = "http://localhost:5116/api/Member/get-all-members";
    const MemTablebody = document.getElementById('membertablebody');

    try {

        const memberdata = await fetch(memberurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })


        const members = await memberdata.json();
        console.log(members);

        MemTablebody.innerHTML = ""
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${member.id }</td>
              <td>${member. firstName}</td>
              <td>${member.lastName}</td>
              <td>${member. nic}</td>
              <td>${member.email}</td>
              <td>${member. phoneNumber}</td>
              <td>${member. joinDate}</td>
            `
            MemTablebody.appendChild(row);
        })

    } catch (error) {
        console.error(error)
    }

};
dispalyamembers();