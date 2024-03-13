<template>
	<v-app class="Check">
		<v-main dark app class="Check__main">
			<template v-if="check">
				<CheckInfo
					:check="check"
					:settings="settings"
					@settings-change="
						v => {
							settings = v
						}
					"
				/>

				<CheckTest v-for="t in check.tests" :key="t.id" :test="t" />
			</template>

			<template v-else-if="isLoading">
				<MDataPreloader>
					<template #title>Идет загрузка</template>
				</MDataPreloader>
			</template>

			<template v-else>
				<MDataPreloader>
					<template #title>Нет данных</template>
				</MDataPreloader>
			</template>
		</v-main>
	</v-app>
</template>

<script>
import MDataPreloader from '@components/common/MDataPreloader.vue'
import CheckInfo from '@components/Check/CheckInfo/CheckInfo.vue'
import CheckTest from '@components/Check/CheckTest/CheckTest.vue'
import checkService from '@services/Check/CheckService'

export default {
	components: {
		MDataPreloader,
		CheckInfo,
		CheckTest,
	},

	data() {
		return {
			check: null,
			isLoading: true,
			settings: {
				showDetail: true,
				showSuccess: true,
			},
			abortController: null,
		}
	},

	computed: {
		aupCode() {
			return this.$route.query.aup
		},
	},

	watch: {
		'$route.query.aup'() {
			this.getCheck()
		},

		settings() {
			this.getCheck()
		},
	},

	mounted() {
		this.getCheck().finally(() => {
			this.isLoading = false
		})
	},

	methods: {
		async getCheck() {
			if (this.abortController) {
				this.abortController.abort()
			}

			this.abortController = new AbortController()

			const data = await checkService.getCheckResultForAup(
				this.aupCode,
				this.settings,
				this.abortController,
			)

			if (!data) return

			this.check = data
		},
	},
}
</script>

<style lang="scss">
.Check {
	height: 100%;

	&__main {
		& > div {
			padding: 40px 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: 100%;
			background-color: #444;
		}
	}
}
</style>
