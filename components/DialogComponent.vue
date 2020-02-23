<template>
  <v-card>
    <v-card-title>
      <div style="word-break: break-word">{{ title }}</div>
    </v-card-title>

    <v-card-text>
      <div class="black--text" v-html="text"></div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="confirm" class="text-none" color="primary" @click="cancel" text>{{ cancelLabel }}</v-btn>
      <v-btn class="text-none" color="primary" depressed @click="call">
        {{
        okLabel
        }}
      </v-btn>
    </v-card-actions>
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
      'confirm'
    ])
  },
  methods: {
    ...mapActions('dialog', ['setDialogParams']),
    call() {
      if (this.okAction) {
        this.okAction()
        return
      }
      this.setDialogParams({})
    },
    cancel() {
      if (this.cancelAction) {
        this.cancelAction()
        return
      }
      this.setDialogParams({})
    }
  }
}
</script>

<style lang="scss" scoped></style>
