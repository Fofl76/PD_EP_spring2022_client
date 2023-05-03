<template>
	<v-expansion-panels
		class="RightMenuEditMapitemExpansion__wrapper"
		flat
		hover
	>
		<v-expansion-panel class="RightMenuEditMapItem">
			<v-expansion-panel-header>
				<div class="RightMenuEditMapItem__expansion-header">
					<div class="RightMenuEditMapItem__expansion-header-title">
						<slot name="title" />
					</div>

					<MHint
						contentClass="RightMenuEditMapItem__hint"
						:tooltipText="tooltipText"
					/>
				</div>
			</v-expansion-panel-header>

			<v-expansion-panel-content>
				<slot />
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
import MHint from '@components/common/MHint.vue'

export default {
	name: 'RightMenuEditMapitemExpansion',
	components: { MHint },
  props: {
    tooltipText: {
      type: String,
      default: null,
    }
  },
}
</script>

<style lang="sass">
.RightMenuEditMapitemExpansion
  background-color: rgba(255, 255, 255, 0.08) !important

  .v-expansion-panel-header
      min-height: 52px !important
      padding: 16px !important
      border-bottom: 1px solid rgba(255, 255, 255, 0.7) !important
      position: relative
      flex-direction: row-reverse !important

      &:after
          content: ''
          position: absolute
          width: 100%
          height: 1px
          bottom: 0
          left: 0
          background-color: #fff
          transform: rotateY(90deg)
          transition: transform .25s ease
      
      .v-expansion-panel-header__icon
          margin-right: 8px

          i
              transform: rotate(-90deg)


  .v-expansion-panel-content__wrap
      padding: 0 16px 16px 16px !important

  &.v-expansion-panel--active

      .v-expansion-panel-header
          &:after
              transform: rotateY(0deg)


.RightMenuEditMapitemExpansion__wrapper
  order-radius: 4px 4px 0 0 !important
</style>
