import assert from 'assert';
import { minLength } from '../../validations';

// Note: each validator returns `true` when the `value` is invalid
describe('Validator: minLength', () => {
	it('should be valid when `value` is undefined and `prop` is 3', () => {
		assert(minLength({}, undefined, 3) === false);
	});
	it('should be valid when `value` is "1234" and `prop` is 3', () => {
		assert(minLength({}, '1234', 3) === false);
	});
	it('should be valid when `value` is "1234" and `prop` is 4', () => {
		assert(minLength({}, '1234', 4) === false);
	});
	it('should be invalid when `value` is "1234" and `prop` is 5', () => {
		assert(minLength({}, '1234', 5) === true);
	});
});
