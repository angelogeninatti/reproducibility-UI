<script setup>
import {inject, onMounted, ref} from "vue";
import axios from "axios";
const globalData = inject('globalData');
const props = defineProps({
    already_chosen: {
        type: Array,
        required: true
    }
})
const emit = defineEmits(['chosenquery', 'stopexperiment']);
function chooseQuery(query) {
    loading_documents.value = true
    globalData.log_data({log: 'choose_query', query: query})
    emit('chosenquery', query);
}
function parseParams(params) {
  const keys = Object.keys(params)
  let options = ''

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === 'object'
    const isParamTypeArray = isParamTypeObject && params[key].length >= 0

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element) => {
        options += `${key}=${element}&`
      })
    }
  })

  return options ? options.slice(0, -1) : options
}
let selected = ref([]);
let loading_queries = ref(true);
let loading_documents = ref(false)
onMounted(async () => {
  await axios.get(globalData.get_queries_url, {params: {
    num_queries: globalData.NUM_QUERIES_PER_EXP,
    already_selected: props.already_chosen.map(el => el.query_id),
  },
    paramsSerializer: (params) => parseParams(params),
  }).then(res => {
    selected.value = res.data
    loading_queries.value = false
    if (selected.value.length === 0) {
      globalData.log_data({log: 'no_queries_left'})
      emit('stopexperiment')
    }
  })
})
</script>

<template>
  <div>
    <h1>Please choose a query</h1>
    <p>Please select a query you know something about. You will be asked to rate results related to it.</p>
    <div v-if="!loading_queries" v-for="(query, index) in selected" :key="index" class="query">
      {{query.qstr}} <input type="button" value="Choose" @click="chooseQuery(query)" :disabled="loading_documents" :class="{loadingDocuments: loading_documents}">
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped>
.query{
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input[type=button], button{
  margin-bottom: 0;
}
.loadingDocuments{
  cursor: wait !important;
}
</style>