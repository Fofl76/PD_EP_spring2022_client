<template>
	<v-list style="height: 305px; overflow-y: scroll" dense>
		<v-list-item-group v-model="_value" color="primary">
			<v-tooltip
				max-width="200"
				open-delay="700"
				left
				v-for="item in disciplines"
				:key="item.id"
			>
				<template v-if="item.id !== 1" v-slot:activator="{ on, attrs }">
					<v-hover v-slot="{ hover }">
						<v-list-item
              v-bind="attrs"
              :value="item.id"
              v-on="on"
            >
							<v-list-item-icon>
								<span :style="{ background: item.color }" class="circle" :class="{shadow: needIsDarkText(item.color)}"></span>
							</v-list-item-icon>

							<v-list-item-content>
								<v-list-item-title>{{ item.name }}</v-list-item-title>
							</v-list-item-content>

							<v-list-item-icon
								v-if="hover"
								@click.stop="$emit('deleteGroup', item)"
							>
								<v-hover v-slot="{ hover: _hover }">
									<v-icon :color="_hover ? 'black' : 'grey'">mdi-delete</v-icon>
								</v-hover>
							</v-list-item-icon>
						</v-list-item>
					</v-hover>
				</template>
				<span>{{ item.name }}</span>
			</v-tooltip>
		</v-list-item-group>
	</v-list>
</template>

<script>
import determinateTextColor from '@utils/determinateTextColor'

export default {
  props: {
    disciplines: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
	methods: {
		needIsDarkText(color) {
			return determinateTextColor(color)
		},
	}
}
</script>

<style lang="sass" scoped>
.circle
    width: 24px
    height: 24px
    border-radius: 100%
.shadow
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px
</style>
