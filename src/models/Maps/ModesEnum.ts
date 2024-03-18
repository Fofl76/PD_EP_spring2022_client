export enum ModesEnum {
	View = 'ViewMode',
	Map = 'MapMode',
	Aup = 'AupMode',
}

export interface IMode {
	title: string
	needPermission: boolean
}

export type IModes = Record<ModesEnum, IMode>
