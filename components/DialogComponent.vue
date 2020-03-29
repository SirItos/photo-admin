<template>
  <v-card>
    <v-form @submit="call" lazy-validation :value="valid" ref="form">
      <v-card-title>
        <div style="word-break: break-word">{{ title }}</div>
      </v-card-title>

      <v-card-text>
        <div class="black--text" v-html="text"></div>
        <div v-if="form">
          <v-textarea
            label="Укажите причину"
            v-model="res"
            auto-grow
            :rules="[val=>!!val || 'Необходимо указать причину']"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="confirm"
          class="text-none"
          color="primary"
          @click="cancel"
          text
        >{{ cancelLabel }}</v-btn>
        <v-btn class="text-none" color="primary" depressed @click="call">
          {{
          okLabel
          }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AppDialog',
  computed: {
    ...mapState('dialog', [
      'title',
      'text',
      'okLabel',
      'cancelLabel',
      'okAction',
      'cancelAction',
      'confirm',
      'form',
      'reason'
    ])
  },
  data: () => ({
    valid: false,
    res: null,
    storeWatcher: null
  }),
  watch: {
    res: function(newVal) {
      this.setReason({ reason: newVal })
    }
  },
  created() {
    this.storeWatcher = this.$store.watch(
      state => state.dialog.visibility,
      newVal => {
        if (!newVal) {
          this.res = null
        }
      }
    )
  },
  beforeDestroy() {
    this.storeWatcher()
  },
  methods: {
    ...mapActions('dialog', ['setDialogParams', 'setReason']),
    call() {
      if (this.$refs.form.validate()) {
        if (this.okAction) {
          this.okAction()
          return
        }
        this.setDialogParams({})
      }
    },
    cancel() {
      if (this.cancelAction) {
        this.setReason({ reason: null })
        this.cancelAction()
        return
      }
      this.setDialogParams({})
      this.setReason({ reason: null })
    }
  }
}
</script>

<style lang="scss" scoped></style>
