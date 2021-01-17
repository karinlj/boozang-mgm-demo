<template>
  <div id="app" class="app">
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/shared/Navbar";
export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<style lang="scss">
body {
  background: #f9f9f9;
  .app {
    font-family: Arial, Helvetica, sans-serif;

    // .container {
    //   max-width: 1300px;
    //   @media all and (min-width: 993px) {
    //     width: 90%;
    //   }
    // }
    .toast-top-right {
      top: 30px !important;
      right: 12px;
    }
    .toast-error {
      background-color: #f44336 !important;
    }
    .toast-success {
      background-color: #00c853 !important;
    }
    .card {
      height: 350px;
      overflow: auto;
      border-radius: 5px;
    }
    .edit_comp {
      position: relative;
      z-index: 1000;
      margin-top: 60px;
      max-width: 800px;
      .edit_header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        h4 {
          margin: 0.8rem auto;
        }
      }
      .field {
        position: relative;
      }
      footer {
        margin-top: 4rem;
        .btn {
          margin-right: 2rem !important;
        }
      }
    }
    #dashboard_table {
      tr {
        .edit {
          font-size: 20px;
        }
      }
      th {
        color: #999;
        font-size: 80%;
        padding: 10px 5px;
      }

      td {
        padding: 10px 5px;
        &.timestamp {
          color: #999;
          font-size: 80%;
        }
        .material-icons {
          font-size: 16px;
        }
      }
      .btn-floating {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 0;
      }
    }
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #d9d9d9;
  }
}
</style>
