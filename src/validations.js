import validUrl from 'valid-url';

export function required(field, value, prop) {
	return prop ? !value : false;
}

export function minLength(field, value, prop) {
	return prop && value ? value.length < prop : false;
}

export function maxLength(field, value, prop) {
	return prop && value ? value.length > prop : false;
}

export function email(field, value, prop) {
	return prop && value ?
		!(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value)) :
		false;
}

export function phone(field, value, prop) {
	return prop && value ? !/^(?:\s*\+)?[\d\s\.\-]{5,16}$/.test(value) : false;
}

export function min(field, value, prop) {
	return prop && value ? !isFinite(value) || parseFloat(value) < prop : false;
}

export function max(field, value, prop) {
	return prop && value ? !isFinite(value) || parseFloat(value) > prop : false;
}

export function pattern(field, value, prop) {
	return !value ? false : !prop.test(value);
}

export function equalTo(field, value, prop) {
	return !value ? false : prop !== value;
}

export function oneOf(field, value, prop) {
	return !value ? false : prop.indexOf(value) === -1;
}

export function url(field, value) {
	return !value ? false : !validUrl.isUri(value);
}

export function promise(field, value, prop) {
	if (typeof prop === 'function') {
		return prop(field, value);
	}
	throw new Error('FormValidation: type promise must be a function!');
}

export function digits(field, value) {
	return !field || !/^\d+$/.test(value);
}

export function matchField(field, value, prop, allValues) {
	return !value ? false : value !== allValues[prop];
}

export function patternIfMatchCondition(field, value, prop, allValues) {
	if (allValues[prop.field] === prop.condition) {
		return !value ? true : !prop.pattern.test(value)
	} else {
		return false;
	}
}

export function arrayGreaterThan(field, value, prop, allValues) {
	return allValues[prop.field].length >= prop.condition ? false : true;
}

export function requiredIfMatchCondition(field, value, prop, allValues) {
	return allValues[prop.field] === prop.condition && !value ? true : false;
}

export function shouldContainLowerCase(field, value, prop) {
	return prop && value ? !/^(?=.*[a-z])/.test(value) : false;
}

export function shouldContainUpperCase(field, value, prop) {
	return prop && value ? !/(?=.*[A-Z])/.test(value) : false;
}

export function shouldContainDigit(field, value, prop) {
	return prop && value ? !/(?=.*[0-9])/.test(value) : false;
}

export function shouldContainSpecialCharacter(field, value, prop) {
	return prop && value ? !/(?=.*[!_£@#\$%\^&\*])/.test(value) : false;
}

export default {
	required,
	minLength,
	maxLength,
	email,
	phone,
	min,
	max,
	pattern,
	equalTo,
	oneOf,
	url,
	promise,
	digits,
	matchField,
	patternIfMatchCondition,
	arrayGreaterThan,
	requiredIfMatchCondition,
	shouldContainLowerCase,
	shouldContainUpperCase,
	shouldContainDigit,
	shouldContainSpecialCharacter
};
