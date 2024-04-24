import * as Joi from 'joi';
import moment from 'moment';

const dateRegex = /^(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export const dateValidator = Joi.date();
export const customDateValidator = Joi.string()
  .trim()
  .regex(dateRegex)
  .message('Date must be in the format dd/mm/yyyy')
  .required();
/** we had custom validation implementation before, but eventually agreed to stick to mm/dd/yyyy on the frontends hence joi validation works fine out of the box for this */

export const formattedDate = (date): number => {
  const dateFormat = date.split('-');
  return Date.parse(`${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`);
};

export const isDateExpired = (expiryDate: string): boolean => {
  const [day, month, year] = expiryDate.split('-');
  const formattedExpiryDate = `${year}-${month}-${day}`;
  const expiryDateObject = new Date(formattedExpiryDate);
  const currentDate = new Date();
  return expiryDateObject.getTime() < currentDate.getTime();
};

export const periodDateValidator = dateValidator
  .required()
  .custom((value: Date, helper) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (value < now)
      return helper.message({
        '*': `sorry, you cannot provide a date in the past `,
      });
    return value;
  });

export const timeValidator = Joi.string()
  .trim()
  .regex(/^([0-9]{2})\:([0-9]{2})$/);

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const getCustomTimeFormatted = (expectedTripPeriod) => {
  const { time, date } = expectedTripPeriod;
  const tripStartDate = convertStringDate(date);

  const hours = parseInt(time.split(':')[0], 10);
  const minutes = parseInt(time.split(':')[1], 10);

  // Create a new Date object and set the hours and minutes
  const customTimeFormatted = new Date(tripStartDate);
  customTimeFormatted.setHours(hours, minutes, 0, 0);

  return customTimeFormatted;
};

function isBeforeCurrentTime(time) {
  const currentTime = getCurrentTime();
  return time < currentTime;
}

export const customTimeValidator = Joi.string().custom((value, helpers) => {
  if (isBeforeCurrentTime(value)) {
    return value;
  } else {
    return value; // Return the value itself when validation fails
  }
}, 'custom time validation');

export const hourMinuteValidator = Joi.extend((joi) => ({
  type: 'time',
  base: joi.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
  messages: {
    'time.invalid': '{{#label}} must be in HH:mm format',
  },
  validate(value, helpers) {
    if (!moment(value, 'HH:mm', true).isValid()) {
      return { value, errors: helpers.error('time.invalid') };
    }
    return value;
  },
}));

export const convertStringDate = (dateString: any): Date => {
  const parts = dateString.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed, so subtract 1
  const year = parseInt(parts[2], 10);

  // Create a new Date object with the parsed values
  return new Date(year, month, day, 0, 0, 0, 0);
};

export const convertStringYearMonthAndDay = (dateString: any): Date => {
  const parts = dateString.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed, so subtract 1
  const year = parseInt(parts[2], 10);

  // Create a new Date object with the parsed values
  return new Date(year, month, day);
};
