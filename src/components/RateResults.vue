<script setup>
import {ref, inject, defineEmits, onMounted, computed} from 'vue';
import Result from './Result.vue';

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
  }
});

const results = ref(props.results.map(el => {
  return {
    title: el.title_gpt4o,
    text: el.text,
    rating: 0
  }
}));
let attentionCheckIndex;
onMounted(() => {
  const options = [1, -1]
  attentionCheckIndex = Math.floor(Math.random() * (results.value.length + 1));
  const randomOption = options[Math.floor(Math.random() * options.length)];
  let attentionCheckResult = {
    title: `Please select ${randomOption === 1 ? '<span class="material-symbols-outlined" style="font-size:18px !important;">thumb_up</span>' : '<span class="material-symbols-outlined" style="font-size:18px !important;">thumb_down</span>'} for this result`,
    text: `Please follow the instruction in the title.`,
    expectedRating: randomOption
  };
  results.value.splice(attentionCheckIndex, 0, attentionCheckResult);
});

async function like(index) {
  results.value[index].rating = 1;
}

async function dislike(index) {
  results.value[index].rating = -1;
}

async function save() {
  await globalData.log_data({log: 'rating_results', query: props.query, results: results.value});
  let attentionCheckOk = results.value[attentionCheckIndex].expectedRating === results.value[attentionCheckIndex].rating
  await globalData.log_data({log: 'rating_attention_check_passed', passed: attentionCheckOk})
  emit('nextphase');
}

const ratingsMissing = computed(() => {
  return results.value.some(result => result.rating === 0);
});
</script>
<template>
  <div>
    <div class="instruction-box">
      <h3>Instructions</h3>
      <ul>
        <li>Please rate each result you just saw.</li>
        <li>Click on 👍 if you think the result is relevant to the query, or on 👎 if you think it is not.</li>
        <li>Click on “Continue”, when you have rated each result.</li>
      </ul>
      Please note that you cannot go back once you click on "Continue".
    </div>
    <h1>Search results for <span id="query_str">"{{ query.qstr }}"</span></h1>
    <div v-if="results.length > 0">
      <div v-for="(result, index) in results" :key="index" class="result-container">
        <Result :title="result.title" :text="result.text" mode="rate" :index="index" class="result" :irrelevant="results[index].rating === -1"/>
        <div class="button-container">
          <button @click="like(index)" :class="{'selected-like':result.rating === 1}" style="margin-right:5px">👍</button>
          <button @click="dislike(index)" :class="{'selected-dislike':result.rating === -1}">👎</button>
        </div>
      </div>
      <hr>
      <input type="button" :disabled="ratingsMissing" value="Continue" @click="save" :title="ratingsMissing ? 'Please rate each result before continuing': ''"></div>
    <div v-else><p>No results found.</p></div>
  </div>
</template>
<style scoped>
.instruction-box {
  border: 2px solid #333;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.instruction-box h3 {
  margin-top: 0;
}

.selected-like {
  background-color: green;
}

.selected-dislike {
  background-color: red;
}

.result{
  width: 80%;
}

.result-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-container {
  display: flex;
}

h1{
  font-weight:300;
  margin-bottom:0.5em;
}

#query_str{
  border-radius: 5px;
  border: 1px solid black;
  padding: 0.5em;
  font-weight:500;
}
</style>