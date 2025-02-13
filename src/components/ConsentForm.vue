<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(['nextpage']);
function checkSubmission(){
  if(document.getElementsByName('check')[0].checked && document.getElementsByName('check2')[0].checked){
    emit('nextpage')
  }else{
    document.getElementById('error').style.display = 'block';
    window.scrollTo(0, document.body.scrollHeight);
  }
}
</script>

<template>
  <h2>Consent Form</h2>
  This study is in line with the current laws D. Lgs 196/2003 and EU GDPR 679/2016 on data protection and by performing the study you consent to the processing and communication of personal data, within the limits, for the purposes and for the duration specified by the current laws (D. Lgs 196/2003 and EU GDPR 679/2016). The data collection complies with the obligations laid down by current legislation in terms of the collection, processing, and storage of sensitive data.  <br>
  <b>Potential risks:</b>
  <br>
  There are no known or anticipated risks to you by participating in this research.<br>
  <br>
  <b>Confidentiality:</b>
  <br>
  No personally identifiable information will be collected, and although the data from this research project will be published and presented at conferences, the data will be reported in aggregate format. Thus, it will not be possible to identify individuals.<br>
  <br>
  <b>Recruitment:</b>
  <br>
  You have been recruited through public mailing lists, social networks, or Prolific.<br>
  <br>
  <b>Storage of Data:</b>
  <br>
  During the study, the collected data will be electronically saved on Data Processor/s Aruba s.p.a, via San Clemente 52, 24036 Ponte San Pietro (BG), ITALY. Moreover, this data will be subsequently stored on the cloud storage service offered by the University of Torino.<br>
  The data will be stored for a period that is no longer than what is needed for the present research. Then, it will be destroyed.<br>
  <br>
  <b>Right to Withdraw:</b>
  <br>
  The participation in this study is voluntary. You can decide not to participate at any time. You can do that by closing your browser and contacting the principal investigator: please include the assigned ID to withdraw. On top-right of the screen you can find your ID and you should write it down, in case you decide to withdraw at a later point. After receiving via email your withdrawal request, we will destroy the data that we collected and are associated with your ID, the email message we received, and the email account of the sender.<br>
  Your right to withdraw data from the study will apply before the data analysis phase of this experiment, which will happen after the end of the study on July 1st, 2024. After this date, it is possible that some form of research dissemination will have already occurred, and it might not be possible to withdraw the collected data.<br>
  <br><br>
  <b>Follow up:</b>
  <br>
  To obtain results from the study, please contact the principal investigator.<br>
  <br>
  <b>Questions or Concerns:</b>
  <br>
  Contact the principal investigator Noemi Mauro (noemi.mauro[at]unito.it).<br>
  <br>
  By completing and submitting this form, your free and informed consent is implied and indicates that you understand the above conditions of participation in this study and the experimental procedures.
  <br><hr><br>
  <input type="checkbox" name="check" required>
  I declare to be at least 18 years old.
  <br>
  <input type="checkbox" name="check2" required>
  I agree to participate in the study and to the processing of the data collected during the test.<br>
  <input type="button" value="Next" @click="checkSubmission">
  <div id="error" style="color:red; display:none">Please check both boxes in order to begin the experiment.</div>
</template>

<style scoped>

</style>