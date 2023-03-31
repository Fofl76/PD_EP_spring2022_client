<template>
	<v-app-bar app class="HomeHeader full-width" height="80" dark clipped-right>
		<div class="HomeHeader__inner">
			<v-select
				class="HomeHeader__input HomeHeader__input-faculty"
				:menu-props="{ offsetY: false }"
				:items="[]"
				item-text="faculty_name"
				no-data-text="Факультеты не найдены"
				@input="onSelectFaculty"
				return-object
				label="Выберите факультет"
				hide-details="auto"
				dark
				filled
				dense
			></v-select>

			<v-autocomplete
				label="Введите направление"
				class="HomeHeader__input HomeHeader__input-direction"
				v-model="directionModel"
				:items="[]"
				@input="onSelectDirection"
				no-data-text="Направления не найдены"
				item-text="name"
				return-object
				hide-details="auto"
				dark
				filled
				dense
			>
				<template v-slot:append>
					<div class="HomeHeader__year-chip--selected">
						<v-chip
							v-if="directionModel"
							class="HomeHeader__year-chip"
							pill
							label
						>
							{{ directionModel.year }}
						</v-chip>
					</div>
				</template>

				<template v-slot:item="{ item }">
					<v-list-item-title>{{ item.name }}</v-list-item-title>
					<div>
						<v-chip class="HomeHeader__year-chip" pill label>{{
							item.year
						}}</v-chip>
					</div>
				</template>
			</v-autocomplete>
		</div>

		<v-spacer></v-spacer>

		<!-- <v-btn text dark>
			<span>Группировки</span>
		</v-btn>

		<v-btn text dark>
			<span>Загрузить план</span>
			<v-icon right dark>mdi-upload</v-icon>
		</v-btn>
		
		<v-btn
			v-if="tableReady"
			:href="`${url}/save_excel/${aupCode}`"
			target="_blank"
			text
			dark
		>
			<span>Скачать</span>
			<v-icon right dark>mdi-download</v-icon>
		</v-btn> -->
	</v-app-bar>
</template>

<script lang="ts">
import Vue from "vue"

export default {
	name: 'AfsdFasdf',
	data() {
		return {
			test: {}
		}
	}
}
</script>

<style lang="sass">
.HomeHeader
    background-color: #333
    display: flex
    justify-content: space-between
    align-items: center

    .v-toolbar__content
        width: 100%

    &__inner
        display: flex
        align-items: center
        gap: 8px

    &__input-faculty
        width: 300px

    &__input-direction
        width: 500px

    &__year-chip
        justify-content: center

        &--selected
            margin-right: 4px

        .v-chip__content
            padding: 0 4px !important
</style>
