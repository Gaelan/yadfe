const NAMES = [
	'Aaron Swartz',
	'Alan Turing',
	'Anna Harren',
	'Brianna Ghey',
	'Manuel Ellis',
	'Near',
	'Nex Benedict',
	'Terry Pratchett'
];

export async function load({ setHeaders }) {
	setHeaders({
		'X-Clacks-Overhead': `GNU ${NAMES[Math.floor(Math.random() * NAMES.length)]}`
	});
}
