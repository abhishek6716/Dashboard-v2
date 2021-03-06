const accessToken = localStorage.getItem('token');

if (!accessToken) {
    window.location = window.location.href.split('/templates/table.html')[0] + '/index.html';
}

const redirectPage = () => {
    window.location = window.location.href.split('/templates/table.html')[0] + '/index.html';
}

const userName = localStorage.getItem('loginUserName');
if (!userName) {
    userName = 'user name not fetched';
}
const lastLoginDate = localStorage.getItem('lastLoginDate');
if (!lastLoginDate) {
    lastLoginDate = 'last login date not fetched';
}

const userNameEl = document.getElementById('userName');
const userIdEl = document.getElementById('userID');

userNameEl.textContent = userName;
userIdEl.textContent = lastLoginDate;

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

/////////////////////////////////   load form data ////////////////////////////////

let overallExpData, relevantExpData;
const loadOverallExpData = async () => {
    const body = await getExperience('OVERALL');
    overallExpData = body.data;
    setOverallElFilter();
    setOverallElCreate();
};
loadOverallExpData();


const loadRelevantExpData = async () => {
    const body = await getExperience('RELEVANT');
    relevantExpData = body.data;
    setRelevantElFilter();
    setRelevantElCreate();
};
loadRelevantExpData();


let departmentAndRoleData;
const loadDepAndRoleData = async () => {
    const body = await getDepAndRole();
    departmentAndRoleData = body.data;
    setDepElFilter();
    setDepElCreate();
    // setDepElUpdate();
};
loadDepAndRoleData();


let zoneData;
const loadZonesData = async () => {
    const body = await getZones();
    zoneData = body.data;
    setZonesElFilter();
    setZonesElCreate();
    // setZonesElUpdate();
};
loadZonesData();

/////////////////////////////////// filters table and pagination ////////////////////////
$(document).ready(function () {
    getCandidates(0, 10);
});


const overallExpFilterNode = document.getElementById('overallExpFilter')
const relaventExpFilterNode = document.getElementById('relaventExpFilter')
const departmentFilterNode = document.getElementById('departmentFilter')
const roleFilterNode = document.getElementById('roleFilter')
const zoneFilterNode = document.getElementById('zoneFilter')
const branchFilterNode = document.getElementById('branchFilter')
const filterBtn = document.getElementById('filterBtn')

const clearRolesFilter = () => {
    roleFilterNode.innerHTML = '<option value="0">Select</option>';
    roleIDFilterVal = ''
};

const clearBranchesFilter = () => {
    branchFilterNode.innerHTML = '<option value="0">Select</option>';
    jobLocationIDFilterVal = ''
};

let sortByFilterVal = '',
    isAscendingFilterVal = false,
    startDateFilterVal = '',
    endDateFilterVal = '',
    dateTypeFilterVal = '',
    candidateTypeFilterVal = '',
    candidateStatusFilterVal = '',
    queryFilterVal = '',
    expOverallIDFilterVal = '',
    expRelavantIDFilterVal = '',
    departmentIDFilterVal = '',
    roleIDFilterVal = '',
    zoneIDFilterVal = '',
    jobLocationIDFilterVal = '';



function setOverallElFilter() {
    for (let i = 0; i < overallExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = overallExpData[i].value;
        OptEl.setAttribute('value', overallExpData[i].id);
        overallExpFilterNode.append(OptEl);
    }
}

function setRelevantElFilter() {
    for (let i = 0; i < relevantExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = relevantExpData[i].value;
        OptEl.setAttribute('value', relevantExpData[i].id);
        relaventExpFilterNode.append(OptEl);
    }
}

function setDepElFilter() {
    roleFilterNode.disabled = true;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = departmentAndRoleData[i].name;
        OptEl.setAttribute('value', departmentAndRoleData[i].id);
        departmentFilterNode.append(OptEl);
    }
}

function setRoleElFilter(selectedDep) {
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
        roleFilterNode.append(OptEl);
    }
    roleFilterNode.disabled = false;
    roleFilterNode.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if (selectedValue === '0') {
            roleIDFilterVal = '';
        } else {
            roleIDFilterVal = selectedValue;
        }
    });
}


function setZonesElFilter() {
    branchFilterNode.disabled = true;
    for (let i = 0; i < zoneData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = zoneData[i];
        OptEl.setAttribute('value', zoneData[i]);
        zoneFilterNode.append(OptEl);
    }
}

function setBranchesElFilter() {
    for (let i = 0; i < BranchesDataFilter.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = BranchesDataFilter[i].branch;
        OptEl.setAttribute('value', BranchesDataFilter[i].id);
        branchFilterNode.append(OptEl);
    }
    branchFilterNode.disabled = false;
    branchFilterNode.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if (selectedValue === '0') {
            jobLocationIDFilterVal = '';
        } else {
            jobLocationIDFilterVal = selectedValue
        }
    });
}

let BranchesDataFilter;
const loadBranchesDataFilter = async (selectedZone) => {
    const body = await getBranches(selectedZone);
    BranchesDataFilter = body.data;
    setBranchesElFilter();
};




//// filter selection ////

const getSortByValue = (e) => {
    let selectedValue = e.target.value
    if (selectedValue == '0') {
        sortByFilterVal = '';
    } else if (selectedValue == '1') {
        sortByFilterVal = 'CREATED_DATE';
    } else if (selectedValue == '2') {
        sortByFilterVal = 'UPDATED_DATE'
    } else if (selectedValue == '3') {
        sortByFilterVal = 'AMOUNT'
    } else {
        sortByFilterVal = 'PAYMENT_DATE'
    }
}


const getOrder = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        isAscendingFilterVal = false;
    } else if (selectedValue === '1') {
        isAscendingFilterVal = true;
    } else {
        isAscendingFilterVal = false;
    }
}

const getStartDate = (e) => {
    let inputValue = e.target.value;
    startDateFilterVal = inputValue;
    setPicker2StartDate(inputValue)
}

const getEndDate = (e) => {
    let inputValue = e.target.value;
    endDateFilterVal = inputValue;
}

const setPicker2StartDate = (newStartDate) => {
    $(".datepicker2").datepicker('setStartDate', newStartDate)
}

const getDateType = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        dateTypeFilterVal = '';
    } else if (selectedValue === '1') {
        dateTypeFilterVal = 'CREATED_DATE'
    } else if (selectedValue === '2') {
        dateTypeFilterVal = 'LAST_STATUS_CHANGE_DATE'
    } else if (selectedValue === '3') {
        dateTypeFilterVal = 'LAST_UPDATED_DATE'
    } else {
        dateTypeFilterVal = 'LAST_UPLOAD_DATE'
    }
}

const getCandidateType = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        candidateTypeFilterVal = '';
    } else if (selectedValue === '1') {
        candidateTypeFilterVal = 'SELF'
    } else if (selectedValue === '2') {
        candidateTypeFilterVal = 'EMPLOYEE'
    } else if (selectedValue === '3') {
        candidateTypeFilterVal = 'HR'
    } else if (selectedValue === '4') {
        candidateTypeFilterVal = 'RECRUITMENT_AGENCY'
    } else {
        candidateTypeFilterVal = 'ALL'
    }
}

const getCandidateStatus = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        candidateStatusFilterVal = '';
    } else if (selectedValue === '1') {
        candidateStatusFilterVal = 'CREATED'
    } else if (selectedValue === '2') {
        candidateStatusFilterVal = 'SHORT_LISTED'
    } else if (selectedValue === '3') {
        candidateStatusFilterVal = 'HOLD'
    } else if (selectedValue === '4') {
        candidateStatusFilterVal = 'REJECTED'
    } else {
        candidateStatusFilterVal = 'ALL'
    }
}

overallExpFilterNode.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        expOverallIDFilterVal = '';
    } else {
        expOverallIDFilterVal = selectedValue;
    }
});

relaventExpFilterNode.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        expRelavantIDFilterVal = '';
    } else {
        expRelavantIDFilterVal = selectedValue;
    }
});

departmentFilterNode.addEventListener('change', (e) => {
    clearRolesFilter();
    const id = e.target.value;
    departmentIDFilterVal = id;
    if (departmentIDFilterVal != '0') {
        setRoleElFilter(id);
    } else {
        departmentIDFilterVal = '';
        roleFilterNode.disabled = true;
    }
});

zoneFilterNode.addEventListener('change', (e) => {
    clearBranchesFilter();
    let selectedZone = e.target.value;
    zoneIDFilterVal = selectedZone;
    if (zoneIDFilterVal != '0') {
        loadBranchesDataFilter(selectedZone);
    } else {
        zoneIDFilterVal = ''
        branchFilterNode.disabled = true;
    }
});

filterBtn.addEventListener('click', (e) => {
    if ((!startDateFilterVal && endDateFilterVal) || (startDateFilterVal && !endDateFilterVal)) {
        if (!startDateFilterVal) {
            $(".datepicker1").focus()
            alert('select start date value!')
        }
        if (!endDateFilterVal) {
            $(".datepicker2").focus()
            alert('select end date value!')
        }
    } else if (startDateFilterVal > endDateFilterVal) {
        alert('starting date not be greater then ending date')
    } else {
        const pageSize = $('#pageSize').val();
        getCandidates(0, pageSize);
    }
})

//////////////// searching //////////////
const getString = (e) => {
    queryValue = '';
    let inputStr = e.target.value;
    if (inputStr.length > 3 || (inputStr === '')) {
        queryFilterVal = inputStr;
        const pageSize = $('#pageSize').val();
        getCandidates(0, pageSize);
    }
}

const getCandidates = async (pageNo, pageSize) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(`https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortByFilterVal}&ascending=${isAscendingFilterVal}&startDate=${startDateFilterVal}&endDate=${endDateFilterVal}&dateFilterType=${dateTypeFilterVal}&candidateType=${candidateTypeFilterVal}&query=${queryFilterVal}&experienceOverallId=${expOverallIDFilterVal}&zoneName=${zoneIDFilterVal}&experienceRelevantId=${expRelavantIDFilterVal}&roleId=${roleIDFilterVal}&jobLocationId=${jobLocationIDFilterVal}&candidateStatus=${candidateStatusFilterVal}`, requestOptions);
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

Handlebars.registerHelper("IsPresent", (remarks) => {
    if (remarks) {
        return remarks;
    } else {
        return '- -'
    }
});

Handlebars.registerHelper('isRA', function (candidateType, options) {
    let fnTrue = options.fn
    if (candidateType === 'RECRUITMENT_AGENCY') {
        console.log(this)
        return fnTrue(this);
    }
})

Handlebars.registerHelper("type1Val1", function (agencyId){
    if (agencyId) {
        return agencyId;
    } else {
        return '- -';
    }
})

Handlebars.registerHelper('isEM', function (candidateType, options) {
    let fnTrue = options.fn
    if (candidateType === 'EMPLOYEE') {
        console.log(this)
        return fnTrue(this);
    }
})

Handlebars.registerHelper("type2Val1", function (employeeId) {
    if (employeeId) {
        return employeeId;
    } else {
        return '- -';
    }
})

Handlebars.registerHelper("type2Val2", function (employeeName) {
    if (employeeName) {
        return employeeName;
    } else {
        return '- -';
    }
})

Handlebars.registerHelper("type2Val3", function (employeeEmailId) {
    if (employeeEmailId) {
        return employeeEmailId;
    } else {
        return '- -';
    }
})

const insertTable = (candidatesData, pageNo, pageSize) => {
    $('#mainDataTable').html('');
    let rowTemplate = $('#dataRow').html()
    let template = Handlebars.compile(rowTemplate);
    console.log(candidatesData);
    for (let i = 0; i < candidatesData.length; i++) {
        candidatesData[i].sno = (pageNo - 1) * pageSize + (i + 1);
        $('#mainDataTable').append(template(candidatesData[i]));
        $(function () {
            $("[rel='tooltip']").tooltip();
        });
    }
};

const repaginate = (arr, pageNumber, pageSize) => {
    $('#pagination').pagination({
        dataSource: arr,
        pageSize,
        pageNumber,
        callback: (data, pagination) => {
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

//////////// reset filters //////////////
const resetFilters = () => {
    expOverallIDFilterVal = ''
    expRelavantIDFilterVal = ''
    departmentIDFilterVal = ''
    roleIDFilterVal = ''
    zoneIDFilterVal = ''
    jobLocationIDFilterVal = ''
    sortByFilterVal = ''
    isAscendingFilterVal = false
    startDateFilterVal = ''
    endDateFilterVal = ''
    dateTypeFilterVal = ''
    candidateTypeFilterVal = ''
    candidateStatusFilterVal = ''
    queryFilterVal = ''
    $('.datepicker1').val("")
    $('.datepicker2').val("")
    getCandidates(0, 10);
}

////// Date validation ////////
const date = new Date();
const endDate = date;
const datePicker1 = (endDate) => {
    $('.datepicker1').datepicker({
        endDate: endDate,
        autoclose: true,
        clearBtn: true,
    });
}

const datePicker2 = (endDate) => {
    $('.datepicker2').datepicker({
        endDate: endDate,
        autoclose: true,
        clearBtn: true,
    });
}

datePicker1(endDate);
datePicker2(endDate);

// let date = new Date(); 
// date.setDate(date.getDate());
// $('.datepicker1').datepicker({
//     endDate: date,
//     autoclose: true,
//     clearBtn: true,
// });

// $('.datepicker2').datepicker({
//     endDate: date,
//     autoclose: true,
//     clearBtn: true,
// });

////////////////////////////////  End of filter section /////////////////////

const resetLabel = (e) => {
    $('#exampleModalLabel2').text('Create');
    $('#attachFileLabel').text('Select File');
}

const FullNameCreateNode = document.getElementById('fullNameCreate');                             // input box
const EmailCreateNode = document.getElementById('emailCreate');                                   // input box
const MobileNoCreateNode = document.getElementById('mobileNoCreate');                             // input box
const overallExpCreateNode = document.getElementById('overallExpCreate');                         // toggler
const relaventExpCreateNode = document.getElementById('relaventExpCreate');                       // toggler
const departmentCreateNode = document.getElementById('departmentCreate');                         // toggler
const roleCreateNode = document.getElementById('roleCreate');                                     // toggler
const zoneCreateNode = document.getElementById('zoneCreate');                                     // toggler
const branchCreateNode = document.getElementById('branchCreate');                                 // toggler
const attachFile = document.getElementById('attachFileCreate');                                   // file
const submitBtn = document.getElementById('submitBtnCreate');                                     // button



let fullNameCreate = '',
    emailIDCreate = '',
    mobileNoCreate = '',
    overallExpIDCreateVal = '',
    relavantExpIDCreateVal = '',
    departmentIDCreateVal = '',
    roleIDCreateVal = '',
    zoneIDCreateVal = '',
    jobLocationIDCreateVal = '',
    resumeIDCreateVal = '',
    resumeNameCreateVal = '',
    resumeNonceCreateVal = '';

let IsFullNameValidCreate = false,
    IsEmailValidCreate = false,
    IsMobileNoValidCreate = false;

FullNameCreateNode.addEventListener('blur', () => {
    const regex = /[a-zA-Z]/;
    const str = FullNameCreateNode.value;
    if (regex.test(str)) {
        fullNameCreate = str;
        IsFullNameValidCreate = true
        FullNameCreateNode.classList.remove('is-invalid')
    } else {
        FullNameCreateNode.classList.add('is-invalid')
        IsFullNameValidCreate = false
    }
});

FullNameCreateNode.addEventListener('input', () => {
    FullNameCreateNode.classList.remove('is-invalid');
})


EmailCreateNode.addEventListener('blur', () => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const str = EmailCreateNode.value;
    if (regex.test(str)) {
        emailIDCreate = str;
        IsEmailValidCreate = true
        EmailCreateNode.classList.remove('is-invalid')
    } else {
        EmailCreateNode.classList.add('is-invalid')
        IsEmailValidCreate = false
    }
});

EmailCreateNode.addEventListener('input', () => {
    EmailCreateNode.classList.remove('is-invalid');
})

MobileNoCreateNode.addEventListener('blur', () => {
    const regex = /^[6-9]\d{9}$/;
    const str = MobileNoCreateNode.value;
    if (regex.test(str)) {
        mobileNoCreate = str;
        IsMobileNoValidCreate = true
        MobileNoCreateNode.classList.remove('is-invalid')
    } else {
        IsMobileNoValidCreate = false
        MobileNoCreateNode.classList.add('is-invalid')
    }
});

MobileNoCreateNode.addEventListener('input', () => {
    MobileNoCreateNode.classList.remove('is-invalid');
})


//////////////////////////// OVERALL AND RELAVENT EXPERIENCE SETUP //////////////////////////


function setOverallElCreate() {
    for (let i = 0; i < overallExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = overallExpData[i].value;
        OptEl.setAttribute('value', overallExpData[i].id);
        overallExpCreateNode.append(OptEl);
        $('#overallExpCreate').append(OptEl);
    }
}

function setRelevantElCreate() {
    for (let i = 0; i < relevantExpData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = relevantExpData[i].value;
        OptEl.setAttribute('value', relevantExpData[i].id);
        relaventExpCreateNode.append(OptEl);
        $('#relaventExpCreate').append(OptEl);
    }
}

overallExpCreateNode.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        overallExpIDCreateVal = '';
    } else {
        overallExpIDCreateVal = selectedValue;
    }
});


relaventExpCreateNode.addEventListener('change', (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        relavantExpIDCreateVal = '';
    } else {
        relavantExpIDCreateVal = selectedValue;
    }
});

///////////////////////////////// DEPARTMENT AND ROLE SETUP /////////////////////////////////////

const clearRolesCreate = () => {
    roleCreateNode.innerHTML = '<option value="0">Select</option>';
    roleIDCreateVal = ''
};

function setDepElCreate() {
    roleCreateNode.disabled = true;
    for (let i = 0; i < departmentAndRoleData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = departmentAndRoleData[i].name;
        OptEl.setAttribute('value', departmentAndRoleData[i].id);
        departmentCreateNode.append(OptEl);
    }
}

departmentCreateNode.addEventListener('change', (e) => {
    clearRolesCreate();
    const id = e.target.value;
    departmentIDCreateVal = id;
    if (departmentIDCreateVal != '0') {
        setRoleElCreate(id);
    } else {
        departmentIDCreateVal = '';
        roleCreateNode.disabled = true;
    }
});

function setRoleElCreate(selectedDep) {
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
        roleCreateNode.append(OptEl);
    }
    roleCreateNode.disabled = false;
    if (rolesData.length == 1) {
        roleCreateNode.options[1].selected = 'selected';
        roleIDCreateVal = roleCreateNode.value;
    }
    roleCreateNode.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if (selectedValue === '0') {
            roleIDCreateVal = '';
        } else {
            roleIDCreateVal = selectedValue;
        }
    });
}

///////////////////////////// ZONES AND BRANCHES SETUP /////////////////////////////////

const clearBranchesCreate = () => {
    branchCreateNode.innerHTML = '<option value="0">Select</option>';
    jobLocationIDCreateVal = ''
};


function setZonesElCreate() {
    branchCreateNode.disabled = true;
    for (let i = 0; i < zoneData.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = zoneData[i];
        OptEl.setAttribute('value', zoneData[i]);
        zoneCreateNode.append(OptEl);
    }
}

// let BranchesDataCreate;
const loadBranchesDataCreate = async (selectedZone) => {
    const body = await getBranches(selectedZone);
    BranchesDataCreate = body.data;
    setBranchesElCreate(BranchesDataCreate);
};

function setBranchesElCreate(BranchesDataCreate) {
    clearBranchesCreate();
    for (let i = 0; i < BranchesDataCreate.length; i++) {
        const OptEl = document.createElement('option');
        OptEl.textContent = BranchesDataCreate[i].branch;
        OptEl.setAttribute('value', BranchesDataCreate[i].id);
        branchCreateNode.append(OptEl);
    }
    branchCreateNode.disabled = false;
    if (BranchesDataCreate.length == 1) {
        branchCreateNode.options[1].selected = 'selected';
        jobLocationIDCreateVal = branchCreateNode.value;
    }
    branchCreateNode.addEventListener('change', (e) => {
        let selectedValue = e.target.value;
        if (selectedValue === '0') {
            jobLocationIDCreateVal = '';
        } else {
            jobLocationIDCreateVal = selectedValue
        }
    });
}

zoneCreateNode.addEventListener('change', (e) => {
    let selectedZone = e.target.value;
    zoneIDCreateVal = selectedZone;
    if (zoneIDCreateVal != '0') {
        loadBranchesDataCreate(selectedZone);
    } else {
        zoneIDCreateVal = ''
        branchCreateNode.disabled = true;
    }
});


////////////////////////////////////// FILE VALIDATION  ////////////////////////////////////

let fileName
attachFileCreate.addEventListener('change', function () {
    if (!this.files[0]) {
        console.log('File Not Attached!')
        return;
    }
    const size = (this.files[0].size / 1024 / 1024).toFixed(2);
    fileName = $(this).val();
    let extension = fileName.split('.').pop();

    if (extension == "pdf" || extension == "docx" || extension == "doc") {
        let arr = fileName.split('.');
        if (arr.length <= 2) {
            attachFileCreate.classList.remove('is-invalid');
            if (size < 5) {
                console.log('Attached correct file!')
                attachFileCreate.classList.remove('is-invalid')
                $(document).ready(function () {
                    $('#attachFileLabel').text('Select File');
                });
                upload();
            } else {
                alert("File must be less then 5 MB");
                attachFileCreate.classList.add('is-invalid')
            }
        } else {
            alert('multi extension file not allowed!');
            attachFileCreate.classList.add('is-invalid')
        }
    } else {
        alert('File format must be pdf or docx or doc')
        attachFileCreate.classList.add('is-invalid')
    }
});

////////////////////////////////// FILE UPLOADING REQUEST ///////////////////////////////////////


const resume = document.getElementById('attachFileCreate');
const upload = () => {
    // e.preventDefault()
    const form = new FormData();
    form.append('file', resume.files[0]);

    var settings = {
        url: 'https://api-hfc.techchefz.com/icicihfc-micro-service/document/reference/upload/v2',
        method: 'POST',
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: form,
    };

    $.ajax(settings).done(function (response) {
        const data = JSON.parse(response).data;
        if (data) {
            resumeIDCreateVal = data.id;
            resumeNameCreateVal = data.name;
            resumeNonceCreateVal = data.nonce;
            alert('file uploaded successfully!')
        } else {
            alert('file not uploaded!');
            resumeIDCreateVal = '';
        }

    });
};

///////////////////////////////// FORM SUBMITTING REQUEST ///////////////////////////////////

$('#exampleModal2').on('hidden.bs.modal', function () {
    FullNameCreateNode.value = ''
    EmailCreateNode.value = ''
    MobileNoCreateNode.value = ''
    overallExpCreateNode.value = '0'
    relaventExpCreateNode.value = '0'
    departmentCreateNode.value = '0'
    roleCreateNode.value = '0'
    zoneCreateNode.value = '0'
    branchCreateNode.value = '0'
    attachFile.value = ''

    fullNameCreate = ''
    emailIDCreate = ''
    mobileNoCreate = ''
    overallExpIDCreateVal = ''
    relavantExpIDCreateVal = ''
    departmentIDCreateVal = ''
    roleIDCreateVal = ''
    zoneIDCreateVal = ''
    jobLocationIDCreateVal = ''
    resumeIDCreateVal = ''
    resumeNameCreateVal = ''
    resumeNonceCreateVal = ''

    IsFullNameValidCreate = false
    IsEmailValidCreate = false
    IsMobileNoValidCreate = false

    roleCreateNode.disabled = true
    branchCreateNode.disabled = true
    FullNameCreateNode.classList.remove('is-invalid');
    EmailCreateNode.classList.remove('is-invalid');
    MobileNoCreateNode.classList.remove('is-invalid');
});

const setCandidateData = (data) => {
    FullNameCreateNode.value = data.fullName;
    EmailCreateNode.value = data.emailId;
    MobileNoCreateNode.value = data.mobileNumber;
    overallExpCreateNode.value = data.experienceOverall.id;
    relaventExpCreateNode.value = data.experienceRelevant.id;

    departmentCreateNode.value = data.role.department.id;
    roleCreateNode.disabled = false;
    setRoleElCreate(data.role.department.id)
    roleCreateNode.value = data.role.id;

    zoneCreateNode.value = data.jobLocation.zone;
    branchCreateNode.disabled = false;

    ///  branch ///
    let zoneText = data.jobLocation.zone;
    let oldBranchId = data.jobLocation.id;

    const getbranch = async (zoneText, oldBranchId) => {
        await loadBranchesDataCreate(zoneText);
        await (branchCreateNode.value = oldBranchId);
    }
    getbranch(zoneText, oldBranchId);

    $(document).ready(function () {
        $('#attachFileLabel').text(data.resumeDocRefFileName);
    });

    fullNameCreate = data.fullName;
    emailIDCreate = data.emailId;
    mobileNoCreate = data.mobileNumber;
    overallExpIDCreateVal = data.experienceOverall.id;
    relavantExpIDCreateVal = data.experienceRelevant.id;
    departmentIDCreateVal = data.role.department.id;
    roleIDCreateVal = data.role.id;
    zoneIDCreateVal = data.jobLocation.zone;
    jobLocationIDCreateVal = data.jobLocation.id;;
    resumeIDCreateVal = data.resumeDocRefId;
    resumeNameCreateVal = data.resumeDocRefFileName;
    resumeNonceCreateVal = '';

    IsFullNameValidCreate = true,
        IsEmailValidCreate = true,
        IsMobileNoValidCreate = true;
}

const CloseModal = () => {
    $('#exampleModal2').modal('hide');
}

function formSubmit() {
    const obj = {
        fullName: fullNameCreate,
        emailId: emailIDCreate,
        mobileNumber: mobileNoCreate,
        experienceOverallId: overallExpIDCreateVal,
        experienceRelevantId: relavantExpIDCreateVal,
        roleId: roleIDCreateVal,
        jobLocationId: jobLocationIDCreateVal,
        resumeDocRefId: resumeIDCreateVal,
        resumeDocRefFileName: resumeNameCreateVal,
        resumeDocRefNonce: resumeNonceCreateVal,
    };
    console.log(obj);
    const settings = {
        url: 'https://api-hfc.techchefz.com/icicihfc-micro-service/rms/candidate/submit/form',
        method: 'POST',
        timeout: 0,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(obj)
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert(response.message);
    });
    console.log(obj);
    CloseModal();
}


/////////////////////////// FORM SUBMISSION /////////////////////////////////

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (!IsFullNameValidCreate || !fullNameCreate || fullNameCreate === ' ') {
        $("#fullNameCreate").focus();
        alert('Enter valid Full Name!')
    } else if (!IsEmailValidCreate || !emailIDCreate || emailIDCreate === ' ') {
        $("#emailCreate").focus();
        alert('Enter valid Email!')
    } else if (!IsMobileNoValidCreate || !mobileNoCreate || mobileNoCreate === ' ') {
        $("#mobileNoCreate").focus();
        alert('Enter valid Mobile Number!')
    } else if (!overallExpIDCreateVal) {
        $("#overallExpCreate").focus();
        alert('Select Overall Experience!')
    } else if (!relavantExpIDCreateVal) {
        $("#relaventExpCreate").focus();
        alert('Select Relavent Experience!')
    } else if (!departmentIDCreateVal) {
        $("#departmentCreate").focus();
        alert('Select Department!')
    } else if (!roleIDCreateVal) {
        $("#roleCreate").focus();
        alert('Select Role!')
    } else if (!zoneIDCreateVal) {
        $("#zoneCreate").focus();
        alert('Select Zone!')
    } else if (!jobLocationIDCreateVal) {
        $("#branchCreate").focus();
        alert('Select Branch!')
    } else if (!resumeIDCreateVal) {
        alert('file not uploaded!')
    } else {
        formSubmit();
        getCandidates(0, 10);
        getCandidates(0, 10);
    }
});

/////////////////////    DownloadBy Section //////////////////////

const getDownloadedByData = async (candidateID) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch(`https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/download/records/by/candidate/id?candidateId=${candidateID}`, requestOptions)
    if (response.status === 200) {
        const datum = await response.json()
        insertDownloadByModal(candidateID, datum.data)
    } else {
        throw new Error('Unable to get downloadedBy data!')
    }
}

function getDownloadedByColumn(ref) {
    const candidateID = ref.parentNode.parentNode.children[9].textContent;
    getDownloadedByData(candidateID);
}

const insertDownloadByModal = (candidateID, ArrayData) => {
    $('#downloadedByModalLabel').text(candidateID)
    $('#downloadByModalBody').html('')
    if (ArrayData.length === 0) {
        $('#NA').show();
        $('#downloadedByTable').hide();
    } else {
        $('#NA').hide();
        $('#downloadedByTable').show();
        let trTemp = $('#downloadByColumn').html();
        let compliedTrTemp = Handlebars.compile(trTemp);
        for (let i = 0; i < ArrayData.length; i++) {
            ArrayData[i].sno = i + 1;
            $('#downloadByModalBody').append(compliedTrTemp(ArrayData[i]));
        }
    }
}

//////////////////////////     Download All  /////////////////////////////

const downloadBtn = document.getElementById('downloadAllBtn')

downloadBtn.addEventListener('click', () => {
    downloadAllData('EXCEL');
})

const downloadAllData = async (downloadType) => {
    let now = new Date();
    let formatedDate = dateFormat(now, "dd-mm-yyyy hh_MM_ss");
    console.log(formatedDate);

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    myHeaders.append('responseType', 'arrayBuffer');

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/download?sortBy=${sortByFilterVal}&ascending=${isAscendingFilterVal}&startDate=${startDateFilterVal}&endDate=${endDateFilterVal}&dateFilterType=${dateTypeFilterVal}&candidateType=${candidateTypeFilterVal}&query=${queryFilterVal}&agencyId=&downloadType=${downloadType}&experienceOverallId=${expOverallIDFilterVal}&zoneName=${zoneIDFilterVal}&experienceRelevantId=${expRelavantIDFilterVal}&roleId=${roleIDFilterVal}&jobLocationId=${jobLocationIDFilterVal}&candidateStatus=${candidateStatusFilterVal}`, requestOptions)
        if (response.status === 200) {
            console.log(response);
            const data = await response.arrayBuffer();
            const blob = new Blob([data], {
                type: 'application/octet-stream'
            });
            const linkElem = document.createElement('a')
            linkElem.href = URL.createObjectURL(blob)
            linkElem.download = `RMS_CANDIDATE_${formatedDate}.xls`
            document.body.appendChild(linkElem)
            linkElem.click()
            document.body.removeChild(linkElem)
        } else {
            throw new Error('Unable to fetch data!');
        }
    } catch (error) {
        console.log(error.message);
    }
}

//////////////////////////////////  Update candidate ///////////////////////////////////

const getCandidateData = async (candidateID) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);


    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch(`https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/by/candidate/id?candidateId=${candidateID}`, requestOptions)
    if (response.status === 200) {
        const datum = await response.json()
        console.log(datum.data);
        setCandidateData(datum.data);
    } else {
        throw new Error('Unable to get candidate data!')
    }
}

function getUpdateForm(ref) {
    $('#exampleModalLabel2').text('Update')
    const candidateID = ref.parentNode.parentNode.children[9].textContent;
    console.log(candidateID);
    getCandidateData(candidateID)
}


/////////////////  candidate status change ////////////////////
const statusChangeToggler = document.getElementById('candidateStatus');
const statusChangeTextBox = document.getElementById('statusRemarks');
const statusBtn = document.getElementById('changeStatusBtn');

let statusChangeVal = '',
    statusChangeTextVal = '',
    candidateID = '';

let reference;
function getStatus(ref) {
    reference = ref;
    candidateID = ref.parentNode.parentNode.children[9].textContent;
    console.log(candidateID);
    $('#statusModalLabel').text(candidateID)
}

const getStatusValue = (e) => {
    let selectedValue = e.target.value;
    if (selectedValue === '0') {
        statusChangeVal = '';
    } else if (selectedValue === '1') {
        statusChangeVal = 'CREATED'
    } else if (selectedValue === '2') {
        statusChangeVal = 'SHORT_LISTED'
    } else if (selectedValue === '3') {
        statusChangeVal = 'HOLD'
    } else if (selectedValue === '4') {
        statusChangeVal = 'REJECTED'
    } else {
        statusChangeVal = 'ALL'
    }
}


const getTextValue = (e) => {
    const str = statusChangeTextBox.value;
    statusChangeTextVal = str;
}

function submitNewStatus() {
    if (!candidateID) {
        $('#candidateStatus').focus();
    } else if (!statusChangeVal) {
        $('#candidateStatus').focus();
        alert('status not selected');
    } else if (!statusChangeTextVal) {
        $('#statusRemarks').focus();
        alert('remarks not added!');
    } else {
        submitStatus();
        getCandidates(0, 10);
        getCandidates(0, 10);
    }
}

const CloseStatusModal = () => {
    statusChangeToggler.value = '0';
    statusChangeTextBox.value = '';
    $('#statusModel').modal('hide');
}

const submitStatus = () => {
    const obj = {
        candidateId: candidateID,
        candidateStatus: statusChangeVal,
        remarks: statusChangeTextVal,
    };
    console.log(obj);
    const settings = {
        url: 'https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/candidate/change/status/by/hr',
        method: 'POST',
        timeout: 0,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(obj)
    };

    $.ajax(settings).done(function (response) {
        alert('status changed successfully!');
    });
    CloseStatusModal();
}


























