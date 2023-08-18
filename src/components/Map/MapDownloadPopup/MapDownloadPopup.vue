<template>
  <v-dialog v-model="value_" max-width="600" class="MapGroupsPopup">
    <v-card>
      <v-card-title class="text-h5">Выбор формата</v-card-title>
      <v-card-text class="MapGroupsPopup__text">
        <MSelect :dark="false" label="Формат" v-model="format" :items="formats" item-text="label" :return-object="false" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="value_ = false">Отмена</v-btn>
        <v-btn color="success" @click="onDownload">
          <!-- :loading="isLoadingUploadFile" -->
          Скачать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MSelect from '@components/common/MSelect.vue';
import axios from '@services/api/axios';

export default {
  components: { MSelect },
  name: 'MapDownloadPopup',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  
  data() {
    return {
      format: {
        label: 'А3',
        value: 3,
      },
      formats: [
        {
          label: 'А3',
          value: 3,
        },
        {
          label: 'А4',
          value: 4,
        }
      ]
    }
  },
  computed: {
    value_: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },

    aupCode() {
			return this.$route.query.aup
		},

		downloadURL() {
			return `${process.env.VUE_APP_API}/save_excel/${this.aupCode}`
		},
  },
  methods: {
    async onDownload() {
      try {
				const resp = await axios.get(this.downloadURL, {
					responseType: 'blob',
          params: {
            paper_size: this.format.value,
          }
				})

				const file = new Blob([resp.data])

				const link = document.createElement('a')
				link.download = `${this.aupCode}.xlsx`
				link.href = URL.createObjectURL(file)

				link.click()
				URL.revokeObjectURL(link.href)
        this.value_ = false
			} catch (err) {
				console.log(err)
			}
    }
  },
}
</script>