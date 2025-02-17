<script setup>
import {inject, defineEmits, ref} from 'vue';
import Result from './Result.vue';
import Instructions from "@/components/Instructions.vue";
const globalData = inject('globalData');
const emit = defineEmits(['nextphase', 'switch']);
const props = defineProps({
  query: {
    type: Object,
    required: true
  },
  results: {
    type: Array,
    required: true
  },
})

const currently_chosen = ref([])
const currently_discarded = ref([])
let opened_items = ref(new Set())

async function switch_results(log_key) {
  await globalData.log_data({log: log_key, query: props.query})
  emit('switch')
}

function chosen(index) {
  const chosenIndex = currently_chosen.value.indexOf(index)
  const discardedIndex = currently_discarded.value.indexOf(index)

  if (chosenIndex === -1) {
    currently_chosen.value.push(index)
    if (discardedIndex !== -1) {
      currently_discarded.value.splice(discardedIndex, 1)
    }
  } else {
    currently_chosen.value.splice(chosenIndex, 1)
  }
}

function discarded(index) {
  const discardedIndex = currently_discarded.value.indexOf(index)
  const chosenIndex = currently_chosen.value.indexOf(index)

  if (discardedIndex === -1) {
    currently_discarded.value.push(index)
    if (chosenIndex !== -1) {
      currently_chosen.value.splice(chosenIndex, 1)
    }
  } else {
    currently_discarded.value.splice(discardedIndex, 1)
  }
}

function cleared(index){
  const chosenIndex = currently_chosen.value.indexOf(index)
  const discardedIndex = currently_discarded.value.indexOf(index)

  if (chosenIndex !== -1) {
    currently_chosen.value.splice(chosenIndex, 1)
  } else if (discardedIndex !== -1) {
    currently_discarded.value.splice(discardedIndex, 1)
  }
}

async function confirm() {
  const chosenResults = currently_chosen.value.map(index => props.results[index])
  const discardedResults = currently_discarded.value.map(index => props.results[index])
  await globalData.log_data({
    log: 'confirmed',
    query: props.query,
    chosen_results: chosenResults,
    chosen_indices: currently_chosen.value,
    discarded_results: discardedResults,
    discarded_indices: currently_discarded.value
  })
  emit('nextphase')
}

function opened(index){
  opened_items.value.add(index)
}
</script>

<template>
  <div>
    <Instructions />
    <div class="search-header">
      <h2>Search results for <span id="query_str">"{{ query.qstr }}"</span></h2>
    </div>
    <div>
      <input type="button" value="I don't understand this query, give me another one" @click="switch_results('skipped_query')" id="skippedQuery">
    </div>
    <div>
      <Result
          v-for="(result, index) in results"
          @opened="opened"
          :key="index"
          :title="result.title_gpt4o"
          :text="result.text"
          mode="choose"
          @chosen="chosen"
          @discarded="discarded"
          @cleared="cleared"
          :index="index"
          :currently_chosen="currently_chosen.includes(index)"
          :currently_discarded="currently_discarded.includes(index)"
      />
      <div class="button-container">
        <input
            type="button"
            value="Continue"
            @click="confirm"
            :title="currently_chosen.length === 0 ? 'Please choose at least one result before continuing': 'Click here to confirm your choices'"
            :disabled="currently_chosen.length === 0"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;
}

h1{
  font-weight:300;
  padding-right:0.5em;
}

#query_str{
  border-radius: 5px;
  border: 1px solid black;
  padding: 0.5em;
  font-weight:500;
}</style>