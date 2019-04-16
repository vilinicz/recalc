<template>
  <div id="app">
    <div class="header">
      Экспресс оценка стоимости объекта*
    </div>

    <div class="calculator">
      <div
        ref="map"
        class="map"
      >
        <svg
          :height="height"
          :viewBox="`0 0 ${width} ${height}`"
          :width="width"
        >
          <g class="districts">
            <g
              v-for="(d, i) in districts"
              :key="`path-${i}`"
              :class="{'selected': d === selected}"
              class="d"
              @click="select(d)"
            >

              <path
                :d="geoPath().projection(projection())(d)"
                vector-effect="non-scaling-stroke"
              />
              <text
                :class="`label-${d.properties.id}`"
                :x="geoPath().projection(projection()).centroid(d)[0]"
                :y="geoPath().projection(projection()).centroid(d)[1]"
                alignment-baseline="central"
                class="label"
                fill="black"
                text-anchor="middle"
              >{{ d.properties.abbr }}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div class="form">
        <div class="district">
          <label for="district">Укажите округ:</label>
          <select
            id="district"
            v-model="selected"
            class="input"
          >
            <option
              v-for="(d, i) in districts"
              :key="i"
              :value="d"
            >
              {{ d.properties.abbr }}
            </option>
          </select>
        </div>

        <div class="area">
          <div class="wrapper">
            <label for="area">
              Площадь м<sup>2</sup>
            </label>
            <input
              id="area"
              v-model="area"
              :max="areaMax"
              :min="areaMin"
              class="input"
              type="number"
            >
          </div>
          <vue-slider
            v-model="area"
            :contained="true"
            :height="3"
            :max="areaMax"
            :min="areaMin"
            dot-size="16"
          />
        </div>
      </div>
    </div>

    <div class="result">
      Results
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';

import { geoCentroid, geoMercator, geoPath } from 'd3-geo';
import mapData from '@/assets/old_moscow_districts_simplified.geo.json';


export default {
  name: 'App',
  components: {
    VueSlider,
  },

  data() {
    return {
      width: 0,
      height: 0,

      meterCost: 210000,

      districts: [],
      area: 10000,
      areaMin: 1000,
      areaMax: 50000,

      selected: undefined,
      hovered: undefined,
    };
  },

  computed: {
    total() {
      return Math.round(this.area * this.meterCost * this.coefficient);
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
    [this.selected] = this.districts;
  },

  methods: {
    projection() {
      return geoMercator()
        .fitSize([this.width, this.height], mapData);
    },

    geoPath() {
      return geoPath();
    },

    centroid() {
      return geoCentroid();
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
  $light: #F2F7FA;
  $gray: #dcdcdc;
  $black: #181818;
  $red: #EB1E4B;

  $primary: $red;

  $bgColor: rgba(#c3c3c3, 0.7);
  $themeColor: $primary;
  @import '~vue-slider-component/lib/theme/default';


  #app {
    min-height: 100%;
    min-width: 100%;
    background: $light linear-gradient(324.93deg, #EBEFF2 -3.08%, #F2F7FA 91.37%, #F2F7FA 91.37%);
    position: relative;
    padding: 4vh 4vw;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;

    grid-template-areas:
      'header'
      'calculator'
      'result';


    .header {
      grid-area: header;
      font-weight: 900;
      font-size: 32px;
      color: $black;
      line-height: 1;
      padding-bottom: 10px;
      border-bottom: 2px solid $gray;
    }


    .calculator {
      grid-area: calculator;
      padding: 5vh 0;

      .map {
        height: 300px;
        margin-left: -2%;

        .d {
          fill: $gray;
          transition: fill 0.25s ease;
          cursor: pointer;
          stroke: $light;
          stroke-width: 2px;

          &:hover {
            fill: darken($gray, 5%);
            .label {
              fill: $black;
            }
          }

          &.selected {
            fill: $primary;
            .label {
              fill: $light;
            }
          }

          &:hover, &.selected {
            .label {
              opacity: 1;
            }
          }
        }

        .label {
          opacity: 0;
          transition: opacity 0.20s ease;
          font-size: 12px;
          font-weight: bold;
          z-index: 1;
          stroke-width: 0;
          font-variant: small-caps;
        }
      }


        .district, .area {
          margin-bottom: 1rem;
          label {
            display: block;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            color: $black;
          }

          .input {
            -webkit-appearance: none;
            display: block;
            background-color: transparent;
            border-bottom: 2px solid $primary;
            font-size: 24px;
            line-height: 29px;
            font-weight: 800;
          }
        }

        .area > .wrapper {
          //display: flex;
          //flex-flow: row wrap;
          //align-items: center;
          margin-bottom: 0.75rem;

          input, label {
            width: auto;
            flex: 1 1 auto;
            //margin-bottom: 0;
          }
        }

        .area .vue-slider {
          padding: 8px 4px !important;
        }
      }

    .result {
      grid-area: result;
    }
  }
</style>
