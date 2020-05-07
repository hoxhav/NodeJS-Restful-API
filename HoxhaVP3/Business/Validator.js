const dataLayer = require("companydata");
const Department = dataLayer.Department;
const Employee = dataLayer.Employee;
const Timecard = dataLayer.Timecard;
const moment = require('moment');
class Validator {

    isDeptNoUnique(dept_no, company) {
        let allDepartmentsForValidation = dataLayer.getAllDepartment(company);
        //if false is dept_no is not unique because it already exists
        for (let i = 0; i < allDepartmentsForValidation.length; i++) {
            if (dept_no == allDepartmentsForValidation[i].getDeptNo()) {
                return false;
            }
        }
        return true;
    }

    isDeptIdExistingRecord(dept_id, company) {
        let allDepartmentsForValidation = dataLayer.getAllDepartment(company);
        //if true it is an existing record
        for (let i = 0; i < allDepartmentsForValidation.length; i++) {
            if (dept_id == allDepartmentsForValidation[i].getId()) {
                return true;
            }
        }
        return false;
    }


    isMngIdExistingRecord(mng_id, company) {
        let allEmployeeForValidation = dataLayer.getAllEmployee(company);
        for (let i = 0; i < allEmployeeForValidation.length; i++) {
            if (mng_id == allEmployeeForValidation[i].getMngId()) {
                return true;
            }
        }
        return false;
    }

    isDateValid(date, type) {
        if (type == "HIRE_DATE") {
            return moment(date, "YYYY-MM-DD", 'fr', true).isValid();
        } else if (type == "TIMECARD_DATE") {
            return moment(date, "YYYY-MM-DD HH:mm:ss.SSS", 'fr', true).isValid();
        }

        return true;
    }

    isEmpNoUnique(emp_no, company) {
        let allEmployeeForValidation = dataLayer.getAllEmployee(company);
        //if false is emp_no is not unique because it already exists
        for (let i = 0; i < allEmployeeForValidation.length; i++) {
            if (emp_no == allEmployeeForValidation[i].getEmpNo()) {
                return false;
            }
        }
        return true;
    }

    isEmpIdExistingRecord(emp_id, company) {
        let allEmployeeForValidation = dataLayer.getAllEmployee(company);
        //if true Emp_id already exists
        for (let i = 0; i < allEmployeeForValidation.length; i++) {
            if (emp_id == allEmployeeForValidation[i].getId()) {
                return true;
            }
        }
        return false;
    }

    isTimecardIdExistingRecord(emp_id, timecard_id) {
        let timeCardForUpdate = dataLayer.getAllTimecard(emp_id);
        //if true Emp_id already exists
        for (let i = 0; i < timeCardForUpdate.length; i++) {
            if (timecard_id == timeCardForUpdate[i].getId()) {
                return true;
            }
        }
        return false;
    }

    isHireDateEqualToCurrentDateOrEarlier(hire_date) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        if (!moment(hire_date).isBefore(today)) {
            if (!moment(hire_date).isSame(today)) {
                return false;
            }
        }
        return true;
    }


    isHireDateWeekday(hire_date) {
        let localDate = new Date(hire_date);
        let day = localDate.getDay();
        //if saturday or sunday Return false
        return !((day === 6) || (day === 0));
    }

    isStartTimeEqualToCurrDateOrOneWeekAgo(start_time) {
        let localDateForStartTime = moment(start_time);
        let currentDate = new Date();
        let sub = currentDate.setDate(currentDate.getDate() - 8); //8 cuz 0-6 is the week in date
        let date = new Date(sub);
        let comparable = moment(date);
        //false if it is not equal to current date or up to one week ago
        let before = moment(localDateForStartTime).isBefore(moment())
        let after = moment(localDateForStartTime).isAfter(comparable);
        if (before && !after) {
            if (!moment(localDateForStartTime).isSame(currentDate)) {
                return false;
            }
        }
        return true;
    }

    isEndDateOneHourGreaterAndBeOnSameDayAsStartTime(start_time, end_time) {
        let localDateForStartTime = new Date(start_time);
        let localDateForEndTime = new Date(end_time);
        let flag = true;
        if ((localDateForEndTime.getHours() - localDateForStartTime.getHours() == 1)) {
            if (localDateForEndTime.getMinutes() - localDateForStartTime.getMinutes() < 0) {
                flag = false;
            }
        }
        if (!flag) {
            return false;
        } else {
            if (!(localDateForEndTime.getHours() - localDateForStartTime.getHours() >= 1) || !(((localDateForStartTime.getMonth() + 1) - (localDateForEndTime.getMonth() + 1)) == 0) || !((localDateForStartTime.getDate() - localDateForEndTime.getDate()) == 0)) {
                return false;
            }
        }
        return true;
    }

    isStartOrEndTimeWeekday(start_time, end_time) {
        let localDate_1 = new Date(start_time);
        let localDate_2 = new Date(end_time);
        let day_1 = localDate_1.getDay();
        let day_2 = localDate_2.getDay();
        //if saturday or sunday Return false
        return !((day_1 === 6) || (day_1 === 0) || (day_2 === 6) || (day_2 === 0));
    }

    //06:00:00-18:00:00
    isBetweenHours(start_time, end_time) {
        let localDateForStartTime = new Date(start_time);
        let localDateForEndTime = new Date(end_time);
        if (!(localDateForStartTime.getHours() >= 6 && localDateForEndTime.getHours() <= 18)) {
            return false;
        } else if (localDateForEndTime.getHours() == 18) {
            if (localDateForEndTime.getMinutes() > 0 || localDateForEndTime.getSeconds() > 0) {
                return false;
            }
        }
        return true;
    }

    isStartTimeOnTheSameDay(start_time, end_time, emp_id) {
        let localDateForStartTime = new Date(start_time);
        let localDateForEndTime = new Date(end_time);
        let timecards = dataLayer.getAllTimecard(emp_id);
        let flag = true;
        for (let i = 0; i < timecards.length; i++) {
            let time = timecards[i].getStartTime();
            let localTime = new Date(time);
            if (localTime.getDate() == localDateForStartTime.getDate() && localTime.getMonth() == localDateForStartTime.getMonth() && localTime.getFullYear() == localDateForStartTime.getFullYear()) {
                flag = false;
            }
        }
        if (!flag) {
            return false;
        }
        return true;
    }


}

module.exports = Validator;