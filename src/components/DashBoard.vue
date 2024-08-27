<template>
  <div class="container">
    <div class="row">
      <div class="row bg-secondary" width="100%">
        <div class="col-sm-6">
          <div class="card mt-5" width="50%">
            <div class="card-body">
              <h5 class="card-title">Behavior Trends</h5>
              <h1 class="text-dark fw-5">{{ behaviorSummary }}</h1>
              <p>
                <span class="text-success">{{ behaviorTrends }}</span>
              </p>
              <div class="img-container">
                <img
                  src="https://datavizproject.com/wp-content/uploads/types/Line-Graph.png"
                  style="width: 150px; height: 120px"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card mt-5" width="50%">
            <div class="card-body">
              <h5 class="card-title">Attendance</h5>
              <h1 class="text-dark fw-5">
                <span>{{ attendanceSummary }}</span>
              </h1>
              <p>
                <span class="text-info">{{ attendanceDetails }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-12" width="100%">
          <div class="card mt-5" width="50%">
            <div class="card-body">
              <h5 class="card-title">GradeBook</h5>
              <h1 class="text-dark fw-5">
                <span>{{ gradeSummary }}</span>
              </h1>
              <p>
                <span class="text-danger">{{ gradeDetails }}</span>
              </p>
              <div class="img-container">
                <img
                  src="https://www.netsuite.com/portal/assets/img/business-articles/erp/pie_chart.png"
                  alt="GradeBook Pie Chart"
                  style="width: 150px; height: 120px"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12" width="100%">
          <div class="card mt-5" width="50%">
            <div class="card-body">
              <h5 class="card-title">Report</h5>
              <p class="card-text">{{ reportDetails }}</p>

              <div class="img-container">
                <img
                  src="https://www.shutterstock.com/shutterstock/photos/2012198003/display_1500/stock-photo-two-schoolgirls-friends-fool-around-during-a-lesson-back-to-school-concept-2012198003.jpg"
                  alt=""
                  style="width: 150px; height: 120px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyDashBoard",
  data() {
    return {
      behaviorSummary: "",
      behaviorTrends: "",
      attendanceSummary: "",
      attendanceDetails: "",
      gradeSummary: "",
      gradeDetails: "",
      reportDetails: "",
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get("/db.json")
        .then((response) => {
          const data = response.data;

          this.behaviorSummary = `${data.pieChartData[0]}% Positive`;
          this.behaviorTrends = `Total Records: ${data.behaviors.length}`;

          const presentCount = data.attendanceRecords.filter(
            (record) => record.status === "Present"
          ).length;
          this.attendanceSummary = `${presentCount} Students Present`;
          this.attendanceDetails = `Total Attendance: ${data.attendanceRecords.length}`;

          const averageGrade =
            data.grades.reduce((sum, grade) => sum + grade.grade, 0) /
            data.grades.length;
          this.gradeSummary = `Average Grade: ${averageGrade.toFixed(2)}`;
          this.gradeDetails = `Total Grades: ${data.grades.length}`;

          this.reportDetails = `Classes: ${data.classes.length}, Behaviors: ${data.behaviors.length}`;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  },
};
</script>

<style scoped>
.card {
  width: 100%;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 1.25rem;
}

.card {
  position: relative;
  overflow: hidden;
}

.img-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 150px;
  height: auto;
  max-height: 130px;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 425px) {
  .card {
    width: 100%;
    margin-bottom: 15px;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-text {
    font-size: 1rem;
  }

  .img-container {
    width: 120px;
  }
}

@media (max-width: 375px) {
  .card {
    width: 100%;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 1.15rem;
  }

  .card-text {
    font-size: 0.95rem;
  }

  .img-container {
    width: 100px;
  }
}

@media (max-width: 320px) {
  .card {
    width: 100%;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-text {
    font-size: 10px;
  }
  h1 {
    font-size: 16px;
  }
  .img-container {
    width: 90px;
  }
  span {
    font-size: 8px;
  }
}
</style>
