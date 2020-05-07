const dataLayer = require("companydata");
const Department = dataLayer.Department;
const Employee = dataLayer.Employee;
const Timecard = dataLayer.Timecard;
const Utility = require('./Utility.js');
const Validator = require('./Validator.js');
const COMPANY = "vxh5681";
let validator = new Validator();

class CompanyController {
    deleteCompany(company) {
        let result = "";
        let flag = dataLayer.deleteCompany(company);
        if (flag > 0) {
            result = "{\"success\": \"Company " + flag + "" + " with id " + company + " was deleted.\"}";
            let deptList = dataLayer.getAllDepartment(company);
            if (deptList.length > 0) {
                deptList.forEach(dept => {
                    dataLayer.deleteDepartment(company, dept.getId());
                });
            }
            let emplList = dataLayer.getAllEmployee(company);
            if (emplList.length > 0) {
                emplList.forEach(empl => {
                    let tCardList = dataLayer.getAllTimecard(empl.getId());
                    if (tCardList.length > 0) {
                        tCardList.forEach(tCard => {
                            dataLayer.deleteTimecard(tCard.getId());
                        });
                    }
                    dataLayer.deleteEmployee(empl.getId());
                });
            }

        } else {
            result = Utility.getError("Company " + company + "" + " was not deleted.");
        }

        return result;
    }

    getDepartment(company, dept_id) {
        let pulledDepartment_getDepartment = dataLayer.getDepartment(company, dept_id);
        if (pulledDepartment_getDepartment == null) {
            return Utility.getError("Department does not exists.");
        }

        return pulledDepartment_getDepartment;
    }

    getAllDepartments(company) {
        let list_getDepartments = dataLayer.getAllDepartment(company);
        if (list_getDepartments.length == 0) {
            return Utility.getError("There are no departments to be found in this company");
        }

        return list_getDepartments;
    }

    updateDepartment(obj_dept_update) {
        //Variables----------------------------------
        let dept_id_department_update = obj_dept_update.dept_id;
        let company_department_update = obj_dept_update.company;
        let dept_name_department_update = obj_dept_update.dept_name;
        let dept_no_department_update = obj_dept_update.dept_no;
        let location_department_update = obj_dept_update.location;
        //-------------------------------------------
        if (!validator.isDeptNoUnique(dept_no_department_update, company_department_update)) {
            return Utility.getError("Department number is not unique for a department");
        }

        if (!validator.isDeptIdExistingRecord(dept_id_department_update, company_department_update)) {
            return Utility.getError("Department id does not exists for a department");
        }

        let departmentToBeUpdated = dataLayer.getDepartment(company_department_update, dept_id_department_update);
        departmentToBeUpdated.setCompany(company_department_update);
        departmentToBeUpdated.setDeptName(dept_name_department_update);
        departmentToBeUpdated.setDeptNo(dept_no_department_update);
        departmentToBeUpdated.setLocation(location_department_update);
        let updatedDepartment = dataLayer.updateDepartment(departmentToBeUpdated);
        let responseJSON = "";
        if (updatedDepartment == null) {
            responseJSON = Utility.getError("Department was not updated, something went wrong.");
        } else {
            responseJSON = "{\"success\": {" +
                "\"dept_id\": " + updatedDepartment.getId() + "" + "," +
                "\"company\":\"" + updatedDepartment.getCompany() + "\"," +
                "\"dept_name\":\"" + updatedDepartment.getDeptName() + "\"," +
                "\"dept_no\":\"" + updatedDepartment.getDeptNo() + "\"," +
                "\"location\":\"" + updatedDepartment.getLocation() + "\"" +
                "}}";
        }
        return responseJSON;
    }




    insertDepartment(company_insert_department, dept_name_insert_department, dept_no_insert_department, location_insert_department) {

        if (!validator.isDeptNoUnique(dept_no_insert_department, company_insert_department)) {
            return Utility.getError("Department number is not unique for a department");
        }

        let departmentToBeInserted = new Department(company_insert_department, dept_name_insert_department, dept_no_insert_department, location_insert_department);
        let insertedDepartment = dataLayer.insertDepartment(departmentToBeInserted);
        let responseJSON = "";
        if (insertedDepartment == null) {
            responseJSON = Utility.getError("Department was not created.");
        } else {
            responseJSON += "{\"success\": {" +
                "\"dept_id\": " + insertedDepartment.getId() + "" + "," +
                "\"company\":\"" + insertedDepartment.getCompany() + "\"," +
                "\"dept_name\":\"" + insertedDepartment.getDeptName() + "\"," +
                "\"dept_no\":\"" + insertedDepartment.getDeptNo() + "\"," +
                "\"location\":\"" + insertedDepartment.getLocation() + "\"" +
                "}}";
        }

        return responseJSON;
    }

    deleteDepartment(company_delete_department, dept_id_delete_department) {
        //foreign keys
        let dept_empl_fk = dataLayer.getAllEmployee(company_delete_department);
        if (dept_empl_fk.length > 0) {
            for (let i = 0; i < dept_empl_fk.length; i++) {
                if (dept_empl_fk[i].getDeptId() == dept_id_delete_department) {
                    let tCardList = dataLayer.getAllTimecard(dept_empl_fk[i].getId());
                    if (tCardList.length > 0) {
                        tCardList.forEach(tCard => {
                            dataLayer.deleteTimecard(tCard.getId());
                        });
                    }
                    dataLayer.deleteEmployee(dept_empl_fk[i].getId());
                }
            }
        }
        let flag = dataLayer.deleteDepartment(company_delete_department, dept_id_delete_department);
        let result = "";
        if (flag > 0) {
            result = "{\"success\": \"Department " + dept_id_delete_department + "" + "from " + company_delete_department + " deleted.\"}";
        } else {
            result = Utility.getError("Department " + dept_id_delete_department + "" + "from " + company_delete_department + " was not deleted.");
        }

        return result;
    }

    getEmployee(emp_id) {
        let pulledEmployee = dataLayer.getEmployee(emp_id);
        if (pulledEmployee == null) {
            return Utility.getError("No employee was found.");
        }

        return pulledEmployee;
    }

    getAllEmployees(company) {
        let list = dataLayer.getAllEmployee(company);
        if (list.length == 0) {
            return Utility.getError("There are no employees to be found in this company");
        }

        return list;
    }

    insertEmployee(emp_name_insert_employee, emp_no_insert_employee, hire_date_insert_employee, job_insert_employee, salary_insert_employee, dept_id_insert_employee, mng_id_insert_employee) {
        /*First validation*/
        if (!validator.isDeptIdExistingRecord(dept_id_insert_employee, COMPANY)) {
            return Utility.getError("Department id does not exists for employee");
        }

        /*Second validation*/
        if (!validator.isMngIdExistingRecord(mng_id_insert_employee, COMPANY)) {
            mng_id_insert_employee = 0;
        }

        /*Third validation and fourth validation about date*/

        if (!validator.isDateValid(hire_date_insert_employee, "HIRE_DATE")) {
            return Utility.getError("Hire date is not a valid date.");
        }

        if (!validator.isHireDateWeekday(hire_date_insert_employee)) {
            return Utility.getError("You cannot hire on Saturday and Sunday.");
        }

        if (!validator.isHireDateEqualToCurrentDateOrEarlier(hire_date_insert_employee)) {
            return Utility.getError("This is a future date.");

        }

        /*Fifth validation
                There was a type in the Project2-Assigment document, it said emp_id to validate
                but in fact it should be written emp_no
             */
        if (!validator.isEmpNoUnique(emp_no_insert_employee, COMPANY)) {
            return Utility.getError("Employee Number must be unique");
        }
        /*Dates validations missing*/
        let employeeToBeInserted = new Employee(emp_name_insert_employee, emp_no_insert_employee, hire_date_insert_employee, job_insert_employee, salary_insert_employee, dept_id_insert_employee, mng_id_insert_employee);
        let insertedEmployee = dataLayer.insertEmployee(employeeToBeInserted);
        let responseJSON = "";
        if (insertedEmployee == null) {
            responseJSON = Utility.getError("No employee was created, something went wrong.");
        } else {
            responseJSON += "{\"success\": {" +
                "\"emp_id\": " + insertedEmployee.getId() + "" + "," +
                "\"emp_name\":\"" + insertedEmployee.getEmpName() + "\"," +
                "\"emp_no\":\"" + insertedEmployee.getEmpNo() + "\"," +
                "\"hire_date\":" + insertedEmployee.getHireDate() + "" + "," +
                "\"job\":\"" + insertedEmployee.getJob() + "\"," +
                "\"salary\":" + insertedEmployee.getSalary() + "" + "," +
                "\"dept_id\":" + insertedEmployee.getDeptId() + "" + "," +
                "\"mng_id\":" + insertedEmployee.getMngId() + "" +
                "}}";
        }

        return responseJSON;
    }

    updateEmployee(obj_employee_update) {
        //Variables----------------------------------
        let emp_id_update_employee = obj_employee_update.emp_id;
        let emp_name_update_employee = obj_employee_update.emp_name;
        let emp_no_update_employee = obj_employee_update.emp_no;
        let hire_date_update_employee = obj_employee_update.hire_date;
        let job_update_employee = obj_employee_update.job;
        let salary_update_employee = obj_employee_update.salary;
        let dept_id_update_employee = obj_employee_update.dept_id;
        let mng_id_update_employee = obj_employee_update.mng_id;
        //-------------------------------------------

        /*First validation*/
        if (!validator.isDeptIdExistingRecord(dept_id_update_employee, COMPANY)) {
            return Utility.getError("Department id does not exists for employee");
        }

        /*Second validation*/
        if (!validator.isMngIdExistingRecord(mng_id_update_employee, COMPANY)) {
            mng_id_update_employee = 0;
        }

        /*Third validation and fourth validation about date*/

        if (!validator.isDateValid(hire_date_update_employee, "HIRE_DATE")) {
            return Utility.getError("Hire date is not a valid date.");
        }

        if (!validator.isHireDateWeekday(hire_date_update_employee)) {
            return Utility.getError("You cannot hire on Saturday and Sunday.");
        }

        if (!validator.isHireDateEqualToCurrentDateOrEarlier(hire_date_update_employee)) {
            return Utility.getError("This is a future date.");

        }

        /*Fifth validation
               There was a type in the Project2-Assigment document, it said emp_id to validate
               but in fact it should be written emp_no
            */
        if (!validator.isEmpNoUnique(emp_no_update_employee, COMPANY)) {
            return Utility.getError("Employee Number must be unique");
        }

        /*Sixth validation*/
        if (!validator.isEmpIdExistingRecord(emp_id_update_employee, COMPANY)) {
            return Utility.getError("Employee id does not exist");
        }

        let employeeToBeUpdated = dataLayer.getEmployee(emp_id_update_employee);
        employeeToBeUpdated.setEmpName(emp_name_update_employee);
        employeeToBeUpdated.setEmpNo(emp_no_update_employee);
        employeeToBeUpdated.setHireDate(hire_date_update_employee);
        employeeToBeUpdated.setJob(job_update_employee);
        employeeToBeUpdated.setSalary(salary_update_employee);
        employeeToBeUpdated.setDeptId(dept_id_update_employee);
        employeeToBeUpdated.setMngId(mng_id_update_employee);
        let updatedEmployee = dataLayer.updateEmployee(employeeToBeUpdated);
        let responseJSON = "";
        if (updatedEmployee == null) {
            responseJSON = Utility.getError("No employee was updated, something went wrong.");
        } else {
            responseJSON += "{\"success\": {" +
                "\"emp_id\": " + updatedEmployee.getId() + "" + "," +
                "\"emp_name\":\"" + updatedEmployee.getEmpName() + "\"," +
                "\"emp_no\":\"" + updatedEmployee.getEmpNo() + "\"," +
                "\"hire_date\":" + updatedEmployee.getHireDate() + "" + "," +
                "\"job\":\"" + updatedEmployee.getJob() + "\"," +
                "\"salary\":" + updatedEmployee.getSalary() + "" + "," +
                "\"dept_id\":" + updatedEmployee.getDeptId() + "" + "," +
                "\"mng_id\":" + updatedEmployee.getMngId() + "" +
                "}}";
        }

        return responseJSON;
    }

    deleteEmployee(emp_id_delete_employee) {
        let tCardList = dataLayer.getAllTimecard(emp_id_delete_employee);
        if (tCardList.length > 0) {
            tCardList.forEach(tCard => {
                dataLayer.deleteTimecard(tCard.getId());
            });
        }
        let flag = dataLayer.deleteEmployee(emp_id_delete_employee);
        let result = "";

        if (flag > 0) {
            result = "{\"success\": \"Employee " + emp_id_delete_employee + "" + " was deleted.\"}";
        } else {
            result = Utility.getError("Employee " + emp_id_delete_employee + "" + " was not deleted.");
        }

        return result;
    }

    getTimecard(timecard_id_get_timecard) {
        let timecard = dataLayer.getTimecard(timecard_id_get_timecard);
        if (timecard == null) {
            return Utility.getError(`Timecard with given ${timecard_id_get_timecard} number does not exists`);
        }

        return timecard;
    }

    getAllTimecards(emp_id_get_timecards) {
        let list_get_timecards = dataLayer.getAllTimecard(emp_id_get_timecards);
        if (list_get_timecards.length == 0) {
            return Utility.getError("There are no timecards to be found");
        }

        return list_get_timecards;
    }

    updateTimecard(objectForInJson) {
        //Variables----------------------------------
        let timecard_id_update_timecard = objectForInJson.timecard_id;
        let start_time_update_timecard = objectForInJson.start_time;
        let end_time_update_timecard = objectForInJson.end_time;
        let emp_id_update_timecard = objectForInJson.emp_id;
        //------------------------

        /*Note: Word document it does not have written emp_id as input, but you need it for validations and to create Timecard object to update*/
        //-------------------------------------------

        /*First validation*/
        if (!validator.isEmpIdExistingRecord(emp_id_update_timecard, COMPANY)) {
            return Utility.getError("Employee id does not exist");
        }

        /*Valid time*/
        if (!validator.isDateValid(start_time_update_timecard + "", "TIMECARD_DATE") || !validator.isDateValid(end_time_update_timecard + "", "TIMECARD_DATE")) {
            return Utility.getError("Hire date is not a valid date.");
        }

        /*Second validation*/
        if (!validator.isStartTimeEqualToCurrDateOrOneWeekAgo(start_time_update_timecard)) {
            return Utility.getError("The start time must be today or up to 1 week ago from the current date.");
        }

        /*Third validation*/
        if (!validator.isEndDateOneHourGreaterAndBeOnSameDayAsStartTime(start_time_update_timecard, end_time_update_timecard)) {
            return Utility.getError("The end time at least 1 hour greater than the start time and be on the same day as the start time.");
        }

        /*Fourth validation*/
        if (!validator.isStartOrEndTimeWeekday(start_time_update_timecard, end_time_update_timecard)) {
            return Utility.getError("Date must not be Saturday or Sunday.");
        }

        /*Fifth validation*/
        if (!validator.isBetweenHours(start_time_update_timecard, end_time_update_timecard)) {
            return Utility.getError("Time must be between 06:00:00 to 18:00:00 and End time minutes or time seconds must be 00.");
        }

        /*Sixth validation*/
        if (!validator.isStartTimeOnTheSameDay(start_time_update_timecard, end_time_update_timecard, emp_id_update_timecard)) {
            return Utility.getError("Start time must not be on the same day as any other start time for that employee.");
        }

        /*   Seventh validation */
        if (!validator.isTimecardIdExistingRecord(emp_id_update_timecard, timecard_id_update_timecard)) {
            return Utility.getError("Timecard id not found to be updated..");
        }



        let timecardToBeUpdated = dataLayer.getTimecard(timecard_id_update_timecard);
        timecardToBeUpdated.setStartTime(start_time_update_timecard);
        timecardToBeUpdated.setEndTime(end_time_update_timecard);
        timecardToBeUpdated.setEmpId(emp_id_update_timecard);
        let updatedTimecard = dataLayer.updateTimecard(timecardToBeUpdated);
        let varTimecardUpdate = "";
        if (timecardToBeUpdated == null) {
            varTimecardUpdate = Utility.getError("No timecard was not updated, something went wrong.");
        } else {
            varTimecardUpdate += "{\"success\": {" +
                "\"timecard_id\": " + updatedTimecard.getId() + "" + "," +
                "\"start_time\":\"" + updatedTimecard.getStartTime() + "\"," +
                "\"end_time\":\"" + updatedTimecard.getEndTime() + "\"," +
                "\"emp_id\":" + updatedTimecard.getEmpId() + "" +
                "}}";
        }

        return varTimecardUpdate;
    }

    insertTimecard(start_time_insert_timecard, end_time_insert_timecard, emp_id_insert_timecard) {
        /*First validation*/
        if (!validator.isEmpIdExistingRecord(emp_id_insert_timecard, COMPANY)) {
            return Utility.getError("Employee id does not exist");
        }

        /*Valid time*/
        if (!validator.isDateValid(start_time_insert_timecard + "", "TIMECARD_DATE") || !validator.isDateValid(end_time_insert_timecard + "", "TIMECARD_DATE")) {
            return Utility.getError("Hire date is not a valid date.");
        }


        /*Second validation*/
        if (!validator.isStartTimeEqualToCurrDateOrOneWeekAgo(start_time_insert_timecard)) {
            return Utility.getError("The start time must be today or up to 1 week ago from the current date.");
        }

        /*Third validation*/
        if (!validator.isEndDateOneHourGreaterAndBeOnSameDayAsStartTime(start_time_insert_timecard, end_time_insert_timecard)) {
            return Utility.getError("The end time at least 1 hour greater than the start time and be on the same day as the start time.");
        }


        /*Fourth validation*/
        if (!validator.isStartOrEndTimeWeekday(start_time_insert_timecard, end_time_insert_timecard)) {
            return Utility.getError("Date must not be Saturday or Sunday.");
        }

        /*Fifth validation*/
        if (!validator.isBetweenHours(start_time_insert_timecard, end_time_insert_timecard)) {
            return Utility.getError("Time must be between 06:00:00 to 18:00:00 and End time minutes or time seconds must be 00.");
        }

        /*Sixth validation*/
        if (!validator.isStartTimeOnTheSameDay(start_time_insert_timecard, end_time_insert_timecard, emp_id_insert_timecard)) {
            return Utility.getError("Start time must not be on the same day as any other start time for that employee.");
        }
        let timecardToBeInserted = new Timecard(start_time_insert_timecard, end_time_insert_timecard, emp_id_insert_timecard);
        let insertedEmployee = dataLayer.insertTimecard(timecardToBeInserted);
        let responseForTimeCardCreate = "";
        if (insertedEmployee == null) {
            responseForTimeCardCreate = Utility.getError("No timecard was created, something went wrong.");
        } else {
            responseForTimeCardCreate += "{\"success\": {" +
                "\"timecard_id\": " + insertedEmployee.getId() + "" + "," +
                "\"start_time\":\"" + insertedEmployee.getStartTime() + "\"," +
                "\"end_time\":\"" + insertedEmployee.getEndTime() + "\"," +
                "\"emp_id\":" + insertedEmployee.getEmpId() + "" +
                "}}";
        }

        return responseForTimeCardCreate;
    }

    deleteTimecard(timecard_id_delete_timecard) {
        let flag = dataLayer.deleteTimecard(timecard_id_delete_timecard);
        let result = "";

        if (flag > 0) {
            result = "{\"success\": \"Timecard " + flag + "" + " with id " + timecard_id_delete_timecard + "" + " was deleted.\"}";
        } else {
            result = Utility.getError("Timecard " + flag + "" + " was not deleted.");
        }

        return result;
    }
}

module.exports = CompanyController;