<template>
  <div
    id="app"
    class="app"
  >
    <div class="header">
      Экспресс оценка стоимости объекта*
    </div>

    <div class="calculator">
      <div class="district">
        <label
          for="district"
          class="label mobile"
        >Выберите <br> округ:</label>
        <label
          for="district"
          class="label desktop"
        >Выберите округ:</label>
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
            {{ d.abbr }}
          </option>
        </select>
      </div>

      <div
        ref="map"
        class="map"
      >
        <svg
          viewBox="0 0 286 327"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g class="districts">
            <g
              v-for="(d, i) in districts"
              :key="`path-${i}`"
              :class="{'selected': d === selected}"
              class="d"
              @click="selected = d"
            >

              <path
                :d="d.shape"
                vector-effect="non-scaling-stroke"
              />
              <!--text
                :class="`label-${d.properties.id}`"
                :x="geoPath().projection(projection()).centroid(d)[0]"
                :y="geoPath().projection(projection()).centroid(d)[1]"
                alignment-baseline="central"
                class="label"
                fill="black"
                text-anchor="middle"
              >{{ d.properties.abbr }}
              </text-->
            </g>
          </g>
        </svg>
      </div>

      <div class="area">
        <div class="wrapper">
          <label
            for="area"
            class="label mobile"
          >
            Площадь <br> объекта:
          </label>
          <label
            for="area"
            class="label desktop"
          >
            Площадь объекта:
          </label>
          <div class="input-wrapper">
            <vue-numeric
              id="area"
              v-model="area"
              :max="areaMax"
              :min="areaMin"
              class="input"
              currency=""
              separator="space"
            />
            <span>м2</span>
          </div>
        </div>
        <vue-slider
          v-model="area"
          :contained="true"
          :height="4"
          :interval="100"
          :max="areaMax"
          :min="areaMin"
          dot-size="24"
          tooltip="none"
        />
      </div>
    </div>

    <div
      class="result"
    >
      <div
        class="calculated"
      >
        <div>
          <div class="label">
            Текущая стоимость объекта:
          </div>
          <div
            class="value"
            v-html="costToString(currentCost)"
          />
        </div>
        <div>
          <div class="label">
            Стоимость ретауна:
          </div>
          <div
            class="value"
            v-html="costToString(rebuildCost)"
          />
        </div>
        <div class="total">
          <div class="label">
            Стоимость после ретауна:
          </div>
          <div
            class="value"
            v-html="costToString(newCost)"
          />
        </div>

        <div class="disclaimer">
          * Указаны приблизительные результаты оценки без учета частных факторов,
          влияющих на реальную стоимость.
          Для получения точных данных обратитесь к нашим специалистам.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import VueNumeric from 'vue-numeric';
import districts from '@/assets/districts.json';

export default {
  name: 'App',
  components: {
    VueSlider,
    VueNumeric,
  },

  data() {
    return {
      districts,
      area: 10000,
      areaMin: 1000,
      areaMax: 50000,

      selected: districts[0],
    };
  },

  computed: {
    currentCost() {
      return Math.round(this.area * this.selected.old_meter_cost);
    },

    rebuildCost() {
      return Math.round(this.area * this.selected.development_meter_cost);
    },

    newCost() {
      return Math.round(this.area * this.selected.new_meter_cost);
    },
  },

  methods: {
    costToString(n) {
      if (n > 1000000000) {
        return `${Math.round((n / 1000000000) * 10) / 10} <span>млрд руб</span>`;
      }
      if (n > 1000000) {
        return `${Math.round((n / 1000000) * 10) / 10} <span>млн руб</span>`;
      }
      return `${Math.round((n / 1000) * 10) / 10} <span>тыс руб</span>`;
    },
  },
};
</script>

<style lang="scss">
  $gray: #dfdfdf;
  $black: #181818;
  $red: #E22245;
  $blue: #394874;

  $bgColor: $blue; //rgba(#c3c3c3, 0.7);
  $themeColor: $red;
  @import '~vue-slider-component/lib/theme/default';


  .app {
    color: $blue;
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: 'header' 'calculator' 'result';

    @media(min-width: 768px) {
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      max-width: 900px;
      max-height: 555px;
      padding: 50px 25px;
      padding-bottom: 0;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 25px;
      grid-template-rows: auto 1fr;
      grid-template-areas: 'header header' 'calculator result';
    }

    .header {
      grid-area: header;
      font-weight: 900;
      font-size: 28px;
      // line-height: 1.1;
      padding: 40px 20px;
      padding-bottom: 1rem;
      // border-bottom: 2px solid $gray;
      @media(min-width: 768px) {
        font-size: 36px;
        padding: 0 25px;
        padding-bottom: 1rem;
      }
      @media(min-width: 900px) {
        font-size: 42px;
        padding: 0 25px;
        padding-bottom: 1rem;
      }
    }

    .calculator {
      grid-area: calculator;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      overflow: hidden;
      padding: 1.25rem 25px 0;

      .map {
        overflow: hidden;
        align-self: flex-end;
        width: 180px;
        margin: -40px 0;

        svg {
          height: 100%;
          width: 100%;
        }

        .d {
          fill: $gray;
          transition: fill 0.25s ease;
          cursor: pointer;
          stroke: #fff;
          stroke-width: 1px;

          &:hover, &.selected {
            fill: $red;
          }
        }

        @media (min-width: 768px) {
          align-self: flex-start;
          width: 220px;
          margin-top: -60px;
        }
      }

      .district, .area {
        z-index: 2;

        .label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 800;
          font-size: 1rem;
          &.desktop {
            display: none;
          }
        }

        .input {
          -webkit-appearance: none;
          background-color: transparent;
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
          color: $blue;
        }

        @media(min-width: 768px) {
          .label {
            font-size: 18px;
            &.desktop {
              display: block;
            }
            &.mobile {
              display: none;
            }
          }
          .input {
            font-size: 32px;
          }
        }
      }

      .district {
        select {
          background: transparent url(assets/polygon.svg) no-repeat;
          background-position-x: 100%;
          background-position-y: 50%;
          padding-right: 25px;
          position: relative;
        }

        @media(min-width: 768px) {
          align-self: flex-end;
          text-align: right;
          select {
            text-align: right;
            text-align-last: right;
          }
        }
      }


      .area {
        margin-top: auto;
        // margin-bottom: 2rem;
        align-self: flex-start;
        width: 100%;

        .wrapper {
          // margin-bottom: 1rem;
          display: flex;
          flex-flow: row wrap;
          // justify-content: space-between;
          align-items: baseline;
        }

        .label {
          flex-shrink: 0;
          width: 100%;
          font-size: 14px;
          font-weight: 800;
        }

        .input {
          text-align: left;
          width: 80px;
          font-weight: 900;
        }

        span {
          margin-left: 0.25rem;
          font-weight: 800;
          line-height: 1.2;
        }
        @media(min-width: 768px) {
          align-self: initial;
          .wrapper {
            justify-content: space-between;
          }

          .label {
            font-size: 18px;
            line-height: 34px;
            width: auto;
            margin-bottom: 0;
          }
          .input {
            text-align: right;
            width: 110px;
            line-height: 34px;
          }

          span {
            font-size: 34px;
          }
        }
      }

      .area .vue-slider {
        margin-top: 0.5rem;

        .vue-slider-rail {
          position: relative;

          &:before, &:after {
            content: '';
            position: absolute;
            top: 0;
            left: -9px;
            width: 11px;
            height: 4px;
            background-color: $red;
          }

          &:after {
            right: -9px;
            left: auto;
            background-color: $bgColor;
          }
        }

        .vue-slider-dot-handle {
          border-radius: 0;
          background: linear-gradient(46.38deg, #A61E34 -134.57%, #F8244B 52.56%);
          box-shadow: -7px 6px 12px rgba(35, 40, 53, 0.2556);
          z-index: 999;
        }
      }
      @media(min-width: 768px) {
        padding: 0 25px;
        padding-top: 2.5rem;
      }
    }

    .result {
      grid-area: result;
      padding: 0 25px;
      padding-top: 0;

      .calculated {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
      }

      .label {
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .value {
        font-size: 24px;
        font-weight: 900;
        padding-bottom: 0.25rem;
        margin-bottom: 1rem;
        // border-bottom: 2px solid rgba($gray, 0.5);
        span {
          font-size: 0.8em;
        }
      }

      .total {
        margin: auto 0;
        .label {
          font-weight: 800;
          font-size: 16px;
        }

        .value {
          border-bottom: 0;
          font-size: 42px;
          font-weight: 900;
          color: $red;
        }
      }

      .disclaimer {
        margin-top: auto;
        // font-style: italic;
        // To align with area slider
        font-weight: 600;
        padding-bottom: 5px;
        line-height: 18px;

        font-size: 14px;
      }

      .btn {
        background-color: $red;
      }

      @media(min-width: 768px) {
        padding-top: 2.5rem;
        .label {
          font-size: 1rem;
        }
        .value {
          font-size: 36px;
        }
        .total > .label {
          font-size: 18px;
        }
        .total > .value {
          font-size: 52px;
          margin-bottom: 20px;
        }
      }
    }

    .result, .calculator {
      padding-bottom: 25px;
      @media (min-width: 768px) {
        padding-bottom: 45px;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s ease-in-out;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

</style>
