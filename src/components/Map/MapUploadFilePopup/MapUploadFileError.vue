<template>
	<div class="MapUploadFileError" v-if="data.errors">
		<div
			class="MapUploadFileErrorBlock__wrapper"
			v-for="(error, i) in data.errors"
			:key="i"
		>
			<div class="MapUploadFileErrorBlock__error-header" v-if="i === 0">
				<v-chip
					class="MapUploadFileErrorBlock__chip"
					color="red"
					text-color="white"
					dense
					x-small
				>
					АУП: {{ data.aup }}
				</v-chip>
			</div>

			<div class="MapUploadFileErrorBlock">
				<div class="MapUploadFileErrorBlock__content">
					<div>{{ error.message }}</div>

					<div v-if="error.cells" class="MapUploadFileErrorBlock__error-cells">
						<v-chip
							v-for="(cell, i) in error.cells"
							:key="i"
							class="MapUploadFileErrorBlock__chip"
							small
						>
							{{ cell }}
						</v-chip>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MapUploadFileError',

	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},

	computed: {},
}
</script>

<style lang="sass">

.MapUploadFileErrorBlock
    padding: 12px 16px
    border-radius: 6px
    border: 1px dashed #FF5252

    &__wrapper
        margin: 8px 0 12px 32px
        position: relative

        &:not(:last-child)
            margin-bottom: 8px

    &__error-header
        position: absolute
        top: 0
        transform: translateY(-50%)
        left: 8px
        display: flex
        gap: 4px

    &__error-cells
        margin-top: 4px
        display: flex
        flex-wrap: wrap
        gap: 4px
</style>
