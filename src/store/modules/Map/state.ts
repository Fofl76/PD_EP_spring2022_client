import { ModesEnum } from '@models/Maps'

const modes = {
	[ModesEnum.View]: {
		title: 'Режим просмотра',
	},
	[ModesEnum.Map]: {
		title: 'Формирование кд',
	},
	[ModesEnum.Aup]: {
		title: 'Редактирование АУП',
	},
}

const state = {
	rightMenuEditWidth: 400,
	rightMenuEditModel: false,
	rightMenuEditItemId: null,

	isAuth: false,
	modes,
	currentMode: ModesEnum.Map,

	canEditGroups: false,
	canViewGroups: true,
	canEditMap: false,
	canUploadPlan: false,
}

export default state
