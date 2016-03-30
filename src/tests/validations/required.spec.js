import assert from 'assert';
import { required } from '../../validations';

describe('Validator: required', () => {
	it('should be valid when `value` is empty and `prop` is false', () => {
		assert(required({}, '', false) === false);
	});
	it('should be valid when `value` is truthy and `prop` is false', () => {
		assert(required({}, 'true', false) === false);
	});
	it('should be invalid when `value` is empty and `prop` is true', () => {
		assert(required({}, '', true) === true);
	});
	it('should be valid when `value` is truthy and `prop` is true', () => {
		assert(required({}, 'true', true) === false);
	});
});
