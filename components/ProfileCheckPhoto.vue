<template>
  <v-col cols="12">
    <client-only>
      <galery
        :images="galleryArray"
        :index="imgIndex"
        @close="imgIndex=null"
        style="margin-top:calc(env(safe-area-inset-top))"
      />
    </client-only>
    <v-row>
      <v-col cols="8" class="title primary--text">
        Фотографии
        <v-divider class="primary my-2"></v-divider>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col v-if="!images.length" cols="12" class="title">Нет фотографий</v-col>
          <v-col v-for="(image,index) in images" :key="`image_${index}`" md="3" sm="4" xs="2">
            <div class="img-shadow" @click="imgIndex = index">
              <v-img :src="image.url" :lazy-src="image.url" cover height="150px">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">111</v-row>
                </template>
              </v-img>
            </div>
          </v-col>
        </v-row>
        <!-- <client-only>
          <vue-picture-swipe :otions="{
          showHideOpacity:true
        }" />
        </client-only>-->
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'ProfilePhoto',
  components: {
    // 'vue-picture-swipe': () => import('vue-picture-swipe')
    galery: () => import('vue-gallery')
  },
  props: {
    images: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data: () => ({
    imgIndex: null
  }),
  computed: {
    galleryArray() {
      return this.images.map(item => {
        return item.url
      })
    }
  }
}
</script>

<style lang="scss">
.img-shadow {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}
</style>