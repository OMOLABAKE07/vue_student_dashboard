<template>
    <div>
      <table ref="dataTable" class="display" style="width:100%">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="(value, col) in row" :key="col">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import $ from 'jquery';
  import 'datatables.net';
  
  export default {
    name: 'DataTable',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.initializeDataTable();
    },
    methods: {
      initializeDataTable() {
        $(this.$refs.dataTable).DataTable({
          data: this.data,
          columns: this.columns.map(column => ({ title: column })),
          responsive: true,
          // You can add additional DataTables options here
        });
      }
    },
    beforeUnmount() {
      $(this.$refs.dataTable).DataTable().destroy(true);
    }
  };
  </script>
  
  
<style scoped>
table.display {
  width: 100%;
  overflow-x: auto;
  display: block;
}

table.display th, 
table.display td {
  padding: 8px;
  text-align: left;
  white-space: nowrap;
}

@media (max-width: 768px) {
  table.display th, 
  table.display td {
    font-size: 14px;
    padding: 6px;
  }
}

@media (max-width: 576px) {
  table.display th, 
  table.display td {
    font-size: 12px;
    padding: 4px;
  }
}
</style>
  