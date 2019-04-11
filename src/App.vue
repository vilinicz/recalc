<template>
  <div id="app">
    <div
      ref="map"
      class="map"
    >
      <svg
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        :width="width"
      >
        <g class="wrapper">
          <g class="districts">
            <path
              v-for="(d, i) in districts"
              :key="`path-${i}`"
              :class="{'selected': d === selected}"
              :d="geoPath().projection(projection())(d)"
              :fill="`rgba(38,50,56,${1 / districts.length * i})`"
              class="d"
              vector-effect="non-scaling-stroke"
              @click="select(d)"
            />
          </g>
        </g>
      </svg>
    </div>

    <div class="form">
      <label for="district">Округ Москвы
        <select
          id="district"
          v-model="selected"
          class="district"
        >
          <option
            v-for="(d, i) in districts"
            :key="i"
            :value="d"
          >
            {{ d.properties.name }}
          </option>
        </select>
      </label>

      <label
        for="area"
        class="area"
      >
        Площадь
        <input
          id="area"
          v-model="area"
          type="number"
          :min="areaMin"
        >
      </label>

      <div
        class="total"
      >
        <div v-if="selected">
          {{ total }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { geoMercator, geoPath } from 'd3-geo';
import mapData from '@/assets/moscow_districts_simplified.geo.json';


export default {
  name: 'App',

  data() {
    return {
      width: 0,
      height: 0,

      meterCost: 210000,
      coef: 1.2,

      districts: [],
      area: 1500,
      areaMin: 1000,
      areaMax: 50000,

      selected: undefined,
      hovered: undefined,
    };
  },

  computed: {
    total() {
      return this.area * this.meterCost * this.coefficient;
    },

    coefficient() {
      return ((id) => {
        switch (id) {
          case 1:
            return 2;
          case 2:
            return 1.7;
          case 3:
            return 1.6;
          case 4:
            return 1.4;
          case 5:
            return 1.35;
          case 6:
            return 1.3;
          case 7:
            return 1.45;
          case 8:
            return 1.5;
          case 9:
            return 1.72;
          case 10:
            return 1.2;
          case 11:
            return 1.1;
          case 12:
            return 1;
          default:
            return 1;
        }
      })(this.selected.properties.id);
    },
  },

  async mounted() {
    this.height = this.$el.querySelector('.map').clientHeight;
    this.width = this.$el.querySelector('.map').clientWidth;

    this.districts = mapData.features.sort((a, b) => a.properties.id - b.properties.id);
  },

  methods: {
    projection() {
      return geoMercator()
        .fitSize([this.width, this.height], mapData);
    },

    geoPath() {
      return geoPath();
    },

    districtAbbr(string) {
      return string[0];
    },

    mouseover(d) {
      if (d) {
        this.highlighted = d.properties;
      }
    },

    mouseout() {
      this.highlighted = undefined;
    },

    select(d) {
      this.selected = d;
    },
  },
};
</script>

<style lang="scss">
  $light: #feffdb;
  $gray: #fce38a;
  $secondary: #fc5185;
  $primary: #364f6b;

  #app {
    height: 100vh;
    display: flex;

    // #### MAP ####
    .map {
      height: 100vh;
      overflow: hidden;
      width: 50%;
      position: relative;
      svg {}
      .wrapper {}
      .districts {}
      .d {
        fill: $gray;
        transition: fill 0.25s ease;
        cursor: pointer;
        stroke: #fff;
        stroke-width: 2px;
        &:hover { fill: $secondary; }
        &.selected { fill: $primary; }
        @media (min-width: 600px) {
          stroke-width: 3px;
        }
        @media (min-width: 800px) {
          stroke-width: 4px;
        }
        @media (min-width: 1200px) {
          stroke-width: 6px;
        }
      }
    }

    // #### FORM  ####
    .form {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;

      label {
        display: block;
      }
      input, select {
        display: block;
      }
    }
  }
</style>
