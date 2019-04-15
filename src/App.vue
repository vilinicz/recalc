<template>
  <div id="app">
    <div class="recalc">
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
        </svg>
      </div>

      <div class="form">
        <div class="district">
          <label for="district">Округ</label>
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
              {{ d.properties.name }}
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
              class="input"
              type="number"
              :min="areaMin"
              :max="areaMax"
            >
          </div>
          <vue-slider
            v-model="area"
            :min="areaMin"
            :max="areaMax"
            :marks="marks"
            :contained="true"
            :interval="100"
            dot-size="16"
            :height="6"
          />
        </div>

        <div class="total">
          <div v-if="selected">
            ₽{{ total }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';

import { geoMercator, geoPath } from 'd3-geo';
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
      marks: {
        1000: {
          label: '1000',
          labelStyle: {
            transform: 'translateX(-12%)',
          },
        },
        50000: {
          label: '50000',
          labelStyle: {
            transform: 'translateX(-88%)',
          },
        },
      },

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

  $bgColor: $gray;
  $themeColor: $primary;
  @import '~vue-slider-component/lib/theme/antd';


  #app {
    height: 100%;
    width: 100%;
    background-color: $primary;
    position: relative;

    .recalc {
      position:absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      margin: auto;
      max-width: 450px;
      max-height: 650px;
      min-height: 450px;
      height: 80%;
      box-shadow: 0 2px 10px rgba(#000, 0.1);
      border-radius: 14px;
      padding: 1rem;
      background-color: #fff;
    }

    // #### MAP ####
    .map {
      height: 50%;
      overflow: hidden;
      position: relative;
      // For visual centering
      margin-left: -2%;
      svg {}
      .districts {}
      .d {
        fill: $gray;
        transition: fill 0.25s ease;
        cursor: pointer;
        stroke: #fff;
        stroke-width: 2px;
        &:hover { fill: $secondary; }
        &.selected { fill: $primary; }
      }
    }

    // #### FORM  ####
    .form {
      display: flex;
      flex-flow: column nowrap;
      flex-shrink: 0;
      height: 50%;
      font-size: 1.1rem;
      position: relative;

      label {
        display: block;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        color: $primary;
      }
      .input {
        -webkit-appearance: none;
        display: block;
        width: 100%;
        background-color: $light;
        padding: 0 1rem;
        height: 2.6rem;
        border-radius: 4px;
      }
      .district, .area {
        margin-bottom: 1rem;
      }
      .area > .wrapper{
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin-bottom: 0.75rem;
        input, label {
          width: auto;
          flex: 1 1 auto;
          margin-bottom: 0;
        }
      }
      .area .vue-slider {
        padding: 8px 4px !important;
      }
      .total {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: right;
        padding: 0 1rem;
        margin: -1rem;
        margin-top: auto;
        background-color: $gray;
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 14px;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: $primary;
      }
    }
    @media (min-width: 768px) {
      .recalc {
        padding: 2rem;
      }
      .map {
        .d {
          stroke-width: 3px;
        }
      }
      .form {
        .input {
          height: 3rem;
        }

        .district, .area {
          margin-bottom: 2rem;
        }

        .total {
          font-size: 2rem;
          height: 4rem;
          margin: -2rem;
          margin-top: auto;
        }
      }
    }
  }
</style>
