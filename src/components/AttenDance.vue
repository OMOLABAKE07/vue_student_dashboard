<template>
  <div class="container">
    <div class="row col-sm-12">
      <div class="row">
        <div class="content">
          <div class="main-title">
            <h1>Attendance Dashboard</h1>
          </div>
          <div class="card dist">
            <h2 class="section-title">Attendance Distribution</h2>
            <div class="chart-container">
              <canvas id="pieChart" class="chart"></canvas>
            </div>
          </div>
          <div class="trends">
            <h2 class="section-title">Attendance Trends</h2>
            <div class="chart-container">
              <canvas id="barChart" class="chart"></canvas>
            </div>
          </div>
          <div>
            <div class="col-sm-12 d-flex">
              <div class="col-sm-6 mt-4">
                <div class="form-group">
                  <select
                    class="custom-select form-control"
                    v-model="selectedClass"
                  >
                    <option value="">---select class---</option>
                    <option
                      v-for="classItem in classes"
                      :key="classItem.id"
                      :value="classItem.class"
                    >
                      {{ classItem.class }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-sm-6">
                <div class="form-group ms-4 mt-4">
                  <select class="form-control" v-model="selectedWeek">
                    <option value="">Select a week</option>
                    <option
                      v-for="week in weeks"
                      :key="week.value"
                      :value="week.value"
                    >
                      {{ week.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-5">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="radio"> Morning </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="Afternoon"
                v-model="selectedTime"
                id="flexCheckCheck"
              />
              <label class="form-check-label" for="flexCheckCheck">
                Afternoon
              </label>
            </div>
          </div>
          <div class="details">
            <h2 class="section-title">Attendance Details</h2>
            <table
              class="attendance-table table-sm table-striped table-bordered table-hover table-responsive-sm"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="record in paginatedAttendanceRecords"
                  :key="record.id"
                >
                  <td>{{ record.date }}</td>
                  <td>{{ record.student }}</td>
                  <td>{{ record.status }}</td>
                </tr>
              </tbody>
            </table>
            <ul
              class="pagination justify-content-end d-flex align-items-center mt-5"
            >
              <li
                class="page-item btn btn-outline-primary btn-sm"
                @click="prevPage"
                :disabled="currentPage === 1"
              >
                Previous
              </li>
              <li class="page-item">
                <p class="mb-0 mx-2">Page</p>
              </li>
              <li class="page-item">
                <div class="d-flex align-items-center">
                  <span class="page-link">{{ currentPage }}</span>
                  <p class="mb-0 mx-2">of</p>
                  <span class="page-link">{{ totalPages }}</span>
                </div>
              </li>
              <li class="page-item">
                <p class="mb-0 mx-2"></p>
              </li>
              <li
                class="page-item btn btn-outline-primary btn-sm"
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Next
              </li>
            </ul>

            <div class="summary">
              <h2 class="section-title">Weekly Attendance Summary</h2>
              <table
                class="summary-table table-sm table-striped table-bordered table-hover table-responsive-sm"
              >
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Full Name</th>
                    <th>Days of the Week</th>
                    <th>Weekly Total Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(record, index) in weeklyAttendanceSummary"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ record.fullName }}</td>
                    <td>{{ record.daysOfWeek }}</td>
                    <td>{{ record.weeklyTotal }}</td>
                    <td>
                      <div>
                        <button
                          @click="openEditModal(index)"
                          class="btn btn-primary btn-sm"
                        >
                          Edit
                        </button>
                        <CustomModal
                          v-if="isModalVisible"
                          :isVisible="isModalVisible"
                          :record="selectedRecord"
                          @close="closeEditModal"
                          @save="saveEditedRecord"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Chart from "chart.js/auto";
import CustomModal from "./CustomModal.vue";

export default {
  name: "AttendanceDashboard",
  components: { CustomModal },
  setup() {
    const pieChartData = ref({
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          label: "Attendance",
          data: [],
          backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56"],
        },
      ],
    });

    const barChartData = ref({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      datasets: [
        {
          label: "Attendance",
          data: [],
          backgroundColor: "#42a5f5",
        },
      ],
    });

    const attendanceRecords = ref([]);
    const weeklyAttendanceSummary = ref([]);
    const classes = ref([]);
    const weeks = ref([]);

    const isModalVisible = ref(false);
    const selectedRecord = ref(null);
    const selectedClass = ref("");
    const selectedWeek = ref("");
    const selectedTime = ref("Afternoon");

    const currentPage = ref(1);
    const recordsPerPage = ref(5);

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        classes.value = data.classes;
        weeks.value = data.weeks;
        pieChartData.value.datasets[0].data = data.pieChartData;
        barChartData.value.datasets[0].data = data.barChartData;
        attendanceRecords.value = data.attendanceRecords;
        weeklyAttendanceSummary.value = data.weeklyAttendanceSummary;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const filteredAttendanceRecords = computed(() => {
      const filtered = attendanceRecords.value.filter((record) => {
        return (
          (!selectedClass.value ||
            record.student.includes(selectedClass.value)) &&
          (!selectedWeek.value || record.date.includes(selectedWeek.value))
        );
      });
      return filtered;
    });

    const paginatedAttendanceRecords = computed(() => {
      const start = (currentPage.value - 1) * recordsPerPage.value;
      const end = start + recordsPerPage.value;
      const paginated = filteredAttendanceRecords.value.slice(start, end);

      return paginated;
    });

    const totalPages = computed(() => {
      return Math.ceil(
        filteredAttendanceRecords.value.length / recordsPerPage.value
      );
    });

    const openEditModal = (index) => {
      selectedRecord.value = weeklyAttendanceSummary.value[index];
      isModalVisible.value = true;
    };

    const closeEditModal = () => {
      isModalVisible.value = false;
    };

    const saveEditedRecord = (editedRecord) => {
      const index = weeklyAttendanceSummary.value.findIndex(
        (record) => record.fullName === editedRecord.fullName
      );
      if (index !== -1) {
        weeklyAttendanceSummary.value[index] = editedRecord;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    let pieChart = null;
    let barChart = null;

    onMounted(async () => {
      await fetchAttendanceData();
      const pieCanvas = document.getElementById("pieChart");
      const barCanvas = document.getElementById("barChart");

      if (pieCanvas) {
        const pieCtx = pieCanvas.getContext("2d");
        if (pieChart) {
          pieChart.destroy();
        }
        pieChart = new Chart(pieCtx, {
          type: "pie",
          data: pieChartData.value,
        });
      } else {
        console.error("Pie Chart canvas not found");
      }

      if (barCanvas) {
        const barCtx = barCanvas.getContext("2d");
        if (barChart) {
          barChart.destroy();
        }
        barChart = new Chart(barCtx, {
          type: "bar",
          data: barChartData.value,
        });
      } else {
        console.error("Bar Chart canvas not found");
      }
    });

    onBeforeUnmount(() => {
      if (pieChart) {
        pieChart.destroy();
      }
      if (barChart) {
        barChart.destroy();
      }
    });

    return {
      pieChartData,
      barChartData,
      attendanceRecords,
      weeklyAttendanceSummary,
      classes,
      weeks,
      selectedClass,
      selectedWeek,
      selectedTime,
      filteredAttendanceRecords,
      paginatedAttendanceRecords,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
      openEditModal,
      closeEditModal,
      isModalVisible,
      selectedRecord,
      saveEditedRecord,
    };
  },
};
</script>

<style scoped>
body {
  overflow-x: hidden !important;
}

.container {
  padding: 0px 25px 0px 25px;
  max-width: 100%;
  background-color: #f7f7f7;
}

.chart-container {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

.chart {
  display: block;
  width: 100% !important;
  height: 300px !important;
}

.dist {
  width: 100%;
  margin: 15px 0;
  background-color: lightcyan;
  padding: 15px;
}

.content {
  padding: 10px;
  border-radius: 8px;
}

.trends {
  margin: 10px 0px 0px 0px !important;
  padding: 10px;
  background-color: rgba(233, 229, 224, 0.906);
}

.main-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  background-color: lightsteelblue;
  padding: 10px;
}

.section-title {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  padding: 5px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
  width: 100% !important;
}

.attendance-table,
.summary-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.attendance-table th,
.attendance-table td,
.summary-table th,
.summary-table td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}

.attendance-table th,
.summary-table th {
  background-color: #f4f4f4;
}

.summary {
  margin: 15px 0 30px 0 !important;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .attendance-table,
  .summary-table {
    font-size: 0.8rem;
  }

  .chart {
    height: 250px !important;
  }
}

@media (max-width: 576px) {
  .main-title {
    font-size: 1.4rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .attendance-table,
  .summary-table {
    font-size: 0.7rem;
  }

  .chart {
    height: 200px !important;
  }
}

@media (max-width: 425px) {
  .main-title {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 0.9rem;
  }

  .attendance-table,
  .summary-table {
    font-size: 0.6rem;
  }

  .attendance-table th,
  .attendance-table td,
  .summary-table th,
  .summary-table td {
    padding: 4px;
  }

  .chart {
    height: 180px !important;
  }
}

@media (max-width: 375px) {
  .main-title {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 0.85rem;
  }

  .chart {
    height: 160px !important;
  }

  .pagination button {
    font-size: 10px !important;
    padding: 0 auto;
  }
  .pagination {
    width: 50%;
    padding: 0 auto;
  }
  .page-item {
    margin-left: 0;
    font-size: 12px;
  }
}

@media (max-width: 320px) {
  .main-title {
    font-size: 1rem;
  }

  .section-title {
    font-size: 0.8rem;
  }

  .attendance-table,
  .summary-table {
    font-size: 0.55rem;
  }

  .chart {
    height: 140px !important;
  }
  .main-title {
    font-size: 1.5rem;
    width: 100%;
  }
  .trends {
    width: 100%;
  }
  .custom-select {
    font-size: 1rem;
  }

  .details {
    width: 100%;
  }
  .pagination button {
    font-size: 20px;
    padding: 0 auto;
    margin: 0 auto;
  }
  .pagination {
    width: 50%;
    margin-left: 68%;
    padding: 0 auto;
    justify-content: start;
  }
  .page-item {
    margin-left: 0;
    font-size: 12px;
  }
}

.pagination {
  margin-top: 1rem;
}
</style>
