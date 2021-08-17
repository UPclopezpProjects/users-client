export class Carriers{
	constructor(
		public driverName: string,
		public origin: string,
		public destination: string,
		public plates: string,
		public productPhotos: File,
		public vehiclePhotos: File,
		public tracking: any
	){}
}
