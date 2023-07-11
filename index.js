


// Constants

var connToken = "90933020|-31949323411237267|90949779";
var studentDBName = "SCHOOL-DB"
var studentRelationName = "STUDENT-TABLE"

var jpdbBaseURL = "https://api.login2explore.com:5577";
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl";
var jpdbISL = "/api/isl";

function resetForm(){

    $("#studentId").prop("disabled", false)
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#dob").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollDate").prop("disabled", false);

    $("#studentId").val("")
    $("#fullName").val("");
    $("#class").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrollDate").val("");

    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", true);
    $("#dob").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollDate").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", false);

    $("#studentId").focus();
}

function validateAndGetFormData() {
    var studentIdVar = $("#studentId").val();
    if (studentIdVar === "") {
           alert("Student Roll No. is Required Value");
           $("#studentId").focus();
           return "";
    }
    var fullNameVar = $("#fullName").val();
    if (fullNameVar === "") {
           alert("Student Name is Required Value");
           $("#fullName").focus();
           return "";
    }
    var classVar = $("#class").val();
    if (classVar === "") {
           alert("Student class is Required Value");
           $("#class").focus();
           return "";
    }
    var dobVar = $("#dob").val();
    if (dobVar === "") {
        alert("Student Date of Birth is Required Value");
        $("#dob").focus();
        return "";
    }
    var addressVar = $("#address").val();
    if (addressVar === "") {
        alert("Student Address is Required Value");
        $("#address").focus();
        return "";
    }
    var enrollVar = $("#enrollDate").val();
    if (enrollVar === "") {
        alert("Student Enrollment date is Required Value");
        $("#enrollDate").focus();
        return "";
    }

    var jsonStrObj = {
           rollNo: studentIdVar,
           studentName: fullNameVar,
           class: classVar,
           dob: dobVar,
           address: addressVar,
           enrollDate: enrollVar,
    };

    return JSON.stringify(jsonStrObj);
}

function saveData(){
    var jsonStrObj = validateAndGetFormData();

    if(jsonStrObj === ""){
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML)
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#studentId").focus();
}

function updateData(){
    $("#update").prop("disabled", true);
    jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML)
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#studentId").focus();
}

function getStudent(){
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);

    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
        $("#class").prop("disabled", false);
        $("#dob").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollDate").prop("disabled", false);
    }else if(resJsonObj.status === 200) {
        $("#studentId").prop("disabled", true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
        $("#class").prop("disabled", false);
        $("#dob").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollDate").prop("disabled", false);
    }

}

function getStudentIdAsJsonObj(){
    var studentId = $("#studentId").val();
    var jsonStr = {
        rollNo: studentId   
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.studentName);
    $("#class").val(record.class);
    $("#dob").val(record.dob);
    $("#address").val(record.address);
    $("#enrollDate").val(record.enrollDate);
    console.log("Filled data into fields");
    
}

function saveRecNo2LS(jsonObj){

    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
    console.log("Saved record number to Local Storage");

}