const DAYS_IN_MONTH = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
};

const FEB_MONTH = 2;
const ABS_DAY_MIN = 1;
const ABS_DAY_MAX = 31;
const ABS_MONTH_MIN = 1;
const ABS_MONTH_MAX = 12;


function getValue(element) {
    return (element.value.trim() == '') ? '' : parseInt(element.value);
}

function calcFebDays(y) {

    let febDays = 28;
    if ((y % 4 == 0) && (y % 400 > 1)) {
        febDays = 29;
    }

    return febDays;
}

function padStr(v) { return String(v).padStart(2, '0'); }

function fixDay(dv, mv, yv) {

    let dayMax = DAYS_IN_MONTH[mv];
    if (mv == FEB_MONTH) {
        dayMax = calcFebDays(yv);
    }

    let correctedDay = padStr(dv);
    if (dv < ABS_DAY_MIN) {
        correctedDay = padStr(ABS_DAY_MIN);
    } else if (dv > dayMax) {
        correctedDay = padStr(dayMax);
    } else if (dv > ABS_DAY_MAX) {
        correctedDay = padStr(ABS_DAY_MAX);
    }

    return correctedDay;
}

function fixMonth(mv) {

    let correctedMonth = padStr(mv);
    if (mv < ABS_MONTH_MIN) {
        correctedMonth = '01';
    } else if (mv > ABS_MONTH_MAX) {
        correctedMonth = '12';
    }

    return correctedMonth;
}

function fixYear(yv) {

    let currentYear = new Date().getFullYear();
    let correctedYear = String(yv);
    if (yv < 1920) {
        correctedYear = '1920';
    } else if (yv > currentYear) {
        correctedYear = String(currentYear);
    }

    return correctedYear;
}

function dayHandler(e, monthElement, yearElement) {

    let dayVal = getValue(e.target);
    if (dayVal == '') {
        e.target.value = dayVal;
    } else {
        let monthVal = getValue(monthElement);
        let yearVal = getValue(yearElement);
        e.target.value = fixDay(dayVal, monthVal, yearVal);
    }
}

function monthHandler(e, dayElement, yearElement) {
    let monthVal = getValue(e.target);
    if (monthVal == '') {
        e.target.value = monthVal;
    } else {
        let dayVal = getValue(dayElement);
        let yearVal = getValue(yearElement);
        e.target.value = fixMonth(monthVal);

        if ((monthVal == FEB_MONTH && yearVal > 0) ||
            (monthVal != FEB_MONTH && monthVal > 0)) {
            dayElement.value = fixDay(dayVal, monthVal, yearVal);
        }
    }
}

function yearHandler(e, dayElement, monthElement) {
    let yearVal = getValue(e.target);
    if (yearVal == '') {
        e.target.value = yearVal;
    } else {
        e.target.value = fixYear(yearVal);

        let monthVal = getValue(monthElement);
        if (monthVal == FEB_MONTH) {
            let dayVal = getValue(dayElement);
            dayElement.value = fixDay(dayVal, monthVal, yearVal);
        }
    }
}

// function changeHandler(e) {
//     if (/\d/.test(e.key)) {
//         e.stopPropagation();
//         e.preventDefault();
//     }
// }

function addDateListeners() {
    const dobDay = document.getElementById('dob-day');
    const dobMonth = document.getElementById('dob-month');
    const dobYear = document.getElementById('dob-year');

    // dobDay.addEventListener('keydown', e => changeHandler(e));
    // dobMonth.addEventListener('keydown', e => changeHandler(e));
    // dobYear.addEventListener('keydown', e => changeHandler(e));

    dobDay.addEventListener('focusout', e => dayHandler(e, dobMonth, dobYear));
    dobMonth.addEventListener('focusout', e => monthHandler(e, dobDay, dobYear));
    dobYear.addEventListener('focusout', e => yearHandler(e, dobDay, dobMonth));
}

addDateListeners();