import { ModesEnum, type IModes } from '@models/Maps'

const modes: IModes = {
	[ModesEnum.View]: {
		title: 'Режим просмотра',
		needPermission: false,
	},
	[ModesEnum.Map]: {
		title: 'Формирование КД',
		needPermission: true,
	},
	[ModesEnum.Aup]: {
		title: 'Редактирование АУП',
		needPermission: true,
	},
}

const state = {
	rightMenuEditWidth: 400,
	rightMenuEditModel: false,
	rightMenuEditItemId: null,

	isAuth: false,
	modes,
	currentMode: ModesEnum.View,

	canEditGroups: false,
	canViewGroups: true,
	canEditMap: false,
	canUploadPlan: false,
}

export default state
