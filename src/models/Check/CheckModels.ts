type nullOrNumber = number | null

export interface ITestDetail {
	period_id: number
	discipline: string
	min: nullOrNumber
	max: nullOrNumber
	value: nullOrNumber
	result: boolean
}

export interface ITest {
	id: number
	title: string
	min: nullOrNumber
	max: nullOrNumber
	value: nullOrNumber
	measure_id: number
	result: boolean
	detailed: ITestDetail | null
}

export interface ICheck {
	aup: string
	okso: string
	faculty: string
	program: string
	profile: string
	education_form: string
	check_date: string
	result: boolean
}

export interface ICheckSettings {
	showDetail: boolean
	showSuccess: boolean
}
