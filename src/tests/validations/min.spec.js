import assert from 'assert';
import { min } from '../../validations';

// Note: each validator returns `true` when the `value` is invalid
describe('Validator: min', () => {
	it('should be valid when `value` is undefined and `prop` is 3', () => {
		assert(min({}, undefined, 3) === false);
	});
	it('should be invalid when `value` is "99" and `prop` is 100', () => {
		assert(min({}, '99', 100) === true);
	});
	it('should be valid when `value` is "100" and `prop` is 100', () => {
		assert(min({}, '100', 100) === false);
	});
	it('should be valid when `value` is "101" and `prop` is 100', () => {
		assert(min({}, '101', 100) === false);
	});
	it('should be invalid when `value` is 99 and `prop` is 100', () => {
		assert(min({}, 99, 100) === true);
	});
	it('should be valid when `value` is 100 and `prop` is 100', () => {
		assert(min({}, 100, 100) === false);
	});
	it('should be valid when `value` is 101 and `prop` is 100', () => {
		assert(min({}, 101, 100) === false);
	});
});
