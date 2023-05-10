<template>
  <div
    class="aup-table__block-wrapper"
    :class="{
      isEditing, 
      fitMode: fitMode && totalZet <= 2}"
    :style="styleVars"
  >
    <div class="aup-table__block" :style="{ backgroundColor }">
      <v-tooltip bottom :open-delay="300">
        <template v-slot:activator="{ on, attrs }">
          <span
            :class="classTableItem"
            class="aup-table__name"
            v-bind="attrs"
            v-on="on"
          >
            {{ data.element.discipline }}
          </span>
        </template>

        <span>{{ data.element.discipline }}</span>
      </v-tooltip>

      <v-btn
        class="aup-table__edit-btn"
        color="white"
        x-small
        fab
        icon
        @click="onEdit"
      >
        <v-icon dark> mdi-pen </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import determinateTextColor from '@utils/determinateTextColor'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },

    isEditing: {
      type: Boolean,
      default: false,
    },
    
    fitMode: {
      type: Boolean,
      default: false,
    },

    height: {
      type: String,
      default: '90px',
    },

    totalZet: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      modeTable: 'default',
    }
  },
  computed: {
    backgroundColor() {
      return this.data.group?.color
    },

    classTableItem() {
      return 'aup-table__name__' + this.modeTable
    },

    needIsDarkText() {
      return determinateTextColor(this.backgroundColor)
    },

    styleVars() {
      return {
        '--height-block': this.height,
        '--text-color': this.needIsDarkText ? '#333' : '#fff',
      }
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.data.element)
    },
  },
}
</script>

<style lang="sass" scoped>
.aup-table
    &__block
        position: relative
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 100%
        padding: 5px
        text-align: center
        border-radius: 8px
        font-size: 100%
        font-family: sans-serif
        cursor: grab
        transition: box-shadow .25s ease

        &:hover
            .aup-table__edit-btn
                opacity: 1

    &__block-wrapper
        height: var(--height-block)


        &.fitMode:hover
          height: calc(var(--height-block) * 3)

        &.isEditing
            .aup-table__block
                box-shadow: 0px 0px 3px 7px rgba(10, 110, 189, 0.7)

    &__name
        color: var(--text-color)
        overflow: hidden
        line-height: 2rem
        max-height: 8rem
        -webkit-box-orient: vertical
        display: block
        max-height: 100%
        display: -webkit-box
        overflow: hidden !important
        text-overflow: ellipsis
        font-weight: bold
        -webkit-line-clamp: 4
        &__full
          -webkit-line-clamp: 1

    &__name-tooltip
        border: 111px solid red

    &__edit-btn
        background-color: rgba(255, 255, 255, 0.1)
        position: absolute
        right: 8px
        top: 8px
        opacity: 0
        transition: opacity .25s ease
</style>
