const accessToken = localStorage.getItem('token')

if (!accessToken) {
    window.location = window.location.href.split('/table.html')[0] + '../../index.html'
}


let candidatesData;
const getCandidates = async (pageNo, pageSize) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/?pageNo=${pageNo}&pageSize=${pageSize}`, requestOptions)

        if (response.status === 200) {
            const datum = await response.json()
            const fakeArr = new Array(datum.totalElements);
            candidatesData = datum.data
            console.log(candidatesData)
            repaginate(fakeArr, pageNo, pageSize)
        } else {
            throw new Error('Unable to fetch data!')
        }

    } catch (error) {
        console.log(error.message)

    }
}

let pageNo = 0;
let pageSize = 10;
const changePageSize = () => {
    pageSize = $('#pageSize').val()
    console.log(pageSize)
    getCandidates(pageNo, pageSize)
}

getCandidates(pageNo, pageSize)

const insertTable = (candidatesData, pageNo, pageSize) => {
    $("tbody").html("");
    let row = `<tr>
            <td>{{fullName}}</td>
            <td>{{role.name}}</td>
            <td>{{role.department.name}}</td>
            <td>{{jobLocation}}</td>
            <td>{{createdDate}}</td>
            <td>{{updatedDate}}</td>
            <td>{{lastUpdatedBy}}</td>
            <td>{{candidateStatus}}</td>
            <td>{{candidateId}}</td>
            <td>{{remarks}}</td>
            <td>{{lastUploadDate}}</td>
        </tr>`;

    let template = Handlebars.compile(row);
    for (let i = 0; i < candidatesData.length; i++) {
        $('tbody').append(template(candidatesData[i]))
    }
}



const repaginate = (fakeArr, pageNo, pageSize) => {
    $('#pagination').pagination({
        dataSource: fakeArr,
        pageSize,
        callback: function (data, pagination) {
            console.log(pagination)
            insertTable(candidatesData, pagination.pageNumber, pageSize)
        },
    });
}









