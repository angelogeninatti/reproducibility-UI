<script setup>
import {ref, onMounted, computed, defineEmits, inject} from 'vue';

const questions = ref([]);
const options = ["Strongly Disagree", "Disagree", "Neither Agree nor Disagree", "Agree", "Strongly Agree"]
const emit = defineEmits(['nextphase']);
const globalData = inject('globalData');

onMounted(() => {
  questions.value = [...document.querySelector('.questionnaire-content').children].map((question, index) => ({
    id: index + 1,
    text: question.textContent.trim(),
    answer: null
  }));

  // Add attention check question at a random position
  const attentionCheckIndex = Math.floor(Math.random() * (questions.value.length + 1));
  const randomOption = options[Math.floor(Math.random() * options.length)];
  const attentionCheckQuestion = {
    id: questions.value.length + 1,
    text: `Please select ${randomOption}.`,
    answer: null,
    isAttentionCheck: true,
    correctAnswer: randomOption
  };
  questions.value.splice(attentionCheckIndex, 0, attentionCheckQuestion);
});

const attentionCheckPassed = computed(() => {
  const attentionCheckQuestion = questions.value.find(q => q.isAttentionCheck);
  return attentionCheckQuestion && attentionCheckQuestion.answer === attentionCheckQuestion.correctAnswer;
});

function updateAnswer(questionId, option) {
  const question = questions.value.find(q => q.id === questionId);
  if (question) {
    question.answer = option;
  }
}

const allQuestionsAnswered = computed(() => {
  return questions.value.every(question => question.answer !== null);
});

function answeredQuestions () {
  globalData.log_data({log: 'answered_questions', questions: questions.value});
  globalData.log_data({log: 'questionnaire_attention_check_passed', passed: attentionCheckPassed.value});
  emit('nextphase');
}
</script>

<template>
  <div class="questionnaire">
    <p>Please answer the following questions about the results you just browsed in relation to the chosen query. Please note that you cannot go back once you click on "Continue".</p>
    <div class="questionnaire-content" style="display: none;">
      <slot></slot>
    </div>
    <table>
      <thead>
      <tr>
        <th>Question</th>
        <th v-for="option in options" :key="option">{{ option }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="question in questions" :key="question.id">
        <td>{{ question.text }}</td>
        <td v-for="option in options" :key="option" @click="updateAnswer(question.id, option)">
          <input
              type="radio"
              :name="`question-${question.id}`"
              :value="option"
              :checked="question.answer === option"
          />
        </td>
      </tr>
      </tbody>
    </table>
    <button :disabled="!allQuestionsAnswered" @click="answeredQuestions" :title="!allQuestionsAnswered ? 'Please answer all questions before continuing': ''">Continue</button>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}

td {
  cursor: pointer;
}

button {
  margin-top: 10px;
}
</style>