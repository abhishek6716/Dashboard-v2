console.log('App is running!')


const getLoginDetails = async (keyString) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let obj = {
        key: keyString
    }

    var raw = JSON.stringify(obj);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try{
        const response = await fetch("https://api-hfc.techchefz.com/icicihfc-micro-service/employee/login", requestOptions)
        if (response.status === 200) {
            const datum = await response.json()
            localStorage.setItem('token', datum.data.accessToken)
            console.log(window.location)
            window.location = window.location.href.split('/index.html')[0] + '/templates/views/table.html'
            console.log(window.location)
        } else {
            throw new Error('Unable to get experience')
        }
    } catch (e) {
        console.log('Invalid credentials!')
        alert('Invalid credentials!')
    }
    
}

const employeeID = document.getElementById('employeeID')
const password = document.getElementById('password')

const getInputObj = () => {
    const inputObj = {
        employeeId: employeeID.value,
        employeeDomain: "RMS",
        password: password.value
    }
    console.log(inputObj)
    getKey(inputObj)
}

const getKey = (obj) => {
    let encoded = btoa(JSON.stringify(obj))
    console.log(encoded)
    getLoginDetails(encoded)
}












