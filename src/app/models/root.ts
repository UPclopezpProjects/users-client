export class Root{
	constructor(
		public email: string,
		public password: string,
		public typeOfUser: string,
		public initialToken: string,
		public typeOfOperation: string,
		public nameOfOperation: string,
		public addressU: string,
		public hashX: string,
		public dp: any
	){}
}