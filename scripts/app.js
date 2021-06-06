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
        const response = await fetch("https://api-hfc.techchefz.com/icicihfc-micro-service/employee/login/ad", requestOptions)
        if (response.status === 200) {
            const datum = await response.json()
            localStorage.setItem('token', datum.data.accessToken)
            localStorage.setItem('loginUserName', datum.data.firstName + ' ' + datum.data.lastName)
            localStorage.setItem('lastLoginDate', datum.data.lastLoginDate)
            console.log(window.location)
            window.location = window.location.href.split('/index.html')[0] + '/templates/table.html'
            console.log(window.location)
        } else {
            throw new Error('employeeID or password is wrong')
        }
    } catch (e) {
        alert('employeeID or password is wrong')
    }
    
}

const employeeID = document.getElementById('employeeID')
const password = document.getElementById('password')

const getInputObj = () => {
    if (employeeID.value === ' ' || employeeID.value === '' || password.value === ' ' || password.value === ''){
        if (employeeID.value === ' ' || employeeID.value === ''){
            employeeID.classList.add('is-invalid')
        } else{
            employeeID.classList.remove('is-invalid')
        }

        if (password.value === ' ' || password.value === ''){
            password.classList.add('is-invalid')
        } else{
            password.classList.remove('is-invalid')
        }
    } else{
        const inputObj = {
            employeeId: employeeID.value,
            employeeDomain: "RMS",
            password: password.value
        }
        console.log(inputObj)
        getKey(inputObj)
    }
}

const getKey = (obj) => {
    let encoded = btoa(JSON.stringify(obj))
    console.log(encoded)
    getLoginDetails(encoded)
}












