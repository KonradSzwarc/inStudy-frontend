import { hasAnyValue } from './utils';

const validation = {
  required: (value, message) => {
    if (!value || !value.toString().trim()) {
      return (typeof message === 'string')
        ? message
        : 'To pole jest wymagane';
    }
    return null;
  },
  noEmptyArr: (values) => {
    if (!values || values.length === 0) {
      return 'Musisz dodać co najmniej jeden element';
    }
    return null;
  },
  naturalNumber: (value) => {
    const naturalReg = /^(0|([1-9]\d*))$/;
    if (!naturalReg.test(value)) {
      return 'Wartość w tym polu musi być liczbą naturalną';
    }
    return null;
  },
};

export default (validate, values, haveErrors, noErrors) => {
  const errors = {};
  Object.keys(validate).map((key) => {
    errors[key] = null;
    Object.keys(validate[key]).map((innerKey) => {
      if (!errors[key]) {
        errors[key] = validation[innerKey](values[key], validate[key][innerKey]);
      }
    });
  });
  if (hasAnyValue(errors)) {
    haveErrors(errors);
  } else {
    noErrors();
  }
};
