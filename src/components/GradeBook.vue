<template>
  <div class="container">
    <div class="row">
      <header>
        <h1>Gradebook Dashboard</h1>
      </header>

      <aside class="card detailed bg-light mt-3 mb-3" width="100%">
        <h2>Detailed Grade Breakdown</h2>
        <table
          class="table table-sm table-striped table-bordered table-hover table-responsive-sm text-center mt-2"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Student Grade</th>
              <th>Student Performance</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in students" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ student.fullName }}</td>
              <td>{{ student.studentGrade }}</td>
              <td>{{ student.studentPerformance }}</td>
              <td>
                {{ student.gpa !== undefined ? student.gpa.toFixed(2) : "" }}
              </td>
            </tr>
          </tbody>
        </table>
      </aside>

      <main>
        <section id="charts">
          <canvas id="gradeChart"></canvas>
          <canvas id="trendChart"></canvas>
        </section>

        <div class="card bg-light mt-3 mb-3 overall">
          <h2>Grades Breakdown</h2>
          <div class="gpa-display">
          <h2>Overall GPA: {{ overallGPA.toFixed(2) }}</h2>
        </div>
          <section id="data-table">
          <table
            class="table table-sm table-striped table-bordered table-hover table-responsive-sm text-center mt-3"
          >
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Credits</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(grade, index) in grades" :key="index">
                <td>{{ grade.subject }}</td>
                <td>{{ grade.grade }}</td>
                <td>{{ grade.credits }}</td>
                <td>
                  {{ grade.gpa !== undefined ? grade.gpa.toFixed(2) : "" }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        </div>
        

        <section id="form-section">
          <div class="card">
            <div class="card-body">
              <h2>Add Grade</h2>
              <form @submit.prevent="addGrade">
                <label for="subject">Subject:</label>
                <input
                  v-model="newGrade.subject"
                  type="text"
                  id="subject"
                  name="subject"
                  required
                />

                <label for="grade">Grade (A-F or 0-100):</label>
                <input
                  v-model="newGrade.grade"
                  type="text"
                  id="grade"
                  name="grade"
                  required
                />

                <label for="credits">Credits:</label>
                <input
                  v-model.number="newGrade.credits"
                  type="number"
                  id="credits"
                  name="credits"
                  required
                />

                <button type="submit" class="btn btn-success mt-3">
                  Add Grade
                </button>
              </form>
              <button @click="clearGrades" class="btn btn-danger mt-3">
                Clear All Grades
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "GradeBook",
  setup() {
    const chartRef = ref(null);

    onMounted(() => {
      // Other onMounted logic, if necessary
    });

    return {
      chartRef,
    };
  },
  data() {
    return {
      students: [],
      grades: [],
      newGrade: {
        subject: "",
        grade: null,
        credits: null,
      },
      gradeChart: null,
      trendChart: null,
    };
  },
  computed: {
    overallGPA() {
      if (this.grades.length === 0) return 0;

      const totalCredits = this.grades.reduce(
        (sum, grade) => sum + grade.credits,
        0
      );
      const totalGradePoints = this.grades.reduce(
        (sum, grade) => sum + this.calculateGPA(grade.grade) * grade.credits,
        0
      );

      return totalGradePoints / totalCredits;
    },
  },
  mounted() {
    this.fetchStudentData();
    this.loadGradesFromLocalStorage();

    this.$nextTick(() => {
      this.renderGradeChart();
      this.renderTrendChart();
    });
  },

  methods: {
    fetchStudentData() {
      fetch("/db.json")
        .then((response) => response.json())
        .then((data) => {
          this.students = data.weeklyAttendanceSummary;
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
        });
    },
    calculateGPA(grade) {
      const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
      if (typeof grade === "string") {
        return gradePoints[grade.toUpperCase()] || 0;
      } else if (typeof grade === "number") {
        if (grade >= 90) return 4;
        if (grade >= 80) return 3;
        if (grade >= 70) return 2;
        if (grade >= 60) return 1;
        return 0;
      }
      return 0;
    },
    loadGradesFromLocalStorage() {
      const savedGrades = localStorage.getItem("grades");
      if (savedGrades) {
        this.grades = JSON.parse(savedGrades);
      }
    },
    saveGradesToLocalStorage() {
      localStorage.setItem("grades", JSON.stringify(this.grades));
    },
    renderGradeChart() {
      const ctx = document.getElementById("gradeChart");
      if (!ctx) {
        console.error("Cannot find gradeChart canvas element");
        return;
      }
      const labels = this.grades.map((g) => g.subject);
      const data = this.grades.map((g) => this.calculateGPA(g.grade));
      try {
        this.gradeChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "GPA",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 4,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error rendering grade chart:", error);
      }
    },
    renderTrendChart() {
      if (this.trendChart) {
        this.trendChart.destroy();
      }
      const ctx = document.getElementById("trendChart");
      if (!ctx) {
        console.error("Cannot find trendChart canvas element");
        return;
      }
      try {
        this.trendChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [
              {
                label: "GPA Over Time",
                data: [3.0, 3.5, 3.2, 3.8],
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 4,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error rendering trend chart:", error);
      }
    },

    addGrade() {
      if (
        this.newGrade.subject &&
        this.newGrade.grade !== null &&
        this.newGrade.credits !== null
      ) {
        const gpa = this.calculateGPA(this.newGrade.grade);
        const newGrades = [
          ...this.grades,
          {
            ...this.newGrade,
            grade: this.newGrade.grade.toString(),
            gpa: gpa,
          },
        ];
        this.grades = newGrades;
        this.saveGradesToLocalStorage();
        this.$nextTick(() => {
          this.updateCharts();
        });
        this.newGrade = { subject: "", grade: null, credits: null };
      }
    },
    updateCharts() {
      if (this.gradeChart) {
        this.gradeChart.destroy();
      }
      this.renderGradeChart();

      if (this.trendChart) {
        this.trendChart.destroy();
      }
      this.renderTrendChart();
    },

    clearGrades() {
      localStorage.removeItem("grades");
      this.grades = [];
      this.updateCharts();
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden !important;
}
.container{
  background-color: #F7F7F7;
}
.overall h2{
  margin-left: 15px;
}
header {
  background-color: #4caf50;
  color: white;
  padding: 1rem;
  text-align: center;
}

main {
  padding: 1rem;
}

section {
  margin-bottom: 2rem;
}

#charts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

canvas {
  max-width: 45%;
  margin-bottom: 1rem;
}

#data-table table {
  width: 100%;
  border-collapse: collapse;
}

#data-table th,
#data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

#form-section .btn-danger {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
}

#form-section .btn-danger:hover {
  background-color: #c9302c;
}

#form-section {
  max-width: 400px;
  margin: 0 auto;
}

#form-section form {
  display: flex;
  flex-direction: column;
}

#form-section label {
  margin: 0.5rem 0 0.25rem;
}

#form-section input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid grey;
}

#form-section button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
}
 
#form-section button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  canvas {
    max-width: 100%;
  }
}

@media (max-width: 352px) {
  .col-sm-2 {
    display: none;
  }
  .col-sm-8 {
    margin-left: 0;
  }
 
}
@media (max-width: 320px) {
 .table{
  font-size: 12px !important;
 }
}
</style>
