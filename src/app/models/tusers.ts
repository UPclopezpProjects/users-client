export class TUsers{
	constructor(
		public fid: string,
		public code: string,
		public ubication: string,
		public name: string,
		public previousStage: string,
		public currentStage: string,
		public nameOfCompany: string,
		public image: File,
		public description: string
	){}
}
