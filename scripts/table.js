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



let experienceOverallID = 'selectExpOveID',
    experienceRelavantID = 'selectExpRelID',
    departmentID = 'selectDep',
    roleID = 'selectRole',
    zoneID = 'selectZone',
    jobLocationID = 'selectBranch';


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
    experienceOverallID = e.target.value;
});

relaventExperience.addEventListener('change', (e) => {
    experienceRelavantID = e.target.value;
});

/////////////////////////////////// DEPARTMENT AND ROLE SETUP /////////////////////////////////////

const clearRoles = () => {
    role.innerHTML = '<option value="selectRole">Select</option>';
    roleID = 'selectRole'
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
    if (departmentID != 'selectDep') {
        setRoleEl(id);
    } else {
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
        roleID = e.target.value;
    });
}

///////////////////////////// ZONES AND BRANCHES SETUP /////////////////////////////////

const clearBranches = () => {
    branch.innerHTML = '<option value="selectBranch">Select</option>';
    jobLocationID = 'selectBranch'
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
        jobLocationID = e.target.value;
    });
}

zone.addEventListener('change', (e) => {
    clearBranches();
    let selectedZone = e.target.value;
    zoneID = selectedZone;
    if (zoneID != 'selectZone') {
        loadBranchesData(selectedZone);
    } else {
        branch.disabled = true;
    }
});



////////////////////////  table and pagination section  ///////////////////////////

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












