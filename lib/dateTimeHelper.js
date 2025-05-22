// import package
import moment from 'moment';

// import lib
import isEmpty from './isEmpty';

export const dateTimeFormat = (dateTime, format = 'YYYY-MM-DD HH:mm:ss') => {
    try {
        if (!isEmpty(dateTime)) {
            let newDateTime = new Date(dateTime);
            if (format.includes('YYYY')) {
                format = format.replace('YYYY', newDateTime.getFullYear())
            }

            if (format.includes('MM')) {
                let month = newDateTime.getMonth() + 1;
                month = month > 9 ? month : `0${month}`
                format = format.replace('MM', month)
            }

            if (format.includes('DD')) {
                let date = newDateTime.getDate();
                date = date > 9 ? date : `0${date}`
                format = format.replace('DD', date)
            }

            if (format.includes('HH')) {
                let hour = newDateTime.getHours();
                hour = hour > 9 ? hour : `0${hour}`
                format = format.replace('HH', hour)
            }

            if (format.includes('mm')) {
                let minute = newDateTime.getMinutes();
                minute = minute > 9 ? minute : `0${minute}`
                format = format.replace('mm', minute)
            }

            if (format.includes('ss')) {
                let seconds = newDateTime.getSeconds();
                seconds = seconds > 9 ? seconds : `0${seconds}`
                format = format.replace('ss', seconds)
            }

            return format

        } else {
            return ''
        }
    } catch (err) {
        console.log('err: ', err);
        return ''
    }
}

export const momentFormat = (dateTime, format = 'YYYY-MM-DD HH:mm') => {
    try {
        if (!isEmpty(dateTime)) {
            let newDateTime = new Date(dateTime);
            return moment(newDateTime).format(format)
        }
        return ''
    } catch (err) {
        return ''
    }
}