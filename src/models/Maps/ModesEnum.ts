export enum ModesEnum {
	View = 'ViewMode',
	Map = 'MapMode',
	Aup = 'AupMode',
	Progress = 'ProgressMode',
}

export interface IMode {
	title: string
	needPermission: boolean
	onlyAdmin?: boolean
}

export type IModes = Record<ModesEnum, IMode>
