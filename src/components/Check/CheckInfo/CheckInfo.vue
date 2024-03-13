<template>
	<v-card class="CheckInfo">
		<h2>{{ check.okso }} {{ check.profile }}</h2>

		<div class="CheckInfo__info">
			<div class="CheckInfo__left">
				<div>{{ check.faculty }}</div>
				<div>Направление: {{ check.program }}</div>
				<div>Форма обучения: {{ check.education_form }}</div>
				<div>Специализация: {{ check.profile }}</div>
				<div>Дата проверки: {{ check.check_date }}</div>

				<div class="CheckInfo__control">
					<v-simple-checkbox
						color="#fff"
						dense
						:value="settings.showDetail"
						@input="
							$emit('settings-change', {
								...settings,
								showDetail: !settings.showDetail,
							})
						"
					/>
					Отображать дополнительную информацию
				</div>

				<div class="CheckInfo__control">
					<v-simple-checkbox
						dense
						color="#fff"
						:value="settings.showSuccess"
						@input="
							$emit('settings-change', {
								...settings,
								showSuccess: !settings.showSuccess,
							})
						"
					/>
					Отображать успешные тесты
				</div>
			</div>

			<div class="CheckInfo__right">
				<v-progress-circular
					:rotate="270"
					:size="160"
					:width="15"
					:value="successPercents"
					color="green"
				>
					{{ success }} / {{ check.tests.length }}
				</v-progress-circular>
			</div>
		</div>
	</v-card>
</template>

<script>
export default {
	props: {
		check: {
			type: Object,
			required: true,
		},
		settings: {
			type: Object,
			required: true,
		},
	},

	computed: {
		success() {
			return this.check.tests.filter(e => e.result).length
		},

		successPercents() {
			return (this.success / this.check.tests.length) * 100
		},
	},
}
</script>

<style lang="scss">
.CheckInfo {
	width: 75%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #272727 !important;
	color: #fff !important;
	padding: 15px 20px;

	&__control {
		display: flex;
		align-items: center;
	}

	&__left {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__info {
		padding: 10px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
}
</style>
