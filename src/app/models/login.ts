export class Login{
	constructor(
		public email: string,
		public password: string,
		public typeOfUser: string,
		public typeOfOperation: string,
		public nameOfOperation: string,
	){}
}