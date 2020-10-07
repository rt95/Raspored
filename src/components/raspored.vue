<template>
  <div>
    <modal></modal>
    <!-- Page Content -->
    <div class="container">
      <div class="row month">
        <button
          class="col"
          @click="lastWeek"
        >Prošli tjedan</button>
        <div class="col">
          {{currentMonth.format('MMMM YYYY') | firstCapitalLetter}}<br>
          {{currentMonth.format('wo') | firstCapitalLetter}}
        </div>
        <button
          class="col"
          @click="nextWeek"
        >Sljedeći tjedan</button>
      </div>
      <div class="row">
        <div
          class="days col"
          v-for="day in days"
        >
          <div>
            {{day.format('dddd') | firstCapitalLetter }}
            <br>
            {{ day.format('DD/MM') }}
          </div>
        </div>
      </div>
      <div
        class="row"
        v-for="(row,row_index) in 6"
        :key="row_index"
      >
        <div
          @click="openModal($event,item,index,row_index)"
          class="col element"
          v-for="(item,index) in days"
          :key="index"
        >
          <div v-for="element in dataFilter(item,index,row_index)">
            <h6>{{ element.content.time }}</h6>
            <h6>{{ element.content.title }}</h6>
            <h6>{{ element.content.status }}</h6>
            <h6>Dvorana: {{ element.content.room }}</h6>
            <h6>{{ element.content.location }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modal from './modal.vue'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'raspored',
  components: {
    modal
  },
  data () {
    return {
      month: null,
      currentMonth: null
    }
  },
  beforeMount () {
    //  Initial setup
    this.currentMonth = moment()
    this.month = moment(this.currentMonth).month()
  },
  methods: {
    lastWeek () {
      this.currentMonth = moment(this.currentMonth.subtract(1, 'w'))
      this.month = moment(this.currentMonth).month()
    },
    nextWeek () {
      this.currentMonth = moment(this.currentMonth.add(1, 'w'))
      this.month = moment(this.currentMonth).month()
    },
    openModal (e, item, index, rowIndex) {
      let dan = item.format('DD')
      let target = e.currentTarget
      let month = moment(this.currentMonth).month()
      let elementData = {
        target: target,
        elementIndex: index,
        rowIndex: rowIndex,
        monthOfElement: month,
        dayOfElement: dan
      }
      this.$store.commit('toggleModal', elementData)
    },
    dataFilter (item, index, rowIndex) {
      // v-if="(element.rowIndex === row_index) && (element.elementIndex === index) && (element.monthOfElement === month) && (element.dayOfElement === item.format('DD'))"
      var data = this.localData
      var month = moment(this.currentMonth).month()
      return data.filter(function (val) {
        if (val.monthOfElement === month &&
          val.rowIndex === rowIndex &&
          val.elementIndex === index &&
          val.dayOfElement === item.format('DD')) {
          return val
        }
      })
    }
  },
  computed: {
    ...mapState({
      localData: 'data'
    }),
    days () {
      return {
        // PON-PET
        0: moment(this.currentMonth).day(1),
        1: moment(this.currentMonth).day(2),
        2: moment(this.currentMonth).day(3),
        3: moment(this.currentMonth).day(4),
        4: moment(this.currentMonth).day(5)
      }
    }
  },
  filters: {
    firstCapitalLetter (string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-bottom: 60px;
}
.col {
  border: 1px solid black;
}
.days {
  min-width: 10vw;
  border: 1px solid black;
}

.element {
  min-width: 10vw;
  min-height: 10vh;
  padding-top: 10px;
}

/* MEDIA */

@media (max-width: 1000px) {
  .container .row {
    font-size: 2.5vw;
  }
  .element div h6 {
    font-size: 2vw;
  }
}

/* ultrawide */

@media (min-width: 2300px) {
  .row {
    flex-wrap: nowrap;
  }
  .month {
    font-size: 2.5vh;
  }
  .days {
    font-size: 2.5vh;
    border: 1px solid black;
  }
  .container {
    max-width: 100%;
  }
  .element div h6 {
    font-size: 2.5vh;
  }
}
</style>
