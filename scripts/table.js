const accessToken = localStorage.getItem('token');

if (!accessToken) {
    window.location =
        window.location.href.split('/templates/table.html')[0] + '/index.html';
}


let url = 'https://api-hfc.techchefz.com/icicihfc-micro-service'

const getExperience = async (experienceType) => {
    experienceType.toUpperCase()
    const response = await fetch(`${url}/rms/get/experience?experienceType=${experienceType}`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get experience')
    }
}

const getDepAndRole = async () => {
    const response = await fetch(`${url}/rms/get/departments/and/roles`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get DepAndRole')
    }
}

const getZones = async () => {
    const response = await fetch(`${url}/rms/get/job/location/zones`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get zones')
    }
}

const getBranches = async (selectedZone) => {
    const response = await fetch(`${url}/rms/get/job/location/branches/by/zone?zone=${selectedZone}`)

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('Unable to get branches')
    }
}

const overallExperience = document.getElementById('overallExperience');               // toggler
const relaventExperience = document.getElementById('relaventExperience');             // toggler
const department = document.getElementById('department');                             // toggler
const role = document.getElementById('role');                                         // toggler
const zone = document.getElementById('zone');                                         // toggler
const branch = document.getElementById('branch');                                     // toggler
const button = document.getElementById('button');                                     // button



let experienceOverallID = '',
    experienceRelavantID = '',
    departmentID = '',
    roleID = '',
    zoneID = '',
    jobLocationID = '';


////////////////////////////// OVERALL AND RELAVENT EXPERIENCE SETUP //////////////////////////


let overallExpData, relevantExpData;
const loadOverallExpData = async () => {
    const body = await getExperience('OVERALL');
    overallExpData = body.data;
    setOverallEl();
};
loadOverallExpData();

const loadRelevantExpData = async () => {
    const body = await getExperience('RELEVANT');
    relevantExpData = body.data;
    setReleventEl();
};
loadRelevantExpData();

function setOverallEl() {
    for (let i = 0; i < overallExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = overallExpData[i].value;
        OptEl.setAttribute('value', overallExpData[i].id);
        overallExperience.append(OptEl);
    }
}

function setReleventEl() {
    for (let i = 0; i < relevantExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = relevantExpData[i].value;
        OptEl.setAttribute('value', relevantExpData[i].id);
        relaventExperience.append(OptEl);
    }
}

overallExperience.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if(selectedValue === '0'){
        experienceOverallID = '';
    } else{
        experienceOverallID = selectedValue;
    }
});

relaventExperience.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        experienceRelavantID = '';
    } else {
        experienceRelavantID = selectedValue;
    }
});

/////////////////////////////////// DEPARTMENT AND ROLE SETUP /////////////////////////////////////

const clearRoles = () => {
    role.innerHTML = '<option value="0">Select</option>';
    roleID = ''
};


let departmentAndRoleData;
const loadDepAndRoleData = async () => {
    const body = await getDepAndRole();
    departmentAndRoleData = body.data;
    // console.log(body.data)
    setDepEl();
};
loadDepAndRoleData();

function setDepEl() {
    role.disabled = true;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = departmentAndRoleData[i].name;
        OptEl.setAttribute('value', departmentAndRoleData[i].id);
        department.append(OptEl);
    }
}

department.addEventListener('change', (e) => {
    clearRoles();
    const id = e.target.value;
    departmentID = id;
    if (departmentID != '0') {
        setRoleEl(id);
    } else {
        departmentID = '';
        role.disabled = true;
    }
});

function setRoleEl(selectedDep) {
    let rolesData;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        if (selectedDep === departmentAndRoleData[i].id) {
            rolesData = departmentAndRoleData[i].roles;
        }
    }
    for (let i = 0; i < rolesData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = rolesData[i].name;
        OptEl.setAttribute('value', rolesData[i].id);
        role.append(OptEl);
    }
    role.disabled = false;
    role.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if(selectedValue === '0'){
            roleID = '';
        } else{
            roleID = selectedValue;
        }
    });
}

///////////////////////////// ZONES AND BRANCHES SETUP /////////////////////////////////

const clearBranches = () => {
    branch.innerHTML = '<option value="0">Select</option>';
    jobLocationID = ''
};

let zoneData;
const loadZonesData = async () => {
    const body = await getZones();
    zoneData = body.data;
    setZonesEl();
};
loadZonesData();

function setZonesEl() {
    branch.disabled = true;
    for (let i = 0; i < zoneData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = zoneData[i];
        OptEl.setAttribute('value', zoneData[i]);
        zone.append(OptEl);
    }
}

let BranchesData;
const loadBranchesData = async (selectedZone) => {
    const body = await getBranches(selectedZone);
    BranchesData = body.data;
    setBranchesEl();
};

function setBranchesEl() {
    for (let i = 0; i < BranchesData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = BranchesData[i].branch;
        OptEl.setAttribute('value', BranchesData[i].id);
        branch.append(OptEl);
    }
    branch.disabled = false;
    branch.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if(selectedValue === '0'){
            jobLocationID = '';
        } else{
            jobLocationID = selectedValue
        }
    });
}

zone.addEventListener('change', (e) => {
    clearBranches();
    let selectedZone = e.target.value;
    zoneID = selectedZone;
    if (zoneID != '0') {
        loadBranchesData(selectedZone);
    } else {
        zoneID = ''
        branch.disabled = true;
    }
});



////////////////////////  table and pagination section  ///////////////////////////
const sortBy = document.getElementById('sortBy')



$(document).ready(function () {
    getCandidates(0, 10);
});

let sortByValue = '',
    isAscending = false,
    startDateValue = '',
    endDateValue = '',
    dateTypeValue = '',
    candidateTypeValue = '',
    candidateStatusValue = '',
    queryValue = '';

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
            `https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortByValue}&ascending=${isAscending}&startDate=${startDateValue}&endDate=${endDateValue}&dateFilterType=${dateTypeValue}&candidateType=${candidateTypeValue}&query=${queryValue}&experienceOverallId=${experienceOverallID}&zoneName=${zoneID}&experienceRelevantId=${experienceRelavantID}&roleId=${roleID}&jobLocationId=${jobLocationID}&candidateStatus=${candidateStatusValue}`,
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
            <td>{{lastStatusChangeDate}}</td>
            <td>{{updatedDate}}</td>
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
        callback: (data, pagination) => {
            console.log(pagination);
        },
    });
    $('#pagination').addHook('afterPageOnClick', (data, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
    $('#pagination').addHook('afterNextOnClick', (data, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
    $('#pagination').addHook('afterPreviousOnClick', (data, pageNumber) => {
        getCandidates(pageNumber - 1, pageSize);
    });
};


// const getSortByValue = (e) => {
//     let selectedValue = e.target.value
//     if(selectedValue == '0'){
//         sortByValue = '';
//     } else if(selectedValue =='1'){
//         sortByValue = 'CREATED';
//     } else if(selectedValue == '2'){
//         sortByValue = ''
//     }
// }


const getOrder = (e) => {
    let selectedValue = e.target.value;
    if(selectedValue === '0'){
        isAscending = false;
    } else if(selectedValue === '1'){
        isAscending = true;
    } else{
        isAscending = false;
    }
}


const getStartDate = (e) => {
    let inputValue = e.target.value;
    startDateValue = inputValue; 
}

const getEndDate = (e) => {
    let inputValue = e.target.value;
    endDateValue = inputValue;
}

const getDateType = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        dateTypeValue = '';
    } else if (selectedValue === '1') {
        dateTypeValue = 'CREATED_DATE'
    } else if (selectedValue === '2'){
        dateTypeValue = 'LAST_STATUS_CHANGE_DATE'
    } else if (selectedValue === '3'){
        dateTypeValue = 'LAST_UPDATED_DATE'
    } else{
        dateTypeValue = 'LAST_UPLOAD_DATE'
    }
}

const getCandidateType = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        candidateTypeValue = '';
    } else if (selectedValue === '1') {
        candidateTypeValue = 'SELF'
    } else if (selectedValue === '2') {
        candidateTypeValue = 'EMPLOYEE'
    } else if (selectedValue === '3') {
        candidateTypeValue = 'HR'
    } else if(selectedValue === '4'){
        candidateTypeValue = 'RECRUITMENT_AGENCY'
    } else {
        candidateTypeValue = 'ALL'
    }
}

const getCandidateStatus = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        candidateStatusValue = '';
    } else if (selectedValue === '1') {
        candidateStatusValue = 'CREATED'
    } else if (selectedValue === '2') {
        candidateStatusValue = 'SHORT_LISTED'
    } else if (selectedValue === '3') {
        candidateStatusValue = 'HOLD'
    } else if (selectedValue === '4'){
        candidateStatusValue = 'REJECTED'
    } else {
        candidateStatusValue = 'ALL'
    }
}

document.getElementById('button').addEventListener('click', (e) => {
    
})











