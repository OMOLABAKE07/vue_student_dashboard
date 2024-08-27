<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="behavior-form">
          <header>
            <h1>Behavioral Objective</h1>
          </header>
          <form @submit.prevent="submitForm" class="mb-4">
            <div class="form-group">
              <label>Date:</label>
              <input
                type="date"
                v-model="form.date"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Type:</label>
              <input
                type="text"
                v-model="form.type"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Description:</label>
              <textarea
                v-model="form.description"
                class="form-control"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Reward:</label>
              <textarea
                v-model="form.reward"
                class="form-control"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Add Record</button>
          </form>
        </div>

        <div class="container">
          <h3>Behavior Records</h3>
          <table v-if="records.length" class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in records" :key="record.id">
                <td>{{ record.date }}</td>
                <td>{{ record.type }}</td>
                <td>{{ record.description }}</td>
                <td>{{ record.reward }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="container">
          <h3>Behavior Trends</h3>
          <Line
            v-if="chartData && chartData.datasets && chartData.datasets.length"
            :data="chartData"
            :options="chartOptions"
          />
          <p v-else>Loading chart...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

export default {
  components: {
    Line,
  },
  setup() {
    const records = ref([]);
    const form = ref({
      date: "",
      type: "",
      description: "",
      reward: "",
    });

    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Behavior Trends",
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    });

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}`;
            },
          },
        },
      },
    };

    const saveRecordsToLocalStorage = () => {
      localStorage.setItem("behaviorRecords", JSON.stringify(records.value));
    };

    const loadRecordsFromLocalStorage = () => {
      const storedRecords = localStorage.getItem("behaviorRecords");
      if (storedRecords) {
        records.value = JSON.parse(storedRecords);
        updateChartData();
      }
    };

    const addRecord = () => {
      const newRecord = {
        id: Date.now(),
        ...form.value,
      };
      records.value.push(newRecord);
      saveRecordsToLocalStorage();
      updateChartData();
      resetForm();
    };

    const submitForm = () => {
      addRecord();
    };

    const resetForm = () => {
      form.value.date = "";
      form.value.type = "";
      form.value.description = "";
      form.value.reward = "";
    };

    const updateChartData = () => {
      const labels = records.value.map((record) => record.date);
      const dataPoints = records.value.map((record) =>
        record.type === "Positive" ? 1 : -1
      );

      chartData.value = {
        labels,
        datasets: [{ ...chartData.value.datasets[0], data: dataPoints }],
      };
    };

    watch(records, () => updateChartData(), { deep: true });

    onMounted(() => {
      loadRecordsFromLocalStorage();
      updateChartData();
    });

    return { records, form, chartData, chartOptions, submitForm };
  },
};
</script>

<style scoped>
body {
  overflow-x: hidden !important;
}

.container {
  padding: 15px;
  background-color: #f7f7f7;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

form {
  margin-bottom: 20px;
}

header {
  background-color: #1e88e5;
  color: white;
  padding: 20px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 24px;
  box-shadow: 0px 4px 2px -2px gray;
}

@media (max-width: 768px) {
  .container {
    padding: 5px;
  }

  form {
    margin-bottom: 15px;
  }

  th,
  td {
    padding: 5px;
  }

  .behavior-form {
    margin: 0 auto;
  }

  button {
    width: 100%;
  }
}

/* Mobile screen adjustments */
@media (max-width: 576px) {
  .container {
    padding: 0;
  }

  th,
  td {
    font-size: 14px;
    padding: 3px;
  }

  h3 {
    font-size: 1.5rem;
  }

  .behavior-form {
    width: 70%;
    padding: 10px;
  }

  button {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
  }
}

@media (max-width: 320px) {
  header h1 {
    font-size: small;
    padding: 0 auto;
  }
}
</style>
