const modes = {
	'map-mode': {
		title: 'Формирование кд',
	},
	'aup-mode': {
		title: 'Редактирование АУП',
	},
}

const state = {
	rightMenuEditWidth: 400,
	rightMenuEditModel: false,
	rightMenuEditItemId: null,

	isAuth: false,
	modes,
	currentMode: 'map-mode',

	canEditGroups: false,
	canViewGroups: true,
	canEditMap: false,
	canUploadPlan: false,
}

export default state
