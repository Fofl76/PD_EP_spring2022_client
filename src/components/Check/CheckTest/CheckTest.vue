<template>
	<v-card class="CheckTest">
		<div class="CheckTest__top">
			<div class="CheckTest__title" @click.self="toggleOpen">
				{{ test.title }}
				<v-icon
					class="CheckTest__chevron"
					:class="{
						'CheckTest__chevron--up': isOpen,
					}"
				>
					mdi-chevron-down
				</v-icon>
			</div>

			<div class="CheckTest__result">
				<div
					v-if="test.result"
					class="CheckTest__result-mark CheckTest__result-mark--success"
				>
					<v-icon>mdi-check</v-icon>
				</div>
				<div
					v-else
					class="CheckTest__result-mark CheckTest__result-mark--error"
				>
					<v-icon>mdi-close</v-icon>
				</div>
			</div>
		</div>

		<v-data-table
			v-if="table"
			:hide-default-footer="true"
			:dark="true"
			class="CheckTest__table"
			:items-per-page="-1"
			v-show="isOpen"
			:headers="headers"
			:items="table"
		/>
	</v-card>
</template>

<script>
const periodMap = {
	'1-2': 'Первый-Второй семестр',
	'3-4': 'Третий-Четвертый семестр',
	'5-6': 'Пятый-Шестой семестр',
	'7-8': 'Седьмой-Восьмой семестр',
	1: 'Первый семестр',
	2: 'Второй семестр',
	3: 'Третий семестр',
	4: 'Четвертый семестр',
	5: 'Пятый семестр',
	6: 'Шестой семестр',
	7: 'Седьмой семестр',
	8: 'Восьмой семестр',
}

export default {
	props: {
		test: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			isOpen: false,
		}
	},

	computed: {
		headers() {
			if (!this.test.detailed) {
				return [
					{ text: 'От', value: 'min', sortable: false },
					{ text: 'До', value: 'max', sortable: false },
					{ text: 'Значение', value: 'value', sortable: false },
				]
			}

			return [
				{ text: 'Период', value: 'period', sortable: false },
				{ text: 'Дисциплина', value: 'discipline', sortable: false },
				{ text: 'От', value: 'min', sortable: false },
				{ text: 'До', value: 'max', sortable: false },
				{ text: 'Значение', value: 'value', sortable: false },
			]
		},

		table() {
			if (!this.test.detailed)
				return [
					{
						max: this.test.max || '-',
						min: this.test.min || '-',
						value: this.test.value || '-',
					},
				]

			return this.test.detailed.map(t => {
				if (t.period_id) {
					if (Array.isArray(t.period_id)) {
						t.period = periodMap[t.period_id.join('-')]
					} else {
						t.period = periodMap[t.period_id]
					}
				} else {
					t.period = '-'
				}

				t.discipline = t.discipline || '-'
				t.max = t.max || '-'
				t.min = t.min || '-'
				t.value = t.value || '-'

				return t
			})
		},
	},

	methods: {
		toggleOpen() {
			this.isOpen = !this.isOpen
		},
	},
}
</script>

<style lang="scss" scoped>
.CheckTest {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-top: 20px;
	width: 75%;
	background: #272727 !important;
	color: #fff !important;
	padding: 15px 20px;

	&__table {
		width: 100%;
		background-color: #444 !important;
		color: #fff !important;
	}

	&__top {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(3, 1fr);
	}

	&__chevron {
		color: #fff;
		transition: 0.15s transform;

		&--up {
			transform: rotate(180deg);
		}
	}

	&__title {
		cursor: pointer;
		grid-column: 2;
		justify-self: center;
		text-align: center;
		display: flex;
		align-items: center;
	}

	&__result {
		grid-column: 3;
		justify-self: end;
	}

	&__result-mark {
		padding: 5px;
		border-radius: 50%;

		& > i {
			color: #fff;
		}

		&--success {
			background: #4caf50;
		}

		&--error {
			background: #f44336;
		}
	}
}
</style>
