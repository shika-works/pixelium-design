import { describe, it, expect } from 'vitest'
import { getDateObj, formaDate, parseDate } from '../time'
import { DEFAULT_YEAR } from '../../const'

describe('getDateObj', () => {
	it('should create a date object with given components', () => {
		const date = getDateObj(2023, 0, 15, 10, 30, 45, 500)
		expect(date.getFullYear()).toBe(2023)
		expect(date.getMonth()).toBe(0) // January
		expect(date.getDate()).toBe(15)
		expect(date.getHours()).toBe(10)
		expect(date.getMinutes()).toBe(30)
		expect(date.getSeconds()).toBe(45)
		expect(date.getMilliseconds()).toBe(500)
	})

	it('should default to zero values', () => {
		const date = getDateObj()
		expect(date.getFullYear()).toBe(1970)
		expect(date.getMonth()).toBe(0)
		expect(date.getDate()).toBe(1)
		expect(date.getHours()).toBe(0)
		expect(date.getMinutes()).toBe(0)
		expect(date.getSeconds()).toBe(0)
		expect(date.getMilliseconds()).toBe(0)
	})

	it('should handle negative year', () => {
		const date = getDateObj(-100, 5, 10)
		expect(date.getFullYear()).toBe(-100)
		expect(date.getMonth()).toBe(5)
		expect(date.getDate()).toBe(10)
	})
})

describe('formaDate', () => {
	const testDate = new Date(2023, 0, 15, 14, 5, 9, 123) // Jan 15, 2023 14:05:09.123

	it('should format YYYY, YY, MM, DD', () => {
		expect(formaDate(testDate, 'YYYY-MM-DD')).toBe('2023-01-15')
		expect(formaDate(testDate, 'YY/MM/DD')).toBe('23/01/15')
	})

	it('should format time with HH, mm, ss, SSS', () => {
		expect(formaDate(testDate, 'HH:mm:ss.SSS')).toBe('14:05:09.123')
	})

	it('should format 12-hour clock with hh and A', () => {
		expect(formaDate(testDate, 'hh:mm A')).toBe('02:05 PM')
		const amDate = new Date(2023, 0, 15, 0, 30)
		expect(formaDate(amDate, 'hh:mm A')).toBe('12:30 AM')
		const noonDate = new Date(2023, 0, 15, 12, 0)
		expect(formaDate(noonDate, 'hh:mm A')).toBe('12:00 PM')
	})

	it('should format quarter Q', () => {
		expect(formaDate(new Date(2023, 0, 1), 'Q')).toBe('1')
		expect(formaDate(new Date(2023, 3, 1), 'Q')).toBe('2')
		expect(formaDate(new Date(2023, 6, 1), 'Q')).toBe('3')
		expect(formaDate(new Date(2023, 9, 1), 'Q')).toBe('4')
	})

	it('should escape text inside brackets', () => {
		expect(formaDate(testDate, '[Year] YYYY')).toBe('Year 2023')
		expect(formaDate(testDate, '[[YYYY]]')).toBe('[YYYY]')
	})

	it('should handle negative years', () => {
		const negativeYearDate = getDateObj(-100, 0, 1)
		expect(formaDate(negativeYearDate, 'YYYY')).toBe('-0100')
		expect(formaDate(negativeYearDate, 'YY')).toBe('00')
	})

	it('should pad zero for single digit values', () => {
		const date = new Date(2023, 0, 5, 9, 3, 2, 7)
		expect(formaDate(date, 'MM/DD HH:mm:ss.SSS')).toBe('01/05 09:03:02.007')
	})
})

describe('parseDate', () => {
	it('should parse YYYY-MM-DD HH:mm:ss', () => {
		const result = parseDate('2023-01-15 14:05:09', 'YYYY-MM-DD HH:mm:ss')
		expect(result?.getFullYear()).toBe(2023)
		expect(result?.getMonth()).toBe(0)
		expect(result?.getDate()).toBe(15)
		expect(result?.getHours()).toBe(14)
		expect(result?.getMinutes()).toBe(5)
		expect(result?.getSeconds()).toBe(9)
	})

	it('should parse YY-MM-DD with default century', () => {
		const result = parseDate('23-05-20', 'YY-MM-DD')
		expect(result?.getFullYear()).toBe(2023)
		expect(result?.getMonth()).toBe(4)
		expect(result?.getDate()).toBe(20)
	})

	it('should parse with quarter Q', () => {
		const q1 = parseDate('2023-1', 'YYYY-Q')
		expect(q1?.getMonth()).toBe(0) // Jan
		const q3 = parseDate('2023-3', 'YYYY-Q')
		expect(q3?.getMonth()).toBe(6) // Jul
	})

	it('should parse 12-hour format with AM/PM', () => {
		const pmDate = parseDate('02:05 PM', 'hh:mm A')
		expect(pmDate?.getHours()).toBe(14)
		expect(pmDate?.getMinutes()).toBe(5)

		const amDate = parseDate('12:30 AM', 'hh:mm A')
		expect(amDate?.getHours()).toBe(0)
		expect(amDate?.getMinutes()).toBe(30)

		const noon = parseDate('12:00 PM', 'hh:mm A')
		expect(noon?.getHours()).toBe(12)
	})

	it('should parse with milliseconds', () => {
		const result = parseDate('12:34:56.789', 'HH:mm:ss.SSS')
		expect(result?.getMilliseconds()).toBe(789)
	})

	it('should handle escaped text in template', () => {
		const result = parseDate('Year 2023', '[Year] YYYY')
		expect(result?.getFullYear()).toBe(2023)
	})

	it('should return null if string does not match template', () => {
		expect(parseDate('YYYY-MM-DDabc', 'YYYY-MM-DD').getTime()).toBeNaN()
	})

	it('should default missing day to 1', () => {
		const result = parseDate('2023-01', 'YYYY-MM')
		expect(result?.getDate()).toBe(1)
	})

	it('should default missing time components to 0', () => {
		const result = parseDate('2023-01-15', 'YYYY-MM-DD')
		expect(result?.getHours()).toBe(0)
		expect(result?.getMinutes()).toBe(0)
		expect(result?.getSeconds()).toBe(0)
		expect(result?.getMilliseconds()).toBe(0)
	})

	it('should parse week number ww (as a numeric token but not used in date calculation in parseDate)', () => {
		// parseDate only captures 'ww' but doesn't use it to set date; it's ignored.
		// This test ensures it doesn't break parsing of other fields.
		const result = parseDate('2023-01-15 10', 'YYYY-MM-DD ww')
		expect(result?.getFullYear()).toBe(2023)
		expect(result?.getMonth()).toBe(0)
		expect(result?.getDate()).toBe(15)
	})

	it('should handle negative years in YYYY', () => {
		const result = parseDate('-0100-01-01', 'YYYY-MM-DD')
		expect(result?.getFullYear()).toBe(-100)
	})
	describe('formaDate with ISO week (ww)', () => {
		it('should format week number according to ISO 8601', () => {
			// 2023-01-01 Sunday
			expect(formaDate(new Date(2023, 0, 1), 'ww')).toBe('52')
			// 2023-01-02 Monday
			expect(formaDate(new Date(2023, 0, 2), 'ww')).toBe('01')
			// 2023-12-31 Sunday
			expect(formaDate(new Date(2023, 11, 31), 'ww')).toBe('52')
			// 2024-01-01 Monday
			expect(formaDate(new Date(2024, 0, 1), 'ww')).toBe('01')
		})
	})

	describe('parseDate with ISO week (ww)', () => {
		it('should parse YYYY-ww as Monday of that ISO week', () => {
			// 2023-W01 Monday is 2023-01-02
			const result = parseDate('2023-01', 'YYYY-ww')
			expect(result?.getFullYear()).toBe(2023)
			expect(result?.getMonth()).toBe(0) // January
			expect(result?.getDate()).toBe(2)
			expect(result?.getDay()).toBe(1) // Monday
		})

		it('should handle week that spans across years', () => {
			// 2023-W52 Monday is 2023-12-25
			const result = parseDate('2023-52', 'YYYY-ww')
			expect(result?.getFullYear()).toBe(2023)
			expect(result?.getMonth()).toBe(11) // December
			expect(result?.getDate()).toBe(25)
			expect(result?.getDay()).toBe(1)
		})

		it('should parse week without year and default to current year', () => {
			const currentYear = DEFAULT_YEAR
			const result = parseDate('10', 'ww')
			expect(result.getDay()).toBe(1)
			expect(result.getFullYear() - currentYear).toBeGreaterThanOrEqual(-1)
			expect(result.getFullYear() - currentYear).toBeLessThanOrEqual(0)
		})

		it('should be symmetric with formaDate', () => {
			const original = new Date(2024, 0, 8) // Monday, Jan 8, 2024 → ISO week 02
			const formatted = formaDate(original, 'YYYY-ww')
			expect(formatted).toBe('2024-02')

			const parsed = parseDate(formatted, 'YYYY-ww')
			expect(parsed?.getFullYear()).toBe(2024)
			expect(parsed?.getMonth()).toBe(0)
			expect(parsed?.getDate()).toBe(8)
			expect(parsed?.getDay()).toBe(1)
		})
	})
})
