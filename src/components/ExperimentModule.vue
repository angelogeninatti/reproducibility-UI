<script setup>
const globalData = inject('globalData');

import SearchResults from "@/components/SearchResults.vue";
import GridQuestionnaire from "@/components/GridQuestionnaire.vue";
import {ref, inject, defineEmits, onMounted} from 'vue';
import axios from 'axios';
import RateResults from "@/components/RateResults.vue";
const emit = defineEmits(['nextpage', 'chosen', 'stopexperiment']);

const phase = ref(0);
const current_query = ref('');
const results = ref([]);
const props = defineProps({
  already_chosen: {
    type: Array,
    required: true
  },
  step: {
    type: String,
    required: true
  },
  batch_size: {
    type: Number,
    required: true
  },
  b: {
    type: Number,
    required: true
  },
  k1: {
    type: Number,
    required: true
  }
})
window.step = props.step;
let already_chosen = ref(props.already_chosen);

globalData.log_data({log: 'next_phase', phase: 0});
function nextPhase(){
  window.scrollTo(0, 0);
  phase.value++;
  if(phase.value >= globalData.NUM_EXP_PHASES)
    emit('nextpage')
  else{
    globalData.current_scene.value++;
    globalData.log_data({log: 'next_phase', phase: phase.value});
  }
}
async function switch_results(){
  emit('chosen', current_query.value, false)
  current_query.value = ''
  await request_query()
  await globalData.log_data({log: 'next_phase', phase: 0});
  phase.value = 0;
}

function chosen(){
  emit('chosen', current_query.value)
  nextPhase()
}

async function request_query() {
  await globalData.load_next_query(already_chosen, async (res) => {
    current_query.value = res.data.query
    results.value = res.data.results;
    await globalData.log_data({log: 'search_results', query: res.data.query, results: res.data.results})
    if (res.data.results.length === 0) {
      await globalData.log_data({log: 'no_queries_left'})
      emit('stopexperiment')
    }
  })
}

onMounted(async () => {
  await request_query()
})
</script>
<template>
  <div v-if="current_query === ''">Loading...</div>
  <div v-else>
    <SearchResults :query="current_query" :results="results" v-if="phase===0" @nextphase="chosen" @switch="switch_results"></SearchResults>
    <GridQuestionnaire v-else-if="phase===1" @nextphase="nextPhase">
      <p>All the results were relevant to the related query.</p>
      <p>At least one result was relevant to the selected query.</p>
      <p>The results were repetitive.</p>
      <p>The results allowed me to satisfy the requested query.</p>
      <p>The results were insufficient to satisfy my query.</p>
    </GridQuestionnaire>
  </div>
</template>

<style scoped>

</style>