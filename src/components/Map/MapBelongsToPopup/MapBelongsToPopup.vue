<template>
	<v-dialog
		:value="value"
		max-width="1000"
		class="MapBelongsToPopup"
		@input="onInputPopup"
	>
		<v-card class="MapBelongsToPopup__card">
			<v-card-title class="text-h5">
				<slot name="title"></slot>
			</v-card-title>
			<v-card-subtitle>
				<slot name="subtitle"></slot>
			</v-card-subtitle>

			<v-card-text class="MapBelongsToPopup__text">
				<div class="MapBelongsToPopup__main">
					<slot name="left"></slot>

					<v-divider vertical />

					<slot name="right"></slot>
				</div>
			</v-card-text>

			<v-card-actions>
				<v-spacer />

				<slot name="actions"></slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import draggable from 'vuedraggable'

import MapBelongsToPopupCreateTab from './MapBelongsToPopupCreateTab.vue'

export default {
	name: 'MapBelongsToPopup',

	props: {
		value: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		onInputPopup(event) {
			this.$emit('input', event)
		},
	},

	components: {
		draggable,
		MapBelongsToPopupCreateTab,
	},
}
</script>

<style lang="scss">
.MapBelongsToPopup {
	&__text {
		padding-bottom: 8px !important;
	}

	&__main {
		display: grid;
		grid-template-columns: 300px min-content 1fr;
	}

	&__card {
		hr[aria-orientation='vertical'] {
			margin: 0 8px;
		}

		hr[aria-orientation='horizontal'] {
			margin: 8px 0;
		}
	}
}
</style>
