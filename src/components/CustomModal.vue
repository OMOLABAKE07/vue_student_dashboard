<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">&times;</button>
      <h2>Edit Attendance</h2>
      <form @submit.prevent="saveChanges">
        <div>
          <label for="fullName">Full Name:</label>
          <input id="fullName" v-model="editedRecord.fullName" type="text" />
        </div>
        <div>
          <label for="daysOfWeek">Days of the Week:</label>
          <input id="daysOfWeek" v-model="editedRecord.daysOfWeek" type="text" />
        </div>
        <div>
          <label for="weeklyTotal">Weekly Total Attendance:</label>
          <input id="weeklyTotal" v-model="editedRecord.weeklyTotal" type="number" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editedRecord: { ...this.record },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveChanges() {
      this.$emit("save", this.editedRecord);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
}


form > div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}


input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
</style>