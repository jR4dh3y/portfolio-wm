export function formatCompactNumber(value: number): string {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: value >= 1000 && value < 10000 ? 1 : 0
	})
		.format(value)
		.toLowerCase();
}
