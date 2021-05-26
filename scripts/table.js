const accessToken = localStorage.getItem('token');

if (!accessToken) {
    window.location =
        window.location.href.split('/templates/views/table.html')[0] +
        '/index.html';
}

$(document).ready(function () {
    getCandidates(0, 10);
});

const getCandidates = async (pageNo, pageSize) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(
            `https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/?pageNo=${pageNo}&pageSize=${pageSize}`,
            requestOptions
        );

        if (response.status === 200) {
            const datum = await response.json();
            const candidatesData = datum.data;
            console.log(datum);
            repaginate(new Array(datum.totalElements), pageNo + 1, pageSize);
            insertTable(candidatesData, pageNo + 1, pageSize);
        } else {
            throw new Error('Unable to fetch data!');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const changePageSize = () => {
    const pageSize = $('#pageSize').val();
    getCandidates(0, pageSize);
};

const insertTable = (candidatesData, pageNo, pageSize) => {
    $('tbody').html('');
    let row = `<tr>
            <td>{{sno}}</td>
            <td>{{fullName}}</td>
            <td>{{role.name}}</td>
            <td>{{role.department.name}}</td>
            <td>{{jobLocation.branch}}</td>
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
        candidatesData[i].sno = (pageNo - 1) * pageSize + (i + 1);
        $('tbody').append(template(candidatesData[i]));
    }
};

const repaginate = (arr, pageNumber, pageSize) => {
    $('#pagination').pagination({
        dataSource: arr,
        pageSize,
        pageNumber,
        callback: (_, pagination) => {
            console.log(pagination);
        },
    });
    $('#pagination').addHook('afterPageOnClick', (_, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
    $('#pagination').addHook('afterNextOnClick', (_, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
    $('#pagination').addHook('afterPreviousOnClick', (_, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
};









