const express = require('express');
const app = express();
const port = 3000;
const Controller = require('./Business/CompanyController.js');
let controller = new Controller();
/* 1 */
app.delete('/HoxhaVP3/CompanyServices/company', express.urlencoded({ extended: true }), function(req, res) {
    let company = req.query.company;
    res.end(controller.deleteCompany(company));
});


/* 2 */
app.get('/HoxhaVP3/CompanyServices/department', express.urlencoded({ extended: true }), function(req, res) {
    let company_get_department = req.query.company;
    let dept_id_get_department = req.query.dept_id;
    res.end(JSON.stringify(controller.getDepartment(company_get_department, dept_id_get_department)));
});

/* 3 */
app.get('/HoxhaVP3/CompanyServices/departments', express.urlencoded({ extended: true }), function(req, res) {
    let company_get_departments = req.query.company;
    res.end(JSON.stringify(controller.getAllDepartments(company_get_departments)));
});

/* 4  */
app.put('/HoxhaVP3/CompanyServices/department', express.urlencoded({ extended: true }), function(req, res) {
    let obj_dept_update = JSON.parse(req.query.inJson);
    res.end(controller.updateDepartment(obj_dept_update));
});

/* 5 */
app.post('/HoxhaVP3/CompanyServices/department', express.urlencoded({ extended: true }), function(req, res) {
    let company_insert_department = req.query.company;
    let dept_name_insert_department = req.query.dept_name;
    let dept_no_insert_department = req.query.dept_no;
    let location_insert_department = req.query.location;
    res.end(controller.insertDepartment(company_insert_department, dept_name_insert_department, dept_no_insert_department, location_insert_department));
});


/* 6 */
app.delete('/HoxhaVP3/CompanyServices/department', express.urlencoded({ extended: true }), function(req, res) {
    let company_delete_department = req.query.company;
    let dept_id_delete_department = req.query.dept_id;
    res.end(controller.deleteDepartment(company_delete_department, dept_id_delete_department));
});


/* 7 */
app.get('/HoxhaVP3/CompanyServices/employee', express.urlencoded({ extended: true }), function(req, res) {
    let emp_id_employee_get = req.query.emp_id;
    res.end(JSON.stringify(controller.getEmployee(emp_id_employee_get)));
});


/* 8 */
app.get('/HoxhaVP3/CompanyServices/employees', express.urlencoded({ extended: true }), function(req, res) {
    let company_employess_get = req.query.company;
    res.end(JSON.stringify(controller.getAllEmployees(company_employess_get)));
});


/* 9 */
app.post('/HoxhaVP3/CompanyServices/employee', express.urlencoded({ extended: true }), function(req, res) {
    let emp_name_insert_employee = req.query.emp_name;
    let emp_no_insert_employee = req.query.emp_no;
    let hire_date_insert_employee = req.query.hire_date;
    let job_insert_employee = req.query.job;
    let salary_insert_employee = req.query.salary;
    let dept_id_insert_employee = req.query.dept_id;
    let mng_id_insert_employee = req.query.mng_id;
    res.end(controller.insertEmployee(emp_name_insert_employee, emp_no_insert_employee, hire_date_insert_employee, job_insert_employee, salary_insert_employee, dept_id_insert_employee, mng_id_insert_employee));
});


/* 10 */
app.put('/HoxhaVP3/CompanyServices/employee', express.urlencoded({ extended: true }), function(req, res) {
    obj_employee_update = JSON.parse(req.query.emplJson);
    res.end(controller.updateEmployee(obj_employee_update));
});


/* 11 */
app.delete('/HoxhaVP3/CompanyServices/employee', express.urlencoded({ extended: true }), function(req, res) {
    let emp_id_delete_employee = req.query.emp_id;
    res.end(controller.deleteEmployee(emp_id_delete_employee));
});

/* 12 */
app.get('/HoxhaVP3/CompanyServices/timecard', express.urlencoded({ extended: true }), function(req, res) {
    let timecard_id_get_timecard = req.query.timecard_id;
    res.end(JSON.stringify(controller.getTimecard(timecard_id_get_timecard)));
});

/* 13 */
app.get('/HoxhaVP3/CompanyServices/timecards', express.urlencoded({ extended: true }), function(req, res) {
    let emp_id_get_timecards = req.query.emp_id;
    res.end(JSON.stringify(controller.getAllTimecards(emp_id_get_timecards)));
});

/* 14 */
app.put('/HoxhaVP3/CompanyServices/timecard', express.urlencoded({ extended: true }), function(req, res) {
    let objectForInJson = JSON.parse(req.query.inJSON);
    res.end(controller.updateTimecard(objectForInJson));
});


/* 15*/
app.post('/HoxhaVP3/CompanyServices/timecard', express.urlencoded({ extended: true }), function(req, res) {
    let start_time_insert_timecard = req.query.start_time;
    let end_time_insert_timecard = req.query.end_time;
    let emp_id_insert_timecard = req.query.emp_id;
    res.end(controller.insertTimecard(start_time_insert_timecard, end_time_insert_timecard, emp_id_insert_timecard));
});

/* 16 */
app.delete('/HoxhaVP3/CompanyServices/timecard', express.urlencoded({ extended: true }), function(req, res) {
    let timecard_id_delete_timecard = req.query.timecard_id;
    res.end(controller.deleteTimecard(timecard_id_delete_timecard));
});

/* Start the server */
app.listen(port, function() {
    console.log(`App running at http://localhost:${port}/`);
});