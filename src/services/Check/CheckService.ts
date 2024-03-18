import Events from 'events'
import Api from '@services/api/Api'
import type { ICheckSettings } from '@models/Check'
import type { Key } from '@models/Key'

class CheckService extends Events {
	constructor(private api: typeof Api) {
		super()
	}

	async getCheckResultForAup(
		aup: Key,
		settings: ICheckSettings,
		abortController: AbortController,
	) {
		const resp = await this.api.fetchCheckResultByAup(
			aup,
			settings,
			abortController,
		)
		if (!resp.success) return null

		return resp.data
	}
}

const checkService = new CheckService(Api)
export default checkService
