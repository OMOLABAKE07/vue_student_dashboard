import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto'; // Adjust path if needed

export default {
  name: 'GradeBook',
  setup() {
    const chartRef = ref(null);

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d');
      new Chart(ctx, {
        type: 'bar', // or any other chart type
        data: {
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: 'Sample Data',
            data: [10, 20, 30],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    return {
      chartRef,
    };
  },
};