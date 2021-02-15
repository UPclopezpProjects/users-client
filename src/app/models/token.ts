export class Token{
	constructor(
		public token: string,
		public email: string,
		public typeOfOperation: string,
		public nameOfOperation: string
	){}
}