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

export function matchField(field, value, prop, dispatch, allValues) {
	return !value ? false : value !== allValues[prop];
}

export default {
	required,
	minLength,
	maxLength,
	email,
	min,
	max,
	pattern,
	equalTo,
	oneOf,
	url,
	promise,
	digits,
	matchField
};
